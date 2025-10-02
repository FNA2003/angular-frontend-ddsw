import { Organization } from "./organization.model";

export class User {
    id!:number;
    username!:string;
    email!:string;
    first_name?:string;
    last_name?:string;
    organization_fk?:Organization;
}