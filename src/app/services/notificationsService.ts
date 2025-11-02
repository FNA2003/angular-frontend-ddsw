import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationInvitation } from '../models/invitation.model';
import { ApiGateway } from './api-gateway';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  constructor(private apiGateway:ApiGateway) {  }

  // Listar invitaciones
  getInvitations():Observable<OrganizationInvitation[]> {
    return this.apiGateway.get("invitations/");
  }

  // Función para rechazar o aceptar una invitación
  // Se modifca el booleano del modelo para un caso o el otro.
  handleInvitation(invitation:OrganizationInvitation):Observable<any> {
    return this.apiGateway.patch(`invitations/${invitation.id}/`, invitation);
  }

  // Enviar una invitación a un usuario
  sendInvitation(invitation:{"emails":string[]}, org_id:number):Observable<any> {
    return this.apiGateway.post(`organizations/${org_id}/invitations/`, invitation);
  }
}