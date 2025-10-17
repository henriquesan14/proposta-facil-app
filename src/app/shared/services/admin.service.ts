import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private API: string = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) { }

  impersonateTenant(tenantId: string): Observable<User>{
    return this.http.post<User>(`${this.API}/impersonate/${tenantId}`, {});
  }

  stopImpersonateTenant(): Observable<User>{
    return this.http.post<User>(`${this.API}/stop-impersonate`, {});
  }
}
