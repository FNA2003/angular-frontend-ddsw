import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorParserService } from '../../../services/error-parser-service';
import { ProjectsService } from '../../../services/projectsService';

@Component({
  selector: 'app-list-personal-proyect-tasks',
  imports: [],
  templateUrl: './list-personal-proyect-tasks.html',
  styleUrl: './list-personal-proyect-tasks.css'
})
export class ListPersonalProyectTasks {
  project_id:number = -1;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private toastr:ToastrService,
              private errorParserService:ErrorParserService,
              private projectsService:ProjectsService) {}

  ngOnInit() {
    const project_id = this.route.snapshot.paramMap.get('project_id');

    if ((!project_id || isNaN(Number(project_id)))) {
      this.router.navigate(['/app'])
    }
    this.project_id = Number(project_id);
  }
}
