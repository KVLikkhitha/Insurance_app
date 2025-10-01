// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:4000/api/policies';

  constructor(private http: HttpClient) {}
  createAgent(agent: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/agents`, agent);
  }

  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agents`);
  }

  assignAgent(agentId: string, targetType: string, targetId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/agents/${agentId}/assign`, {
      targetType,
      targetId,
    });
  }

  // Fetch all user policies (admin view)
  getUserPolicies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/userpolicies`);
  }

  // Fetch all claims (admin/agent view)
  getClaims(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/claims`);
  }
}
