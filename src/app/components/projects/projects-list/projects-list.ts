import { Component, Input } from '@angular/core';
import { Project, ProjectEnum } from '../../../models/project.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects-list',
  imports: [DatePipe],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
  standalone:true
})
export class ProjectsList {
  @Input() projects:Project[] = [];
  @Input() projectType:ProjectEnum = ProjectEnum.PERSONAL;

  ngOnInit() {
    
  }
}
