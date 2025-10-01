import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-assign-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6">
      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Assign Agent
      </h2>

      <!-- Form -->
      <form (ngSubmit)="onAssign()" #assignForm="ngForm" class="space-y-4">
        <!-- Agent ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            [(ngModel)]="agentId"
            name="agentId"
            placeholder="Enter Agent ID"
            required
          />
        </div>

        <!-- Target Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
          <select
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            [(ngModel)]="targetType"
            name="targetType"
            required
          >
            <option value="policy">Policy</option>
            <option value="claim">Claim</option>
          </select>
        </div>

        <!-- Target ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target ID</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            [(ngModel)]="targetId"
            name="targetId"
            placeholder="Enter Target ID"
            required
          />
        </div>

        <!-- Submit Button with Loader -->
        <button
          type="submit"
          [disabled]="loading"
          class="w-full flex justify-center items-center bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
          {{ loading ? 'Assigning...' : 'Assign Agent' }}
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
export class AssignAgentComponent {
  agentId = '';
  targetType = 'policy';
  targetId = '';
  message = '';
  loading = false;

  constructor(private adminService: AdminService) {}

  onAssign() {
    this.loading = true;
    this.message = '';

    this.adminService.assignAgent(this.agentId, this.targetType, this.targetId).subscribe({
      next: () => {
        this.message = 'Agent assigned successfully!';
        this.agentId = '';
        this.targetId = '';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to assign agent';
        this.loading = false;
      },
    });
  }
}
