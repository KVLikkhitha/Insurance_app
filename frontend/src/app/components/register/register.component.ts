import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'customer';
  loading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = null;

    this.authService.register(this.name, this.email, this.password, this.role).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Registration failed';
      },
    });
  }
}
