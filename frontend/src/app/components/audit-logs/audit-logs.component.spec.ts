import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { AuditLogsComponent } from './audit-logs.component';
import { AuditService } from '../../services/audit.service';

describe('AuditLogsComponent', () => {
  let component: AuditLogsComponent;
  let fixture: ComponentFixture<AuditLogsComponent>;
  let mockAuditService: jasmine.SpyObj<AuditService>;

  beforeEach(async () => {
    mockAuditService = jasmine.createSpyObj('AuditService', ['getAuditLogs']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, AuditLogsComponent],
      providers: [{ provide: AuditService, useValue: mockAuditService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditLogsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch logs on init successfully', fakeAsync(() => {
    const logs = [
      { timestamp: new Date().toISOString(), action: 'CREATE_POLICY', actorId: 'admin1', details: {} },
      { timestamp: new Date().toISOString(), action: 'UPDATE_CLAIM', actorId: 'admin2', details: {} }
    ];
    mockAuditService.getAuditLogs.and.returnValue(of(logs));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
    expect(component.logs.length).toBe(2);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  }));

  it('should handle error when fetching logs fails', fakeAsync(() => {
    spyOn(console, 'error');
    mockAuditService.getAuditLogs.and.returnValue(throwError(() => new Error('Fail')));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(mockAuditService.getAuditLogs).toHaveBeenCalled();
    expect(component.logs.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to fetch audit logs');
    expect(console.error).toHaveBeenCalled();
  }));

  it('should apply filters correctly', () => {
    component.logs = [
      { timestamp: '2025-09-29T10:00:00Z', action: 'CREATE_POLICY', actorId: 'admin1', details: {} },
      { timestamp: '2025-09-30T12:00:00Z', action: 'UPDATE_CLAIM', actorId: 'admin2', details: {} }
    ];

    component.filters = {
      fromDate: '2025-09-30',
      toDate: '',
      action: '',
      actorId: ''
    };

    component.applyFilters();

    expect(component.logs.length).toBe(1);
    expect(component.logs[0].actorId).toBe('admin2');
  });

  it('should reset filters and fetch logs', fakeAsync(() => {
    const logs = [
      { timestamp: new Date().toISOString(), action: 'CREATE_POLICY', actorId: 'admin1', details: {} }
    ];
    mockAuditService.getAuditLogs.and.returnValue(of(logs));
    component.filters = { fromDate: '2025-01-01', toDate: '2025-01-31', action: 'TEST', actorId: 'abc' };
    component.resetFilters();
    tick();
    fixture.detectChanges();
    expect(component.filters).toEqual({ fromDate: '', toDate: '', action: '', actorId: '' });
    expect(component.logs.length).toBe(1);
  }));
});
