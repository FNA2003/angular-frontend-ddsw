import { Component } from '@angular/core';
import { LinkI } from '../../interfaces/navbar-link';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  currentRoute:string = "";
  navLinks:LinkI[] = [];

  /* Links de las rutas sin acceso */
  public firstLinks:LinkI[] = [
    { label:"Inicio",        path:"home",     enabled:true, icon:"bi bi-house-fill" },
    { label:"Registro",      path:"register", enabled:true, icon:"bi bi-arrow-down-circle-fill" },
    { label:"Loggeo",        path:"log_in",    enabled:true, icon:"bi bi-arrow-right-circle" }
  ];
  /* Links de la página principal, luego del loggeo */
  public appLinks:LinkI[] = [
    { label:"Inicio",        path:"app",      enabled:true, icon:"bi bi-house-fill" },
    /*{ label:"Agenda",     path:"", enabled:true, icon:"bi bi-calendar-fill" },*/
    { label:"Cerrar Sesión", path:"logout",   enabled:true, icon:"bi bi-box-arrow-right" },
  ];
  

  constructor(private router:Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.updateLinks();
      }
    });
  }

  updateLinks():void {
    const isAuth:boolean = ['/home', '/log_in', '/register'].some(path =>
      this.currentRoute.startsWith(path)
    );    
    this.navLinks = isAuth ? this.firstLinks : this.appLinks;
  }
}