import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Team, TeamMembership } from '../../../models/team.model';
import { ToastrService } from 'ngx-toastr';
import { ErrorParserService } from '../../../services/error-parser-service';
import { TeamsService } from '../../../services/teamsService';
import { DatePipe } from '@angular/common';
import { RoleName } from '../../../models/role.model';

@Component({
  selector: 'app-detailed-team-view',
  imports: [DatePipe],
  templateUrl: './detailed-team-view.html',
  styleUrl: './detailed-team-view.css'
})
export class DetailedTeamView {
  @Input() editTeam:Team = new Team();
  @Input() orgId:number = -1;
  @Output() goBack = new EventEmitter();

  teamMembers:TeamMembership[] = [];

  addedTeamMembers:TeamMembership[] = [];

  ORGANIZATION_ROLES: RoleName[] = [
    "team_admin",
    "team_member"
  ];
  showRoleOptions: { [userId: string]: boolean } = {};

  constructor(private toastr:ToastrService,
              private errorParser:ErrorParserService,
              private teamService:TeamsService) {  }

  ngOnInit() {
    this.teamService.getTeamMembers(this.editTeam.organization, this.editTeam.id)
      .subscribe({
        next:(v) => {
          this.teamMembers = v;
        },
        error:(e) => {
          this.toastr.error(this.errorParser.parseBackendError(e), "Error tratando de obtener los miembros del equipo");
          this.goBack.emit();
        }
      });
  }

  formatedRole(role:String|undefined):string {
    if (!role) return '';
    return role
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  toggleRoleOptions(member:number) {
    this.showRoleOptions[member] = !this.showRoleOptions[member];
  }

  changeUserRole(member:TeamMembership, role:RoleName) {
    let teamMember:TeamMembership = new TeamMembership();
    teamMember.role = this.ORGANIZATION_ROLES.indexOf(role) + 5;
    teamMember.team = member.team;
    teamMember.user = member.user;

    this.teamService.changeTeamRole(this.orgId, teamMember.team, teamMember.role, teamMember)
      .subscribe({
        next:v => {
          this.teamMembers[this.teamMembers.indexOf(member)] = v;
          this.toastr.success(`Se eliminó el rol a ${v.role}`, "Éxito al cambiar el rol");
        },
        error:e=> {
          this.toastr.error(this.errorParser.parseBackendError(e), "Error al tratar de cambiar el rol de un usuario del equipo");
        }
      });
  }

  kickUser(member:TeamMembership) {
    this.teamService.removeUserFromTeam(this.orgId, member.team, member.user)
      .subscribe({
        next:v => {
          this.teamMembers.splice(this.teamMembers.indexOf(member), 1);
          this.toastr.success(`Se eliminó al usuario id. ${member.user} del equipo ${member.team}`, "Éxito al expulsar");
        },
        error:e=> {
          this.toastr.error(this.errorParser.parseBackendError(e), "Error al tratar de eliminar al usuario del equipo");
        }
      });
  }
}
