import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-paymentform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paymentform.component.html',
  styleUrls: ['./paymentform.component.css']
})
export class PaymentFormComponent implements OnInit {
  paymentForm!: FormGroup;
  policyId!: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get policyId from route params
    this.policyId = this.route.snapshot.paramMap.get('policyId') || '';

    // Build form
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      method: ['CARD', Validators.required],
      reference: ['', Validators.required]
    });
  }

  // Submit form
  onSubmit(): void {
    if (this.paymentForm.invalid) return;

    this.loading = true;

    const paymentData = {
      policyId: this.policyId,
      ...this.paymentForm.value
    };

    this.paymentService.recordPayment(paymentData).subscribe({
      next: (res) => {
        alert('Payment successful!');
        this.router.navigate(['/payment']);
      },
      error: (err) => {
        console.error('Payment failed:', err);
        alert(err.error?.error || 'Payment failed. Try again.');
      },
      complete: () => (this.loading = false)
    });
  }
}
