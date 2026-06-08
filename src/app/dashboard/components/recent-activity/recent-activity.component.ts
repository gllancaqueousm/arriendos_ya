import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActivityItem {
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css'
})
export class RecentActivityComponent {
  readonly activities: ActivityItem[] = [
    {
      title: 'Pago recibido',
      description: 'Departamento 302 · Torre Norte',
      time: 'Hace 15 minutos'
    },
    {
      title: 'Contrato renovado',
      description: 'Casa 18 · Condominio Los Almendros',
      time: 'Hace 2 horas'
    },
    {
      title: 'Nueva solicitud',
      description: 'Estudio 11 · Centro',
      time: 'Ayer'
    }
  ];
}
