import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Enviroments } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      Enviroments.supabase.url,
      Enviroments.supabase.publickey
    );
  }

  // Permite a otros servicios acceder al cliente configurado
  get client(): SupabaseClient {
    return this.supabase;
  }
}