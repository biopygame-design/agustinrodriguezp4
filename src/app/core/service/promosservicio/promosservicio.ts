import { Component, inject } from '@angular/core';
import { SupabaseService } from '../supabaseservicie/supabaseservice';
import { Promomodelo } from '../../models/promomodelo/promomodelo';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn : 'root'
})
export class Promosservicio {
  private supabaseService = inject(SupabaseService);
  // O si prefieres por constructor: constructor(private supabaseService: SupabaseService) {}

  async obtenerPromos(): Promise<Promomodelo[]> {
    // Usamos el cliente que provee tu servicio
    const { data, error } = await this.supabaseService.client
      .from('promos')
      .select('*')
      .eq('activo', true);

    if (error) {
      console.error('Error al obtener promos:', error.message);
      return [];
    }
    return data as Promomodelo[];
  }

  // Crear una promo nueva (Solo para Admin)
  async crearPromo(promo: Promomodelo) {
    const { data, error } = await this.supabaseService.client
      .from('promos')
      .insert([promo])
      .select();

    if (error) {
      console.error('Error al crear promo:', error.message);
      return { exito: false, error: error.message };
    }
    return { exito: true, data };
  }
}