import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  /* Propiedad que usará el template para validar y enviar al back */
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
  });

  constructor(private toastr: ToastrService, private authService: Auth, private router:Router) {  }


  /* Método que se llama una vez que se 'submitea' algo */
  onSubmit():void {
    if (this.userForm.invalid) {
      this.toastr.warning("Completá todos los campos requeridos y asegurate que el email tenga formato válido!");
      return;
    }

    const user: User = this.userForm.getRawValue() as User;

    this.authService.register(user).subscribe({
      next: (response:any) => { 
        localStorage.setItem("acc_tk", response.access);
        this.toastr.success("Usuario Registrado!");
        this.router.navigate(["/app"]);
      },
      error: () => this.toastr.error("Error al registrar el usuario!")
    });
  }
}
