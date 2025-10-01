import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6">
      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Create New Agent
      </h2>

      <!-- Form -->
      <form (ngSubmit)="onSubmit()" #agentForm="ngForm" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            [(ngModel)]="agent.name"
            name="name"
            placeholder="Enter agent name"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            [(ngModel)]="agent.email"
            name="email"
            placeholder="Enter email address"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            [(ngModel)]="agent.password"
            name="password"
            placeholder="Enter password"
            required
          />
        </div>

        <!-- Submit Button with Loader -->
        <button
          type="submit"
          [disabled]="loading"
          class="w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            *ngIf="loading"
            class="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          {{ loading ? 'Creating...' : 'Create Agent' }}
        </button>
      </form>

      <!-- Feedback -->
      <p
        *ngIf="message"
        class="mt-4 text-center font-medium"
        [ngClass]="{
          'text-green-600': message.includes('successfully'),
          'text-red-600': message.includes('Failed')
        }"
      >
        {{ message }}
      </p>
    </div>
  `,
})
export class CreateAgentComponent {
  agent = { name: '', email: '', password: '' };
  message = '';
  loading = false;

  constructor(private adminService: AdminService) {}

  onSubmit() {
    this.loading = true;
    this.message = '';

    this.adminService.createAgent(this.agent).subscribe({
      next: () => {
        this.message = 'Agent created successfully!';
        this.agent = { name: '', email: '', password: '' };
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to create agent';
        this.loading = false;
      },
    });
  }
}