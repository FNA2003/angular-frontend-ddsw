import { Component } from '@angular/core';
import { ListInvitations } from '../list-invitations/list-invitations';
import { SendInvitations } from '../send-invitations/send-invitations';
import { UserDataService } from '../../../services/user-data-service';
import { User } from '../../../models/user.model';
import { Invitation } from '../../../models/invitation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [ListInvitations, SendInvitations],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {
  currentUser:User|null = null;
  mostrarPanel:boolean = false;

  listarNotificaciones:boolean = true;
  puedeInvitar:boolean = true;

  constructor(private userData:UserDataService, private router:Router) {  }

  ngOnInit() {
    /* Siempre obtengo info del usuario */
    this.userData.user$.subscribe(user => {
      this.currentUser = user;

      if (user?.organization_fk) {
        this.puedeInvitar = true;
        this.listarNotificaciones = false;
      } else {
        this.puedeInvitar = false;
        this.listarNotificaciones = true;
      }
    });
  }

  toggleNotificationsPanel() {
    this.mostrarPanel = !this.mostrarPanel;
  }

  aceptoInvitacion(inv:Invitation) {
    const nUsr = this.currentUser as User;
    nUsr.organization_fk = inv.organization_fk;
    
    this.userData.updateUser(nUsr);

    this.router.navigate(["/app"]);
  }
}