import { Component,inject,signal,computed, Injectable,DestroyRef } from '@angular/core';
import { candyinterface } from '../../core/models/candyinterface/candyinterface';
import { Supabaseservicie } from '../supabaseservicie/supabaseservicie';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';


@Injectable({
  providedIn : 'root'
})
export class Candyservice {
    private initialcandy: candyinterface[] = [
    {
      id: "1",
      nombre: "coca-cola",
      imagen: "https://ardiaprod.vtexassets.com/arquivos/ids/357998/Gaseosa-CocaCola-Sabor-Original-600-Ml-_2.jpg?v=638939019985070000",
      precio: 5.00
    }
  ];

  private candySignal = signal<candyinterface[]>(this.initialcandy);
  cargando = signal(false);
  candy = computed(() => this.candySignal());
  
  // Usamos el cliente directamente desde el servicio de Supabase
  private supabaseClient = inject(SupabaseService).client;
  private destroyRef = inject(DestroyRef);
  private channel!: RealtimeChannel;

  constructor() {
    // Al iniciar el servicio, cargamos los candies desde Supabase
    this.cargarcandyDesdeDB();
    
    // Nos suscribimos a cambios en tiempo real
    this.channel = this.iniciarRealtime();

    // Limpiamos la suscripción cuando el servicio se destruye
    this.destroyRef.onDestroy(() => {
      this.supabaseClient.removeChannel(this.channel);
    });
  }

  // Cargar candies desde Supabase
  private async cargarcandyDesdeDB(): Promise<void> {
    this.cargando.set(true);

    const { data, error } = await this.supabaseClient
      .from('candy')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('❌ Error al cargar candys desde Supabase:', error.message);
    } else {
      this.candySignal.set(data || []);
      console.log(`✅ Se cargaron ${data?.length ?? 0} candys desde Supabase`);
    }

    this.cargando.set(false);
  }

  // Sincronización en tiempo real con Supabase Realtime
  private iniciarRealtime(): RealtimeChannel {
    return this.supabaseClient
      .channel('candy-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'candy' },
        (payload) => {
          console.log('🔄 Cambio en tiempo real:', payload.eventType, payload);

          switch (payload.eventType) {
            case 'INSERT':
              this.candySignal.update(candy => [...candy, payload.new as candyinterface]);
              break;

            case 'UPDATE':
              this.candySignal.update(candy =>
                candy.map(c => c.id === (payload.new as candyinterface).id
                  ? payload.new as candyinterface
                  : c
                )
              );
              break;

            case 'DELETE':
              this.candySignal.update(candy =>
                candy.filter(c => c.id !== (payload.old as { id: string }).id)
              );
              break;
          }
        }
      )
      .subscribe();
  }

  // Obtener un candy por ID — retorna un computed reactivo
  getCandyById(id: string) {
    return computed(() => this.candySignal().find(candy => candy.id === id));
  }

  // Método para agregar un nuevo candy a Supabase
  async agregarCandy(producto: {
    nombre: string;
    precio: number;
    imagen: string;
  }): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('candy')
        .insert([producto]);

      if (error) {
        console.error('❌ Error al agregar candy en Supabase:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('❌ Error inesperado al guardar el candy:', err);
      return false;
    }
  }
<<<<<<< HEAD
  async registrarVentaCandy(nombreProducto: string, cantidad: number = 1, usuarioId?: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('detalle_ventas_candy')
        .insert([{
          nombre_producto: nombreProducto,
          cantidad: cantidad,
          usuario_id: usuarioId || null
        }]);

      if (error) {
        console.error('❌ Error al registrar venta del candy:', error.message);
        return false;
      }

      console.log(`✅ Venta registrada: ${cantidad}x ${nombreProducto}`);
      return true;
    } catch (err) {
      console.error('❌ Error inesperado al registrar la venta:', err);
      return false;
    }
  }
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
}