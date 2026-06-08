import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PropertyRecord } from '../../models/property.model';

@Component({
  selector: 'app-property-management-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-management-table.component.html',
  styleUrl: './property-management-table.component.css'
})
export class PropertyManagementTableComponent {
  @Input() properties: PropertyRecord[] = [];
  @Input() selectedPropertyId: string | null = null;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() rangeStart = 0;
  @Input() rangeEnd = 0;

  @Output() readonly selectProperty = new EventEmitter<PropertyRecord>();
  @Output() readonly previousPage = new EventEmitter<void>();
  @Output() readonly nextPage = new EventEmitter<void>();

  readonly visibleColumns = ['ID', 'Dirección', 'Comuna', 'Estado', 'Corredor', 'Propietario'];

  getStatusClass(status: PropertyRecord['status']): string {
    switch (status) {
      case 'Activo':
        return 'status-activo';
      case 'Inactivo':
        return 'status-inactivo';
      case 'En Reparación':
        return 'status-reparacion';
    }
  }
}
