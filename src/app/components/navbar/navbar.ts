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
    { label:"Home",     path:"home",         enabled:true, icon:"bi bi-house" },
    { label:"Register", path:"register", enabled:true, icon:"bi bi-person-add" },
    { label:"Login",    path:"login",    enabled:true, icon:"bi bi-box-arrow-in-right" }
  ];
  /* Links de la página principal, luego del loggeo */
  public appLinks:LinkI[] = [
    { label:"Home",     path:"app", enabled:true, icon:"bi bi-house" }
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
    const isAuth:boolean = ['/home', '/login', '/register'].some(path =>
      this.currentRoute.startsWith(path)
    );    
    this.navLinks = isAuth ? this.firstLinks : this.appLinks;
  }
}