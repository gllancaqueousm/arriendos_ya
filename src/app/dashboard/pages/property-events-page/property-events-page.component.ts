import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { EventoRecord, EVENTO_TIPOS } from '../../models/evento.model';
import { PropertyRecord } from '../../models/property.model';
import { EventoService } from '../../services/evento.service';
import { PropertyManagementService } from '../../services/property-management.service';

const EMPTY_EVENTO: Omit<EventoRecord, 'id' | 'propiedadId'> = {
  tipo: '',
  descripcion: '',
  fecha: ''
};

@Component({
  selector: 'app-property-events-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './property-events-page.component.html',
  styleUrl: './property-events-page.component.css'
})
export class PropertyEventsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyManagementService);
  private readonly eventoService = inject(EventoService);

  readonly eventoTipos = EVENTO_TIPOS;

  readonly propiedadId = signal<number>(0);
  readonly property = signal<PropertyRecord | null>(null);
  readonly eventos = signal<EventoRecord[]>([]);
  readonly formModel = signal<Omit<EventoRecord, 'id' | 'propiedadId'>>({ ...EMPTY_EVENTO });

  readonly isLoadingProperty = signal(false);
  readonly isLoadingEventos = signal(false);
  readonly isSaving = signal(false);
  readonly propertyError = signal('');
  readonly eventosError = signal('');
  readonly formError = signal('');
  readonly successMessage = signal('');

  readonly isLoading = computed(() => this.isLoadingProperty() || this.isLoadingEventos());

  constructor() {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = Number(raw);

    if (!raw || !Number.isInteger(id) || id <= 0) {
      this.router.navigate(['/propiedades']);
      return;
    }

    this.propiedadId.set(id);
    this.loadProperty(id);
    this.loadEventos(id);
  }

  goBack(): void {
    this.router.navigate(['/propiedades']);
  }

  updateFormField<K extends keyof Omit<EventoRecord, 'id' | 'propiedadId'>>(
    field: K,
    value: Omit<EventoRecord, 'id' | 'propiedadId'>[K]
  ): void {
    this.formModel.update((f) => ({ ...f, [field]: value }));
  }

  createEvento(): void {
    const form = this.formModel();
    if (!form.tipo || !form.descripcion || !form.fecha) {
      this.formError.set('Por favor completa todos los campos del formulario.');
      return;
    }

    this.isSaving.set(true);
    this.formError.set('');
    this.successMessage.set('');

    this.eventoService
      .createEvento({ ...form, propiedadId: this.propiedadId() })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (created) => {
          this.eventos.update((list) => [created, ...list]);
          this.formModel.set({ ...EMPTY_EVENTO });
          this.successMessage.set('Evento creado exitosamente.');
        },
        error: () => {
          this.formError.set('No se pudo crear el evento. Intenta nuevamente.');
        }
      });
  }

  private loadProperty(id: number): void {
    this.isLoadingProperty.set(true);
    this.propertyService
      .getProperty(id)
      .pipe(finalize(() => this.isLoadingProperty.set(false)))
      .subscribe({
        next: (property) => this.property.set(property),
        error: () => this.propertyError.set('No se pudo cargar la propiedad.')
      });
  }

  private loadEventos(propiedadId: number): void {
    this.isLoadingEventos.set(true);
    this.eventoService
      .getEventosByPropiedad(propiedadId)
      .pipe(finalize(() => this.isLoadingEventos.set(false)))
      .subscribe({
        next: (eventos) => this.eventos.set(eventos),
        error: () => this.eventosError.set('No se pudieron cargar los eventos.')
      });
  }
}
