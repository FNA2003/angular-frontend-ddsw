import { Component } from '@angular/core';
import { Notifications } from '../invitations/notifications/notifications';
import { ProjectsList } from '../projects/projects-list/projects-list';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-main-page',
  imports: [Notifications, ProjectsList],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  personalProjects:Project[] = [];
  orgProjects:Project[] = [];
}