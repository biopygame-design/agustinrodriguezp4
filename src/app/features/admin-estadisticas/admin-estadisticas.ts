import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';

// 📚 Importaciones para Excel y PDF
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  imports: [],
  selector: 'app-admin-estadisticas',
  styleUrl: './admin-estadisticas.css',
  templateUrl: './admin-estadisticas.html',
})
export class AdminEstadisticas {
  private supabase = inject(SupabaseService).client;
  private chartInstance: Chart | null = null;
  filtroActual = signal<'semana' | 'mes'>('semana');

  // Guardamos las entradas enriquecidas con el nombre de la película
  private datosEntradasParaReporte: any[] = [];

  constructor() {
    afterNextRender(() => {
      this.cargarGraficoPeliculas('semana');
    });
  }

  async cambiarFiltro(filtro: 'semana' | 'mes') {
    this.filtroActual.set(filtro);
    await this.cargarGraficoPeliculas(filtro);
  }

  async cargarGraficoPeliculas(filtroParam?: 'semana' | 'mes') {
    const filtro = this.filtroActual();
    const fechaLimite = new Date();
    
    if (filtro === 'semana') {
      fechaLimite.setDate(fechaLimite.getDate() - 7);
    } else {
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);
    }

    try {
      // 1. Traemos las entradas
      const { data: entradas, error: errorEntradas } = await this.supabase
        .from('entradas')
        .select('*')
        .gte('fecha_creacion', fechaLimite.toISOString());

      if (errorEntradas) throw errorEntradas;

      // 2. Traemos las funciones y películas para hacer el puente de datos
      const { data: funciones, error: errorFunciones } = await this.supabase
        .from('funciones')
        .select('id, pelicula_id');

      if (errorFunciones) throw errorFunciones;

      const { data: peliculas, error: errorPeliculas } = await this.supabase
        .from('peliculas')
        .select('id, nombre');

      if (errorPeliculas) throw errorPeliculas;

      const mapaFunciones = new Map(funciones.map((f: any) => [String(f.id), f.pelicula_id]));
      const mapaPeliculas = new Map(peliculas.map((p: any) => [String(p.id), p.nombre]));

      const conteo: { [key: string]: number } = {};
      
      // 3. Cruzamos los datos y enriquecemos cada entrada con el nombre de la película
      this.datosEntradasParaReporte = (entradas || []).map((entrada: any) => {
        const peliculaId = mapaFunciones.get(String(entrada.funcion_id));
        const nombrePeli = peliculaId ? (mapaPeliculas.get(String(peliculaId)) || 'Película Desconocida') : 'Película Desconocida';
        
        conteo[nombrePeli] = (conteo[nombrePeli] || 0) + 1;

        return {
          ...entrada,
          nombrePelicula: nombrePeli // Propiedad virtual calculada para el reporte
        };
      });

      const labels = Object.keys(conteo);
      const valores = Object.values(conteo);

      this.renderizarChart(labels, valores, filtro);

    } catch (error) {
      console.error('Error al cargar datos del gráfico:', error);
    }
  }

  // 📊 Método para exportar a Excel (Incluyendo Nombre de Película y Total)
  exportarExcel() {
    if (this.datosEntradasParaReporte.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const datosMapeados = this.datosEntradasParaReporte.map(item => ({
      ID: item.id,
      'Película': item.nombrePelicula,
      'Código QR': item.codigo_qr,
      'ID Usuario': item.usuario_id,
      'Asientos': item.asientos,
      'Total ($)': item.total,
      'Estado': item.estado,
      'Fecha de Creación': new Date(item.fecha_creacion).toLocaleString()
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosMapeados);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Reporte Facturacion': worksheet }, 
      SheetNames: ['Reporte Facturacion'] 
    };

    XLSX.writeFile(workbook, `reporte_facturacion_${this.filtroActual()}.xlsx`);
  }

  // 📄 Método para exportar a PDF (Incluyendo Nombre de Película y Total)
  exportarPDF() {
    if (this.datosEntradasParaReporte.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Facturación - Cine UTN', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Filtro aplicado: ${this.filtroActual() === 'semana' ? 'Última Semana' : 'Último Mes'}`, 14, 28);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 34);

    const filasTabla = this.datosEntradasParaReporte.map(item => [
      item.id,
      item.nombrePelicula,
      item.asientos,
      `$${item.total}`,
      new Date(item.fecha_creacion).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Película', 'Asientos', 'Total', 'Fecha']],
      body: filasTabla,
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`reporte_facturacion_${this.filtroActual()}.pdf`);
  }

  renderizarChart(labels: string[], valores: number[], filtro: string) {
    const ctx = document.getElementById('chartPeliculas') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['Sin datos'],
        datasets: [{
          label: `Entradas Vendidas (${filtro === 'semana' ? 'Última Semana' : 'Último Mes'})`,
          data: valores.length > 0 ? valores : [0],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#ffffff' } }
        },
        scales: {
          x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
          y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, beginAtZero: true }
        }
      }
    });
  }




































































































}
