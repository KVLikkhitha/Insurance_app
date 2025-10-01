import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService],
    });

    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should record a payment', () => {
    const mockPayment = {
      policyId: '123',
      amount: 1000,
      method: 'CARD' as const,
      reference: 'TXN001',
    };

    const mockResponse = { success: true };

    service.recordPayment(mockPayment).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/payments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayment);

    req.flush(mockResponse);
  });

  it('should fetch user payments with mapped data', () => {
    const mockApiResponse = [
      {
        _id: '1',
        amount: 500,
        userPolicyId: {
          policyProductId: { title: 'Health Policy', code: 'HP001' },
        },
      },
      {
        _id: '2',
        amount: 1000,
        userPolicyId: null,
      },
    ];

    service.getUserPayments().subscribe((payments) => {
      expect(payments.length).toBe(2);
      expect(payments[0].policyTitle).toBe('Health Policy');
      expect(payments[0].policyCode).toBe('HP001');
      expect(payments[1].policyTitle).toBe('Unknown Policy');
      expect(payments[1].policyCode).toBe('N/A');
    });

    const req = httpMock.expectOne('http://localhost:4000/api/payments/user/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should fetch all payments with mapped data', () => {
    const mockApiResponse = [
      {
        _id: '1',
        amount: 1500,
        userPolicyId: {
          policyProductId: { title: 'Life Policy', code: 'LP001' },
        },
      },
      {
        _id: '2',
        amount: 2000,
        userPolicyId: null,
      },
    ];

    service.getAllPayments().subscribe((payments) => {
      expect(payments.length).toBe(2);
      expect(payments[0].policyTitle).toBe('Life Policy');
      expect(payments[0].policyCode).toBe('LP001');
      expect(payments[1].policyTitle).toBe('Unknown Policy');
      expect(payments[1].policyCode).toBe('N/A');
    });

    const req = httpMock.expectOne('http://localhost:4000/api/payments');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });
});
