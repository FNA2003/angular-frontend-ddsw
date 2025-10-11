import { Organization } from "./organization.model";

export enum ProjectEnum {
    PERSONAL = "P",
    ORGANIZATIONAL = "O"
}

export class Project {
    id:number = 0;
    title!:string;
    description?:string;
    organization_fk?:Organization;
    tipe!:ProjectEnum;
    creation_date!:number;
}