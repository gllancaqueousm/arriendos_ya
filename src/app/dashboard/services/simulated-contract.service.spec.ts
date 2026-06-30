import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SimulatedContract } from '../models/simulated-contract.model';
import { SimulatedContractService } from './simulated-contract.service';

const BASE_CONTRACT: Omit<SimulatedContract, 'estado' | 'origen' | 'createdAt'> = {
  propiedadId: 1,
  arrendatarioRut: 'AR-001',
  montoMensual: 950000,
  mesGarantia: 1,
  fechaInicio: '2026-07-01',
  fechaTermino: '2027-06-30',
  diaPago: 5,
  reajusteSemestral: 3.5
};

describe('SimulatedContractService', () => {
  let service: SimulatedContractService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(SimulatedContractService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a contract and return it with required fields', () => {
    const saved = service.saveContract(BASE_CONTRACT);

    expect(saved.propiedadId).toBe(1);
    expect(saved.arrendatarioRut).toBe('AR-001');
    expect(saved.montoMensual).toBe(950000);
    expect(saved.estado).toBe('ACTIVO');
    expect(saved.origen).toBe('demo-local');
    expect(saved.createdAt).toBeTruthy();
  });

  it('should retrieve a saved contract by property id', () => {
    service.saveContract(BASE_CONTRACT);
    const found = service.getByPropertyId(1);

    expect(found).not.toBeNull();
    expect(found!.arrendatarioRut).toBe('AR-001');
  });

  it('should return null for a non-existent property id', () => {
    expect(service.getByPropertyId(999)).toBeNull();
  });

  it('should overwrite existing contract for the same property', () => {
    service.saveContract(BASE_CONTRACT);
    service.saveContract({ ...BASE_CONTRACT, arrendatarioRut: 'AR-002' });

    const found = service.getByPropertyId(1);
    expect(found!.arrendatarioRut).toBe('AR-002');
  });

  it('should store multiple contracts for different properties', () => {
    service.saveContract(BASE_CONTRACT);
    service.saveContract({ ...BASE_CONTRACT, propiedadId: 5, arrendatarioRut: 'AR-002' });

    const all = service.getAll();
    expect(Object.keys(all).length).toBe(2);
    expect(all[1].arrendatarioRut).toBe('AR-001');
    expect(all[5].arrendatarioRut).toBe('AR-002');
  });

  it('should remove a single contract by property id', () => {
    service.saveContract(BASE_CONTRACT);
    service.removeByPropertyId(1);

    expect(service.getByPropertyId(1)).toBeNull();
  });

  it('should clear all contracts', () => {
    service.saveContract(BASE_CONTRACT);
    service.saveContract({ ...BASE_CONTRACT, propiedadId: 5 });
    service.clearAll();

    expect(Object.keys(service.getAll()).length).toBe(0);
  });

  it('should return empty object when localStorage is empty', () => {
    expect(service.getAll()).toEqual({});
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('arriendosya_demo_contracts', 'NOT_JSON{{');
    expect(() => service.getAll()).not.toThrow();
    expect(service.getAll()).toEqual({});
  });
});
