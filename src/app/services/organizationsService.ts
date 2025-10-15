import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {
  private baseUrl:string = "http://localhost:8000/api/organizations";

  constructor(private http:HttpClient) {  }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get(`${this.baseUrl}/list/`) as Observable<Organization[]>;
  }

  makeOrganization(organization: Organization):Observable<any> {
    return this.http.post(`${this.baseUrl}/new/`, organization) as Observable<any>;
  }

  editOrganization(organization:any, id:number):Observable<any> {
    return this.http.patch(`${this.baseUrl}/edit/${id}`, organization) as Observable<any>;
  }
  deleteOrganization(id:number):Observable<any> {
    return this.http.delete(`${this.baseUrl}/edit/${id}`) as Observable<any>;
  }
}