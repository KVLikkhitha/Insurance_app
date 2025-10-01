import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditService]
    });

    service = TestBed.inject(AuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch audit logs with default limit', () => {
    const mockLogs = [{ id: 1, action: 'TEST_ACTION' }];

    service.getAuditLogs().subscribe((logs) => {
      expect(logs).toEqual(mockLogs);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/policies/admin/audit?limit=50');
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
  });

  it('should fetch audit logs with custom limit', () => {
    const mockLogs = [{ id: 2, action: 'ANOTHER_ACTION' }];

    service.getAuditLogs(10).subscribe((logs) => {
      expect(logs).toEqual(mockLogs);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/policies/admin/audit?limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
  });

  it('should fetch summary stats', () => {
    const mockSummary = { totalPolicies: 100, totalClaims: 25 };

    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual(mockSummary);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/policies/admin/summary');
    expect(req.request.method).toBe('GET');
    req.flush(mockSummary);
  });
});
