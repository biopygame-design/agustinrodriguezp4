export interface EntradaSupabaseModelo {
  id?: number;
  codigo_qr: string;
  usuario_id: string;
  funcion_id: number;
  asientos: string;
  total: number;
<<<<<<< HEAD
  estado?: 'valida' | 'usada' | 'cancelada';
=======
  estado?: 'valida' | 'usada';
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
  fecha_creacion?: string;
  fecha_funcion? : string
}