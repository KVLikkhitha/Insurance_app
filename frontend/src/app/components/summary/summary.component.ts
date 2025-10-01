import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        System Summary
      </h2>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center items-center py-10">
        <svg
          class="animate-spin h-8 w-8 text-blue-600"
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
        <span class="ml-3 text-gray-600">Loading summary...</span>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="text-red-600 font-medium text-center py-4">
        {{ error }}
      </div>

      <!-- Summary Grid -->
      <div *ngIf="summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Users -->
        <div
          class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Users</h3>
            <svg
              class="h-8 w-8 opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6h-4m4 0v-6m0 6H7m4-6a4 4 0 00-4-4V7a4 4 0 018 0v3a4 4 0 004 4m-4 6v-6"
              />
            </svg>
          </div>
          <p class="mt-3 text-3xl font-bold">{{ summary.usersCount }}</p>
        </div>

        <!-- Policies -->
        <div
          class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Active Policies</h3>
            <svg
              class="h-8 w-8 opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m-2 4h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v12z"
              />
            </svg>
          </div>
          <p class="mt-3 text-3xl font-bold">{{ summary.policiesSold }}</p>
        </div>

        <!-- Claims -->
        <div
          class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Pending Claims</h3>
            <svg
              class="h-8 w-8 opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-6h13M9 5h13M5 5v14"
              />
            </svg>
          </div>
          <p class="mt-3 text-3xl font-bold">{{ summary.claimsPending }}</p>
        </div>

        <!-- Payments -->
        <div
          class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Total Payments</h3>
            <svg
              class="h-8 w-8 opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 8c-2.21 0-4-1.79-4-4V7h8v5c0 2.21-1.79 4-4 4z"
              />
            </svg>
          </div>
          <p class="mt-3 text-3xl font-bold">₹{{ summary.totalPayments }}</p>
        </div>
      </div>
    </div>
  `,
})
export class SummaryComponent implements OnInit {
  summary: any;
  loading = false;
  error = '';

  constructor(private auditService: AuditService) {}

  ngOnInit() {
    this.fetchSummary();
  }

  fetchSummary() {
    this.loading = true;
    this.auditService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch summary';
        console.error(err);
        this.loading = false;
      },
    });
  }
}
