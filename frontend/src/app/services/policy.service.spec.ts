import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolicyService } from './policy.service';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:4000/api/policies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PolicyService]
    });

    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch all policies (GET)', () => {
    const mockPolicies = [{ _id: '1', title: 'Health Insurance' }];
    service.getPolicies().subscribe((policies) => {
      expect(policies).toEqual(mockPolicies);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicies);
  });

  it('should add a new policy (POST)', () => {
    const newPolicy = { title: 'Car Insurance' };
    const mockResponse = { success: true };

    service.addPolicy(newPolicy).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPolicy);
    req.flush(mockResponse);
  });

  it('should purchase a policy (POST)', () => {
    const policyId = '123';
    const purchaseData = { startDate: '2025-09-30' };
    const mockResponse = { success: true };

    service.purchasePolicy(policyId, purchaseData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/${policyId}/purchase`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(purchaseData);
    req.flush(mockResponse);
  });

  it('should fetch user policies (GET)', () => {
    const mockUserPolicies = [{ policyId: '1', status: 'active' }];

    service.getUserPolicies().subscribe((res) => {
      expect(res).toEqual(mockUserPolicies);
    });

    const req = httpMock.expectOne(`${apiUrl}/user/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserPolicies);
  });

  it('should cancel a user policy (PUT)', () => {
    const userPolicyId = '456';
    const mockResponse = { success: true };

    service.cancelPolicy(userPolicyId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/user/${userPolicyId}/cancel`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });
});
