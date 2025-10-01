import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private apiUrl = 'http://localhost:4000/api/policies/claims';
  private policyApiUrl = 'http://localhost:4000/api/policies';

  constructor(private http: HttpClient) {}

  
  //  Submit a new claim (customer only)
  submitClaim(data: {
    userPolicyId: string;   
    incidentDate: string;
    description: string;
    amountClaimed: number;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
   
  // List claims (admin → all, customer → own)
  getClaims(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((claims) =>
        claims.map((c) => ({
          ...c,
          policyTitle: c.userPolicyId?.policyProductId?.title ?? 'Unknown Policy',
          policyCode: c.userPolicyId?.policyProductId?.code ?? '',
          policyNumber: c.userPolicyId?.policyNumber ?? '',
        }))
      )
    );
  }

// Get claim details by ID
  getClaimById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

// Update claim status (admin/agent only)
  updateClaimStatus(id: string, data: { status: 'PENDING' | 'APPROVED' | 'REJECTED'; notes?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, data);
  }

  //Fetch logged-in customer's purchased policies(for dropdown in claim form)
  getUserPolicies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.policyApiUrl}/user/me`);
  }
}