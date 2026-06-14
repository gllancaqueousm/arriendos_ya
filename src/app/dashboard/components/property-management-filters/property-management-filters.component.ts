import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyFilters } from '../../models/property.model';

@Component({
  selector: 'app-property-management-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-management-filters.component.html',
  styleUrl: './property-management-filters.component.css'
})
export class PropertyManagementFiltersComponent {
  @Input({ required: true }) filters!: PropertyFilters;
  @Input() comunas: string[] = [];

  @Output() readonly filtersChange = new EventEmitter<PropertyFilters>();
  @Output() readonly clear = new EventEmitter<void>();

  readonly disponibleOptions: Array<{ label: string; value: boolean | 'Todos' }> = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Disponible', value: true },
    { label: 'No disponible', value: false }
  ];

  updateFilter<K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]): void {
    this.filtersChange.emit({ ...this.filters, [key]: value });
  }
}
