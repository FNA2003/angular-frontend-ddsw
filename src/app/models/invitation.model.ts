import { Organization } from "./organization.model";
import { User } from "./user.model";

export enum InvitationsEnum {
    PENDING = 'P',
    ACCEPTED = 'A',
    REFUSED = 'R',
}
export class Invitation {
    id!:number;
    organization_fk!:Organization;
    receiver_email!:string;
    sender_fk!:User;
    state!:InvitationsEnum;
    send_date!:Date;
}
