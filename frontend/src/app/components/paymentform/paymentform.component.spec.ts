import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFormComponent } from './paymentform.component';
import { PaymentService } from '../../services/payment.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;
  let paymentServiceSpy: jasmine.SpyObj<PaymentService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    paymentServiceSpy = jasmine.createSpyObj('PaymentService', ['recordPayment']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PaymentFormComponent, ReactiveFormsModule],
      providers: [
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['policyId', '123']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.paymentForm;
    expect(form).toBeTruthy();
    expect(form.get('amount')).toBeTruthy();
    expect(form.get('method')?.value).toBe('CARD');
    expect(form.get('reference')).toBeTruthy();
  });

  it('should mark form invalid when required fields are missing', () => {
    component.paymentForm.setValue({ amount: '', method: '', reference: '' });
    expect(component.paymentForm.invalid).toBeTrue();
  });

  it('should call paymentService.recordPayment on valid submit', () => {
    const mockResponse = { success: true };
    paymentServiceSpy.recordPayment.and.returnValue(of(mockResponse));

    component.paymentForm.setValue({ amount: 500, method: 'CARD', reference: 'TXN123' });
    component.onSubmit();

    expect(paymentServiceSpy.recordPayment).toHaveBeenCalledWith({
      policyId: '123',
      amount: 500,
      method: 'CARD',
      reference: 'TXN123',
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/payment']);
  });

  it('should handle error on failed payment', () => {
    spyOn(window, 'alert');
    paymentServiceSpy.recordPayment.and.returnValue(
      throwError(() => ({ error: { error: 'Payment failed' } }))
    );

    component.paymentForm.setValue({ amount: 1000, method: 'NETBANKING', reference: 'TXN999' });
    component.onSubmit();

    expect(paymentServiceSpy.recordPayment).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Payment failed');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
