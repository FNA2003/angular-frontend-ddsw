import { RoleName } from "./role.model";

export class Team {
  id?: number;
  organization!: number; // ID de la organización, el serializer no da el objeto, da el id
  name: string = '';
  description?: string;
  created_at?: string; // ISO datetime que retorna Django
}

export class TeamMembership {
  id?: number;
  team!: number; // ID del equipo
  user!: number; // ID del OrganizationMembership
  role!: RoleName; // nombre del rol (ej: 'team_admin')
  joined_at?: string; // ISO datetime, solo lectura
}
