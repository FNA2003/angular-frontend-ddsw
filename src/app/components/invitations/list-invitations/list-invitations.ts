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

  rejectInvitation(invitacion:Invitation):void {
    /* Llamar al servicio.... */
    this.toastr.warning("Cuidado", "Sin implementar!");
    this.toastr.success(`Eliminando invitación de la organización '${invitacion.organization_fk.name}'...`, "Rechazando Invitación!");
  }

  acceptInvitation(invitacion:Invitation):void {
    /* Llamar al servicio.... */
    this.toastr.warning("Cuidado", "Sin implementar!");
    this.toastr.success(`Aceptando invitación de la organización '${invitacion.organization_fk.name}'...`, "Aceptando Invitación!");
  }
}
