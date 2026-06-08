import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PortfolioItem {
  name: string;
  value: number;
}

@Component({
  selector: 'app-portfolio-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-status.component.html',
  styleUrl: './portfolio-status.component.css'
})
export class PortfolioStatusComponent {
  readonly items: PortfolioItem[] = [
    { name: 'Ocupación', value: 88 },
    { name: 'Contratos vigentes', value: 74 },
    { name: 'Morosidad', value: 12 }
  ];
}
