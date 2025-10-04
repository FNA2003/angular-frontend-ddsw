import { Injectable } from '@angular/core';


export interface LinkI {
  label:string;
  path:string;
  enabled:boolean;
}

/*
 * Servicio para activar o desactivar links
 * de la barra de navegación se solicite por otros
 * componentes
 */

@Injectable({ providedIn: 'root' })
export class NavbarService {
  links:LinkI[] = [
    { label:"Home", path:"", enabled:true },
    { label:"Register", path:"", enabled:true },
    { label:"Login", path:"", enabled:true },
  ];

  /* Getter de los links existentes (no solo activos) */
  getLinks():LinkI[] {
    return this.links;
  }

  /* Busca un link de la lista de links disponibles, si lo encuentra
  lo activa o desactiva según parámetro */
  toogleLink(label:string, enabled:boolean):LinkI|undefined {
    const link = this.links.find(l => l.label === label);
    if (link) link.enabled = enabled;
    
    return link;
  }
}
