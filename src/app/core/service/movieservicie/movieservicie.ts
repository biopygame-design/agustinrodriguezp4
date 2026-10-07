import { Component,inject,signal,computed, Injectable,DestroyRef } from '@angular/core';
import { movieinterface } from '../../models/movieinterface/movieinterface';
import { SupabaseService } from '../supabaseservicie/supabaseservice';
import { RealtimeChannel } from '@supabase/supabase-js';
import { DatePipe } from '@angular/common';
   
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
      horarios : [],
      precio : 10.00,
      clasificacion : "+18",
      fecha_estreno : "2026-10-06",
      es_preventa : false,
      precio_preventa : 7.00
    }
  ]
  private peliculasSignal = signal<movieinterface[]>(this.initialpeliculas);
  cargando = signal(false);
  peliculas = computed(() => this.peliculasSignal());
  Ssupabaseservice = inject(SupabaseService).client;
  private destroyRef = inject(DestroyRef);

  async obtenerPeliculasPorGenero(genero: string) {
    if (genero === 'todos') {
      return await this.obtenerTodasLasPeliculas();
    }
    
    const { data, error } = await this.Ssupabaseservice
      .from('peliculas')
      .select('*')
      .eq('genero', genero);

    if (error) {
      console.error('Error al filtrar películas:', error);
      return [];
    }
    return data;
  }

  async obtenerTodasLasPeliculas() {
    const { data, error } = await this.Ssupabaseservice
      .from('peliculas')
      .select('*');
    
    if (error) {
      console.error('Error al obtener todas las películas:', error);
      return [];
    }
    return data || [];
  }

  getMovieById(id: string) {
    return computed(() => this.peliculasSignal().find(p => p.id === id));
  }

  private channel!: RealtimeChannel;

  constructor() {
    this.cargarPeliculasDesdeDB();
    this.channel = this.iniciarRealtime();

    this.destroyRef.onDestroy(() => {
      this.Ssupabaseservice.removeChannel(this.channel);
    });
  }

  private async cargarPeliculasDesdeDB(): Promise<void> {
    this.cargando.set(true);

    // 💡 Quitamos el filtro .eq('es_preventa', false) para que traiga TODAS las películas 
    // (tanto las normales como las que están en preventa)
    const { data, error } = await this.Ssupabaseservice
      .from('peliculas')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('❌ Error al cargar películas desde Supabase:', error.message);
    } else {
      this.peliculasSignal.set(data || []);
      console.log(`✅ Se cargaron ${data?.length ?? 0} películas desde Supabase`);
    }

    this.cargando.set(false);
  }

  private iniciarRealtime(): RealtimeChannel {
    return this.Ssupabaseservice
      .channel('peliculas-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'peliculas' }, // 💡 Cambiado de 'libros' a 'peliculas'
        (payload) => {
          console.log('🔄 Cambio en tiempo real:', payload.eventType, payload);

          switch (payload.eventType) {
            case 'INSERT':
              this.peliculasSignal.update(pelicula => [...pelicula, payload.new as movieinterface]);
              break;

            case 'UPDATE':
              this.peliculasSignal.update(pelicula =>
                pelicula.map(l => l.id === (payload.new as movieinterface).id
                  ? payload.new as movieinterface
                  : l
                )
              );
              break;

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

  async obtenerPeliculaPorId(id: string | number): Promise<movieinterface | null> {
    const { data, error } = await this.Ssupabaseservice
      .from('peliculas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error al obtener película por ID:', error.message);
      return null;
    }
    return data;
  }
  async agregarPelicula(pelicula: Omit<movieinterface, 'id'>): Promise<boolean> {
    const { error } = await this.Ssupabaseservice
      .from('peliculas')
      .insert([pelicula]);

    if (error) {
      console.error('❌ Error al agregar película:', error.message);
      return false;
    }

    console.log(`🎬 Nueva película agregada correctamente`);
    return true;
  }

  async obtenerFuncionesPorPelicula(peliculaId: string | number) {
    const idString = String(peliculaId).trim();

    const { data, error } = await this.Ssupabaseservice
      .from('funciones')
      .select('*')
      .eq('pelicula_id', idString);

    if (error) {
      console.error('Error al obtener funciones:', error);
      return [];
    }
    return data || [];
  }

  async obtenerPeliculasProximas() {
    const hoy = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.Ssupabaseservice
      .from('peliculas')
      .select('*')
      .gt('fecha_estreno', hoy)
      .order('fecha_estreno', { ascending: true });

    if (error) {
      console.error('❌ Error al cargar próximos estrenos:', error.message);
      return [];
    }
    
    return data || [];
  }
  async actualizarPelicula(id: string | number, peliculaData: Partial<movieinterface>): Promise<boolean> {
    const { error } = await this.Ssupabaseservice
      .from('peliculas')
      .update(peliculaData)
      .eq('id', id);

    if (error) {
      console.error('❌ Error al actualizar película:', error.message);
      return false;
    }

    console.log(`🎬 Película con ID ${id} actualizada correctamente`);
    return true;
  }
}