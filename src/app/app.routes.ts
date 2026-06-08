import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';
import { PropertyManagementPageComponent } from './dashboard/pages/property-management-page/property-management-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'propiedades', component: PropertyManagementPageComponent },
  { path: '**', redirectTo: 'dashboard' }
];
