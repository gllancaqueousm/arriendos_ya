import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { FinanceSummaryComponent } from '../../components/finance-summary/finance-summary.component';
import { PortfolioStatusComponent } from '../../components/portfolio-status/portfolio-status.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { RecentActivityComponent } from '../../components/recent-activity/recent-activity.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FinanceSummaryComponent,
    PortfolioStatusComponent,
    QuickActionsComponent,
    RecentActivityComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {}
