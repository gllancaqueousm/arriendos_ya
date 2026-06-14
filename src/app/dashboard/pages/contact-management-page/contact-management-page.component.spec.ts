import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
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
    serviceSpy.listContacts.calls.reset();
    serviceSpy.createContact.calls.reset();
    serviceSpy.updateContact.calls.reset();
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

  it('should select and clear a contact', () => {
    const fixture = TestBed.createComponent(ContactManagementPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.selectContact(MOCK_PROPIETARIOS[0]);
    expect(fixture.componentInstance.selectedRut()).toBe(MOCK_PROPIETARIOS[0].rut);
    expect(fixture.componentInstance.formModel().nombre).toBe('María');

    fixture.componentInstance.clearForm();
    expect(fixture.componentInstance.selectedRut()).toBeNull();
    expect(fixture.componentInstance.formModel().nombre).toBe('');
  });

  it('should create or update a contact on save', () => {
    const fixture = TestBed.createComponent(ContactManagementPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.updateField('rut', '11.111.111-1');
    fixture.componentInstance.updateField('nombre', 'Paula');
    fixture.componentInstance.updateField('apellido', 'Rojas');
    fixture.componentInstance.updateField('telefono', '+56 9 2222 3333');
    fixture.componentInstance.saveContact(mockValidForm());
    expect(serviceSpy.createContact).toHaveBeenCalledWith('propietarios', {
      rut: '11.111.111-1',
      nombre: 'Paula',
      apellido: 'Rojas',
      telefono: '+56 9 2222 3333'
    });

    fixture.componentInstance.selectContact(MOCK_PROPIETARIOS[0]);
    fixture.componentInstance.updateField('telefono', '+56 9 9999 9999');
    fixture.componentInstance.saveContact(mockValidForm());
    expect(serviceSpy.updateContact).toHaveBeenCalledWith('propietarios', '12.345.678-9', {
      rut: '12.345.678-9',
      nombre: 'María',
      apellido: 'Pérez',
      telefono: '+56 9 9999 9999'
    });
  });
});

function mockValidForm(): NgForm {
  return {
    control: {
      markAllAsTouched: () => undefined
    },
    invalid: false,
    resetForm: () => undefined
  } as unknown as NgForm;
}
