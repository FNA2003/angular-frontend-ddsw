import { Organization } from "./organization.model";
import { User } from "./user.model";

export enum InvitationsEnum {
    PENDING = 'P',
    ACCEPTED = 'A',
    REFUSED = 'R',
}
export class Invitation {
    id:number = 0;
    organization_fk!:Organization;
    receiver_email?:string; // En la recepción, puede ser null, la información sería irrelevante, pues, se recibe al mismo usuario
    sender_fk!:User;
    state!:InvitationsEnum;
    send_date!:string;
}
