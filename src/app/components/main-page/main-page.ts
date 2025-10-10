import { Component } from '@angular/core';

import { Project, ProjectEnum } from '../../models/project.model';

import { Notifications } from '../invitations/notifications/notifications';
import { ProjectsList } from '../projects/projects-list/projects-list';
import { ProjectsService } from '../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main-page',
  imports: [Notifications, ProjectsList],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  personalProjects:Project[] = [];
  orgProjects:Project[] = [];
  projectType = ProjectEnum;

  constructor(private projectsService:ProjectsService, private toastr:ToastrService) {  }

  ngOnInit() {
    /* Al iniciar el componente, tratamos de 'conseguir' los 
    proyectos para pasarselos a cada 'projects-list' correspondiente */
    this.projectsService.getProjects()
      .subscribe({
        next:(data:Project[]) => {
          data.forEach(proyecto => {
            if (proyecto.tipe === this.projectType.PERSONAL) {
              this.personalProjects.push(proyecto);
            } else {
              this.orgProjects.push(proyecto);
            }
          });
        },
        error: (e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al buscar los proyectos!");
        }
      })
  }
}