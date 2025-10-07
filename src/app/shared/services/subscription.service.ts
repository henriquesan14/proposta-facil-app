import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../core/models/paginated-result.interface';
import { Subscription } from '../../core/models/subscription.interface';
import { CreateSubscription } from '../../core/models/create-subscription.interface';
import { Payment } from '../../core/models/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private API: string = `${environment.apiUrl}/admin/subscriptions`;
  constructor(private http: HttpClient) { }

  getSubscriptions(parametros: any): Observable<PaginatedResult<Subscription>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<PaginatedResult<Subscription>>(`${this.API}/`, {params});
  }

  getSubscriptionById(id: string): Observable<Subscription>{
    return this.http.get<Subscription>(`${this.API}/${id}`);
  }
  
  createSubscription(createSubscription: CreateSubscription){
    return this.http.post(`${this.API}`, createSubscription);
  }

  updateSubscription(createSubscription: CreateSubscription){
    return this.http.put(`${this.API}`, createSubscription);
  }

  deleteSubscription(id: string){
    return this.http.delete(`${this.API}/${id}`,);
  }

  getPayments(id: string){
    return this.http.get<PaginatedResult<Payment>>(`${this.API}/${id}/payments`);
  }
}
