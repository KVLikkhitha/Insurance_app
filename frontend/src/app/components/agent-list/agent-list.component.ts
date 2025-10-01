import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Agents</h2>

        <!-- Search Bar with Icon -->
        <div class="relative w-full sm:w-72">
          <span class="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Search agents..."
            class="pl-10 pr-4 py-2 w-full border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <!-- Agent List -->
      <ul *ngIf="filteredAgents().length; else noAgents" class="space-y-3">
        <li
          *ngFor="let agent of filteredAgents()"
          class="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {{ agent.name.charAt(0) }}
            </div>
            <div>
              <p class="text-gray-900 font-medium text-lg">{{ agent.name }}</p>
              <p class="text-sm text-gray-600">{{ agent.email }}</p>
            </div>
          </div>
          <span class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Agent
          </span>
        </li>
      </ul>

      <ng-template #noAgents>
        <div class="text-center py-12 text-gray-500">
          <svg
            class="mx-auto h-14 w-14 text-gray-400 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5V4H2v16h5m10 0a2 2 0 002-2v-4a2 2 0 00-2-2h-4v6h4zM9 20v-6H5a2 2 0 00-2 2v4h6z"
            />
          </svg>
          <p class="text-lg font-semibold">No agents found</p>
          <p class="text-sm">Try adjusting your search or create a new agent.</p>
        </div>
      </ng-template>
    </div>
  `,
})
export class AgentListComponent implements OnInit {
  agents: any[] = [];
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents() {
    this.adminService.getAgents().subscribe({
      next: (res) => (this.agents = res),
      error: (err) => console.error('Failed to load agents', err),
    });
  }

  filteredAgents() {
    if (!this.searchTerm.trim()) return this.agents;
    return this.agents.filter(
      (a) =>
        a.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}