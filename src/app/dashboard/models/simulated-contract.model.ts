export interface SimulatedContract {
  propiedadId: number;
  arrendatarioRut: string;
  montoMensual: number;
  mesGarantia: number;
  fechaInicio: string;
  fechaTermino: string;
  diaPago: number;
  reajusteSemestral: number;
  estado: 'ACTIVO';
  origen: 'demo-local';
  createdAt: string;
}
