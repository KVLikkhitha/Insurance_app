import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PolicyComponent } from './components/policy/policy.component';
import { CustomerComponent } from './components/customer/customer.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentFormComponent } from './components/paymentform/paymentform.component';
import { ClaimComponent } from './components/claim/claim.component';
import { ClaimListComponent } from './components/claim-list/claim-list.component';
import { CreateAgentComponent } from './components/create-agent/create-agent.component';
import { AgentListComponent } from './components/agent-list/agent-list.component';
import { AssignAgentComponent } from './components/assign-agent/assign-agent.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';
import { SummaryComponent } from './components/summary/summary.component';
import { HomeComponent } from './components/home/home.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // default
      { path: 'home', component: HomeComponent },

      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'policy', component: PolicyComponent },
      { path: 'customer', component: CustomerComponent },
      { path: 'paymentform/:policyId', component: PaymentFormComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'claim', component: ClaimComponent },
      { path: 'claimlist', component: ClaimListComponent },
      { path: 'summary', component: SummaryComponent, canActivate: [adminGuard] },

      { path: 'createagent', component: CreateAgentComponent, canActivate: [adminGuard] },
      { path: 'agentlist', component: AgentListComponent, canActivate: [adminGuard] },
      { path: 'assignagent', component: AssignAgentComponent, canActivate: [adminGuard] },
      
      { path: 'auditlogs', component: AuditLogsComponent, canActivate: [adminGuard]},
    ],
  },
  { path: '**', redirectTo: 'login' },
];

