import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionAccountResponse } from '../../core/models/subscription-account-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private API: string = `${environment.apiUrl}/account`;
  constructor(private http: HttpClient) { }

  getSubscriptionsAccount(parametros: any): Observable<SubscriptionAccountResponse>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<SubscriptionAccountResponse>(`${this.API}/subscription`);
  }
}
