import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ClaimListComponent implements OnInit {
  claims: any[] = [];
  loading = true;
  error = '';
  userRole: string | null = null;

  constructor(
    private claimService: ClaimService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.userRole = this.authService.currentUser.role;
    } else {
      this.userRole = localStorage.getItem('role');
    }

    this.fetchClaims();
  }

  fetchClaims(): void {
    this.loading = true;
    this.claimService.getClaims().subscribe({
      next: (res) => (this.claims = res),
      error: (err) => {
        console.error('Error fetching claims:', err);
        this.error = 'Failed to load claims';
      },
      complete: () => (this.loading = false),
    });
  }

  updateStatus(claimId: string, status: 'APPROVED' | 'REJECTED'): void {
    this.claimService.updateClaimStatus(claimId, { status }).subscribe({
      next: () => this.fetchClaims(),
      error: (err) => console.error('Error updating claim:', err),
    });
  }
}