import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ContactRecord } from '../../models/contact.model';
import { PropertyRecord } from '../../models/property.model';
import { ContactManagementService } from '../../services/contact-management.service';
import { PropertyManagementService } from '../../services/property-management.service';
import { SimulatedContractService } from '../../services/simulated-contract.service';
import { TenantAssignmentPageComponent } from './tenant-assignment-page.component';

const MOCK_PROPERTY: PropertyRecord = {
  id: 4,
  direccion: 'Irarrázaval 2110, Depto 1203',
  comuna: 'Ñuñoa',
  ciudad: 'Santiago',
  region: 'Metropolitana',
  numeroHabitaciones: 3,
  numeroBanos: 2,
  precioArriendo: 680000,
  disponible: false
};

const MOCK_CONTACT: ContactRecord = {
  rut: '12345678-9',
  nombre: 'Camila',
  apellido: 'Torres',
  telefono: '+56 9 8512 4491'
};

describe('TenantAssignmentPageComponent', () => {
  const propertyServiceSpy = jasmine.createSpyObj<PropertyManagementService>(
    'PropertyManagementService',
    ['listProperties', 'assignTenant']
  );
  const contactServiceSpy = jasmine.createSpyObj<ContactManagementService>(
    'ContactManagementService',
    ['listContacts']
  );
  const contractServiceSpy = jasmine.createSpyObj<SimulatedContractService>(
    'SimulatedContractService',
    ['saveContract', 'getByPropertyId', 'getAll', 'clearAll']
  );

  beforeEach(async () => {
    propertyServiceSpy.listProperties.calls.reset();
    propertyServiceSpy.assignTenant.calls.reset();
    contactServiceSpy.listContacts.calls.reset();
    contractServiceSpy.saveContract.calls.reset();
    contractServiceSpy.getByPropertyId.calls.reset();
    contractServiceSpy.clearAll.calls.reset();

    propertyServiceSpy.listProperties.and.returnValue(of([MOCK_PROPERTY]));
    contactServiceSpy.listContacts.and.returnValue(of([MOCK_CONTACT]));
    contractServiceSpy.getByPropertyId.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [TenantAssignmentPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: PropertyManagementService, useValue: propertyServiceSpy },
        { provide: ContactManagementService, useValue: contactServiceSpy },
        { provide: SimulatedContractService, useValue: contractServiceSpy }
      ]
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

  it('should show the demo mode badge', () => {
    const fixture = TestBed.createComponent(TenantAssignmentPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Modo demo');
  });

  it('should call assignTenant and saveContract on successful confirmation', () => {
    propertyServiceSpy.assignTenant.and.returnValue(of(MOCK_PROPERTY));
    contractServiceSpy.saveContract.and.returnValue({
      propiedadId: 4,
      arrendatarioRut: '12345678-9',
      montoMensual: 680000,
      mesGarantia: 1,
      fechaInicio: '2026-07-01',
      fechaTermino: '2027-06-30',
      diaPago: 5,
      reajusteSemestral: 3,
      estado: 'ACTIVO',
      origen: 'demo-local',
      createdAt: new Date().toISOString()
    });

    const fixture = TestBed.createComponent(TenantAssignmentPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.updateField('propertyId', 4);
    fixture.componentInstance.updateField('tenantId', '12345678-9');
    fixture.componentInstance.updateField('monthlyRent', 680000);
    fixture.componentInstance.updateField('guaranteeMonths', 1);
    fixture.componentInstance.updateField('startDate', '2026-07-01');
    fixture.componentInstance.updateField('endDate', '2027-06-30');
    fixture.componentInstance.updateField('paymentDay', 5);
    fixture.componentInstance.updateField('semiannualAdjustment', 3);
    fixture.detectChanges();

    const form = { control: { markAllAsTouched: () => {} }, invalid: false } as any;
    fixture.componentInstance.confirmAssignment(form);

    expect(propertyServiceSpy.assignTenant).toHaveBeenCalledWith(4, '12345678-9');
    expect(contractServiceSpy.saveContract).toHaveBeenCalled();
    expect(fixture.componentInstance.feedbackType()).toBe('success');
  });

  it('should show an error and not save contract when assignTenant fails', () => {
    propertyServiceSpy.assignTenant.and.returnValue(
      throwError(() => new Error('Connection refused'))
    );

    const fixture = TestBed.createComponent(TenantAssignmentPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.updateField('propertyId', 4);
    fixture.componentInstance.updateField('tenantId', '12345678-9');
    fixture.componentInstance.updateField('monthlyRent', 680000);
    fixture.componentInstance.updateField('guaranteeMonths', 1);
    fixture.componentInstance.updateField('startDate', '2026-07-01');
    fixture.componentInstance.updateField('endDate', '2027-06-30');
    fixture.componentInstance.updateField('paymentDay', 5);
    fixture.componentInstance.updateField('semiannualAdjustment', 3);
    fixture.detectChanges();

    const form = { control: { markAllAsTouched: () => {} }, invalid: false } as any;
    fixture.componentInstance.confirmAssignment(form);

    expect(propertyServiceSpy.assignTenant).toHaveBeenCalled();
    expect(contractServiceSpy.saveContract).not.toHaveBeenCalled();
    expect(fixture.componentInstance.feedbackType()).toBe('error');
  });

  it('should clear all contracts and reset form on resetDemo', () => {
    const fixture = TestBed.createComponent(TenantAssignmentPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.updateField('propertyId', 4);
    fixture.detectChanges();

    const form = {
      control: { markAllAsTouched: () => {} },
      invalid: false,
      resetForm: () => {}
    } as any;
    fixture.componentInstance.resetDemo(form);

    expect(contractServiceSpy.clearAll).toHaveBeenCalled();
    expect(fixture.componentInstance.formModel().propertyId).toBeNull();
    expect(fixture.componentInstance.feedbackMessage()).toContain('Demo reiniciada');
  });
});

