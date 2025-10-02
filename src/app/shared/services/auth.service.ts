import { Injectable } from '@angular/core';
import { Credentials } from '../../core/models/credentials.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user.interface';
import { ActivateAccountRequest } from '../../core/models/activate-account-request.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private API: string = `${environment.apiUrl}/auth`;
    constructor(private http: HttpClient) { }
  
    login(credentials: Credentials): Observable<User>{
      return this.http.post<User>(`${this.API}/login`, credentials);
    }

    refreshToken(): Observable<User>{
      return this.http.post<User>(`${this.API}/refresh-token`, {});
    }

    logout(){
      return this.http.post(`${this.API}/logout`, {},);
    }

    activateAccount(activateAccount: ActivateAccountRequest){
      return this.http.post(`${this.API}/activate-account`, activateAccount);
    }
}
