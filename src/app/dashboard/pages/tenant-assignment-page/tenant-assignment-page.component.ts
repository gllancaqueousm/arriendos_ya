import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { PropertyRecord } from '../../models/property.model';

interface TenantRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface AssignmentFormValue {
  propertyId: number | null;
  tenantId: string;
  monthlyRent: number | null;
  guaranteeMonths: number | null;
  startDate: string;
  endDate: string;
  paymentDay: number | null;
  semiannualAdjustment: number | null;
}

const MOCK_PROPERTIES: PropertyRecord[] = [
  {
    id: 1,
    direccion: 'Av. Providencia 1250, Depto 402',
    comuna: 'Providencia',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    numeroHabitaciones: 2,
    numeroBanos: 1,
    precioArriendo: 950000,
    disponible: true
  },
  {
    id: 4,
    direccion: 'Irarrázaval 2110, Depto 1203',
    comuna: 'Ñuñoa',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    numeroHabitaciones: 3,
    numeroBanos: 2,
    precioArriendo: 680000,
    disponible: false
  },
  {
    id: 5,
    direccion: 'Avenida Perú 932, Casa 14',
    comuna: 'Recoleta',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    numeroHabitaciones: 2,
    numeroBanos: 1,
    precioArriendo: 830000,
    disponible: true
  },
  {
    id: 7,
    direccion: 'Manuel Montt 1510, Depto 302',
    comuna: 'Providencia',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    numeroHabitaciones: 1,
    numeroBanos: 1,
    precioArriendo: 760000,
    disponible: false
  }
];

const MOCK_TENANTS: TenantRecord[] = [
  {
    id: 'AR-001',
    fullName: 'Camila Torres',
    email: 'camila.torres@mail.com',
    phone: '+56 9 8512 4491'
  },
  {
    id: 'AR-002',
    fullName: 'Rodrigo Fuentes',
    email: 'rodrigo.fuentes@mail.com',
    phone: '+56 9 7781 2250'
  },
  {
    id: 'AR-003',
    fullName: 'Daniela Pizarro',
    email: 'daniela.pizarro@mail.com',
    phone: '+56 9 9223 6008'
  }
];

const EMPTY_FORM: AssignmentFormValue = {
  propertyId: null,
  tenantId: '',
  monthlyRent: null,
  guaranteeMonths: null,
  startDate: '',
  endDate: '',
  paymentDay: null,
  semiannualAdjustment: null
};

@Component({
  selector: 'app-tenant-assignment-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './tenant-assignment-page.component.html',
  styleUrl: './tenant-assignment-page.component.css'
})
export class TenantAssignmentPageComponent {
  readonly availableProperties = signal<PropertyRecord[]>(
    MOCK_PROPERTIES.filter((property) => !property.disponible)
  );

  readonly allTenants = signal<TenantRecord[]>(MOCK_TENANTS);
  readonly tenantQuery = signal('');
  readonly formModel = signal<AssignmentFormValue>({ ...EMPTY_FORM });
  readonly feedbackMessage = signal('');

  readonly filteredTenants = computed(() => {
    const query = this.tenantQuery().trim().toLowerCase();
    if (!query) {
      return this.allTenants();
    }

    return this.allTenants().filter((tenant) =>
      [tenant.fullName, tenant.email, tenant.id].some((field) => field.toLowerCase().includes(query))
    );
  });

  readonly selectedProperty = computed(
    () =>
      this.availableProperties().find((property) => property.id === this.formModel().propertyId) ?? null
  );
  readonly selectedTenant = computed(
    () => this.allTenants().find((tenant) => tenant.id === this.formModel().tenantId) ?? null
  );
  readonly hasDateRangeError = computed(() => {
    const values = this.formModel();
    return !!values.startDate && !!values.endDate && values.endDate < values.startDate;
  });

  updateField<K extends keyof AssignmentFormValue>(field: K, value: AssignmentFormValue[K]): void {
    this.formModel.update((current) => ({ ...current, [field]: value }));
  }

  confirmAssignment(form: NgForm): void {
    form.control.markAllAsTouched();
    if (form.invalid || this.hasDateRangeError()) {
      this.feedbackMessage.set('Revisa los campos obligatorios antes de confirmar la asignación.');
      return;
    }

    const property = this.selectedProperty();
    const tenant = this.selectedTenant();
    this.feedbackMessage.set(
      `Asignación confirmada: ${tenant?.fullName ?? 'Arrendatario'} en ${property?.direccion ?? 'propiedad'}.`
    );
  }

  saveDraft(): void {
    this.feedbackMessage.set('Borrador guardado. Puedes continuar la asignación más tarde.');
  }

  cancelProcess(form: NgForm): void {
    this.formModel.set({ ...EMPTY_FORM });
    this.tenantQuery.set('');
    this.feedbackMessage.set('Proceso cancelado.');
    form.resetForm({ ...EMPTY_FORM });
  }
}
