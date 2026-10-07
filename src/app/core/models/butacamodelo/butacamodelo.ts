export interface Butacamodelo {
  id: number;
  funcion_id: number;
  fila: string;
  numero: number;
  estado: string;
  tipo?: 'normal' | 'vip' | 'discapacitado'; // 👈 Añadido
  bloque?: string;                           // 👈 Añadido
  usuario_id?: string;
}