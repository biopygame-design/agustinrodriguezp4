import { Component, inject } from '@angular/core';
import { ButacasService } from '../../../service/butacas-service/butacas-service';
import { EntradaSupabaseModelo } from '../../models/entrada-modelo/entrada-modelo';
import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabaseservicie/supabaseservice';
Injectable({
  providedIn : 'root'
})

export class EntradasServicio {
  private supabaseService = inject(SupabaseService);

  async obtenerEntradasUsuario(userId: string): Promise<EntradaSupabaseModelo[]> {
    const { data, error } = await this.supabaseService.client
      .from('entradas')
      .select('*')
      .eq('usuario_id', userId);

    if (error) {
      console.error('Error al obtener entradas:', error.message);
      return [];
    }
    return data || [];
  }
}