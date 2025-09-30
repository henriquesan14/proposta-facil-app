import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionAccountResponse } from '../../core/models/subscription-account-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private API: string = `${environment.apiUrl}/account`;
  constructor(private http: HttpClient) { }

  getSubscriptionsAccount(): Observable<SubscriptionAccountResponse>{
    return this.http.get<SubscriptionAccountResponse>(`${this.API}/subscription`);
  }
}
