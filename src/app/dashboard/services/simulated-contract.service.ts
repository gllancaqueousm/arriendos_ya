import { Injectable } from '@angular/core';
import { SimulatedContract } from '../models/simulated-contract.model';

const STORAGE_KEY = 'arriendosya_demo_contracts';

@Injectable({
  providedIn: 'root'
})
export class SimulatedContractService {
  /**
   * Saves (or overwrites) a simulated contract for a given property.
   * If a contract already exists for the property it is replaced.
   */
  saveContract(contract: Omit<SimulatedContract, 'estado' | 'origen' | 'createdAt'>): SimulatedContract {
    const full: SimulatedContract = {
      ...contract,
      estado: 'ACTIVO',
      origen: 'demo-local',
      createdAt: new Date().toISOString()
    };

    const all = this.loadAll();
    all[contract.propiedadId] = full;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return full;
  }

  /** Returns the simulated contract for a property, or null if none exists. */
  getByPropertyId(propiedadId: number): SimulatedContract | null {
    return this.loadAll()[propiedadId] ?? null;
  }

  /** Returns all simulated contracts indexed by property id. */
  getAll(): Record<number, SimulatedContract> {
    return this.loadAll();
  }

  /** Removes a single contract. */
  removeByPropertyId(propiedadId: number): void {
    const all = this.loadAll();
    delete all[propiedadId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  /** Removes all simulated contracts (demo reset). */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadAll(): Record<number, SimulatedContract> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<number, SimulatedContract>) : {};
    } catch {
      return {};
    }
  }
}
