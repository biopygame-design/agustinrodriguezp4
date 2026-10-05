import { Component, inject, signal } from '@angular/core';
import { EntradaSupabaseModelo } from '../../core/models/entrada-modelo/entrada-modelo';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';
import { AuthService } from '../../core/service/authservice/authservice';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-perfilcompras',
  styleUrl: './perfilcompras.css',
  templateUrl: './perfilcompras.html',
})
export class Perfilcompras {
  authService = inject(AuthService);
  supabaseService = inject(SupabaseService);

  usuario = this.authService.currentUserData;
  entradas = signal<EntradaSupabaseModelo[]>([]);

  constructor() {
    this.cargarDatosUsuarioYEntradas();
  }

  private async cargarDatosUsuarioYEntradas() {
    const user = this.authService.currentUser();
    if (user) {
      await this.cargarEntradas(user.id);
    }
  }

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
      .eq('id', entrada.funcion_id)
      .single();

    if (funcionError || !funcionData) {
      console.error('Error al buscar la función:', funcionError?.message);
      alert('❌ No se pudo verificar el horario de la función.');
      return;
    }

    // ⚠️ IMPORTANTE: Ajustá 'fecha' y 'horario' según los nombres reales de las columnas en tu tabla 'funciones' de Supabase
    const fechaHoraFuncionStr = `${funcionData.fecha} ${funcionData.horario}`;
    const fechaFuncion = new Date(fechaHoraFuncionStr).getTime();
    const ahora = new Date().getTime();
    const diferenciaHoras = (fechaFuncion - ahora) / (1000 * 60 * 60);

    // 3. Validar la regla de las 2 horas de anticipación
    if (diferenciaHoras < 2) {
      alert('❌ No se puede cancelar. Las cancelaciones deben hacerse con al menos 2 horas de anticipación a la función.');
      return;
    }

    // 4. Acreditamos el dinero como crédito a favor del usuario
    await this.authService.sumarCredito(entrada.total);

    // 5. Actualizar el estado de la entrada a 'cancelada' en la tabla 'entradas'
    await this.supabaseService.client
      .from('entradas')
      .update({ estado: 'cancelada' }) // Opcional: si querés marcarla como cancelada
      .eq('id', entrada.id);

    alert(`¡Reserva cancelada con éxito! Se acreditaron $${entrada.total} en tu cuenta como crédito.`);
    
    // 6. Recargamos el listado de entradas del usuario
    const user = this.authService.currentUser();
    if (user) await this.cargarEntradas(user.id);
  }
}