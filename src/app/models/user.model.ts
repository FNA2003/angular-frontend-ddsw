import { Organization } from "./organization.model";

export class User {
    id?:number;
    username!:string;
    email!:string;
    password?:string; // Puede ser nula cuando recibimos un modelo del back (no tenemos que saber la contraseña de otro usuario)
    first_name?:string;
    last_name?:string;
    organization_fk?:Organization;
}