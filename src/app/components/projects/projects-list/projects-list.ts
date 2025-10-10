import { Component, Input } from '@angular/core';
import { Project, ProjectEnum } from '../../../models/project.model';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-projects-list',
  imports: [DatePipe, NgClass],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
})
export class ProjectsList {
  @Input() projects:Project[] = [];
  @Input() projectType:ProjectEnum = ProjectEnum.PERSONAL;
  prEnum = ProjectEnum;

  ngOnInit() {
    
  }
}
