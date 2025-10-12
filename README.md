# 🏠 Inicio
[Servicios](#servicios) | [Interceptors](#interceptors) | [Modelos](#modelos) | [Componentes](#componentes) | [Falta Hacer](#falta-hacer)

> **_NOTAS:_**  
> Para ejecutar el projecto es necesario instalar  ```ngx-toastr```.  
> Vea las vulnerabilidades, errores y ```TODO's``` nombrados en este documento.

# 🗂️ Estructura general del proyecto

## Servicios
Usamos servicios para llamadas a la API y traer/llevar información desde/hasta los componentes. Además, también los vamos a usar para comunicar componentes (luego se verá)  
El criterio para crear servicios es, hasta el día de hoy, debatible. Aún así, trato de numerarlos:
1. El servicio usa métodos con acceso a una misma URI de la API con **1 única** ruta distinta.
2. El servicio es necesario por **más de 1 componente**.
3. La comunicación de los componentes a través del servicio reduce la complejidad (no se implementan señales, no se 'harcodean' funciones) y el acoplamiento (siempre que sea necesario, se descartan pipes y bindings para usar servicios).

### ```auth.ts```
Servicio para registrar un usuario o, logearlo. Implementa los siguientes métodos:
| Método | Descripción |
|--------|-------------|
|```register(user:User):Observable<any>```|Registra un nuevo usuario|
|```login(user:{email:string; password:string}):Observable<any>```| Inicia sesión|

> Podrá ver que, el método login no toma un usuario, esto se debe a que, se quiere evitar tener que enviar información que el back-end no utilizará.  
> Por otro lado, como la sesión es manejada con **JWT**, cada componente, cuando verifica el éxito del servicio deberá almacenar en "localstorage" el token para poder ser usado por los [_intercepters_](#interceptors)...**🚨 Hasta el momento, esta implementación es muy pobre y totalmente vulnerable a ataques XSS (mas aún teniendo en cuenta que no se implementó el token refresh de los JWT), asi que, es recomendable revisar esto para ambientes de deploy🚨**


### ```notificationsService.ts```
Servicio utilizado para el manejo de todo lo relacionado con las invitaciones, vease:
| Método | Descripción |
|--------|-------------|
|```getInvitations():Observable<Invitation[]>```| Método para que el subscriptor reciba una lista de las invitaciones pendientes del usuario que recibió de distintas organizaciones.|
|```sendInvitations(emails:string[]):Observable<any>```|Si el usuario pertenece a una organización y, tiene permisos, con este método enviará al back una lista de emails a los cuales se les creará una invitación para unirse a su organización.|
|```rejectInvitation(invitationNumber:number):Observable<any>```|Dada una invitación, el usuario podrá marcarla como rechazada.|
|```acceptInvitation(invitationNumber:number, invitation:Invitation):Observable<any>```|Si el usuario sin organización envía este método, se acepta la invitación y agrega el usuario a la organización.|


### ```projectsService.ts```
Servicio usado para consultar los proyectos de un usuario y, crear nuevos proyectos. Por el momento, este servicio **⚠️apunta a un endpoint inexistente⚠️** pués, todavía se espera a la implementación de django.
| Método | Descripción |
|--------|-------------|
|```getProjects():Observable<Project[]>```| Método que consultará por una lista de proyectos *personales y organizacionales* del usuario.|
|```makeProject(project:Project):Observable<any>```| Usado por el componente que creará proyectos para hacer uno nuevo (ese componente deberá encargarse de validar permisos).|
|```editProject(project:any, id:number):Observable<any>```| Se trata de alterar algún campo, cualquiera, del proyecto _(id)_ usando el método PATCH |
|```deleteProject(id:number):Observable<any>```| Borrar un proyecto, si es posible o el usuario puede. |

## Interceptors
Parte de la aplicación que agrega funcionalidad con componentes tipo 'middleware'. No está de más decir que esta sección es una de la más crítica. Paso a describir brevemente que función cumple cada interceptor:

- ```auth-guard.ts```: Interceptor que determina si el usuario tiene una sesión activa (token existente y aún válido). "Protegiendo" las rutas que solo puede acceder el usuario con sesión (véase en ```app.routes.ts```). Si el usuario no está autentificado, se cancela la navegación y se redirije a la página de inicio (si se venció su *JWT*, además de lo anterior, se elimina de almacenamiento).
- ```redirect-if-authenticated.ts```: Interceptor para las rutas comunes que, al incluirse como ```canActivate``` en la definición de la ruta, nos redirije al dashboard si tenemos sesión activa, caso contrario podemos seguir navegando en estas.
- **```auth-interceptor.ts```**: Probablemente, el interceptor más importante de los nombrados. Este intercepta cada uso del _HttpClient provider_ y, le agrega el token JWT (si existe) a cada cabecera HTTP. Este interceptor, ante un error HTTP 401 (Unauthorized), removerá el token, por esto, **⚠️ante permisos insuficientes, es necesario que el back-end envié un HTTP 403 (Forbidden) en lugar del 401⚠️**.


## Modelos
Clases que se definieron _casi_ biunivocamente en referencia a los modelos definidos en el back-end (con algunas excepciones). Por esto, no veo necesario detallarlas y nombro únicamente sus diferencias:

| Modelo | Cambios Clave |
|--------|---------------|
|**```user.model.ts```**| El campo ```id``` puede ser nulo, pués, como no vamos a realizar operaciones REST sobre usuarios individuales, no siempre necesitamos los id's. Y, el campo ```password```, en este caso, la contraseña puede ser nula para evitar errores en el parseo al recibir información de otro usuario. Pero, la propia del usuario se requerirá.|
|**```invitation.model.ts```**| A ```id:number = 0;``` le asigno un valor por defecto para evitar definir el campo como posible-nulo ya que la información de id si es requerida para operar.Y, ```receiver_email?:string;```, ya que, en la recepción, sería información redundante.|
|**```organization.model.ts```**| _Sin diferencias_|
|**```project.model.ts```**| _Sin diferencias_ |

## Componentes
Como esta sección es muy volatil, unicamnete voy a listar brevemente cada componente siguiendo un orden de relevancia/uso:

1. ```navbar```: Este mostrará una barra de navegación *sticky* con *dos event listeners*, siendo el primero un listener de ruta, que se usará para determinar que url's mostrará la barra de navegación y, el segundo listener para el "scroll" determina si oculta o muestra el contenido.
2. ```home```: Componente que únicamente mostrará un 'landing-page'.
3. ```register```: Componente para la alta de usuarios, este usa el  ```services/auth.ts``` y **ReactiveForms**.
4. ```login```: Similar al componente anterior, pero para el inicio de sesión de usuarios.
5. ```logout```: _"Lazy-component"_ se usa únicamente eliminar la sesión y redirigir a la ruta de ```home``` sin agregarle funciones al ```navbar```.
6. ```main-page```: A partir de este componente, todos los siguientes necesetirán autentificación para usarlos. Este componente, renderizará  conjunto de componentes de proyectos e invitaciones.
7. ````invitations````: Conjunto de componentes que renderizarán (si se cumplen los requisitos) un botón para abrir la vista de invitaciones pendientes o para el envió de invitaciones (mutuamente excluyentes).
8. ```invitations/notifications```: Componente principal en este conjunto, pues mostrará el botón y, su 'carta' si se lo clickea, además, decidirá si se debe listar las invitaciones (usuario sin organización) ó, si se debe renderizar el componente de enviar invitaciones (si se tienen los permisos).
9. ```invitations/list-notifications```: Como ya se nombró, este mostrará las invitaciones pendientes y, manejará el rechazo o aceptación de las invitaciones.
10. ```invitations/send-invitations```: Último en este conjunto, este maneja un listado de emails (agregandolos o sacando cada uno mediante inputs) para luego, enviarles una invitación a la organización.
11. ```projects```: Conjunto de componentes que comprende; el listado de proyectos, la creación de nuevos proyectos y, la modificación de estos.
12. ```projects/projects-list```: Componente que recibe un listado de proyectos y, tipo de estos (personales u organizacionales) para luego listarlos "estilizados" según este último tipo. Este componente, reemplazará la _"carta"_ de cada proyecto al seleccionar el botón de edición por el componente ```projects/edit-project```, además, maneja borrar el proyecto y la re-dirección hacia las tareas de este si se desea acceder al mismo.
13. ```projects/edit-project```: Componente usado para editar la información de un proyecto seleccionado.
14. ```projects/project-form```: Componente, con ruta propia, que se usa para la creación de proyectos (ya sean personales u organizacionales).


# 📋 Falta Hacer:

## TODO's primarios
- [ ] El componente ```main-page```, consulta el servicio ```projectsService```, componente que consulta un servicio inexistente pues, falta crear el end-point en el back-end. Por esto, se agregaron placeholders de projects en este componente para previsualizar la vista **⚠️Remover luego⚠️**.
- [ ] Implementar el botón _"Ir al Proyecto"_ en el componente ```projects/projects-list``` luego de crear el proyecto que permite visualizar las tareas del proyecto.
- [ ] Crear organización.
- [ ] Calendario de tareas.
- [ ] Administración de organización.

### TODO's secundarios
- [ ] Agregar y modificar todos los _modelos_ necesarios pasado el consenso.
- [ ] En el componente ```invitations/list-invitations```, agregar el comportamiento correspondiente al aceptar una invitación luego de que el handler sea exitoso.
- [ ] Agregarle al componente ```invitations/notifications``` el "pedido" de información para conocer si el usuario pertenece a una organización (si pertenece, puede invitar personas, sino, puede ver las invitaciones recibidas). Luego, si se agrega la funcionalidad, agregar el pedido de rol para saber si PUEDE enviar invitaciones.

#### TODO's terciarios
- [ ] Agregar el envío de la lista de administradores en el componente ```projects/projec-form``` luego del consenso y de agregarse los roles y equipos de la organización.

##### TODO's recomendables
- [ ] Dividir la lógica de projects-list, pues, debería intercambiarse un 'project-card' con ```edit-project``` para evitar repetir bloques y dar más aislamiento.