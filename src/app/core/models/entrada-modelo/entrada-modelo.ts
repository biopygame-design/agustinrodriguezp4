export interface EntradaSupabaseModelo {
  id?: number;
  codigo_qr: string;
  usuario_id: string;
  funcion_id: number;
  asientos: string;
  total: number;
  estado?: 'valida' | 'usada' | 'cancelada';
  fecha_creacion?: string;
  fecha_funcion? : string
}