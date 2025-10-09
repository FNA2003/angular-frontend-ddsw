import { Component } from '@angular/core';
import { Notifications } from '../invitations/notifications/notifications';

@Component({
  selector: 'app-main-page',
  imports: [Notifications],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {

}