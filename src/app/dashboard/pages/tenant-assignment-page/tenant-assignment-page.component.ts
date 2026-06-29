import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { switchMap } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { PropertyRecord } from '../../models/property.model';
import { SimulatedContract } from '../../models/simulated-contract.model';
import { ContactManagementService } from '../../services/contact-management.service';
import { PropertyManagementService } from '../../services/property-management.service';
import { SimulatedContractService } from '../../services/simulated-contract.service';

interface TenantRecord {
  id: string;
  fullName: string;
  phone: string;
}

interface SavedAssignmentSummary {
  contract: SimulatedContract;
  propertyAddress: string;
  tenantName: string;
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
export class TenantAssignmentPageComponent implements OnInit {
  private readonly propertyService = inject(PropertyManagementService);
  private readonly contactService = inject(ContactManagementService);
  private readonly contractService = inject(SimulatedContractService);

  readonly allProperties = signal<PropertyRecord[]>([]);
  readonly allTenants = signal<TenantRecord[]>([]);
  readonly savedContracts = signal<Record<number, SimulatedContract>>({});
  readonly tenantQuery = signal('');
  readonly formModel = signal<AssignmentFormValue>({ ...EMPTY_FORM });
  readonly feedbackMessage = signal('');
  readonly feedbackType = signal<'success' | 'error' | 'info'>('info');
  readonly isSubmitting = signal(false);
  readonly showAssignments = signal(false);
  readonly confirmedContract = signal<SimulatedContract | null>(null);
  readonly availableProperties = computed(() =>
    this.allProperties().filter((property) => property.disponible)
  );

  readonly filteredTenants = computed(() => {
    const query = this.tenantQuery().trim().toLowerCase();
    if (!query) {
      return this.allTenants();
    }

    return this.allTenants().filter((tenant) =>
      [tenant.fullName, tenant.id].some((field) => field.toLowerCase().includes(query))
    );
  });

  readonly selectedProperty = computed(
    () =>
      this.availableProperties().find((property) => property.id === this.formModel().propertyId) ?? null
  );
  readonly selectedTenant = computed(
    () => this.allTenants().find((tenant) => tenant.id === this.formModel().tenantId) ?? null
  );
  readonly savedAssignments = computed<SavedAssignmentSummary[]>(() =>
    Object.values(this.savedContracts())
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((contract) => {
        const property = this.allProperties().find((item) => item.id === contract.propiedadId);
        const tenant = this.allTenants().find((item) => item.id === contract.arrendatarioRut);

        return {
          contract,
          propertyAddress: property?.direccion ?? `Propiedad #${contract.propiedadId}`,
          tenantName: tenant?.fullName ?? `Arrendatario ${contract.arrendatarioRut}`
        };
      })
  );
  readonly hasDateRangeError = computed(() => {
    const values = this.formModel();
    return !!values.startDate && !!values.endDate && values.endDate < values.startDate;
  });

  ngOnInit(): void {
    this.refreshSavedAssignments();

    this.propertyService.listProperties().subscribe((properties) => {
      this.allProperties.set(properties);
    });

    this.contactService.listContacts('arrendatarios').subscribe((contacts) => {
      this.allTenants.set(
        contacts.map((contact) => ({
          id: contact.rut,
          fullName: `${contact.nombre} ${contact.apellido}`,
          phone: contact.telefono
        }))
      );
    });
  }

  updateField<K extends keyof AssignmentFormValue>(field: K, value: AssignmentFormValue[K]): void {
    this.formModel.update((current) => ({ ...current, [field]: value }));
    if (field === 'propertyId' && typeof value === 'number') {
      this.confirmedContract.set(this.contractService.getByPropertyId(value));
    }
  }

  confirmAssignment(form: NgForm): void {
    form.control.markAllAsTouched();
    if (form.invalid || this.hasDateRangeError()) {
      this.feedbackType.set('error');
      this.feedbackMessage.set('Revisa los campos obligatorios antes de confirmar la asignación.');
      return;
    }

    const property = this.selectedProperty();
    const tenant = this.selectedTenant();
    const values = this.formModel();

    if (!property || !tenant) {
      this.feedbackType.set('error');
      this.feedbackMessage.set('Debes seleccionar una propiedad y un arrendatario.');
      return;
    }

    this.isSubmitting.set(true);
    this.feedbackMessage.set('');

    this.propertyService
      .assignTenant(property.id, tenant.id)
      .pipe(
        switchMap(() =>
          this.propertyService.updateProperty(property.id, {
            ...property,
            disponible: false
          })
        )
      )
      .subscribe({
      next: (assignedProperty) => {
        this.allProperties.update((properties) =>
          properties.map((item) =>
            item.id === assignedProperty.id ? { ...assignedProperty, disponible: false } : item
          )
        );

        const saved = this.contractService.saveContract({
          propiedadId: property.id,
          arrendatarioRut: tenant.id,
          montoMensual: values.monthlyRent!,
          mesGarantia: values.guaranteeMonths!,
          fechaInicio: values.startDate,
          fechaTermino: values.endDate,
          diaPago: values.paymentDay!,
          reajusteSemestral: values.semiannualAdjustment!
        });

        this.confirmedContract.set(saved);
        this.refreshSavedAssignments();
        this.isSubmitting.set(false);
        this.feedbackType.set('success');
        this.feedbackMessage.set(
          `✓ Asignación confirmada: ${tenant.fullName} en ${property.direccion}.`
        );
      },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          this.feedbackType.set('error');
          const message =
            err instanceof Error ? err.message : 'Error al comunicarse con el servidor.';
          this.feedbackMessage.set(`Error al confirmar la asignación: ${message}`);
        }
      });
  }

  saveDraft(): void {
    this.feedbackType.set('info');
    this.feedbackMessage.set('Borrador guardado. Puedes continuar la asignación más tarde.');
  }

  toggleAssignmentsList(): void {
    this.showAssignments.update((current) => !current);
  }

  cancelProcess(form: NgForm): void {
    this.formModel.set({ ...EMPTY_FORM });
    this.tenantQuery.set('');
    this.confirmedContract.set(null);
    this.feedbackType.set('info');
    this.feedbackMessage.set('Proceso cancelado.');
    form.resetForm({ ...EMPTY_FORM });
  }

  resetDemo(form: NgForm): void {
    this.contractService.clearAll();
    this.refreshSavedAssignments();
    this.confirmedContract.set(null);
    this.formModel.set({ ...EMPTY_FORM });
    this.tenantQuery.set('');
    this.feedbackType.set('info');
    this.feedbackMessage.set('Demo reiniciada: contratos simulados eliminados.');
    form.resetForm({ ...EMPTY_FORM });
  }

  private refreshSavedAssignments(): void {
    this.savedContracts.set(this.contractService.getAll());
  }
}
