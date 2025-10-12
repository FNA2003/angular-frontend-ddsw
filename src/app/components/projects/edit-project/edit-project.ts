import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project, ProjectEnum } from '../../../models/project.model';
import { DatePipe, NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-project',
  imports: [DatePipe, NgClass, ReactiveFormsModule],
  templateUrl: './edit-project.html',
  styleUrl: '../projects-list/projects-list.css'
})
export class EditProject {
  @Input() project:Project|null = null;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  projectType = ProjectEnum;

  formulario:FormGroup = new FormGroup({});


  constructor (private toastr:ToastrService, private projectService:ProjectsService) {  }

  ngOnInit() {
    this.formulario = new FormGroup({
      id:new FormControl(this.project?.id, [Validators.required]),
      tipe:new FormControl(this.project?.tipe, [Validators.required]),
      title:new FormControl(this.project?.title, [Validators.required, Validators.maxLength(32)]),
      description:new FormControl(this.project?.description),
      organization_fk:new FormControl(this.project?.organization_fk),
      creation_date:new FormControl(this.project?.creation_date, [Validators.required])
    })
  }

  changeData() {
    if (this.formulario.invalid) {
      this.toastr.warning("Asegurate de completar los campos necesarios y que estén en el formato solicitado", "Error en los campos a editar!");
      return;
    }

    const p = this.formulario.getRawValue() as Project;
   
    this.projectService.editProject(p, p.id)
      .subscribe({
        next: (v:any) => {
          this.toastr.success("Todos los campos alterados fueron modificados", "Éxito al actualizar proyecto!");
          this.save.emit(p);
        },
        error: (e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error.errors}`, "Error al editar proyecto!");
        }
      });
  }
}
