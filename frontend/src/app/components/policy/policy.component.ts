import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  policies: any[] = [];
  addPolicyForm!: FormGroup;
  purchaseForm!: FormGroup;
  selectedPolicyId: string | null = null;
  userRole: string = '';

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.getPolicies();
    this.initForms();
    this.getUserRole();
  }

  // Load all available policies
  getPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (res) => (this.policies = res),
      error: (err) => console.error('Error fetching policies:', err),
    });
  }


  // Initialize forms
  initForms(): void {
    this.addPolicyForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      premium: ['', [Validators.required, Validators.min(1)]],
      minSumInsured: ['', [Validators.required, Validators.min(1)]],
      termMonths: ['', [Validators.required, Validators.min(1)]],
    });

    this.purchaseForm = this.fb.group({
      startDate: ['', Validators.required],
      termMonths: ['', [Validators.required, Validators.min(1)]],
      nomineeName: ['', Validators.required],
      nomineeRelation: ['', Validators.required],
    });
  }

  // Add policy (admin)
  addPolicy(): void {
    if (this.addPolicyForm.invalid) return;

    this.policyService.addPolicy(this.addPolicyForm.value).subscribe({
      next: () => {
        alert('Policy added successfully!');
        this.getPolicies();
        this.addPolicyForm.reset();
      },
      error: (err) => {
        console.error('Error adding policy:', err);
        alert(err.error?.error || 'Failed to add policy');
      },
    });
  }

  // Purchase policy (customer)
  purchasePolicy(): void {
    if (!this.selectedPolicyId || this.purchaseForm.invalid) return;

    const data = {
      startDate: this.purchaseForm.value.startDate,
      termMonths: this.purchaseForm.value.termMonths,
      nominee: {
        name: this.purchaseForm.value.nomineeName,
        relation: this.purchaseForm.value.nomineeRelation,
      },
    };

    this.policyService.purchasePolicy(this.selectedPolicyId, data).subscribe({
      next: () => {
        alert('Policy purchased successfully!');
        this.purchaseForm.reset();
        this.selectedPolicyId = null;
        this.router.navigate(['/customer']);
      },
      error: (err) => {
        console.error('Error purchasing policy:', err);
        alert(err.error?.error || 'Failed to purchase policy');
      },
    });
  }
  getUserRole(): void {
    this.userRole = localStorage.getItem('role') || '';
  }
  selectPolicy(policyId: string): void {
    this.selectedPolicyId = policyId;
  }
}