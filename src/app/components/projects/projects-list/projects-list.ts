import { Component, Input } from '@angular/core';
import { Project, ProjectEnum } from '../../../models/project.model';
import { DatePipe, NgClass } from '@angular/common';
import { EditProject } from '../edit-project/edit-project';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-projects-list',
  imports: [DatePipe, NgClass, EditProject],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
})
export class ProjectsList {
  @Input() projects:Project[] = [];
  @Input() projectType:ProjectEnum = ProjectEnum.PERSONAL;

  prEnum = ProjectEnum;
  editProjectId:number|null = null;

  constructor(private toastr:ToastrService, private projectService:ProjectsService) {  }

  /* Atrapo el emmiter de 'edit-project' para mostrar el proyecto actualizado sin volver a consultar el back */
  onSave(updatedProject:Project) {
    let x;
    for(x = 0; x < this.projects.length; x++) {
      if (this.projects[x].id === updatedProject.id) { break; }
    }
    this.projects[x] = updatedProject;
    this.editProjectId = null;
  }
  deleteProject(project:Project) {
    this.projectService.deleteProject(project.id)
      .subscribe({
        next: (v:any) => {
          this.toastr.success("Se eliminó correctamente el proyecto", "Éxito al eliminar el proyecto");
          this.projects.splice(this.projects.indexOf(project), 1);
        },
        error: (e:HttpErrorResponse) => {
          this.toastr.error(`Error: ${e.error.errors}`, "Error al tratar de eliminar el proyecto");
        }
      });
  }  
}
