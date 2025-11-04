import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../../models/project.model';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDataService } from '../../../services/user-data-service';
import { ErrorParserService } from '../../../services/error-parser-service';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../services/tasksService';

@Component({
  selector: 'app-task-editor-creator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-editor-creator.html',
  styleUrl: './task-editor-creator.css'
})
export class EditTask {
  @Input() task:Task|null = null; //null : crea una tarea. not null: edita tarea
  
  @Output() save = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  formulario:FormGroup = new FormGroup({});

  @Input() orgId?: number;
  @Input() proyId?: number;

  availableTasks: Task[] = [];

  constructor (private toastr:ToastrService, 
               private projectService:ProjectsService,
               private userDataService:UserDataService,
               private errorParserService:ErrorParserService,
               private tasksService:TasksService) {  }

  ngOnInit() {
    this.formulario = new FormGroup({
      // Los campos que se pueden editar
      name:new FormControl(this.task?.name, [Validators.required, Validators.maxLength(32)]),
      description:new FormControl(this.task?.description),
      expiration_datetime:new FormControl(this.task?.expiration_datetime),

      predecessors_ids:new FormControl(this.task?.predecessors_ids, [Validators.required, Validators.maxLength(32)]),
      users_ids:new FormControl(this.task?.users_ids, [Validators.required, Validators.maxLength(32)]),
      teams_ids:new FormControl(this.task?.teams_ids, [Validators.required, Validators.maxLength(32)]),

      // Estos no :/
      id:new FormControl(this.task?.id),
      created_at:new FormControl(this.task?.created_at),
      completed:new FormControl(this.task?.completed),
      project:new FormControl(this.task?.project),

      predecessors:new FormControl(this.task?.predecessors),
      assigned_users:new FormControl(this.task?.assigned_users),
      assigned_teams:new FormControl(this.task?.assigned_teams)  
    });
    this.tasksService.getPersonalTasks(this.proyId as number).subscribe(tasks => {
      this.availableTasks = tasks;
    });
  }

  // onSubmit() {
  //   if (this.formulario.invalid) {
  //     console.log(this.formulario.getRawValue());
      
  //     this.toastr.warning("Cerciorese de que todos los campos requeridos estén completos y en el formato pedido.", "Error en los campos!");
  //     return;
  //   }

  //   const proyecto = this.formulario.getRawValue() as Project;
  //   proyecto.created_at = new Date().toISOString().split('T')[0];

  //   const dropdown:HTMLSelectElement = document.getElementById("projectTipeSelector") as HTMLSelectElement;

  //   if (this.orgId? > 0) {
  //     this.tasksService.makePersonalTask(this.orgId?, task)
  //     .subscribe({
  //       next:(val) => {
  //         this.formulario.reset();
  //         this.toastr.success("Proyecto creado correctamente", "Éxito al crear el proyecto");
  //         this.router.navigate(["/app"]);
  //       },
  //       error:(e) => {
  //         this.toastr.error(this.errorParserService.parseBackendError(e), "Error al crear el proyecto!");
  //       }
  //     });
  //   } else {
  //     this.projectsService.makePersonalProject(proyecto)
  //     .subscribe({
  //       next:(val) => {
  //         this.formulario.reset();
  //         this.toastr.success("Proyecto creado correctamente", "Éxito al crear el proyecto");
  //         this.router.navigate(["/app"]);
  //       },
  //       error:(e) => {
  //         this.toastr.error(this.errorParserService.parseBackendError(e), "Error al crear el proyecto!");
  //       }
  //     });
  //   }
    
  // }
}
