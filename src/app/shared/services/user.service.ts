import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../core/models/user.interface';
import { Observable } from 'rxjs';
import { CreateUser } from '../../core/models/create-user.interface';
import { PaginatedResult } from '../../core/models/paginated-result.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API: string = `${environment.apiUrl}/user`;
  constructor(private http: HttpClient) { }

  getUsers(parametros: any): Observable<PaginatedResult<User>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<PaginatedResult<User>>(`${this.API}/`, {params});
  }

  createUser(user: CreateUser): Observable<User>{
    return this.http.post<User>(`${this.API}/`, user);
  }

  updateUser(user: CreateUser){
    return this.http.put(`${this.API}/`, user);
  }

  deleteUser(id: string){
    return this.http.delete(`${this.API}/${id}`,);
  }

  deleteUsersBatch(userIds: string[]){
    return this.http.post(`${this.API}/delete`, {userIds});
  }
}
