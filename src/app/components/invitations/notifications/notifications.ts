import { Component } from '@angular/core';
import { ListInvitations } from '../list-invitations/list-invitations';
import { SendInvitations } from '../send-invitations/send-invitations';

@Component({
  selector: 'app-notifications',
  imports: [ListInvitations, SendInvitations],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {
  mostrarPanel:boolean = false;

  listarNotificaciones:boolean = true;
  puedeInvitar:boolean = true;

  toggleNotificationsPanel() {
    this.mostrarPanel = !this.mostrarPanel;
  }
}