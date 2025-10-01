import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private baseUrl = 'http://localhost:4000/api/policies/admin';

  constructor(private http: HttpClient) {}

  // Fetch audit logs
  getAuditLogs(limit: number = 50): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/audit?limit=${limit}`);
  }

  // Fetch summary stats
  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`);
  }
}
