import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimComponent } from './claim.component';
import { ClaimService } from '../../services/claim.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

class MockClaimService {
  getClaims = jasmine.createSpy('getClaims').and.returnValue(of([{ _id: '1', description: 'Test Claim' }]));
  getUserPolicies = jasmine.createSpy('getUserPolicies').and.returnValue(
    of([{ _id: '101', policyProductId: { title: 'Health Insurance' } }])
  );
  submitClaim = jasmine.createSpy('submitClaim').and.returnValue(of({ message: 'Claim submitted successfully' }));
}

describe('ClaimComponent', () => {
  let component: ClaimComponent;
  let fixture: ComponentFixture<ClaimComponent>;
  let claimService: MockClaimService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimComponent, CommonModule, FormsModule],
      providers: [{ provide: ClaimService, useClass: MockClaimService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimComponent);
    component = fixture.componentInstance;
    claimService = TestBed.inject(ClaimService) as unknown as MockClaimService;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load claims on init', () => {
    expect(claimService.getClaims).toHaveBeenCalled();
    expect(component.claims.length).toBe(1);
  });

  it('should load user policies on init', () => {
    expect(claimService.getUserPolicies).toHaveBeenCalled();
    expect(component.userPolicies.length).toBe(1);
  });

  it('should not submit claim if no policy is selected', () => {
    spyOn(window, 'alert');
    component.newClaim.userPolicyId = '';
    component.submitClaim();
    expect(window.alert).toHaveBeenCalledWith('Please select a policy before submitting.');
    expect(claimService.submitClaim).not.toHaveBeenCalled();
  });

  it('should submit claim successfully', () => {
    spyOn(window, 'alert');
    const claimData = {
      userPolicyId: '101',
      incidentDate: '2025-09-01',
      description: 'Accident',
      amountClaimed: 5000,
    };
    component.newClaim = { ...claimData };
    component.submitClaim();
    expect(claimService.submitClaim).toHaveBeenCalledWith(jasmine.objectContaining(claimData));
    expect(window.alert).toHaveBeenCalledWith('Claim submitted successfully!');
  });

  it('should handle error when submitting claim', () => {
    spyOn(console, 'error');
    (claimService.submitClaim as jasmine.Spy).and.returnValue(throwError(() => new Error('Server error')));

    const claimData = {
      userPolicyId: '101',
      incidentDate: '2025-09-01',
      description: 'Accident',
      amountClaimed: 5000,
    };

    component.newClaim = { ...claimData };

    component.submitClaim();

    expect(console.error).toHaveBeenCalledWith('Error submitting claim:', jasmine.any(Error));
  });
});
