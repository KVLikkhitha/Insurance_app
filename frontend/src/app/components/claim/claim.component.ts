import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../services/claim.service';

@Component({
  selector: 'app-claim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css'],
})
export class ClaimComponent implements OnInit {
  claims: any[] = [];
  userPolicies: any[] = [];
  newClaim = {
    userPolicyId: '',
    incidentDate: '',
    description: '',
    amountClaimed: 0,
  };

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    this.loadClaims();
    this.loadUserPolicies();
  }

  loadClaims(): void {
    this.claimService.getClaims().subscribe({
      next: (res) => (this.claims = res),
      error: (err) => console.error('Error fetching claims:', err),
    });
  }

  loadUserPolicies(): void {
    this.claimService.getUserPolicies().subscribe({
      next: (res) => (this.userPolicies = res),
      error: (err) => console.error('Error fetching user policies:', err),
    });
  }

  submitClaim(): void {
  if (!this.newClaim.userPolicyId) {
    alert('Please select a policy before submitting.');
    return;
  }

  this.claimService.submitClaim(this.newClaim).subscribe({
    next: () => {
      alert('Claim submitted successfully!');
      this.newClaim = {
        userPolicyId: '',
        incidentDate: '',
        description: '',
        amountClaimed: 0,
      };
      this.loadClaims();
    },
    error: (err) => console.error('Error submitting claim:', err),
  });
}
}
