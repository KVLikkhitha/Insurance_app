import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { AgentListComponent } from './agent-list.component';
import { AdminService } from '../../services/admin.service';

describe('AgentListComponent', () => {
  let component: AgentListComponent;
  let fixture: ComponentFixture<AgentListComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mockAdminService = jasmine.createSpyObj('AdminService', ['getAgents']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, AgentListComponent],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockAdminService.getAgents.and.returnValue(of([])); 
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load agents from service on init', () => {
    const mockAgents = [
      { name: 'Alice', email: 'alice@test.com' },
      { name: 'Bob', email: 'bob@test.com' },
    ];
    mockAdminService.getAgents.and.returnValue(of(mockAgents));

    fixture.detectChanges(); 

    expect(mockAdminService.getAgents).toHaveBeenCalled();
    expect(component.agents.length).toBe(2);
    expect(component.agents).toEqual(mockAgents);
  });

  it('should handle error when service fails', () => {
    spyOn(console, 'error'); 
    mockAdminService.getAgents.and.returnValue(throwError(() => 'Error!'));
    fixture.detectChanges(); 
    expect(mockAdminService.getAgents).toHaveBeenCalled();
    expect(component.agents.length).toBe(0);
    expect(console.error).toHaveBeenCalled();
  });

  it('should filter agents by search term', () => {
    component.agents = [
      { name: 'Alice', email: 'alice@test.com' },
      { name: 'Bob', email: 'bob@test.com' },
    ];

    component.searchTerm = 'alice';
    const filtered = component.filteredAgents();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Alice');

    component.searchTerm = 'bob@test.com';
    const filteredByEmail = component.filteredAgents();
    expect(filteredByEmail.length).toBe(1);
    expect(filteredByEmail[0].email).toBe('bob@test.com');
  });

  it('should bind search input with ngModel', async () => {
    mockAdminService.getAgents.and.returnValue(of([{ name: 'Alice', email: 'alice@test.com' }]));
    fixture.detectChanges(); 

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'Alice';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.searchTerm).toBe('Alice');
  });
});
