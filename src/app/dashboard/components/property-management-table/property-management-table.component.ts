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
  @Input() selectedPropertyId: number | null = null;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() rangeStart = 0;
  @Input() rangeEnd = 0;
  @Input() isLoading = false;
  @Input() isDeleting = false;

  @Output() readonly selectProperty = new EventEmitter<PropertyRecord>();
  @Output() readonly deleteProperty = new EventEmitter<PropertyRecord>();
  @Output() readonly newProperty = new EventEmitter<void>();
  @Output() readonly previousPage = new EventEmitter<void>();
  @Output() readonly nextPage = new EventEmitter<void>();

  readonly visibleColumns = ['ID', 'Dirección', 'Comuna', 'Ciudad', 'Precio Arriendo', 'Disponible'];

  confirmDelete(property: PropertyRecord, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`¿Eliminar la propiedad "${property.direccion}"?`)) {
      this.deleteProperty.emit(property);
    }
  }
}
