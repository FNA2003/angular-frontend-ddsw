import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvitationsService } from '../../../services/notificationsService';
import { OrganizationInvitation } from '../../../models/invitation.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-invitations',
  imports: [DatePipe],
  templateUrl: './list-invitations.html',
  styleUrl: './list-invitations.css'
})
export class ListInvitations {
  invitations:OrganizationInvitation[] = [];

  constructor(private toastr:ToastrService, private invitationsService:InvitationsService) {  }

  ngOnInit() {
    this.invitationsService.getInvitations()
      .subscribe({
        next: (data:any) => {
          this.invitations = [... data.data];
        },
        error: (data:HttpErrorResponse) => 
          this.toastr.error(`Errores: ${data.error}`, 
            "Error de acceso de invitaciones!")
      })
  }

  rejectInvitation(invitation:OrganizationInvitation) {
    invitation.rejected = true;

    this.invitationsService.handleInvitation(invitation)
      .subscribe({
        next:(v) => {
          this.toastr.success("Se rechazó correctamente la invitación", "Éxito al rechazar!");
          // Buscamos la invitación de la lista y, la borramos de ahi
          const index:number = this.invitations.indexOf(invitation);
          this.invitations.splice(index, 1);
        },
        error:(e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al rechazar invitación");
        }
      });
  }

  acceptInvitation(invitacion:OrganizationInvitation) {
    invitacion.accepted = true;

    this.invitationsService.handleInvitation(invitacion)
      .subscribe({
        next: (v) => {
          this.toastr.success("Se aceptó correctamente la invitación", "Éxito al aceptar!");
          location.reload();
        },
        error: (e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al aceptar invitación");
        }
      });
  }
}
