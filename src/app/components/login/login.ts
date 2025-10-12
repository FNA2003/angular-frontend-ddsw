import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: '../register/register.css'
})
export class Log_in {
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService:Auth, private toastr:ToastrService, private router:Router) {  }

  onSubmit() {
    if (this.formLogin.invalid) {
      this.toastr.warning("Asegurate de completar todos los campos requeridos y cumplir el tipo de campo", "Formulario Inválido");
      return;
    }

    /* Parseo de datos para evitar conflictos de tipo undefiend */
    const data = this.formLogin.getRawValue() as {email:string; password:string};

    this.authService.login(data)
      .subscribe({
        next: (response:any) => { 
          localStorage.setItem("acc_tk", response.access);
          this.toastr.success("Redirigiendo...", "Inicio de sesión exitoso!");
          this.router.navigate(["/app"]);
        },
        error:(e:HttpErrorResponse) => this.toastr.error(`Errores: ${e.error}`, "Error al inciar sesión!")
      });
  }
}