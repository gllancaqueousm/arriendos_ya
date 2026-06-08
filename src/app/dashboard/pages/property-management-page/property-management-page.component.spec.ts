import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PropertyManagementPageComponent } from './property-management-page.component';

describe('PropertyManagementPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyManagementPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
  });

  it('should render the property management view', () => {
    const fixture = TestBed.createComponent(PropertyManagementPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).not.toBeNull();
    expect(compiled.querySelector('app-topbar')).not.toBeNull();
    expect(compiled.textContent).toContain('Mantener Propiedades');
    expect(compiled.textContent).toContain('Filtros');
    expect(compiled.textContent).toContain('Nueva Propiedad');
    expect(compiled.textContent).toContain('Guardar cambios');
  });

  it('should filter properties by status', () => {
    const fixture = TestBed.createComponent(PropertyManagementPageComponent);
    fixture.componentInstance.updateFilters({
      status: 'En Reparación',
      comuna: 'Todas',
      corredor: 'Todos'
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.filteredProperties().length).toBe(1);
    expect(fixture.componentInstance.filteredProperties()[0].status).toBe('En Reparación');
  });
});
