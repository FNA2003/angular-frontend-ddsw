import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = "http://localhost:8000/api/access";

  constructor(private http:HttpClient) {  }

  register(user:User):Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
  login(user:User):Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }
}
