import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl:string = "http://localhost:8000/api/projects";

  constructor(private http:HttpClient) {  }

  getProjects():Observable<Project[]> {
    return this.http.get(`${this.baseUrl}/list/`) as Observable<Project[]>;
  }

  makeProject(project:Project):Observable<any> {
    return this.http.post(`${this.baseUrl}/new/`, project) as Observable<any>;
  }

  editProject(project:any, id:number):Observable<any> {
    return this.http.patch(`${this.baseUrl}/edit/${id}`, project) as Observable<any>;
  }
  deleteProject(id:number):Observable<any> {
    return this.http.delete(`${this.baseUrl}/edit/${id}`) as Observable<any>;
  }
}