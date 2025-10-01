import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PaymentComponent } from './payment.component';
import { PaymentService } from '../../services/payment.service';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let paymentServiceSpy: jasmine.SpyObj<PaymentService>;

  const mockPayments = [
    {
      policyTitle: 'Health Policy',
      policyCode: 'HP001',
      amount: 2000,
      method: 'UPI',
      reference: 'TXN123',
      status: 'SUCCESS',
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    paymentServiceSpy = jasmine.createSpyObj('PaymentService', [
      'getAllPayments',
      'getUserPayments',
    ]);

    await TestBed.configureTestingModule({
      imports: [PaymentComponent],
      providers: [{ provide: PaymentService, useValue: paymentServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Admin/Agent role', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.returnValue('admin');
      paymentServiceSpy.getAllPayments.and.returnValue(of(mockPayments));
      fixture.detectChanges();
    });

    it('should load all payments for admin/agent', () => {
      expect(paymentServiceSpy.getAllPayments).toHaveBeenCalled();
      expect(component.payments.length).toBe(1);
      expect(component.payments[0].policyCode).toBe('HP001');
    });
  });

  describe('User role', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.returnValue('user');
      paymentServiceSpy.getUserPayments.and.returnValue(of(mockPayments));
      fixture.detectChanges();
    });

    it('should load user payments for non-admin', () => {
      expect(paymentServiceSpy.getUserPayments).toHaveBeenCalled();
      expect(component.payments.length).toBe(1);
      expect(component.payments[0].method).toBe('UPI');
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.returnValue('admin');
      paymentServiceSpy.getAllPayments.and.returnValue(
        throwError(() => new Error('Server error'))
      );
      spyOn(console, 'error');
      fixture.detectChanges();
    });

    it('should log error when getAllPayments fails', () => {
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching all payments:',
        jasmine.any(Error)
      );
      expect(component.payments.length).toBe(0);
    });
  });
});
