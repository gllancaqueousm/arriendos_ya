import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { ContactRecord, ContactResource } from '../../models/contact.model';
import { ContactManagementService } from '../../services/contact-management.service';

const EMPTY_CONTACT: ContactRecord = {
  rut: '',
  nombre: '',
  apellido: '',
  telefono: ''
};

type ContactCollection = Record<ContactResource, ContactRecord[]>;

@Component({
  selector: 'app-contact-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './contact-management-page.component.html',
  styleUrl: './contact-management-page.component.css'
})
export class ContactManagementPageComponent {
  private readonly contactService = inject(ContactManagementService);

  readonly activeTab = signal<ContactResource>('propietarios');
  readonly contacts = signal<ContactCollection>({
    propietarios: [],
    arrendatarios: []
  });
  readonly selectedRut = signal<string | null>(null);
  readonly formModel = signal<ContactRecord>({ ...EMPTY_CONTACT });
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly currentContacts = computed(() => this.contacts()[this.activeTab()]);
  readonly isEditing = computed(() => this.selectedRut() !== null);
  readonly tabTitle = computed(() =>
    this.activeTab() === 'propietarios' ? 'Propietarios' : 'Arrendatarios'
  );

  constructor() {
    this.loadContacts('propietarios');
  }

  trackByRut(_: number, contact: ContactRecord): string {
    return contact.rut;
  }

  getFullName(contact: ContactRecord): string {
    return `${contact.nombre} ${contact.apellido}`.trim();
  }

  setTab(resource: ContactResource): void {
    if (resource === this.activeTab()) {
      return;
    }

    this.activeTab.set(resource);
    this.clearForm();

    if (!this.contacts()[resource].length) {
      this.loadContacts(resource);
    }
  }

  selectContact(contact: ContactRecord): void {
    this.selectedRut.set(contact.rut);
    this.formModel.set({ ...contact });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  clearForm(form?: NgForm): void {
    this.selectedRut.set(null);
    this.formModel.set({ ...EMPTY_CONTACT });
    this.errorMessage.set('');
    this.successMessage.set('');
    form?.resetForm({ ...EMPTY_CONTACT });
  }

  updateField<K extends keyof ContactRecord>(field: K, value: ContactRecord[K]): void {
    this.formModel.update((current) => ({ ...current, [field]: value }));
  }

  saveContact(form: NgForm): void {
    form.control.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    const resource = this.activeTab();
    const payload = this.formModel();
    const selectedRut = this.selectedRut();
    const request$ = selectedRut
      ? this.contactService.updateContact(resource, selectedRut, payload)
      : this.contactService.createContact(resource, payload);

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    request$.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.clearForm(form);
        this.successMessage.set(
          selectedRut
            ? `${this.tabTitle()} actualizado correctamente.`
            : `${this.tabTitle()} creado correctamente.`
        );
        this.loadContacts(resource);
      },
      error: () => {
        this.errorMessage.set('No se pudo guardar el registro. Intenta nuevamente.');
      }
    });
  }

  private loadContacts(resource: ContactResource): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.contactService
      .listContacts(resource)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (contacts) => {
          this.contacts.update((current) => ({ ...current, [resource]: contacts }));
          if (resource === this.activeTab() && this.selectedRut()) {
            const selected = contacts.find((contact) => contact.rut === this.selectedRut());
            if (!selected) {
              this.clearForm();
            }
          }
        },
        error: () => {
          this.errorMessage.set(`No se pudo cargar ${this.tabTitle().toLowerCase()}.`);
        }
      });
  }
}
