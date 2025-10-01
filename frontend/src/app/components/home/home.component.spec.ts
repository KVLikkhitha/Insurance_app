import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule] 
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero heading', () => {
    const heading = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(heading.textContent).toContain('Insurance that');
    expect(heading.textContent).toContain('protects');
  });

  it('should render "Get Started" button with href', () => {
    const button = fixture.debugElement.query(By.css('a[target="_blank"]')).nativeElement as HTMLAnchorElement;
    expect(button).toBeTruthy();
    expect(button.href).toContain('/register');
  });

  it('should render "Contact Us" router link', () => {
    const button = fixture.debugElement.query(By.css('a[routerLink="/contact"]')).nativeElement;
    expect(button).toBeTruthy();
  });

  it('should render all feature cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('section div.bg-white'));
    expect(cards.length).toBe(3);

    const titles = cards.map(card => card.query(By.css('h3')).nativeElement.textContent.trim());
    expect(titles).toEqual(['Guidance', 'Claims', 'Secure Payments']);
  });
});
