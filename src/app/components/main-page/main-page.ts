import { Component } from '@angular/core';

import { Project, ProjectEnum } from '../../models/project.model';

import { Notifications } from '../invitations/notifications/notifications';
import { ProjectsList } from '../projects/projects-list/projects-list';
import { ProjectsService } from '../../services/projectsService';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-main-page',
  imports: [Notifications, ProjectsList, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  personalProjects:Project[] = [];
  orgProjects:Project[] = [];
  projectType = ProjectEnum;

  constructor(private projectsService:ProjectsService, private toastr:ToastrService) {
    const placeholderLista:Project[] = [
      {
        id:1,
        title:"Proyecto Org. 1",
        description:"Esta es una descripción de ejemplo",
        tipe:ProjectEnum.ORGANIZATIONAL,
        creation_date:Date.now(),
        organization_fk:{
          name:"Organizacion 1"
        }
      },
      {
        id:2,
        title:"Proyecto Org. 2",
        description:"Esta es una descripción de ejemplo \
        Lorem ipsum dolor, sit amet consectetur adipisicing elit",
        tipe:ProjectEnum.ORGANIZATIONAL,
        creation_date:Date.now(),
        organization_fk:{
          name:"Organizacion 1"
        }
      },
      {
        id:3,
        title:"Proyecto Personal 1",
        description:"Hola, este es un proyecto de ejemplo\
        podés ver cuando se crea en main-page.ts",
        tipe:ProjectEnum.PERSONAL,
        creation_date:Date.now()
      },
      {
        id:4,
        title:"Proyecto Personal 2",
        description:"Hal asm it abat il it abab\
        podés ver cuando se crea en main-page.ts",
        tipe:ProjectEnum.PERSONAL,
        creation_date:Date.now()
      },
      {
        id:5,
        title:"Proyecto Personal 3",
        description:"Hal asm it abat il it abab\
        podés ver cuando se crea en main-page.ts",
        tipe:ProjectEnum.PERSONAL,
        creation_date:Date.now()
      },
      {
        id:6,
        title:"Proyecto Personal 4",
        description:"Hal asm it abat il it abab\
        podés ver cuando se crea en main-page.ts",
        tipe:ProjectEnum.PERSONAL,
        creation_date:Date.now()
      }
    ];

    this.orgProjects.push(placeholderLista[0], placeholderLista[1]);
    this.personalProjects.push(placeholderLista[2], placeholderLista[3], placeholderLista[4], placeholderLista[5]);
  }

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