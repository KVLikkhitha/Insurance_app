import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PolicyComponent } from './policy.component';
import { PolicyService } from '../../services/policy.service';

describe('PolicyComponent', () => {
  let component: PolicyComponent;
  let fixture: ComponentFixture<PolicyComponent>;
  let mockPolicyService: jasmine.SpyObj<PolicyService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPolicyService = jasmine.createSpyObj('PolicyService', [
      'getPolicies',
      'addPolicy',
      'purchasePolicy'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPolicyService.getPolicies.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PolicyComponent, ReactiveFormsModule],
      providers: [
        { provide: PolicyService, useValue: mockPolicyService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    const mockPolicies = [
      { _id: '1', code: 'P001', title: 'Health Insurance', description: 'Covers medical expenses', premium: 1000, minSumInsured: 50000, termMonths: 12 }
    ];
    mockPolicyService.getPolicies.and.returnValue(of(mockPolicies));

    component.ngOnInit();

    expect(mockPolicyService.getPolicies).toHaveBeenCalled();
    expect(component.policies).toEqual(mockPolicies);
  });

  it('should call addPolicy when form is valid', () => {
    component.initForms();
    component.addPolicyForm.setValue({
      code: 'P002',
      title: 'Car Insurance',
      description: 'Covers car damages',
      premium: 2000,
      minSumInsured: 100000,
      termMonths: 24
    });

    mockPolicyService.addPolicy.and.returnValue(of({}));

    component.addPolicy();

    expect(mockPolicyService.addPolicy).toHaveBeenCalled();
  });

  it('should NOT call addPolicy when form is invalid', () => {
    component.initForms();
    component.addPolicyForm.patchValue({ code: '', title: '' });
    component.addPolicy();

    expect(mockPolicyService.addPolicy).not.toHaveBeenCalled();
  });

  it('should purchase policy when form is valid', () => {
    component.initForms();
    component.selectedPolicyId = '123';
    component.purchaseForm.setValue({
      startDate: '2025-09-30',
      termMonths: 12,
      nomineeName: 'John',
      nomineeRelation: 'Brother'
    });

    mockPolicyService.purchasePolicy.and.returnValue(of({}));

    component.purchasePolicy();

    expect(mockPolicyService.purchasePolicy).toHaveBeenCalledWith('123', jasmine.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/customer']);
  });

  it('should NOT purchase policy if form is invalid', () => {
    component.initForms();
    component.selectedPolicyId = '123';
    component.purchaseForm.patchValue({ startDate: '', termMonths: '' });

    component.purchasePolicy();

    expect(mockPolicyService.purchasePolicy).not.toHaveBeenCalled();
  });

  it('should set userRole from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('admin');
    component.getUserRole();
    expect(component.userRole).toBe('admin');
  });
});
