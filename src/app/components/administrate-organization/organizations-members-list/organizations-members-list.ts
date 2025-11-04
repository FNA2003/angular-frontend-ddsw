import { Component, Input } from '@angular/core';
import { OrganizationMembership } from '../../../models/organization.model';
import { DatePipe } from '@angular/common';
import { RoleName } from '../../../models/role.model';
import { OrganizationsService } from '../../../services/organizationsService';
import { ToastrService } from 'ngx-toastr';
import { ErrorParserService } from '../../../services/error-parser-service';

@Component({
  selector: 'app-organizations-members-list',
  imports: [DatePipe],
  templateUrl: './organizations-members-list.html',
  styleUrl: './organizations-members-list.css'
})
export class OrganizationsMembersList {
  @Input() organizationMembers:OrganizationMembership[] = [];
  @Input() organizationId:number = -1;

  ORGANIZATION_ROLES: RoleName[] = [
    'organization_admin',
    'organization_member',
    'organization_project_creator',
    'organization_team_creator',
  ];
  showRoleOptions: { [userId: string]: boolean } = {};

  constructor(private organizationService:OrganizationsService,
              private toastr:ToastrService,
              private errorParser:ErrorParserService) {  }

  formatedRole(role:String|undefined):string {
    if (!role) return '';
    return role
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  toggleRoleOptions(usr_id:number) {
    this.showRoleOptions[usr_id] = !this.showRoleOptions[usr_id];
  }

  changeUserRole(user:OrganizationMembership, newRole: RoleName): void {
    const aux:OrganizationMembership = new OrganizationMembership();
    aux.user = user.user;
    aux.role_name = newRole;
    aux.role = this.ORGANIZATION_ROLES.indexOf(newRole) + 1;
    

    this.organizationService.changeOrganizationUserRole(this.organizationId, aux)
      .subscribe({
        next: (v) => {
          this.organizationMembers[this.organizationMembers.indexOf(user)] = v;
          this.toastr.success(`Se cambio correctamente el rol de ${user.user_username}`, "Éxito al cambiar rol");
        },
        error: (e) => {
          this.toastr.error(this.errorParser.parseBackendError(e), "Error al asignarle otro rol al usuario");
        }
      });
  }
  kickUser(user:OrganizationMembership) {
    this.organizationService.kickUserFromOrganization(this.organizationId, user.user)
      .subscribe({
        next: (v) => {
          this.organizationMembers.splice(this.organizationMembers.indexOf(user), 1);
          this.toastr.success(`Se eliminó correctamente al usuario ${user.user_username} de la organización`, "Éxito al eliminar al usuario");
        },
        error: (e) => {
          this.toastr.error(this.errorParser.parseBackendError(e), "Error al tratar de eliminar a un usuario de la organización");
        }
      })
  }

}
