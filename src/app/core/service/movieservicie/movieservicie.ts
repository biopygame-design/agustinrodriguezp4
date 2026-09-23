import { Component,inject,signal,computed, Injectable,DestroyRef } from '@angular/core';
import { movieinterface } from '../../models/movieinterface/movieinterface';
import { SupabaseService } from '../supabaseservicie/supabaseservice';
import { RealtimeChannel } from '@supabase/supabase-js';
   
@Injectable({providedIn: 'root'})
export class Movieservicie {
  private initialpeliculas : movieinterface [] = [
    {
      id:"1",
      nombre:"nigthmare on elm street 6",
      duracion: "89 minutos",
      genero : "terror",
      formato : "2d 3d",
      idioma : "ingles",
      subtitulos : "español",
      portada : "https://upload.wikimedia.org/wikipedia/en/7/70/Freddy%27s_Dead_Poster.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
      horarios : []
    }
  ]
  private peliculasSignal = signal<movieinterface[]>(this.initialpeliculas);
  cargando = signal(false);
  peliculas = computed(() => this.peliculasSignal());
  Ssupabaseservice = inject(SupabaseService).client;
  private destroyRef = inject(DestroyRef);


  // Método para buscar por ID
  getMovieById(id: string) {
    return computed(() => this.peliculasSignal().find(p => p.id === id));
  }

  private channel!: RealtimeChannel;

  constructor() {
    // Al iniciar el servicio, cargamos los libros desde Supabase
    this.cargarPeliculasDesdeDB();
    // Nos suscribimos a cambios en tiempo real
    this.channel = this.iniciarRealtime();

    // Limpiamos la suscripción cuando el servicio se destruye
    this.destroyRef.onDestroy(() => {
      this.Ssupabaseservice.removeChannel(this.channel);
    });
  }
  

  private async cargarPeliculasDesdeDB(): Promise<void> {
    this.cargando.set(true);

    const { data, error } = await this.Ssupabaseservice
      .from('peliculas') // El nombre exacto de tu tabla en Supabase
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('❌ Error al cargar películas desde Supabase:', error.message);
    } else {
      // Guardamos los datos de Supabase en el signal (si data es null, guardamos un array vacío)
      this.peliculasSignal.set(data || []);
      console.log(`✅ Se cargaron ${data?.length ?? 0} películas desde Supabase`);
    }

    this.cargando.set(false);
  }
   private iniciarRealtime(): RealtimeChannel {
    return this.Ssupabaseservice
      .channel('libros-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'libros' },
        (payload) => {
          console.log('🔄 Cambio en tiempo real:', payload.eventType, payload);

          switch (payload.eventType) {
            // INSERT — un nuevo libro fue agregado por otro usuario
            case 'INSERT':
              this.peliculasSignal.update(pelicula => [...pelicula, payload.new as movieinterface]);
              break;

            // UPDATE — un libro fue modificado (ej: reserva que cambia el stock)
            case 'UPDATE':
              this.peliculasSignal.update(pelicula =>
                pelicula.map(l => l.id === (payload.new as movieinterface).id
                  ? payload.new as movieinterface
                  : l
                )
              );
              break;

            // DELETE — un libro fue eliminado
            case 'DELETE':
              this.peliculasSignal.update(pelicula =>
                pelicula.filter(l => l.id !== (payload.old as { id: string }).id)
              );
              break;
          }
        }
      )
      .subscribe();
  }

  // Obtener un libro por ID — retorna un computed que se actualiza reactivamente
  getLibroById(id: string) {
    return computed(() => this.peliculasSignal().find(libro => libro.id === id));
  }

}
