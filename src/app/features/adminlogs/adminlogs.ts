import { Component, inject, signal } from '@angular/core';
import { Inject } from '@angular/core';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe,CommonModule],
  selector: 'app-adminlogs',
  styleUrl: './adminlogs.css',
  templateUrl: './adminlogs.html',
})
export class Adminlogs {
  private supabase = inject(SupabaseService).client;
  
  logs = signal<any[]>([]);
  cargando = signal<boolean>(true);

  constructor() {
    // Se ejecuta apenas se instancia el componente, sin necesidad de implementar OnInit
    this.cargarLogs();
  }

  async cargarLogs() {
    this.cargando.set(true);
    const { data, error } = await this.supabase
      .from('logs_actividad')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar los logs:', error.message);
    } else {
      this.logs.set(data || []);
    }
    this.cargando.set(false);
  }

}
