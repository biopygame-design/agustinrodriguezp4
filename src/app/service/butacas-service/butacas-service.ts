import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Butacamodelo } from '../../core/models/butacamodelo/butacamodelo';
import { Enviroments } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ButacasService {
  
  private supabase: SupabaseClient;
  private currentChannel: RealtimeChannel | null = null;
  
  public butacas = signal<Butacamodelo[]>([]);

  constructor() {
    this.supabase = createClient(
      Enviroments.supabase.url, 
      Enviroments.supabase.publickey
    );
  }

 // En tu ButacasService, ajustá el listener de Realtime para asegurarte de refrescar o actualizar bien:
  async cargarButacas(funcionId: number) {
    if (this.currentChannel) {
      await this.supabase.removeChannel(this.currentChannel);
    }

    const { data, error } = await this.supabase
      .from('butacas')
      .select('*')
      .eq('funcion_id', funcionId);
    
    if (error) {
      console.error('Error al cargar butacas:', error);
      return;
    }

    if (data) {
      this.butacas.set(data as Butacamodelo[]);
    }

    this.currentChannel = this.supabase
      .channel(`cambios-butacas-${funcionId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'butacas',
          filter: `funcion_id=eq.${funcionId}` 
        },
        (payload) => {
          // Si prefieres seguridad total ante actualizaciones masivas, 
          // podés llamar a cargarButacas(funcionId) de nuevo o actualizar el item específico:
          const updatedButaca = payload.new as Butacamodelo;
          if (!updatedButaca) return;

          this.butacas.update(listaActual => {
            const index = listaActual.findIndex(b => b.id === updatedButaca.id);
            if (index !== -1) {
              const copia = [...listaActual];
              copia[index] = updatedButaca;
              return copia;
            }
            return listaActual;
          });
        }
      );

    this.currentChannel.subscribe();
  }

  async confirmarCompraYOcuparButacas(
  idsButacas: number[], 
  userId: string, 
  funcionId: number, 
  codigoReserva: string, 
  nombresButacas: string, 
  totalPagar: number,
  fechaFuncion?: string
) {
  try {
    // 1. Insertar el registro en la tabla 'entradas' con estado 'valida'
    const { error: errorEntrada } = await this.supabase
      .from('entradas')
      .insert({
        codigo_qr: codigoReserva,
        usuario_id: userId,
        funcion_id: funcionId,
        asientos: nombresButacas,
        total: totalPagar,
        estado: 'valida' // Necesario para que luego el empleado pueda validarla
      });

    if (errorEntrada) throw errorEntrada;

    // 2. Actualizar el estado de las butacas a ocupadas
    const { error } = await this.supabase
      .from('butacas')
      .update({ 
        estado: 'ocupada',
        usuario_id: userId 
      })
      .in('id', idsButacas);

    if (error) throw error;

    // Actualización local inmediata (optimista)
    this.butacas.update(lista => 
      lista.map(b => idsButacas.includes(b.id) ? { ...b, estado: 'ocupada', usuario_id: userId } : b)
    );

    return { exito: true };
  } catch (error: any) {
    console.error('Error al registrar la compra y las butacas:', error.message || error);
    return { exito: false, mensaje: error.message };
  }
}
 async crearFuncionYGenerarButacas(peliculaId: number, salaId: number, horarioInicio: string, horarioFin: string) {
    if (!horarioInicio || !horarioFin) {
      return { exito: false, mensaje: 'Por favor completa los horarios de inicio y fin.' };
    }

    // 1. Asegurar formato estricto "HH:mm:ss" o "HH:mm"
    // Si viene como "9:19", lo pasamos a "09:19:00" para estandarizar
    const normalizarHora = (h: string) => {
      let partes = h.split(':');
      let horas = partes[0].padStart(2, '0');
      let minutos = (partes[1] || '00').padStart(2, '0');
      let segundos = (partes[2] || '00').padStart(2, '0');
      return `${horas}:${minutos}:${segundos}`;
    };

    const inicioStr = normalizarHora(horarioInicio);
    const finStr = normalizarHora(horarioFin);

    // 2. Validación numérica y segura de que el fin sea mayor al inicio
    const [hInicio, mInicio, sInicio] = inicioStr.split(':').map(Number);
    const [hFin, mFin, sFin] = finStr.split(':').map(Number);

    const totalSegundosInicio = hInicio * 3600 + mInicio * 60 + sInicio;
    const totalSegundosFin = hFin * 3600 + mFin * 60 + sFin;

    if (totalSegundosFin <= totalSegundosInicio) {
      return { exito: false, mensaje: 'El horario de fin debe ser mayor al horario de inicio.' };
    }

    // 3. Calcular los márgenes de 30 minutos usando una fecha base para restar/sumar
    const fechaBase = new Date();
    
    const dInicio = new Date(fechaBase);
    dInicio.setHours(hInicio, mInicio - 30, sInicio); // 30 minutos antes

    const dFin = new Date(fechaBase);
    dFin.setHours(hFin, mFin + 30, sFin); // 30 minutos después

    const formatoHora = (d: Date) => {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    };

    const inicioConMargen = formatoHora(dInicio);
    const finConMargen = formatoHora(dFin);

    // 4. Consultar si hay cruce en la misma sala respetando el margen de 30 mins
    const { data: funcionesExistentes, error: errorBusqueda } = await this.supabase
      .from('funciones')
      .select('*')
      .eq('sala_id', salaId)
      .lt('horario_inicio', finConMargen)
      .gt('horario_fin', inicioConMargen);

    if (errorBusqueda) {
      console.error('Error al validar funciones existentes:', errorBusqueda.message);
      return { exito: false, mensaje: 'Error al validar la disponibilidad de la sala.' };
    }

    if (funcionesExistentes && funcionesExistentes.length > 0) {
      return { 
        exito: false, 
        mensaje: 'La sala está ocupada o no respeta el margen mínimo de 30 minutos de diferencia con otra función.' 
      };
    }

    // 5. Insertar la función (guardamos en formato corto HH:mm:ss o HH:mm según prefieras)
    const horarioInicioDB = inicioStr.substring(0, 5); // Ej: "09:19"
    const horarioFinDB = finStr.substring(0, 5);       // Ej: "10:20"

    const { data: nuevaFuncion, error: errorFuncion } = await this.supabase
      .from('funciones')
      .insert([
        {
          pelicula_id: peliculaId,
          sala_id: salaId,
          horario_inicio: horarioInicioDB,
          horario_fin: horarioFinDB
        }
      ])
      .select()
      .single();

    if (errorFuncion) {
      console.error('Error al crear la función:', errorFuncion.message);
      return { exito: false, mensaje: errorFuncion.message };
    }

    const funcionId = nuevaFuncion.id;
    const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    const nuevasButacas = [];

    for (const fila of filas) {
      let tipoFila = 'normal';
      if (fila === 'J' || fila === 'K') {
        tipoFila = 'discapacitado';
      } else if (fila === 'R' || fila === 'S' || fila === 'T') {
        tipoFila = 'vip';
      }

      // Izquierdo (4)
      for (let i = 1; i <= 4; i++) {
        nuevasButacas.push({
          funcion_id: funcionId,
          fila: fila,
          numero: i,
          bloque: 'izquierdo',
          tipo: tipoFila,
          estado: 'libre'
        });
      }

      // Central
      const totalCentro = (tipoFila === 'discapacitado') ? 14 : 20; 
      for (let i = 1; i <= totalCentro; i++) {
        nuevasButacas.push({
          funcion_id: funcionId,
          fila: fila,
          numero: i + 4,
          bloque: 'central',
          tipo: tipoFila,
          estado: 'libre'
        });
      }

      // Derecho (4)
      for (let i = 1; i <= 4; i++) {
        nuevasButacas.push({
          funcion_id: funcionId,
          fila: fila,
          numero: i + 24,
          bloque: 'derecho',
          tipo: tipoFila,
          estado: 'libre'
        });
      }
    }

    const { error: errorButacas } = await this.supabase.from('butacas').insert(nuevasButacas);
    
    if (errorButacas) {
      console.error('Error al generar las butacas:', errorButacas.message);
      return { exito: false, mensaje: 'Función creada, pero falló la generación de butacas.' };
    }

    return { exito: true, mensaje: '¡Función creada y butacas generadas con éxito!' };
  }
  // En tu butacas.service.ts o el servicio que uses para las películas
async obtenerPeliculas() {
  const { data, error } = await this.supabase
    .from('peliculas')
    .select('*');

  if (error) {
    console.error('Error al obtener películas:', error);
    throw error;
  }
  return data || [];
}
async validarEntradaPorCodigo(codigoIngresado: string) {
  if (!codigoIngresado || codigoIngresado.trim() === '') {
    return { exito: false, mensaje: 'Por favor, ingresa o escanea un código válido.' };
  }

  const codigoLimpio = codigoIngresado.trim();

  try {
    // 1. Buscar la entrada en Supabase por su código QR
    const { data: entrada, error: errorBusqueda } = await this.supabase
      .from('entradas')
      .select('*')
      .eq('codigo_qr', codigoLimpio)
      .maybeSingle();

    if (errorBusqueda) throw errorBusqueda;

    if (!entrada) {
      return { exito: false, mensaje: '❌ El código ingresado no existe en el sistema.' };
    }

    // 2. Verificar si el QR ya fue utilizado (regla de negocio: deja de funcionar)
    if (entrada.estado === 'usada') {
      return { 
        exito: false, 
        mensaje: `⚠️ ¡ATENCIÓN! Este QR ya fue utilizado anteriormente (Asientos: ${entrada.asientos}).` 
      };
    }

    // 3. Actualizar el estado a 'usada' para invalidarlo permanentemente
    const { error: errorUpdate } = await this.supabase
      .from('entradas')
      .update({ estado: 'usada' })
      .eq('id', entrada.id);

    if (errorUpdate) throw errorUpdate;

    return { 
      exito: true, 
      mensaje: `✅ ¡Acceso Autorizado! Entrada válida. Asientos: ${entrada.asientos}` 
    };

  } catch (error: any) {
    console.error('Error al validar la entrada:', error.message || error);
    return { exito: false, mensaje: 'Ocurrió un error al intentar validar el código.' };
  }
}
}