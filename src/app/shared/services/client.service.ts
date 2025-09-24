import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../core/models/paginated-result.interface';
import { Client } from '../../core/models/client.interface';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private API: string = `${environment.apiUrl}/client`;
  constructor(private http: HttpClient) { }

  getClients(parametros: any): Observable<PaginatedResult<Client>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<PaginatedResult<Client>>(`${this.API}/`, {params});
  }

  createClient(user: Client): Observable<Client>{
    return this.http.post<Client>(`${this.API}/`, user);
  }

  updateClient(user: Client){
    return this.http.put(`${this.API}/`, user);
  }

  deleteClient(id: string){
    return this.http.delete(`${this.API}/${id}`,);
  }

  deleteClientsBatch(userIds: string[]){
    return this.http.post(`${this.API}/delete`, {userIds});
  }
}
