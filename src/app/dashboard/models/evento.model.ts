export interface EventoRecord {
  id?: number;
  propiedadId: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}

export const EVENTO_TIPOS = [
  'Mantención',
  'Inspección',
  'Reparación',
  'Limpieza',
  'Visita',
  'Otro'
] as const;
