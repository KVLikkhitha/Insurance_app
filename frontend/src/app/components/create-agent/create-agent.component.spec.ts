import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError, defer } from 'rxjs';
import { CreateAgentComponent } from './create-agent.component';
import { AdminService } from '../../services/admin.service';
import { By } from '@angular/platform-browser';

describe('CreateAgentComponent', () => {
  let component: CreateAgentComponent;
  let fixture: ComponentFixture<CreateAgentComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', ['createAgent']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CreateAgentComponent],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call adminService.createAgent on form submit (success case)', fakeAsync(() => {
    const mockResponse = { success: true };
    const inputAgent = { name: 'John', email: 'john@test.com', password: '1234' };
    mockAdminService.createAgent.and.returnValue(of(mockResponse));

    component.agent = { ...inputAgent };
    component.onSubmit();
    tick();

    expect(mockAdminService.createAgent).toHaveBeenCalledWith(inputAgent);
    expect(component.message).toBe('Agent created successfully!');
    expect(component.agent).toEqual({ name: '', email: '', password: '' });
    expect(component.loading).toBeFalse();
  }));

  it('should set error message when service fails', fakeAsync(() => {
    mockAdminService.createAgent.and.returnValue(throwError(() => ({ status: 500 })));

    component.agent = { name: 'Jane', email: 'jane@test.com', password: '5678' };
    component.onSubmit();
    tick();

    expect(mockAdminService.createAgent).toHaveBeenCalled();
    expect(component.message).toBe('Failed to create agent');
    expect(component.loading).toBeFalse();
  }));

  it('should disable button and show loader while loading', fakeAsync(() => {
    mockAdminService.createAgent.and.returnValue(
      defer(() => Promise.resolve({ success: true }))
    );

    component.agent = { name: 'John', email: 'john@test.com', password: '1234' };

    component.onSubmit();
    expect(component.loading).toBeTrue();

    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should bind input fields with ngModel', async () => {
    component.agent.name = 'Tester';
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement as HTMLInputElement;
    expect(input.value).toBe('Tester');
    input.value = 'Changed';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.agent.name).toBe('Changed');
  });
});
