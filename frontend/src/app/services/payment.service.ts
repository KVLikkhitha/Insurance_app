import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:4000/api/payments'; 
  constructor(private http: HttpClient) {}

  //Record a new payment for a policy
  recordPayment(data: {
    policyId: string;
    amount: number;
    method: 'CARD' | 'NETBANKING' | 'OFFLINE' | 'SIMULATED';
    reference: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  //Get logged-in user's payments (with safe mapping)
  getUserPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/me`).pipe(
      map((payments) =>
        payments.map((p) => ({
          ...p,
          policyTitle: p.userPolicyId?.policyProductId?.title || 'Unknown Policy',
          policyCode: p.userPolicyId?.policyProductId?.code || 'N/A'
        }))
      )
    );
  }

  // Get all payments (admin/agent only, with safe mapping)
  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((payments) =>
        payments.map((p) => ({
          ...p,
          policyTitle: p.userPolicyId?.policyProductId?.title || 'Unknown Policy',
          policyCode: p.userPolicyId?.policyProductId?.code || 'N/A'
        }))
      )
    );
  }
}


