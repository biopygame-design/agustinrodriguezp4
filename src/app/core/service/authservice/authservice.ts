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
      const metadata = this.currentUser()?.user_metadata;
      if (metadata) {
        this.currentUserData.set({
          id: userId,
          nombre: metadata['nombre'] || '',
          apellido: metadata['apellido'] || '',
          tipo_de_sangre: metadata['tipo_de_sangre'] || '',
          dias_de_vacaciones_al_anio: metadata['dias_de_vacaciones_al_anio'] || '',
          color_de_ojos: metadata['color_de_ojos'] || '',
          rol: metadata['rol'] || '',
          puntos: 0
        } as Userinterface);
      }
    }
  }

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

    if (user) {
      const { error: dbError } = await this.supabase.from('usuarios').insert({
        id: user.id,
        nombre,
        apellido,
        tipo_de_sangre,
        dias_de_vacaciones_al_anio,
        color_de_ojos,
        rol,
        primera_compra_disponible: true,
        puntos: 0
      });

      if (dbError) {
        console.error('Error al insertar en la tabla usuarios:', dbError.message);
      } else {
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

  get tieneDescuentoPrimeraCompra(): boolean {
    const data = this.currentUserData();
    return data ? (data.primera_compra_disponible ?? true) : false;
  }

  async usarCuponPrimeraCompra() {
    const user = this.currentUser();
    if (!user) return;

    const { error } = await this.supabase
      .from('usuarios')
      .update({ primera_compra_disponible: false })
      .eq('id', user.id);

    if (!error) {
      const current = this.currentUserData();
      if (current) {
        this.currentUserData.set({ ...current, primera_compra_disponible: false });
      }
    } else {
      console.error('Error al actualizar el estado del cupón:', error.message);
    }
  }

  async sumarPuntos(puntosGanados: number) {
    try {
      const user = this.currentUser();
      if (!user) return;

      const { data: usuario, error: errorFetch } = await this.supabase
        .from('usuarios')
        .select('puntos')
        .eq('id', user.id)
        .maybeSingle();

      if (errorFetch) throw errorFetch;

      let totalFinal = puntosGanados;

      if (!usuario) {
        // Inserción sin incluir la propiedad 'email'
        const { error: errorInsert } = await this.supabase
          .from('usuarios')
          .insert({
            id: user.id,
            puntos: puntosGanados,
            primera_compra_disponible: false
          });

        if (errorInsert) throw errorInsert;
      } else {
        const puntosActuales = usuario.puntos || 0;
        totalFinal = puntosActuales + puntosGanados;

        const { error: errorUpdate } = await this.supabase
          .from('usuarios')
          .update({ puntos: totalFinal })
          .eq('id', user.id);

        if (errorUpdate) throw errorUpdate;
      }

      const current = this.currentUserData();
      if (current) {
        this.currentUserData.set({ ...current, puntos: totalFinal });
      }

      console.log(`⭐ ¡Se sumaron ${puntosGanados} puntos! Total acumulado: ${totalFinal}`);
    } catch (error: any) {
      console.error('❌ Error al sumar puntos:', error.message || error);
    }
  }
  async actualizarPuntosUsuario(nuevosPuntos: number) {
    try {
      const user = this.currentUser();
      if (!user) return;

      // Aseguramos que los puntos nunca sean negativos
      const totalFinal = Math.max(0, nuevosPuntos);

      const { error: errorUpdate } = await this.supabase
        .from('usuarios')
        .update({ puntos: totalFinal })
        .eq('id', user.id);

      if (errorUpdate) throw errorUpdate;

      const current = this.currentUserData();
      if (current) {
        this.currentUserData.set({ ...current, puntos: totalFinal });
      }

      console.log(`✨ Puntos actualizados correctamente. Nuevo saldo: ${totalFinal}`);
    } catch (error: any) {
      console.error('❌ Error al actualizar los puntos:', error.message || error);
    }
  }
  // Sumar crédito tras cancelar una compra
  async sumarCredito(montoACancelar: number) {
    try {
      const user = this.currentUser();
      if (!user) return;

      const usuarioActual = this.currentUserData();
      const creditoActual = usuarioActual?.credito || 0;
      const nuevoCredito = creditoActual + montoACancelar;

      const { error } = await this.supabase
        .from('usuarios')
        .update({ credito: nuevoCredito })
        .eq('id', user.id);

      if (error) throw error;

      if (usuarioActual) {
        this.currentUserData.set({ ...usuarioActual, credito: nuevoCredito });
      }

      console.log(`💰 Crédito actualizado. Nuevo saldo a favor: $${nuevoCredito}`);
    } catch (error: any) {
      console.error('❌ Error al sumar crédito:', error.message);
    }
  }

  // Gastar crédito al pagar una compra
  async gastarCredito(montoAGastar: number): Promise<boolean> {
    try {
      const user = this.currentUser();
      const usuarioActual = this.currentUserData();
      if (!user || !usuarioActual) return false;

      const creditoActual = usuarioActual.credito || 0;
      if (creditoActual < montoAGastar) return false;

      const nuevoCredito = creditoActual - montoAGastar;

      const { error } = await this.supabase
        .from('usuarios')
        .update({ credito: nuevoCredito })
        .eq('id', user.id);

      if (error) throw error;

      this.currentUserData.set({ ...usuarioActual, credito: nuevoCredito });
      return true;
    } catch (error: any) {
      console.error('❌ Error al gastar crédito:', error.message);
      return false;
    }
  }
}