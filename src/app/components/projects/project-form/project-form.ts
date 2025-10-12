import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, ProjectEnum } from '../../../models/project.model';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm {
  tiposProyecto = Object.values(ProjectEnum);
  formulario:FormGroup = new FormGroup({
    tipe:new FormControl("", [Validators.required]),
    title:new FormControl("", [Validators.required, Validators.maxLength(32)]),
    description:new FormControl("")
  });

  contenedorAdmins:boolean = false;
  listaAdministradores:Array<string> = [];

  constructor(private toastr:ToastrService, private projectsService:ProjectsService, private router:Router) {  }


  ngOnInit() {
    this.formulario.get("tipe")?.valueChanges
      .subscribe((tipo:ProjectEnum) => {
        this.contenedorAdmins = tipo === ProjectEnum.ORGANIZATIONAL;
      });
  }

  addAdmin() {
    const input = document.getElementById("admin-input") as HTMLInputElement;
    
    if (input && input.value.trim().length > 0) {
      this.listaAdministradores.push(input.value);
      input.value = "";
      input.focus();
    }
  }
  removeAdmin(admin:string) {
    this.listaAdministradores.splice(this.listaAdministradores.indexOf(admin), 1);
  }

  onSubmit() {
    if (this.formulario.invalid) {
      console.log(this.formulario.getRawValue());
      
      this.toastr.warning("Cerciorese de que todos los campos requeridos estén completos y en el formato pedido.", "Error en los campos!");
      return;
    }

    const proyecto = this.formulario.getRawValue() as Project;
    proyecto.creation_date = new Date().toISOString().split('T')[0];

    this.projectsService.makeProject(proyecto)
      .subscribe({
        next:(val) => {
          this.formulario.reset();
          this.listaAdministradores = [];
          this.toastr.success("Proyecto creado correctamente", "Éxito al crear el proyecto");
          this.router.navigate(["/app"]);
        },
        error:(e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al crear el proyecto!");
        }
      })
  }
}
