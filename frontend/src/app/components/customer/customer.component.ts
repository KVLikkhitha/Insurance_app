import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../services/policy.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  userPolicies: any[] = [];

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {
    this.loadUserPolicies();
  }
  // Fetch purchased policies
  loadUserPolicies(): void {
    this.policyService.getUserPolicies().subscribe({
      next: (res) => this.userPolicies = res,
      error: (err) => console.error('Error loading user policies:', err)
    });
  }

  // Cancel a purchased policy
  cancelPolicy(policyId: string): void {
    if (!confirm('Are you sure you want to cancel this policy?')) return;

    this.policyService.cancelPolicy(policyId).subscribe({
      next: () => {
        alert('Policy cancelled successfully!');
        this.loadUserPolicies(); // refresh list after cancel
      },
      error: (err) => {
        console.error('Error cancelling policy:', err);
        alert(err.error?.error || 'Failed to cancel policy');
      }
    });
  }
}

