import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClaimService } from './claim.service';

describe('ClaimService', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:4000/api/policies/claims';
  const policyApiUrl = 'http://localhost:4000/api/policies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClaimService],
    });
    service = TestBed.inject(ClaimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit a claim', () => {
    const mockData = {
      userPolicyId: 'policy123',
      incidentDate: '2025-09-30',
      description: 'Accident damage',
      amountClaimed: 5000,
    };

    service.submitClaim(mockData).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush({ success: true });
  });

  it('should handle error when submitting a claim', () => {
    const mockData = {
      userPolicyId: 'policy123',
      incidentDate: '2025-09-30',
      description: 'Accident damage',
      amountClaimed: 5000,
    };

    service.submitClaim(mockData).subscribe({
      next: () => fail('Should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('should get claims and map policy details', () => {
    const mockResponse = [
      {
        _id: 'c1',
        userPolicyId: {
          policyProductId: { title: 'Health Insurance', code: 'H001' },
          policyNumber: 'P-1001',
        },
      },
    ];

    service.getClaims().subscribe((claims) => {
      expect(claims.length).toBe(1);
      expect(claims[0].policyTitle).toBe('Health Insurance');
      expect(claims[0].policyCode).toBe('H001');
      expect(claims[0].policyNumber).toBe('P-1001');
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush(mockResponse);
  });

  it('should handle error when fetching claims', () => {
    service.getClaims().subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      },
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get claim by id', () => {
    const mockClaim = { _id: 'c1', description: 'Accident' };

    service.getClaimById('c1').subscribe((claim) => {
      expect(claim).toEqual(mockClaim);
    });

    const req = httpMock.expectOne(`${apiUrl}/c1`);
    req.flush(mockClaim);
  });

  it('should handle error when fetching claim by id', () => {
    service.getClaimById('c1').subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/c1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should update claim status', () => {
    const updateData = { status: 'APPROVED' as const, notes: 'Verified' };

    service.updateClaimStatus('c1', updateData).subscribe((res) => {
      expect(res).toEqual({ updated: true });
    });

    const req = httpMock.expectOne(`${apiUrl}/c1/status`);
    expect(req.request.method).toBe('PUT');
    req.flush({ updated: true });
  });

  it('should handle error when updating claim status', () => {
    const updateData = { status: 'APPROVED' as const };

    service.updateClaimStatus('c1', updateData).subscribe({
      next: () => fail('Should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/c1/status`);
    req.flush('Update failed', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should fetch user policies', () => {
    const mockPolicies = [{ _id: 'p1', policyNumber: 'PN-001' }];

    service.getUserPolicies().subscribe((policies) => {
      expect(policies.length).toBe(1);
      expect(policies[0].policyNumber).toBe('PN-001');
    });

    const req = httpMock.expectOne(`${policyApiUrl}/user/me`);
    req.flush(mockPolicies);
  });

  it('should handle error when fetching user policies', () => {
    service.getUserPolicies().subscribe({
      next: () => fail('Should have failed with 403 error'),
      error: (error) => {
        expect(error.status).toBe(403);
        expect(error.statusText).toBe('Forbidden');
      },
    });

    const req = httpMock.expectOne(`${policyApiUrl}/user/me`);
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });
});
