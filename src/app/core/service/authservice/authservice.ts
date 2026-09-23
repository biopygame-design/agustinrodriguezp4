import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from '../supabaseservicie/supabaseservice';
import { User, Session } from '@supabase/supabase-js';
import { Userinterface } from '../../models/userinterface/userinterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;

  currentUser = signal<User | null>(null);
  currentSession = signal<Session | null>(null);
  currentUserData = signal<Userinterface | null>(null);

  constructor() {
    this.initAuthSession();
  }

  private initAuthSession() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentSession.set(session);
      this.currentUser.set(session?.user ?? null);

      if (session?.user) {
        // Cargar los datos siempre que haya sesión y currentUserData aún no esté cargado
        if (!this.currentUserData() || this.currentUserData()?.id !== session.user.id) {
          await this.cargarDatosUsuario(session.user.id);
        }
      } else {
        this.currentUserData.set(null);
      }
    });
  }

  public async cargarDatosUsuario(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error al cargar datos del usuario:', error.message);
    }

    if (data) {
      this.currentUserData.set(data);
    } else {
      // Fallback: Si no hay fila en la tabla 'usuarios', usamos metadata de Auth
      const metadata = this.currentUser()?.user_metadata;
      if (metadata) {
        this.currentUserData.set({
          id: userId,
          nombre: metadata['nombre'] || '',
          apellido: metadata['apellido'] || '',
          tipo_de_sangre: metadata['tipo_de_sangre'] || '',
          dias_de_vacaciones_al_anio: metadata['dias_de_vacaciones_al_anio'] || '',
          color_de_ojos: metadata['color_de_ojos'] || '',
          rol: metadata['rol'] || ''
        } as Userinterface);
      }
    }
  }

  // Iniciar sesión y garantizar que se carguen los datos inmediatamente
  async signIn(email: string, password: string) {
    const response = await this.supabase.auth.signInWithPassword({ email, password });
    
    if (response.data.user) {
      await this.cargarDatosUsuario(response.data.user.id);
    }

    return response;
  }

  async signUp(
    email: string, 
    password: string, 
    nombre: string, 
    apellido: string, 
    tipo_de_sangre: string, 
    dias_de_vacaciones_al_anio: string, 
    color_de_ojos: string,
    rol: string
  ) {
    // 1. Crear el usuario en Supabase Auth
    const response = await this.supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          nombre,
          apellido,
          tipo_de_sangre,
          dias_de_vacaciones_al_anio,
          color_de_ojos,
          rol
        }
      }
    });

    if (response.error) return response;

    const user = response.data.user;

    // 2. Insertar la fila correspondiente en la tabla 'usuarios'
    if (user) {
      const { error: dbError } = await this.supabase.from('usuarios').insert({
        id: user.id,
        nombre,
        apellido,
        tipo_de_sangre,
        dias_de_vacaciones_al_anio,
        color_de_ojos,
        rol,
        email
      });

      if (dbError) {
        console.error('Error al insertar en la tabla usuarios:', dbError.message);
      } else {
        // Cargar los datos inmediatamente al crearse
        await this.cargarDatosUsuario(user.id);
      }
    }

    return response;
  }

  async signOut() {
    const res = await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.currentSession.set(null);
    this.currentUserData.set(null);
    return res;
  }
}