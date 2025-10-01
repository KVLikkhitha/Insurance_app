import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Audit Logs
      </h2>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="date"
            [(ngModel)]="filters.fromDate"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="date"
            [(ngModel)]="filters.toDate"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <input
            type="text"
            [(ngModel)]="filters.action"
            placeholder="e.g. CREATE_POLICY"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Actor</label>
          <input
            type="text"
            [(ngModel)]="filters.actorId"
            placeholder="e.g. admin123"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end mb-6 space-x-3">
        <button
          (click)="applyFilters()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Apply
        </button>
        <button
          (click)="resetFilters()"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

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
        <span class="ml-3 text-gray-600">Loading logs...</span>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="text-red-600 font-medium text-center py-4">
        {{ error }}
      </div>

      <!-- Table -->
      <div *ngIf="!loading && logs.length > 0" class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
          <thead class="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
            <tr>
              <th class="px-4 py-3 border">Timestamp</th>
              <th class="px-4 py-3 border">Action</th>
              <th class="px-4 py-3 border">Actor</th>
              <th class="px-4 py-3 border">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let log of logs" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3 text-gray-600">
                {{ log.timestamp | date:'short' }}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ log.action }}
              </td>
              <td class="px-4 py-3 text-blue-600 font-medium">
                {{ log.actorId }}
              </td>
              <td class="px-4 py-3 text-gray-700">
                <pre class="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-lg border">
{{ log.details | json }}
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && logs.length === 0 && !error" class="text-center py-10 text-gray-500">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-3"
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
        <p class="text-lg font-medium">No audit logs found</p>
        <p class="text-sm">Try adjusting filters or wait for new activity.</p>
      </div>
    </div>
  `,
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];
  loading = false;
  error = '';

  filters = {
    fromDate: '',
    toDate: '',
    action: '',
    actorId: '',
  };

  constructor(private auditService: AuditService) {}

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {
    this.loading = true;
    this.auditService.getAuditLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch audit logs';
        console.error(err);
        this.loading = false;
      },
    });
  }

  applyFilters() {
    this.logs = this.logs.filter((log) => {
      const matchesDate =
        (!this.filters.fromDate ||
          new Date(log.timestamp) >= new Date(this.filters.fromDate)) &&
        (!this.filters.toDate ||
          new Date(log.timestamp) <= new Date(this.filters.toDate));
      const matchesAction = !this.filters.action || log.action.includes(this.filters.action);
      const matchesActor = !this.filters.actorId || log.actorId.includes(this.filters.actorId);
      return matchesDate && matchesAction && matchesActor;
    });
  }

  resetFilters() {
    this.filters = { fromDate: '', toDate: '', action: '', actorId: '' };
    this.fetchLogs();
  }
}