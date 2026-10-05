
export interface Promomodelo {
  id?: string;
  titulo: string;
  descripcion: string;
  tipo: 'puntos' | 'descuento' | 'edad'; // 👈 Asegúrate de incluir 'descuento' aquí
  puntos_necesarios?: number;
  edad_minima?: number;
  edad_maxima?: number;
  descuento_porcentaje?: number;
  activo: boolean;
}
