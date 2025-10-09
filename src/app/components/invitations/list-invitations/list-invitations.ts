import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvitationsService } from '../../../services/notificationsService';
import { Invitation } from '../../../models/invitation.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-invitations',
  imports: [DatePipe],
  templateUrl: './list-invitations.html',
  styleUrl: './list-invitations.css'
})
export class ListInvitations {
  invitations:Invitation[] = [];

  constructor(private toastr:ToastrService, private invitationsService:InvitationsService) {  }

  ngOnInit() {
    this.invitationsService.getInvitations()
      .subscribe({
        next: (data:any) => {
          this.invitations = [... data.data];
        },
        error: (data:HttpErrorResponse) => 
          this.toastr.error(`Errores: ${data.error.errors}`, 
            "Error de acceso de invitaciones!")
      })
  }

  rejectInvitation(invitationNumber:number):void {    
    this.invitationsService.rejectInvitation(invitationNumber)
      .subscribe({
        next:(v) => {
          this.toastr.success("Se rechazó correctamente la invitación", "Éxito al rechazar!");
          // Buscamos la invitación de la lista y, la borramos de ahi
          const index:number = this.invitations.indexOf(this.invitations.find(x => x.id === invitationNumber) as Invitation);
          this.invitations.splice(index, 1);
        },
        error:(e:HttpErrorResponse) => {
          this.toastr.error(`Error: ${e.error}`, "Error al rechazar invitación");
        }
      });
  }

  acceptInvitation(invitacion:Invitation):void {
    this.invitationsService.acceptInvitation(invitacion.id, invitacion)
      .subscribe({
        next: (v) => {
          this.toastr.success("Se aceptó correctamente la invitación", "Éxito al aceptar!");
          this.toastr.warning("Qué sigue ahora?", "Error de implementación!");
        },
        error: (e:HttpErrorResponse) => {
          this.toastr.error(`Error: ${e.error}`, "Error al aceptar invitación");
        }
      });
  }
}
