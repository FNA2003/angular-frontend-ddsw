import { Component, Input } from '@angular/core';
import { Project, ProjectEnum } from '../../../models/project.model';

@Component({
  selector: 'app-projects-list',
  imports: [],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
  standalone:true
})
export class ProjectsList {
  @Input() projects:Project[] = [];
  @Input() projectType:ProjectEnum = ProjectEnum.PERSONAL;
}
