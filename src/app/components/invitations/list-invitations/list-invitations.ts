import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from '../../../services/notificationsService';
import { Invitation } from '../../../models/invitation.model';

@Component({
  selector: 'app-list-invitations',
  imports: [DatePipe],
  templateUrl: './list-invitations.html',
  styleUrl: './list-invitations.css'
})
export class ListInvitations {
  invitations:Invitation[] = [];

  constructor(private toastr:ToastrService, private notificationService:NotificationsService) {  }

  ngOnInit() {
    this.notificationService.getNotifications()
      .subscribe({
        next: (data:any) => {
          this.invitations = [... data.data];
        },
        error: (data:any) => 
          this.toastr.error(`Errores: ${data.errors}`, 
            "Error de acceso de invitaciones!")
      })
  }

  rejectInvitation(invitacion:Invitation):void {
    /* Llamar al servicio.... xd */
    this.toastr.warning("Cuidado", "Sin implementar!");
    this.toastr.success(`Eliminando invitación de la organización '${invitacion.organization_fk.name}'...`, "Rechazando Invitación!");
  }

  acceptInvitation(invitacion:Invitation):void {
    /* Llamar al servicio.... */
    this.toastr.warning("Cuidado", "Sin implementar!");
    this.toastr.success(`Aceptando invitación de la organización '${invitacion.organization_fk.name}'...`, "Aceptando Invitación!");
  }
}
