import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LinkI {
  label:string;
  path:string;
  enabled:boolean;
  icon:string; // Este será el string de la clase del ícono
}
/*
 * Servicio para activar o desactivar links
 * de la barra de navegación se solicite por otros
 * componentes
 */
@Injectable({ providedIn: 'root' })
export class NavbarService {
  /* Por ahora le damos estos links para la página home, luego, mainPage cargará los otros links */
  private linksSubject = new BehaviorSubject<LinkI[]>([
    { label:"Home",     path:"",         enabled:true, icon:"" },
    { label:"Register", path:"register", enabled:true, icon:"" },
    { label:"Login",    path:"login",    enabled:true, icon:"" }
  ]);
  links$ = this.linksSubject.asObservable();

  setLinks(links: LinkI[]) {
    this.linksSubject.next(links);
  }

  getLinks(): LinkI[] {
    return this.linksSubject.getValue();
  }
}
