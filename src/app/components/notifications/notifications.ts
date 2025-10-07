import { Component } from '@angular/core';
import { Invitation } from '../../models/invitation.model';
import { NotificationsService } from '../../services/notificationsService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {
  invitations:Invitation[] = []

  constructor(private notificationService:NotificationsService, private toastr:ToastrService) {  }

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
}