import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../core/models/paginated-result.interface';
import { Proposal } from '../../core/models/proposal.interface';
import { Observable } from 'rxjs';
import { CreateProposal } from '../../core/models/create-proposal.interface';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private API: string = `${environment.apiUrl}/proposal`;
  constructor(private http: HttpClient) { }

  getProposals(parametros: any): Observable<PaginatedResult<Proposal>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined && parametros[key] !== '') {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<PaginatedResult<Proposal>>(`${this.API}/`, {params});
  }

  getProposalById(id: string): Observable<Proposal>{
    return this.http.get<Proposal>(`${this.API}/${id}`);
  }

  createProposal(proposal: CreateProposal): Observable<Proposal>{
    return this.http.post<Proposal>(`${this.API}/`, proposal);
  }

  updateProposal(proposal: CreateProposal){
    return this.http.put(`${this.API}/`, proposal);
  }

  deleteProposal(id: string){
    return this.http.delete(`${this.API}/${id}`,);
  }

  sendProposal(id: string){
    return this.http.post(`${this.API}/${id}/send`, {});
  }
}
