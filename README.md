# Inicio
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
> Por otro lado, como la sesión es manejada con **JWT**, cada componente, cuando verifica el éxito del servicio deberá almacenar en "localstorage" el token para poder ser usado por los _intercepters_...**🚨 Hasta el momento, esta implementación es muy pobre y totalmente vulnerable a ataques XSS (mas aún teniendo en cuenta que no se implementó el token refresh de los JWT), asi que, es recomendable revisar esto para ambientes de deploy🚨**


### ```notificationsService.ts```
Servicio utilizado para el manejo de todo lo relacionado con las invitaciones, vease:
| Método | Descripción |
|--------|-------------|
|```getInvitations():Observable<Invitation[]>```| Método para que el subscriptor reciba una lista de las invitaciones pendientes que recibió de distintas organizaciones.|
|```sendInvitations(emails:string[]):Observable<any>```|Si el usuario pertenece a una organización y, tiene permisos, con este método enviará al back una lista de emails a los cuales se les creará una invitación para unirse a la organización.|
|```rejectInvitation(invitationNumber:number):Observable<any>```|Dada una invitación, el usuario podrá marcarla como rechazada.|
|```acceptInvitation(invitationNumber:number, invitation:Invitation):Observable<any>```|Si el usuario sin organización envía este método, se acepta la invitación y agrega el usuario a la organización.|


## Interceptors
Parte de la aplicación que le agrega funcionalidad como componentes 'middleware'. No está de más decir que esta sección es una de la más crítica. Paso a describir brevemente que función cumple cada interceptor:

- ```auth-guard.ts```: Interceptor que determina si el usuario tiene una sesión activa (token existente y aún válido). Con el fin de ser proteger las rutas que solo puede acceder el usuario con sesión (véase ```app.routes.ts```). Si el usuario no está autentificado, se cancela la navegación y se redirije a la página de inicio (si se venció su *JWT*, además de lo anterior, se elimina de almacenamiento).
- ```redirect-if-authenticated.ts```: Interceptor para las rutas comunes que, al incluirse como ```cantActivate``` en la definición de la ruta, nos redirije al dashboard si tenemos sesión activa, caso contrario nos deja navegar en estas.
- **```auth-interceptor.ts```**: Probablemente, el interceptor más importante de los nombrados. Este intercepta cada uso del _HttpClient provider_ y, le agrega el token JWT (si existe) a cada cabecera HTTP. Este interceptor, ante un error HTTP 401 (Unauthorized), removerá el token, por esto, **⚠️ante permisos insuficientes, es necesario que el back-end envié un HTTP 403 (Forbidden) en lugar de este 401⚠️**.


## Modelos
Clases que se definieron _casi_ biunivocamente en referencia a los modelos definidos en el back-end (en más, verá que la mayoría de los modelos hasta tienen los mismos nombres)

### ```user.model.ts```
Modelo que usamos para enviar información propia (login, register o manejo de invitaciones o validación), o también, para "enriquecer" el front-end con información adicional de otros usuarios.
Podrá ver que, los campos son los mismos a los definidos en django inclusive su nulidad, excepto por:
```
id?:number; // Como no vamos a realizar operaciones rest sobre usuarios individuales, no siempre necesitamos los id's
...
password?:string; // En este caso, la contraseña puede ser nula para evitar errores en el parseo al recibir información de otro usuario. Pero, la del usuario propia se requerirá siempre que se pida.
...
```
### ```invitation.model.ts```
 Nuevamente, defino un modelo similar al definido con django incluso con su enum para evitar errores. Nuevamente, describo los campos que difieren:

```
id:number = 0; // Asigno un valor por defecto para evitar definir el campo como posible-nulo
...
receiver_email?:string; // En la recepción, sería información redundante
```
### ```organization.model.ts```
 ⚠️ Modelo sin terminar, solamente se agregó el campo _'name'_ para mostrarla en la pantalla de invitaciones.  

## Componentes
Como esta sección es muy volatil, unicamnete voy a listar brevemente cada componente siguiendo un orden de relevancia/uso:

1. ```navbar```: Este mostrará una barra de navegación sticky con *dos event listeners*, siendo el primero un listener de ruta, que se usará para determinar que url's mostrará la barra de navegación y, el segundo listener para el "scroll" y determinar si ocultar o muestra el contenido.
2. ```home```: Componente que únicamente mostrará un 'landing-page'.
3. ```register```: Componente para la alta de usuarios, este usa el  ```services/auth.ts``` y, controlará campos con **ReactiveForms**.
4. ```login```: Similar al componente anterior, pero para el inicio de sesión de usuarios.
5. ```logout```: _"Lazy-componente"_ se usa únicamente eliminar la sesión y redirigir a la ruta de ```home``` sin agregarle funciones al ```navbar```.
6. ```main-page```: A partir de este componente, todos los siguientes necesetirán autentificación para usarlos. Este componente, renderizará  conjunto de componentes de proyectos e invitaciones.
7. ````invitations````: Conjunto de componentes que renderizarán (si se cumplen los requisitos) un botón para abrir la vista de invitaciones pendientes o para el envió de invitaciones (mutuamente excluyentes).
8. ```invitations/notifications```: Componente principal en este conjunto, pues mostrará el botón y, su 'carta' si se lo clickea, además, decidirá si se debe listar las invitaciones (usuario sin organización) ó, si se debe renderizar el componente de enviar invitaciones (si se tienen los permisos).
9. ```invitations/list-notifications```: Como ya se nombró, este mostrará las invitaciones pendientes y, manejará el rechazo o aceptación de las invitaciones.
10. ```invitations/send-invitations```: Último en este conjunto, este manejara listar emails (o sacarlos de la lista) para luego, enviarles una invitación a la organización.


# 📋 Falta Hacer:
- [ ] Terminar el modelo ```organization``` y agregar el resto de modelos luego del consenso.
- [ ] En el componente ```invitations/notifications```, mostrar únicamente el botón para ver la carta de Invitaciones si puede enviarlas (está en una organización y, más adelante, si tiene permisos) ó, si no tiene organización para ver las invitaciones recibidas.
- [ ] En el componente ```invitations/notifications```, mostrar el componente listar invitaciones o enviarlas si no tiene organización o si (respectivamente).
- [ ] En el componente ```invitations/list-invitations```, agregar el comportamiento correspondiente al aceptar una invitación luego de que el handler sea exitoso.
- [ ] Agregar vista de proyectos personales y organizacionales en el componente ```main-page```.
- [ ] Funcionalidades de punto anterior.
- [ ] Manejo y vista de tareas dentro de componente(s) de la tarea anterior.
- [ ] Calendario de tareas.
