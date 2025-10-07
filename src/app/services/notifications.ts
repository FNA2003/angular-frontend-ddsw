import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invitation, InvitationsEnum } from '../models/invitation.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Notifications {
  private baseUrl = "http://localhost:8000/api/invitations";

  constructor(private http: HttpClient) {  }

  getNotifications():Observable<Invitation[]> {
    return this.http.get(`${this.baseUrl}/list/`) as Observable<Invitation[]>;
  }

  
  sendNotification(invitate:Invitation):Observable<any> {
    return this.http.post(`${this.baseUrl}/send/`, invitate);
  }
}