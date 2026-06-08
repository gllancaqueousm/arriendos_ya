import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { PropertyDetailPanelComponent } from '../../components/property-detail-panel/property-detail-panel.component';
import { PropertyManagementFiltersComponent } from '../../components/property-management-filters/property-management-filters.component';
import { PropertyManagementTableComponent } from '../../components/property-management-table/property-management-table.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { PropertyFilters, PropertyRecord } from '../../models/property.model';

const DEFAULT_FILTERS: PropertyFilters = {
  status: 'Todos',
  comuna: 'Todas',
  corredor: 'Todos'
};

const MOCK_PROPERTIES: PropertyRecord[] = [
  {
    id: 'PR-001',
    address: 'Av. Providencia 1250, Depto 402',
    comuna: 'Providencia',
    status: 'Activo',
    corredor: 'Catalina Muñoz',
    owner: 'María Paz Herrera',
    monthlyRent: '$950.000',
    lastUpdate: '08 Jun 2026',
    notes: 'Contrato vigente hasta diciembre. Buen historial de pago.'
  },
  {
    id: 'PR-002',
    address: 'Los Militares 3480, Oficina 611',
    comuna: 'Las Condes',
    status: 'En Reparación',
    corredor: 'Felipe Soto',
    owner: 'Inmobiliaria Horizonte',
    monthlyRent: '$1.450.000',
    lastUpdate: '06 Jun 2026',
    notes: 'Ajuste de climatización y pintura interior en curso.'
  },
  {
    id: 'PR-003',
    address: 'San Diego 415, Local 8',
    comuna: 'Santiago',
    status: 'Activo',
    corredor: 'Josefa Ríos',
    owner: 'Carlos Méndez',
    monthlyRent: '$780.000',
    lastUpdate: '05 Jun 2026',
    notes: 'Propiedad comercial con ocupación al 100%.'
  },
  {
    id: 'PR-004',
    address: 'Irarrázaval 2110, Depto 1203',
    comuna: 'Ñuñoa',
    status: 'Inactivo',
    corredor: 'Catalina Muñoz',
    owner: 'Patricia Silva',
    monthlyRent: '$680.000',
    lastUpdate: '03 Jun 2026',
    notes: 'Disponible para publicación desde la próxima semana.'
  },
  {
    id: 'PR-005',
    address: 'Avenida Perú 932, Casa 14',
    comuna: 'Recoleta',
    status: 'Activo',
    corredor: 'Felipe Soto',
    owner: 'Pedro Riquelme',
    monthlyRent: '$830.000',
    lastUpdate: '02 Jun 2026',
    notes: 'Arrendatario renovó por 12 meses.'
  },
  {
    id: 'PR-006',
    address: 'Alonso de Córdova 5870, Depto 901',
    comuna: 'Vitacura',
    status: 'Activo',
    corredor: 'Josefa Ríos',
    owner: 'Andrea Contreras',
    monthlyRent: '$1.920.000',
    lastUpdate: '01 Jun 2026',
    notes: 'Pendiente actualización de inventario.'
  }
];

@Component({
  selector: 'app-property-management-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    PropertyManagementFiltersComponent,
    PropertyManagementTableComponent,
    PropertyDetailPanelComponent
  ],
  templateUrl: './property-management-page.component.html',
  styleUrl: './property-management-page.component.css'
})
export class PropertyManagementPageComponent {
  readonly pageSize = 5;
  readonly properties = signal<PropertyRecord[]>(MOCK_PROPERTIES);
  readonly filters = signal<PropertyFilters>(DEFAULT_FILTERS);
  readonly currentPage = signal(1);
  readonly selectedPropertyId = signal<string | null>(MOCK_PROPERTIES[0]?.id ?? null);

  readonly comunas = Array.from(new Set(MOCK_PROPERTIES.map((property) => property.comuna)));
  readonly corredores = Array.from(new Set(MOCK_PROPERTIES.map((property) => property.corredor)));

  readonly filteredProperties = computed(() =>
    this.properties().filter((property) => {
      const filters = this.filters();

      return (
        (filters.status === 'Todos' || property.status === filters.status) &&
        (filters.comuna === 'Todas' || property.comuna === filters.comuna) &&
        (filters.corredor === 'Todos' || property.corredor === filters.corredor)
      );
    })
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProperties().length / this.pageSize))
  );

  readonly pagedProperties = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProperties().slice(start, start + this.pageSize);
  });

  readonly selectedProperty = computed(
    () =>
      this.filteredProperties().find((property) => property.id === this.selectedPropertyId()) ??
      this.filteredProperties()[0] ??
      null
  );

  readonly rangeStart = computed(() =>
    this.filteredProperties().length ? (this.currentPage() - 1) * this.pageSize + 1 : 0
  );

  readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize, this.filteredProperties().length)
  );

  constructor() {
    effect(() => {
      const visibleProperties = this.filteredProperties();
      const totalPages = this.totalPages();

      if (this.currentPage() > totalPages) {
        this.currentPage.set(totalPages);
      }

      if (
        visibleProperties.length &&
        !visibleProperties.some((property) => property.id === this.selectedPropertyId())
      ) {
        this.selectedPropertyId.set(visibleProperties[0].id);
      }
    });
  }

  updateFilters(filters: PropertyFilters): void {
    this.filters.set(filters);
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.filters.set(DEFAULT_FILTERS);
    this.currentPage.set(1);
  }

  selectProperty(property: PropertyRecord): void {
    this.selectedPropertyId.set(property.id);
  }

  previousPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }

  saveProperty(property: PropertyRecord): void {
    this.properties.update((properties) =>
      properties.map((currentProperty) =>
        currentProperty.id === property.id ? { ...property } : currentProperty
      )
    );
    this.selectedPropertyId.set(property.id);
  }
}
