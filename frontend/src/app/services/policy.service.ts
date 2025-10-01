import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:4000/api/policies';

  constructor(private http: HttpClient) {}

  // Get all available policies
  getPolicies(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Add new policy (Admin only)
  addPolicy(policyData: any): Observable<any> {
    return this.http.post(this.apiUrl, policyData);
  }

  // Purchase a policy (Customer)
  purchasePolicy(policyId: string, purchaseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${policyId}/purchase`, purchaseData);
  }

  // Get policies purchased by the logged-in user
  getUserPolicies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  // Cancel a purchased policy (Customer or Admin)
  cancelPolicy(userPolicyId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userPolicyId}/cancel`, {});
  }
}
