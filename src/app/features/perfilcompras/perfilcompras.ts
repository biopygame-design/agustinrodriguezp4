import { Component, inject, signal } from '@angular/core';
import { EntradaSupabaseModelo } from '../../core/models/entrada-modelo/entrada-modelo';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';
import { AuthService } from '../../core/service/authservice/authservice';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ButacasService } from '../../service/butacas-service/butacas-service';
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040

@Component({
  imports: [CommonModule],
  selector: 'app-perfilcompras',
  styleUrl: './perfilcompras.css',
  templateUrl: './perfilcompras.html',
})
export class Perfilcompras {
  authService = inject(AuthService);
  supabaseService = inject(SupabaseService);
<<<<<<< HEAD
  butacasservice = inject(ButacasService)

  usuario = this.authService.currentUserData;
  entradas = signal<EntradaSupabaseModelo[]>([]);
  getNombrePelicula(entrada: any): string {
    return entrada.funciones?.peliculas?.nombre || 'Película desconocida';
  }
=======

  usuario = this.authService.currentUserData;
  entradas = signal<EntradaSupabaseModelo[]>([]);
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040

  constructor() {
    this.cargarDatosUsuarioYEntradas();
  }

  private async cargarDatosUsuarioYEntradas() {
    const user = this.authService.currentUser();
    if (user) {
      await this.cargarEntradas(user.id);
    }
  }

<<<<<<< HEAD
 async cargarEntradas(userId: string) {
    // 1. Traemos las entradas del usuario de forma simple
    const { data: entradasData, error } = await this.supabaseService.client
      .from('entradas')
      .select('*')
      .eq('usuario_id', userId);

    if (error || !entradasData) {
      console.error('Error al obtener entradas:', error?.message);
      this.entradas.set([]);
      return;
    }

    // 2. Enriquecemos cada entrada buscando su función y película de forma segura
    const entradasEnriquecidas = await Promise.all(
      entradasData.map(async (entrada) => {
        let nombrePelicula = 'Película desconocida';
        let funcionData = null;

        if (entrada.funcion_id) {
          // Buscamos la función correspondiente
          const { data: funcion } = await this.supabaseService.client
            .from('funciones')
            .select('*')
            .eq('id', entrada.funcion_id)
            .single();

          if (funcion) {
            funcionData = funcion;
            // Buscamos la película usando el ID de la película de la función
            // (Asegurate de que el campo en 'funciones' que apunta a la película se llame 'pelicula_id' o ajustalo si tiene otro nombre)
            const { data: peli } = await this.supabaseService.client
              .from('peliculas')
              .select('nombre')
              .eq('id', funcion.pelicula_id) 
              .single();

            if (peli) {
              nombrePelicula = peli.nombre;
            }
          }
        }

        // Retornamos la entrada con la estructura que espera tu HTML y tu función auxiliar
        return {
          ...entrada,
          funciones: {
            ...funcionData,
            peliculas: { nombre: nombrePelicula }
          }
        };
      })
    );

    this.entradas.set(entradasEnriquecidas);
  }

  async cancelarEntrada(entrada: any) {
    // 1. Validar que la entrada no esté usada o ya cancelada
    if (entrada.estado === 'usada' || entrada.estado === 'cancelada') {
      alert('❌ Esta entrada ya no se puede cancelar.');
      return;
    }

    // 2. Consultar el horario de la función
    const { data: funcionData, error: funcionError } = await this.supabaseService.client
      .from('funciones')
      .select('*')
=======
  async cargarEntradas(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('entradas') // Asegúrate de que este sea el nombre de tu tabla en Supabase
      .select('*')
      .eq('usuario_id', userId);

    if (error) {
      console.error('Error al obtener entradas:', error.message);
      this.entradas.set([]);
    } else {
      this.entradas.set(data || []);
    }
  }

 async cancelarEntrada(entrada: EntradaSupabaseModelo) {
    // 1. Validar que la entrada no esté usada
    if (entrada.estado === 'usada') {
      alert('❌ No se puede cancelar una entrada que ya fue utilizada.');
      return;
    }

    // 2. Consultar el horario de la función en la tabla 'funciones' usando el funcion_id
    const { data: funcionData, error: funcionError } = await this.supabaseService.client
      .from('funciones') // Asegurate de que tu tabla se llame así en Supabase
      .select('*')       // Traemos todos los campos para ver cómo se llama la columna de fecha/hora
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
      .eq('id', entrada.funcion_id)
      .single();

    if (funcionError || !funcionData) {
      console.error('Error al buscar la función:', funcionError?.message);
      alert('❌ No se pudo verificar el horario de la función.');
      return;
    }

<<<<<<< HEAD
=======
    // ⚠️ IMPORTANTE: Ajustá 'fecha' y 'horario' según los nombres reales de las columnas en tu tabla 'funciones' de Supabase
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
    const fechaHoraFuncionStr = `${funcionData.fecha} ${funcionData.horario}`;
    const fechaFuncion = new Date(fechaHoraFuncionStr).getTime();
    const ahora = new Date().getTime();
    const diferenciaHoras = (fechaFuncion - ahora) / (1000 * 60 * 60);

    // 3. Validar la regla de las 2 horas de anticipación
    if (diferenciaHoras < 2) {
      alert('❌ No se puede cancelar. Las cancelaciones deben hacerse con al menos 2 horas de anticipación a la función.');
      return;
    }

<<<<<<< HEAD
    // 4. Liberar las butacas en la base de datos (si la entrada tiene guardados los IDs de butacas)
    if (entrada.ids_butacas && entrada.ids_butacas.length > 0) {
      const liberadasExito = await this.butacasservice.liberarButacas(entrada.ids_butacas);
      if (!liberadasExito) {
        alert('⚠️ Advertencia: No se pudieron liberar las butacas en el mapa, pero se continuará con la cancelación.');
      }
    }

    // 5. Acreditamos el dinero como crédito a favor del usuario
    await this.authService.sumarCredito(entrada.total);

    // 6. Actualizar el estado de la entrada a 'cancelada' en la base de datos
    const { error: updateError } = await this.supabaseService.client
      .from('entradas')
      .update({ estado: 'cancelada' })
      .eq('id', entrada.id);

    if (updateError) {
      alert('❌ Error al actualizar el estado en la base de datos.');
      return;
    }

    // 7. Opcional: Registrar la acción en los logs de actividad
    await this.authService.registrarLog(
      'Devolución de entrada', 
      `Se canceló la reserva #${entrada.id} y se acreditaron $${entrada.total}.`
    );

    // 8. Actualizamos el estado localmente para que la interfaz reaccione al instante
    entrada.estado = 'cancelada';

    alert(`¡Reserva cancelada con éxito! Se liberaron las butacas y se acreditaron $${entrada.total} en tu cuenta como crédito.`);
    
    // 9. Recargamos el listado de entradas del usuario
=======
    // 4. Acreditamos el dinero como crédito a favor del usuario
    await this.authService.sumarCredito(entrada.total);

    // 5. Actualizar el estado de la entrada a 'cancelada' en la tabla 'entradas'
    await this.supabaseService.client
      .from('entradas')
      .update({ estado: 'cancelada' }) // Opcional: si querés marcarla como cancelada
      .eq('id', entrada.id);

    alert(`¡Reserva cancelada con éxito! Se acreditaron $${entrada.total} en tu cuenta como crédito.`);
    
    // 6. Recargamos el listado de entradas del usuario
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
    const user = this.authService.currentUser();
    if (user) await this.cargarEntradas(user.id);
  }
}