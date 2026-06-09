import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';
import { PropertyManagementPageComponent } from './dashboard/pages/property-management-page/property-management-page.component';
import { TenantAssignmentPageComponent } from './dashboard/pages/tenant-assignment-page/tenant-assignment-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'propiedades', component: PropertyManagementPageComponent },
  { path: 'asignaciones', component: TenantAssignmentPageComponent },
  { path: '**', redirectTo: 'dashboard' }
];
