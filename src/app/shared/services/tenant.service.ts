import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../core/models/paginated-result.interface';
import { Tenant } from '../../core/models/tenant.interface';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private API: string = `${environment.apiUrl}/tenant`;
  constructor(private http: HttpClient) { }

  getTenants(parametros: any): Observable<PaginatedResult<Tenant>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<PaginatedResult<Tenant>>(`${this.API}/`, {params});
  }

  getTenantById(id: string): Observable<Tenant>{
    return this.http.get<Tenant>(`${this.API}/${id}`);
  }

  createTenant(tenant: Tenant): Observable<Tenant>{
    return this.http.post<Tenant>(`${this.API}/`, tenant);
  }

  updateTenant(tenant: Tenant){
    return this.http.put(`${this.API}/`, tenant);
  }

  deleteTenant(id: string){
    return this.http.delete(`${this.API}/${id}`,);
  }
}
