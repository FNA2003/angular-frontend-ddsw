import { RoleName } from './role.model';

// Organización, puede ser propia o que nos hayamos unido
export class Organization {
  id?: number;
  name: string = '';
  created_at?: string;
}

// Rol de un usuario en la organización
export class OrganizationMembership {
  id?: number;
  role!: RoleName;
  role_name?: string;
  
  user!: number; // ID del usuario
  user_email?: string;
  user_username?: string;
  
  organization!: number; // ID de la organización
  
  joined_at?: string;
}
