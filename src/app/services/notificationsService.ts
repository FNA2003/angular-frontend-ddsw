import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invitation } from '../models/invitation.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  private baseUrl = "http://localhost:8000/api/invitations";

  constructor(private http: HttpClient) {  }

  getInvitations():Observable<Invitation[]> {
    return this.http.get(`${this.baseUrl}/list/`) as Observable<Invitation[]>;
  }
  sendInvitations(emails:string[]):Observable<any> {
    return this.http.post(`${this.baseUrl}/send/`, emails);
  }
}