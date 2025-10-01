import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SummaryComponent } from './summary.component';
import { AuditService } from '../../services/audit.service';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let mockAuditService: jasmine.SpyObj<AuditService>;

  beforeEach(async () => {
    mockAuditService = jasmine.createSpyObj('AuditService', ['getSummary']);

    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [{ provide: AuditService, useValue: mockAuditService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display summary', fakeAsync(() => {
    const mockData = {
      usersCount: 10,
      policiesSold: 5,
      claimsPending: 2,
      totalPayments: 50000
    };

    mockAuditService.getSummary.and.returnValue(of(mockData));
    fixture.detectChanges(); 
    tick(); 
    fixture.detectChanges();
    expect(component.summary).toEqual(mockData);
    expect(component.loading).toBeFalse();
  }));

  it('should handle error on fetchSummary', fakeAsync(() => {
    mockAuditService.getSummary.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.error).toBe('Failed to fetch summary');
    expect(component.loading).toBeFalse();
  }));
});
