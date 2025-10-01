import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AssignAgentComponent } from './assign-agent.component';
import { AdminService } from '../../services/admin.service';

describe('AssignAgentComponent', () => {
  let component: AssignAgentComponent;
  let fixture: ComponentFixture<AssignAgentComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', ['assignAgent']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, AssignAgentComponent],
      providers: [{ provide: AdminService, useValue: mockAdminService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign agent successfully', fakeAsync(() => {
    mockAdminService.assignAgent.and.returnValue(of({ success: true }).pipe(delay(0)));

    component.agentId = 'A123';
    component.targetType = 'policy';
    component.targetId = 'P456';
    component.onAssign();
    fixture.detectChanges();
    tick(); 
    fixture.detectChanges(); 

    expect(mockAdminService.assignAgent).toHaveBeenCalledWith('A123', 'policy', 'P456');
    expect(component.message).toBe('Agent assigned successfully!');
    expect(component.agentId).toBe('');
    expect(component.targetId).toBe('');
    expect(component.loading).toBeFalse();
  }));

  it('should handle error when assignment fails', fakeAsync(() => {
    spyOn(console, 'error');
    mockAdminService.assignAgent.and.returnValue(throwError(() => new Error('Fail')).pipe(delay(0)));

    component.agentId = 'A123';
    component.targetType = 'claim';
    component.targetId = 'C789';

    component.onAssign();
    fixture.detectChanges();
    tick(); 
    fixture.detectChanges(); 

    expect(mockAdminService.assignAgent).toHaveBeenCalledWith('A123', 'claim', 'C789');
    expect(component.message).toBe('Failed to assign agent');
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  }));

  it('should bind agentId input with ngModel', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input[name="agentId"]')).nativeElement as HTMLInputElement;
    input.value = 'A999';
    input.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(component.agentId).toBe('A999');
  }));

  it('should bind targetType select with ngModel', fakeAsync(() => {
    const select = fixture.debugElement.query(By.css('select[name="targetType"]')).nativeElement as HTMLSelectElement;
    select.value = 'claim';
    select.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();

    expect(component.targetType).toBe('claim');
  }));

  it('should bind targetId input with ngModel', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input[name="targetId"]')).nativeElement as HTMLInputElement;
    input.value = 'T123';
    input.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(component.targetId).toBe('T123');
  }));

  it('should disable submit button and show spinner while loading', fakeAsync(() => {
    mockAdminService.assignAgent.and.returnValue(of({ success: true }).pipe(delay(0)));

    component.agentId = 'A123';
    component.targetType = 'policy';
    component.targetId = 'P456';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
    expect(button.querySelector('svg')).toBeNull();
    component.onAssign();
    fixture.detectChanges(); 
    expect(component.loading).toBeTrue();
    expect(button.disabled).toBeTrue();
    expect(button.querySelector('svg')).toBeTruthy();
    tick();
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(button.disabled).toBeFalse();
    expect(button.querySelector('svg')).toBeNull();
  }));
});
