import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-organization-proyect-tasks',
  imports: [],
  templateUrl: './list-organization-proyect-tasks.html',
  styleUrl: './list-organization-proyect-tasks.css'
})
export class ListOrganizationProyectTasks {
project_id:number = -1;
  organization_id:number= -1;

  constructor(private route: ActivatedRoute,
              private router:Router
  ) {}

  ngOnInit() {
    const project_id = this.route.snapshot.paramMap.get('project_id');
    const organization_id = this.route.snapshot.paramMap.get('organization_id');

    if ((!project_id || isNaN(Number(project_id))) || (!organization_id || isNaN(Number(organization_id)))) {
      this.router.navigate(['/app'])
    }
    this.project_id = Number(project_id);
    this.organization_id = Number(organization_id);
  }
}
