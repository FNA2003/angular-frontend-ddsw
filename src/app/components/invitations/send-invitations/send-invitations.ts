import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from '../../../services/notificationsService';

@Component({
  selector: 'app-send-invitations',
  imports: [ReactiveFormsModule],
  templateUrl: './send-invitations.html',
  styleUrl: './send-invitations.css'
})
export class SendInvitations {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  emailList:string[] = [];

  constructor (private notificationService:NotificationsService, private toastr:ToastrService) {  }

  addEmail() {
    const email = this.emailControl.value?.trim();
    if (email && this.emailControl.valid && !this.emailList.includes(email)) {
      this.emailList.push(email);
      this.emailControl.reset();
    }
  }

  removeEmail(index:number) {
    this.emailList.splice(index, 1);
  }

  sendEmails() {
    this.toastr.warning("Sin implementar todavía", "Error de implementación!");
  }
}
