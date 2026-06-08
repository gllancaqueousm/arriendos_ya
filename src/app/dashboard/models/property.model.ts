export type PropertyStatus = 'Activo' | 'Inactivo' | 'En Reparación';

export interface PropertyRecord {
  id: string;
  address: string;
  comuna: string;
  status: PropertyStatus;
  corredor: string;
  owner: string;
  monthlyRent: string;
  lastUpdate: string;
  notes: string;
}

export interface PropertyFilters {
  status: PropertyStatus | 'Todos';
  comuna: string;
  corredor: string;
}
