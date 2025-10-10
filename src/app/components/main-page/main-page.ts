import { Component } from '@angular/core';

import { Project } from '../../models/project.model';

import { Notifications } from '../invitations/notifications/notifications';
import { ProjectsList } from '../projects/projects-list/projects-list';


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