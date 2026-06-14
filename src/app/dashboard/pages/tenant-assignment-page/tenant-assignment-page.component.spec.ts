import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TenantAssignmentPageComponent } from './tenant-assignment-page.component';

describe('TenantAssignmentPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantAssignmentPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
  });

  it('should render the tenant assignment page', () => {
    const fixture = TestBed.createComponent(TenantAssignmentPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).not.toBeNull();
    expect(compiled.querySelector('app-topbar')).not.toBeNull();
    expect(compiled.textContent).toContain('Asignar arrendatario a propiedad');
    expect(compiled.textContent).toContain('Resumen de asignación');
    expect(compiled.textContent).toContain('Confirmar asignación');
    expect(compiled.textContent).toContain('Guardar como borrador');
    expect(compiled.textContent).toContain('Cancelar proceso');
  });

  it('should only expose non-available properties for assignment', () => {
    const fixture = TestBed.createComponent(TenantAssignmentPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.availableProperties().length).toBeGreaterThan(0);
    expect(fixture.componentInstance.availableProperties().every((property) => !property.disponible)).toBeTrue();
  });
});
