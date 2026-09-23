import { Component,inject,signal,computed, Injectable,DestroyRef } from '@angular/core';
import { candyinterface } from '../../core/models/candyinterface/candyinterface';
import { Supabaseservicie } from '../supabaseservicie/supabaseservicie';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';


@Injectable({
  providedIn : 'root'
})
export class Candyservice {
    private initialcandy : candyinterface [] = [
        {
          id:"1",
          nombre:"coca-cola",
          imagen : "https://ardiaprod.vtexassets.com/arquivos/ids/357998/Gaseosa-CocaCola-Sabor-Original-600-Ml-_2.jpg?v=638939019985070000"
        }
      ]
   private candySignal = signal<candyinterface[]>(this.initialcandy);
    cargando = signal(false);
    candy = computed(() => this.candySignal());
    Ssupabaseservice = inject(SupabaseService).client;
    private destroyRef = inject(DestroyRef);
  
  
    // Método para buscar por ID
    getMovieById(id: string) {
      return computed(() => this.candySignal().find(p => p.id === id));
    }
  
    private channel!: RealtimeChannel;
  
    constructor() {
      // Al iniciar el servicio, cargamos los libros desde Supabase
      this.cargarcandyDesdeDB();
      // Nos suscribimos a cambios en tiempo real
      this.channel = this.iniciarRealtime();
  
      // Limpiamos la suscripción cuando el servicio se destruye
      this.destroyRef.onDestroy(() => {
        this.Ssupabaseservice.removeChannel(this.channel);
      });
    }
    
  
    private async cargarcandyDesdeDB(): Promise<void> {
      this.cargando.set(true);
  
      const { data, error } = await this.Ssupabaseservice
        .from('candy') // El nombre exacto de tu tabla en Supabase
        .select('*')
        .order('nombre', { ascending: true });
  
      if (error) {
        console.error('❌ Error al cargar películas desde Supabase:', error.message);
      } else {
        // Guardamos los datos de Supabase en el signal (si data es null, guardamos un array vacío)
        this.candySignal.set(data || []);
        console.log(`✅ Se cargaron ${data?.length ?? 0} candys desde Supabase`);
      }
  
      this.cargando.set(false);
    }
     private iniciarRealtime(): RealtimeChannel {
      return this.Ssupabaseservice
        .channel('candy-realtime')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'candy' },
          (payload) => {
            console.log('🔄 Cambio en tiempo real:', payload.eventType, payload);
  
            switch (payload.eventType) {
              // INSERT — un nuevo libro fue agregado por otro usuario
              case 'INSERT':
                this.candySignal.update(candy => [...candy, payload.new as candyinterface]);
                break;
  
              // UPDATE — un libro fue modificado (ej: reserva que cambia el stock)
              case 'UPDATE':
                this.candySignal.update(candy =>
                  candy.map(l => l.id === (payload.new as candyinterface).id
                    ? payload.new as candyinterface
                    : l
                  )
                );
                break;
  
              // DELETE — un libro fue eliminado
              case 'DELETE':
                this.candySignal.update(candy =>
                  candy.filter(l => l.id !== (payload.old as { id: string }).id)
                );
                break;
            }
          }
        )
        .subscribe();
    }
  
    // Obtener un libro por ID — retorna un computed que se actualiza reactivamente
    getLibroById(id: string) {
      return computed(() => this.candySignal().find(libro => libro.id === id));
    }
  
  
  

}
