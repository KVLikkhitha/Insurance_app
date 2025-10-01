import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:4000/api/policies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create an agent', () => {
    const mockAgent = { name: 'John', email: 'john@test.com', password: '1234' };
    const mockResponse = { success: true, id: 'A1' };

    service.createAgent(mockAgent).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/agents`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error when creating an agent', () => {
    const mockAgent = { name: 'John', email: 'john@test.com', password: '1234' };

    service.createAgent(mockAgent).subscribe({
      next: () => fail('Expected error, not success'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/agents`);
    req.flush('Create failed', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch agents', () => {
    const mockAgents = [{ id: 'A1', name: 'John' }];

    service.getAgents().subscribe((res) => {
      expect(res).toEqual(mockAgents);
    });

    const req = httpMock.expectOne(`${baseUrl}/agents`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAgents);
  });

  it('should handle error when fetching agents', () => {
    service.getAgents().subscribe({
      next: () => fail('Expected error, not success'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(err.statusText).toBe('Not Found');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/agents`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should assign agent', () => {
    const agentId = 'A1';
    const targetType = 'policy';
    const targetId = 'P1';
    const mockResponse = { success: true };

    service.assignAgent(agentId, targetType, targetId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/agents/${agentId}/assign`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ targetType, targetId });
    req.flush(mockResponse);
  });

  it('should handle error when assigning agent', () => {
    const agentId = 'A1';

    service.assignAgent(agentId, 'policy', 'P1').subscribe({
      next: () => fail('Expected error, not success'),
      error: (err) => {
        expect(err.status).toBe(400);
        expect(err.statusText).toBe('Bad Request');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/agents/${agentId}/assign`);
    req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
  });

  it('should fetch user policies', () => {
    const mockPolicies = [{ id: 'P1', title: 'Health Policy' }];

    service.getUserPolicies().subscribe((res) => {
      expect(res).toEqual(mockPolicies);
    });

    const req = httpMock.expectOne(`${baseUrl}/userpolicies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicies);
  });

  it('should handle error when fetching user policies', () => {
    service.getUserPolicies().subscribe({
      next: () => fail('Expected error, not success'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/userpolicies`);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch claims', () => {
    const mockClaims = [{ id: 'C1', status: 'PENDING' }];

    service.getClaims().subscribe((res) => {
      expect(res).toEqual(mockClaims);
    });

    const req = httpMock.expectOne(`${baseUrl}/claims`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClaims);
  });

  it('should handle error when fetching claims', () => {
    service.getClaims().subscribe({
      next: () => fail('Expected error, not success'),
      error: (err) => {
        expect(err.status).toBe(403);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/claims`);
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });
});

