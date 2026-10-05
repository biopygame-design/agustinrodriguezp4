
export interface Resenasmodelo {
  id?: string;
  pelicula_id: number | string;
  usuario_id: string;
  estrellas: number;
  comentario: string;
  created_at?: string;
  usuarios?: {
    nombre: string;
    apellido: string;
  };
}
