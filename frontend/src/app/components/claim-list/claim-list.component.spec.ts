import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { ClaimListComponent } from './claim-list.component';
import { ClaimService } from '../../services/claim.service';
import { AuthService } from '../../services/auth.service';

class MockClaimService {
  getClaims = jasmine.createSpy().and.returnValue(of([]));
  updateClaimStatus = jasmine.createSpy().and.returnValue(of({}));
}
class MockAuthService {
  currentUser = { role: 'customer' };
}

describe('ClaimListComponent', () => {
  let component: ClaimListComponent;
  let fixture: ComponentFixture<ClaimListComponent>;
  let claimService: MockClaimService;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimListComponent],
      providers: [
        { provide: ClaimService, useClass: MockClaimService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimListComponent);
    component = fixture.componentInstance;
    claimService = TestBed.inject(ClaimService) as unknown as MockClaimService;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message initially', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('[data-testid="loading"]'));
    expect(loadingEl.nativeElement.textContent).toContain('Loading claims...');
  });

  it('should display "No claims found" message when claims list is empty', () => {
    component.loading = false;
    component.claims = [];
    fixture.detectChanges();

    const noClaimsEl = fixture.debugElement.query(By.css('[data-testid="no-claims"]'));
    expect(noClaimsEl.nativeElement.textContent).toContain('No claims found');
  });

  it('should not render admin actions if role is customer', () => {
    component.userRole = 'customer';
    component.claims = [
      {
        _id: '1',
        policyTitle: 'Test Policy',
        policyCode: 'TP001',
        incidentDate: new Date().toISOString(),
        description: 'Test claim',
        amountClaimed: 1000,
        status: 'PENDING',
      },
    ];
    fixture.detectChanges();

    const adminActions = fixture.debugElement.query(By.css('[data-testid="admin-actions"]'));
    expect(adminActions).toBeNull();
  });

  it('should render admin actions if role is admin', () => {
    component.userRole = 'admin';
    component.claims = [
      {
        _id: '1',
        policyTitle: 'Test Policy',
        policyCode: 'TP001',
        incidentDate: new Date().toISOString(),
        description: 'Test claim',
        amountClaimed: 1000,
        status: 'PENDING',
      },
    ];
    fixture.detectChanges();

    const adminActions = fixture.debugElement.query(By.css('[data-testid="admin-actions"]'));
    expect(adminActions).toBeTruthy();

    const approveBtn = fixture.debugElement.query(By.css('[data-testid="approve-btn"]'));
    const rejectBtn = fixture.debugElement.query(By.css('[data-testid="reject-btn"]'));
    expect(approveBtn).toBeTruthy();
    expect(rejectBtn).toBeTruthy();
  });
});
