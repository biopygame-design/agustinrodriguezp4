export interface CarritoModelo {
  id: string;              
  tipo: 'entrada' | 'candy' | 'combo_canje'; // 👈 Agregamos el tipo para promos por puntos
  titulo: string;          
  precio: number;          // Si se paga en dinero (puede ser 0 si es 100% puntos)
  cantidad: number;        
  imagen?: string;         
  puntosNecesarios?: number; // 👈 Cantidad de puntos que cuesta el combo/promo
  detalles?: {             
    funcionId?: string;
    horario?: string;
    formato?: string;
    idsButacas?: number[];     
    nombresButacas?: string;   
  };
}