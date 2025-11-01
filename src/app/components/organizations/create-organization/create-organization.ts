import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Project, ProjectEnum } from '../../../models/project.model';
import { ToastrService } from 'ngx-toastr';
import { OrganizationsService } from '../../../services/organizationsService';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserDataService } from '../../../services/user-data-service';
import { Organization } from '../../../models/organization.model';

@Component({
  selector: 'app-create-organization',
  imports: [ReactiveFormsModule],
  templateUrl: './create-organization.html',
  styleUrl: './create-organization.css'
})

export class OrganizationForm {
  
  registerForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required)
  });

  constructor(private toastr: ToastrService, 
              private organizationsService:OrganizationsService, 
              private router:Router
  ){  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastr.warning("Cerciorese de que todos los campos requeridos estén completos y en el formato pedido.", "Error en los campos!");
      return;
    }

    const organization = this.registerForm.getRawValue() as Organization;
    organization.creation_date = new Date().toISOString().split('T')[0];
    
    this.organizationsService.makeOrganization(organization)
      .subscribe({
        next:(val) => {
          this.registerForm.value();
          this.registerForm.reset();
          this.toastr.success("Proyecto creado correctamente", "Éxito al crear el proyecto");
          this.router.navigate(["/app"]);
        },
        error:(e:HttpErrorResponse) => {
          this.toastr.error(`Errores: ${e.error}`, "Error al crear el proyecto!");
        }
      })
  }
}