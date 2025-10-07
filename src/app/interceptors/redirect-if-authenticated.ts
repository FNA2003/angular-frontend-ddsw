import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('acc_tk');
    if (token) {
      this.router.navigate(['/app']); // redirige si ya está logueado
      return false; // evita que cargue la ruta pública
    }
    return true; // permite acceso si no hay token
  }
}
