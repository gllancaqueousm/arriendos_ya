export interface EventoRecord {
  id?: number;
  propiedad: {
    id: number;
  };
  tipo: string;
  descripcion: string;
  fecha?: string;
  url: "";
}

export const EVENTO_TIPOS = [
  'Mantención',
  'Inspección',
  'Reparación',
  'Limpieza',
  'Visita',
  'Otro'
] as const;
