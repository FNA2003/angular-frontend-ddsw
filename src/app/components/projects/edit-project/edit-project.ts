import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../../models/project.model';
import { DatePipe, NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDataService } from '../../../services/user-data-service';

@Component({
  selector: 'app-edit-project',
  imports: [DatePipe, NgClass, ReactiveFormsModule],
  templateUrl: './edit-project.html',
  styleUrl: '../projects-list-personal/projects-list-personal.css'
})
export class EditProject {
  @Input() project:Project|null = null;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();


  formulario:FormGroup = new FormGroup({});

  organizationId:number = -1;


  constructor (private toastr:ToastrService, 
               private projectService:ProjectsService,
               private userDataService:UserDataService) {  }

  ngOnInit() {
    this.formulario = new FormGroup({
      // Los campos que se pueden editar
      name:new FormControl(this.project?.name, [Validators.required, Validators.maxLength(32)]),
      description:new FormControl(this.project?.description),
      
      // Estos no :/
      id:new FormControl(this.project?.id, [Validators.required]),
      organization:new FormControl(this.project?.organization),
      created_at:new FormControl(this.project?.created_at, [Validators.required]),
      is_closed:new FormControl(this.project?.is_closed, [Validators.required]),
      owner:new FormControl(this.project?.owner, [Validators.required]),
      closed_at:new FormControl(this.project?.closed_at, [Validators.required])
    });

    this.userDataService.getOrganizationObject()
      .subscribe({
        next:(v) => {
          if (v.length > 0) this.organizationId = v[0].id as number;
        },
        error:(e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al tratar de obtener el id de su organización");
        }
      });
  }

  changeData() {
    if (this.formulario.invalid) {
      this.toastr.warning("Asegurate de completar los campos necesarios y que estén en el formato solicitado", "Error en los campos a editar!");
      return;
    }

    const p = this.formulario.getRawValue() as Project;
   
    if (this.organizationId < 0) {
      // El proyecto es organizacional
      this.projectService.editOrganizationProject(this.organizationId, p)
        .subscribe({
        next: (v:any) => {
          this.toastr.success("Todos los campos alterados fueron modificados", "Éxito al actualizar proyecto organizacional!");
          this.save.emit(p);
        },
        error: (e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al editar proyecto!");
        }
      });
    } else {
      // Personal
      this.projectService.editPersonalProject(p)
        .subscribe({
          next: (v:any) => {
            this.toastr.success("Todos los campos alterados fueron modificados", "Éxito al actualizar proyecto personal!");
            this.save.emit(p);
          },
          error: (e:HttpErrorResponse) => {
            this.toastr.error(`Errores: ${e.error}`, "Error al editar proyecto!");
          }
        });
    }
  }
}
