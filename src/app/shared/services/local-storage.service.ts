import { Injectable } from '@angular/core';
import { User } from '../../core/models/user.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  public user$ = this.userSubject.asObservable();

  constructor() { }

  private loadUser(): User | null {
    const dataString = localStorage.getItem('user');
    return dataString ? JSON.parse(dataString) : null;
  }

  setUserStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUserStorage(): User | null {
    return this.userSubject.value;
  }

  removeUserStorage() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isImpersonate(): boolean {
    const user = this.getUserStorage();
    return !!user?.tenantImpersonate;
  }
  
}