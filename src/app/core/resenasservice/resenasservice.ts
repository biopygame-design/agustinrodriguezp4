import { Component, inject } from '@angular/core';
import { Resenasmodelo } from '../models/resenasmodelo/resenasmodelo';
import { SupabaseService } from '../service/supabaseservicie/supabaseservice';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
@Injectable({
providedIn : 'root'
})
 

export class Resenasservice {
  private supabase = inject(SupabaseService).client;

  // Obtener reseñas de una película y el promedio
  async obtenerResenasDePelicula(peliculaId: number | string) {
    const { data, error } = await this.supabase
      .from('resenas')
      .select('*') // O selecciona solo los campos que necesites, pero sin meter tablas relacionadas
  .eq('pelicula_id', peliculaId)
  .order('created_at', { ascending: false });
    if (error) {
      console.error('Error al obtener reseñas:', error.message);
      return { resenas: [], promedio: 0, total: 0 };
    }

    const resenas = data as unknown as Resenasmodelo[];
    const total = resenas.length;
    
    let promedio = 0;
    if (total > 0) {
      const suma = resenas.reduce((acc, curr) => acc + curr.estrellas, 0);
      promedio = Number((suma / total).toFixed(1)); // Redondeado a un decimal (ej: 4.5)
    }

    return { resenas, promedio, total };
  }

  // Guardar una nueva reseña
  async agregarResena(peliculaId: number | string, estrellas: number, comentario: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Debes iniciar sesión para dejar una reseña.');

    const { error } = await this.supabase.from('resenas').insert({
      pelicula_id: peliculaId,
      usuario_id: user.id,
      estrellas,
      comentario
    });

    if (error) throw error;
  }

}
