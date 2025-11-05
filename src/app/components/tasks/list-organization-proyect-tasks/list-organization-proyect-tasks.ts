import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorParserService } from '../../../services/error-parser-service';
import { ProjectsService } from '../../../services/projectsService';
import { TasksService } from '../../../services/tasksService';
import { Task } from '../../../models/task.model';
import { EditTask } from "../task-editor-creator/task-editor-creator";
import { DatePipe } from '@angular/common';
import { OrganizationMembership } from '../../../models/organization.model';
import { OrganizationsService } from '../../../services/organizationsService';
import { ProjectUserMembership } from '../../../models/project.model';

@Component({
  selector: 'app-list-organization-proyect-tasks',
  standalone: true,
  imports: [EditTask, DatePipe],
  templateUrl: './list-organization-proyect-tasks.html',
  styleUrl: './list-organization-proyect-tasks.css'
})
export class ListOrganizationProyectTasks {
  project_id:number = -1;
  organization_id:number = -1;
  tasks:Task[] = [];
  editTaskId:number|null|undefined = null;
  editingBool:boolean = false;

  addMembers:OrganizationMembership[] = [];

  showEditor = false;              // controla el *ngIf del editor
  editing: Task | null = null;     // tarea en edición (o null si es creación)

  constructor(private route: ActivatedRoute,
              private router:Router,
              private toastr:ToastrService,
              private errorParserService:ErrorParserService,
              private projectsService:ProjectsService,
              private tasksService: TasksService,
              private orgService:OrganizationsService) {}

  ngOnInit() {
    const project_id = this.route.snapshot.paramMap.get('project_id');
    const organization_id = this.route.snapshot.paramMap.get('organization_id');

    if ((!project_id || isNaN(Number(project_id))) || (!organization_id || isNaN(Number(organization_id)))) {
      this.router.navigate(['/app'])
    }
    this.project_id = Number(project_id);
    this.organization_id = Number(organization_id);

    this.tasksService.getOrganizationTasks(Number(organization_id), Number(project_id)).subscribe({
      next:(t) => {
        this.tasks = t;
      },
      error:(e) => {
        this.toastr.error(this.errorParserService.parseBackendError(e), "Erro al tratar de obtener las tareas personales!");
      }
    });
    this.orgService.getOrganizationUsers(this.organization_id)
      .subscribe({
        next: v => {
          this.orgService.getProjectMembers(this.organization_id, this.project_id)
            .subscribe({
              next: x => {
                for (let index = 0; index < x.length; index++) {
                  if (v.findIndex(m => x[index].user === m.user) < 0) this.addMembers.push(v[index]);
                }
              },
              error: e => {this.toastr.error(this.errorParserService.parseBackendError(e), "Error al obtener miembros");}
            });
        },
        error: e => {this.toastr.error(this.errorParserService.parseBackendError(e), "Error al obtener miembros");}
      });
  }

  /* Atrapo el emmiter de 'editor-creator-task' para mostrar la tarea actualizada sin volver a consultar el back */
  onSave(updatedTask:Task) {
    window.location.reload();
  }

  completeTask(task:Task) {
    this.tasksService.completeOrganizationTask(this.organization_id, this.project_id, task.id as number)
      .subscribe({
        next: v=> {
          this.toastr.success(`Se completo ${task.name}`, "Éxito al completar la tarea");
          location.reload();
        },
        error: e => {
          this.toastr.error(this.errorParserService.parseBackendError(e), "Error al tratar de completar una tarea");
        }
      });
  }

  deleteTask(task:Task) {
      this.tasksService.removeOrganizationTask(this.organization_id, this.project_id, task.id as number)
        .subscribe({
          next: (v:any) => {
            this.toastr.success("Se eliminó correctamente la tarea", "Éxito al eliminar la tarea");
            this.tasks.splice(this.tasks.indexOf(task), 1);
          },
          error: (e) => {
            this.toastr.error(this.errorParserService.parseBackendError(e), "Error al tratar de eliminar la tarea");
          }
        });
    }  
  
  closeTasks(){
    for (const tarea of this.tasks){
      this.deleteTask(tarea);
    }
  }

  onCancelled() {
    this.showEditor = false;
    this.editing = null;
    this.editingBool = false;
  }

  newTask() {
    if (this.editing === null) {this.editing = new Task(); this.editingBool = false;}
    else this.editing = null;
  }

  agregarAlProyecto(usrOrgMember:OrganizationMembership) {
    this.orgService.addProjectMember(this.organization_id, this.project_id, usrOrgMember.id as number)
      .subscribe({
        next: v => {
          this.addMembers.splice(this.addMembers.indexOf(usrOrgMember), 1);
        },
        error: e => {
          this.toastr.error(this.errorParserService.parseBackendError(e), "Error al tratar de agregar a un usuario al proyecto");
        }
      });
  }

}
