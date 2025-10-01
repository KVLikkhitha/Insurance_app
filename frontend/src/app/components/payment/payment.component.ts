import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments: any[] = [];
  userRole: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.loadPayments();
  }

  loadPayments(): void {
    if (this.userRole === 'admin' || this.userRole === 'agent') {
      this.paymentService.getAllPayments().subscribe({
        next: (res) => (this.payments = res),
        error: (err) => console.error('Error fetching all payments:', err),
      });
    } else {
      this.paymentService.getUserPayments().subscribe({
        next: (res) => (this.payments = res),
        error: (err) => console.error('Error fetching user payments:', err),
      });
    }
  }
}