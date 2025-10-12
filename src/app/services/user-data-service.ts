import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userSubjetc = new BehaviorSubject<User|null>(null);
  user$ = this.userSubjetc.asObservable();

  constructor() {
    const storedUser = localStorage.getItem("usr_o");

    if (storedUser) {
      this.userSubjetc.next(JSON.parse(storedUser));
    }
  }
  
  updateUser(user:User) {
    this.userSubjetc.next(user);
    localStorage.setItem("usr_o", JSON.stringify(user));
  }
  clearUser() {
    this.userSubjetc.next(null);
    localStorage.removeItem("usr_o");
  }
}
