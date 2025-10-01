import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NgIf, NgClass],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Navbar -->
      <header class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <!-- Logo + Title -->
          <div class="flex items-center gap-3">
            <img src="https://licindia.in/favicon.ico" alt="Logo" class="w-8 h-8" />
            <h1 class="text-xl font-bold text-gray-800">Insurance Portal</h1>
          </div>

          <!-- Nav Links -->
          <nav class="hidden md:flex gap-6 text-sm font-medium items-center text-gray-700">
            <a routerLink="/home" routerLinkActive="active-link">Home</a>
            <a routerLink="/login" routerLinkActive="active-link">Login</a>
            <a routerLink="/register" routerLinkActive="active-link">Register</a>
            <a routerLink="/policy" routerLinkActive="active-link">Policies</a>
            <a routerLink="/customer" routerLinkActive="active-link">Customer</a>
            <a routerLink="/payment" routerLinkActive="active-link">Payments</a>
            <a routerLink="/claim" routerLinkActive="active-link">Claims</a>
            <a routerLink="/claimlist" routerLinkActive="active-link">Claim List</a>
            <ng-container>
            <div class="relative group">
              <!-- Admin Button -->
              <button
                class="px-3 py-2 text-gray-800 hover:text-blue-600 font-medium flex items-center gap-1 focus:outline-none"
              >
                Admin
                <svg
                  class="w-4 h-4 transform group-hover:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                class="absolute left-0 top-full mt-0 w-56 bg-blue-800 text-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <a
                  routerLink="/createagent"
                  routerLinkActive="active-link"
                  class="block px-4 py-2 border-b border-blue-700 hover:bg-blue-700">
                  Create Agent
                </a>
                <a
                  routerLink="/agentlist"
                  routerLinkActive="active-link"
                  class="block px-4 py-2 border-b border-blue-700 hover:bg-blue-700">
                  Agent List
                </a>
                <a
                  routerLink="/assignagent"
                  routerLinkActive="active-link"
                  class="block px-4 py-2 border-b border-blue-700 hover:bg-blue-700">
                  Assign Agent
                </a>
              </div>
            </div>
          </ng-container>
            <a routerLink="/auditlogs" routerLinkActive="active-link">Audit Logs</a>
            <a routerLink="/summary" routerLinkActive="active-link">Summary</a>

        <button
          *ngIf="isLoggedIn"
          (click)="logout()"
          data-testid="logout-btn"
          class="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          Logout
        </button>
          </nav>
        </div>
      </header>

      <!-- Routed Content -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
  `,
  styles: [`
    a { transition: color 0.2s, border-bottom 0.2s; }
    a:hover { color: #2563eb; }
    .active-link { border-bottom: 2px solid #2563eb; padding-bottom: 2px; color: #2563eb; }
  `],
})
export class DashboardComponent implements OnInit {
  currentYear = new Date().getFullYear();
  admin = false;
  isLoggedIn = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      const role = localStorage.getItem('role');
      this.admin = role === 'admin';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    this.admin = false;
    this.router.navigate(['/login']);
  }
}

