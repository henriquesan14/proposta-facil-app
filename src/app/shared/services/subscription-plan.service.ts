import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../../core/models/subscription-plan.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  private API: string = `${environment.apiUrl}/subscriptionPlan`;
  constructor(private http: HttpClient) { }

  getSubscriptionPlans(parametros: any): Observable<SubscriptionPlan[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<SubscriptionPlan[]>(`${this.API}/`, {params});
  }

  getSubscriptionPlanById(id: string): Observable<SubscriptionPlan>{
      return this.http.get<SubscriptionPlan>(`${this.API}/${id}`);
  }

  createSubscriptionPlan(subscriptionPlan: SubscriptionPlan){
    return this.http.post(`${this.API}`, subscriptionPlan);
  }

  updateSubscriptionPlan(subscriptionPlan: SubscriptionPlan){
    return this.http.put(`${this.API}`, subscriptionPlan);
  }

  deleteSubscriptionPlan(id: string){
    return this.http.delete(`${this.API}/${id}`,);
  }

}