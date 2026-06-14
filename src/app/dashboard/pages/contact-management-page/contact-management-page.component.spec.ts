import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ContactRecord } from '../../models/contact.model';
import { ContactManagementService } from '../../services/contact-management.service';
import { ContactManagementPageComponent } from './contact-management-page.component';

const MOCK_PROPIETARIOS: ContactRecord[] = [
  {
    rut: '12.345.678-9',
    nombre: 'María',
    apellido: 'Pérez',
    telefono: '+56 9 1234 5678'
  }
];

const MOCK_ARRENDATARIOS: ContactRecord[] = [
  {
    rut: '98.765.432-1',
    nombre: 'Juan',
    apellido: 'Soto',
    telefono: '+56 9 1111 2222'
  }
];

describe('ContactManagementPageComponent', () => {
  const serviceSpy = jasmine.createSpyObj<ContactManagementService>(
    'ContactManagementService',
    ['listContacts', 'createContact', 'updateContact']
  );

  beforeEach(async () => {
    serviceSpy.listContacts.and.callFake((resource) =>
      of(resource === 'propietarios' ? MOCK_PROPIETARIOS : MOCK_ARRENDATARIOS)
    );
    serviceSpy.createContact.and.returnValue(of(MOCK_PROPIETARIOS[0]));
    serviceSpy.updateContact.and.returnValue(of(MOCK_PROPIETARIOS[0]));

    await TestBed.configureTestingModule({
      imports: [ContactManagementPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ContactManagementService, useValue: serviceSpy }
      ]
    }).compileComponents();
  });

  it('should render contact management page', () => {
    const fixture = TestBed.createComponent(ContactManagementPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Gestión de Contactos');
    expect(compiled.textContent).toContain('Propietarios');
    expect(compiled.textContent).toContain('Arrendatarios');
    expect(compiled.textContent).toContain('Guardar');
    expect(compiled.textContent).toContain('Limpiar');
  });

  it('should load owners on startup and tenants when changing tab', () => {
    const fixture = TestBed.createComponent(ContactManagementPageComponent);
    fixture.detectChanges();

    expect(serviceSpy.listContacts).toHaveBeenCalledWith('propietarios');
    fixture.componentInstance.setTab('arrendatarios');
    expect(serviceSpy.listContacts).toHaveBeenCalledWith('arrendatarios');
  });
});
