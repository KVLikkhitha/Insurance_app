import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CustomerComponent } from './customer.component';
import { PolicyService } from '../../services/policy.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;
  let policyServiceSpy: jasmine.SpyObj<PolicyService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PolicyService', ['getUserPolicies', 'cancelPolicy']);

    await TestBed.configureTestingModule({
      imports: [CustomerComponent, RouterTestingModule],
      providers: [
        { provide: PolicyService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    policyServiceSpy = TestBed.inject(PolicyService) as jasmine.SpyObj<PolicyService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user policies on init', () => {
    const mockPolicies = [{ _id: '1', status: 'ACTIVE', policyProductId: { title: 'Life Insurance', code: 'L001', premium: 5000, termMonths: 12 } }];
    policyServiceSpy.getUserPolicies.and.returnValue(of(mockPolicies));
    fixture.detectChanges(); 

    expect(policyServiceSpy.getUserPolicies).toHaveBeenCalled();
    expect(component.userPolicies).toEqual(mockPolicies);
  });

  it('should handle error when loading user policies', () => {
    spyOn(console, 'error');
    policyServiceSpy.getUserPolicies.and.returnValue(throwError(() => ({ error: 'Error loading' })));

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
    expect(component.userPolicies).toEqual([]);
  });

  it('should cancel policy and reload list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    policyServiceSpy.cancelPolicy.and.returnValue(of({}));
    policyServiceSpy.getUserPolicies.and.returnValue(of([])); 

    component.cancelPolicy('123');

    expect(policyServiceSpy.cancelPolicy).toHaveBeenCalledWith('123');
    expect(window.alert).toHaveBeenCalledWith('Policy cancelled successfully!');
    expect(policyServiceSpy.getUserPolicies).toHaveBeenCalled();
  });

  it('should not cancel policy if confirm is false', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.cancelPolicy('123');

    expect(policyServiceSpy.cancelPolicy).not.toHaveBeenCalled();
  });

  it('should handle error when cancelling policy', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');

    policyServiceSpy.cancelPolicy.and.returnValue(throwError(() => ({ error: { error: 'Cancel failed' } })));

    component.cancelPolicy('123');

    expect(window.alert).toHaveBeenCalledWith('Cancel failed');
    expect(console.error).toHaveBeenCalled();
  });
});
