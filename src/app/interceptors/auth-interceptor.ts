import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable, throwError } from "rxjs";

/* 
 * Interceptor para, ante cualquier query-request del usuario
 * agregarle el jwt o, redirigir al usuario en caso de
 * token vencido. (Podría agregar un refresh del token... Pera nah)
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router:Router, private toastr:ToastrService) {  }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const JWT_TOKEN = localStorage.getItem("acc_tk");
        let send_request:HttpRequest<any>;

        /* Si existe el token en el local storage, dejamos que 
        siga la query, pero le agregamos la header del token */
        if (JWT_TOKEN) {
            const REQ_CLONED = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${JWT_TOKEN}`)
            });
            send_request = REQ_CLONED;
        } else {
            send_request = req;
        }

        /* Acá enviamos la query, y, si recibimos un error 401, 'cerramos sesión' */
        return next.handle(send_request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Token Inválido o sesión expirada
                    localStorage.removeItem("acc_tk");
                    this.toastr.error("Iniciá sesión", "Credenciales Vencidas/Inválidas");
                    this.router.navigate(["/home"]);
                }
                return throwError(() => error);
            })
        )
    }
}