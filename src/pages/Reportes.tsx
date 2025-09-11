import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, TrendingDown, Users, FileText, AlertCircle, PieChart, Target, DollarSign, Activity, CreditCard, Clock, MapPin, Star, Heart, Zap, ShoppingCart } from 'lucide-react';
import PDFGenerator from '../services/pdfGenerator';

interface ReportData {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  icono: React.ComponentType<any>;
  datos: any[];
  fechaUltima: string;
}

const Reportes: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('citas');
  const [dateRange, setDateRange] = useState({
    inicio: '2024-01-01',
    fin: new Date().toISOString().split('T')[0]
  });

  const reports: ReportData[] = [
    {
      id: 'citas',
      nombre: 'Informe de Citas',
      descripcion: 'Análisis completo de citas programadas, realizadas y canceladas',
      categoria: 'Operacional',
      icono: Calendar,
      datos: [
        { fecha: '2024-01-15', programadas: 25, realizadas: 22, canceladas: 2, noShow: 1 },
        { fecha: '2024-01-16', programadas: 28, realizadas: 24, canceladas: 3, noShow: 1 },
        { fecha: '2024-01-17', programadas: 30, realizadas: 28, canceladas: 1, noShow: 1 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'no-show',
      nombre: 'Análisis No-Show',
      descripcion: 'Pacientes que no asistieron sin cancelar',
      categoria: 'Calidad',
      icono: AlertCircle,
      datos: [
        { paciente: 'Juan Pérez', fecha: '2024-01-15', tratamiento: 'Limpieza', profesional: 'Dr. García' },
        { paciente: 'Ana López', fecha: '2024-01-16', tratamiento: 'Revisión', profesional: 'Dra. Martín' },
        { paciente: 'Carlos Ruiz', fecha: '2024-01-17', tratamiento: 'Empaste', profesional: 'Dr. García' },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'produccion',
      nombre: 'Producción por Profesional',
      descripcion: 'Rendimiento y facturación por cada profesional',
      categoria: 'Financiero',
      icono: TrendingUp,
      datos: [
        { profesional: 'Dr. García', pacientes: 45, tratamientos: 67, facturacion: 3250, horas: 120 },
        { profesional: 'Dra. Martín', pacientes: 38, tratamientos: 52, facturacion: 2890, horas: 96 },
        { profesional: 'Dr. López', pacientes: 31, tratamientos: 41, facturacion: 2150, horas: 80 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'presupuestos',
      nombre: 'Presupuestos Aceptados',
      descripcion: 'Análisis de conversión de presupuestos',
      categoria: 'Comercial',
      icono: FileText,
      datos: [
        { mes: 'Enero', enviados: 45, aceptados: 28, rechazados: 12, pendientes: 5, conversion: 62 },
        { mes: 'Febrero', enviados: 52, aceptados: 35, rechazados: 14, pendientes: 3, conversion: 67 },
        { mes: 'Marzo', enviados: 48, aceptados: 32, rechazados: 11, pendientes: 5, conversion: 67 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'financiero',
      nombre: 'Análisis Financiero',
      descripcion: 'Ingresos, gastos y rentabilidad por período',
      categoria: 'Financiero',
      icono: CreditCard,
      datos: [
        { mes: 'Enero', ingresos: 15420, gastos: 8750, beneficio: 6670, rentabilidad: 43.2 },
        { mes: 'Febrero', ingresos: 18650, gastos: 9200, beneficio: 9450, rentabilidad: 50.7 },
        { mes: 'Marzo', ingresos: 17890, gastos: 8950, beneficio: 8940, rentabilidad: 50.0 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'satisfaccion',
      nombre: 'Satisfacción del Cliente',
      descripcion: 'Encuestas y valoraciones de pacientes',
      categoria: 'Calidad',
      icono: Star,
      datos: [
        { profesional: 'Dr. García', puntuacion: 4.8, encuestas: 24, recomendaria: 96 },
        { profesional: 'Dra. Martín', puntuacion: 4.6, encuestas: 18, recomendaria: 89 },
        { profesional: 'Dr. López', puntuacion: 4.7, encuestas: 15, recomendaria: 93 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'tratamientos',
      nombre: 'Tratamientos Populares',
      descripcion: 'Análisis de frecuencia y rentabilidad por tratamiento',
      categoria: 'Operacional',
      icono: Heart,
      datos: [
        { tratamiento: 'Limpieza Dental', cantidad: 89, promedio: 65, total: 5785, satisfaccion: 4.9 },
        { tratamiento: 'Empastes', cantidad: 67, promedio: 95, total: 6365, satisfaccion: 4.7 },
        { tratamiento: 'Ortodoncia', cantidad: 23, promedio: 2200, total: 50600, satisfaccion: 4.8 },
        { tratamiento: 'Implantes', cantidad: 18, promedio: 1850, total: 33300, satisfaccion: 4.6 },
        { tratamiento: 'Blanqueamiento', cantidad: 34, promedio: 350, total: 11900, satisfaccion: 4.8 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'tiempo',
      nombre: 'Gestión de Tiempo',
      descripcion: 'Análisis de duración de citas y tiempos de espera',
      categoria: 'Operacional',
      icono: Clock,
      datos: [
        { profesional: 'Dr. García', duracionPromedio: 45, tiempoEspera: 12, puntualidad: 94 },
        { profesional: 'Dra. Martín', duracionPromedio: 38, tiempoEspera: 8, puntualidad: 98 },
        { profesional: 'Dr. López', duracionPromedio: 52, tiempoEspera: 15, puntualidad: 89 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'marketing',
      nombre: 'Fuentes de Pacientes',
      descripcion: 'Análisis de canales de adquisición de pacientes',
      categoria: 'Comercial',
      icono: Zap,
      datos: [
        { fuente: 'Recomendaciones', pacientes: 45, porcentaje: 38.5, conversion: 85, coste: 0 },
        { fuente: 'Google Ads', pacientes: 28, porcentaje: 23.9, conversion: 12, coste: 1250 },
        { fuente: 'Redes Sociales', pacientes: 22, porcentaje: 18.8, conversion: 8, coste: 680 },
        { fuente: 'Web Orgánico', pacientes: 15, porcentaje: 12.8, conversion: 15, coste: 0 },
        { fuente: 'Otros', pacientes: 7, porcentaje: 6.0, conversion: 25, coste: 200 },
      ],
      fechaUltima: '2024-01-17'
    },
    {
      id: 'inventario',
      nombre: 'Gestión de Inventario',
      descripcion: 'Control de stock y materiales dentales',
      categoria: 'Operacional',
      icono: ShoppingCart,
      datos: [
        { producto: 'Anestesia Local', stock: 45, minimo: 20, valor: 450, uso: 85 },
        { producto: 'Amalgama', stock: 12, minimo: 15, valor: 180, uso: 67 },
        { producto: 'Composite', stock: 28, minimo: 10, valor: 840, uso: 92 },
        { producto: 'Brackets', stock: 156, minimo: 50, valor: 2340, uso: 78 },
        { producto: 'Guantes Latex', stock: 8, minimo: 25, valor: 120, uso: 95 },
      ],
      fechaUltima: '2024-01-17'
    }
  ];

  const selectedReportData = reports.find(r => r.id === selectedReport);

  const exportReport = (formato: 'pdf' | 'excel' | 'csv') => {
    if (formato === 'pdf' && selectedReportData) {
      try {
        const doc = PDFGenerator.generateReport(selectedReportData);
        const fileName = `reporte_${selectedReportData.id}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        // Show success notification (you can implement a toast notification here)
        console.log(`PDF generado exitosamente: ${fileName}`);
      } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtelo de nuevo.');
      }
    } else if (formato === 'excel') {
      // Excel export functionality can be implemented here
      console.log('Exportando a Excel...');
      alert('Funcionalidad de exportación a Excel próximamente disponible');
    } else if (formato === 'csv') {
      // CSV export functionality
      if (selectedReportData) {
        const csvContent = generateCSV(selectedReportData);
        downloadCSV(csvContent, `reporte_${selectedReportData.id}_${new Date().toISOString().split('T')[0]}.csv`);
      }
    }
  };

  const generateCSV = (reportData: ReportData): string => {
    if (reportData.datos.length === 0) return '';
    
    const headers = Object.keys(reportData.datos[0]);
    const csvHeaders = headers.join(',');
    const csvRows = reportData.datos.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderReportContent = () => {
    if (!selectedReportData) return null;

    switch (selectedReport) {
      case 'citas':
        return (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Programadas</p>
                    <p className="text-3xl font-bold text-white mt-1">83</p>
                    <p className="text-blue-100 text-xs mt-1">+12% vs semana anterior</p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Realizadas</p>
                    <p className="text-3xl font-bold text-white mt-1">74</p>
                    <p className="text-green-100 text-xs mt-1">89% efectividad</p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Canceladas</p>
                    <p className="text-3xl font-bold text-white mt-1">6</p>
                    <p className="text-yellow-100 text-xs mt-1">7% del total</p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <TrendingDown className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">No-Show</p>
                    <p className="text-3xl font-bold text-white mt-1">3</p>
                    <p className="text-red-100 text-xs mt-1">3.6% tasa</p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                  Desglose Diario de Citas
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Fecha
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Programadas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Realizadas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Canceladas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No-Show</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Efectividad</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {new Date(fila.fecha).toLocaleDateString('es-ES')}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                            {fila.programadas}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            {fila.realizadas}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg inline-block">
                            {fila.canceladas}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-lg inline-block">
                            {fila.noShow}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {Math.round((fila.realizadas / fila.programadas) * 100)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'no-show':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tasa de No-Show: 3.6%</h3>
                  <p className="text-red-100 text-lg">3 no-shows de 83 citas programadas</p>
                  <p className="text-red-100 text-sm mt-1">Meta: Mantener por debajo del 5%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2 text-red-600" />
                  Detalle de Pacientes No-Show
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-red-50 to-rose-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Paciente
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tratamiento</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Profesional</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {fila.paciente.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{fila.paciente}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                            {new Date(fila.fecha).toLocaleDateString('es-ES')}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.tratamiento}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {fila.profesional}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'produccion':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Total Pacientes</p>
                  <p className="text-3xl font-bold text-white mt-1">114</p>
                  <p className="text-blue-100 text-xs mt-1">Atendidos este período</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-green-100 text-sm font-medium">Total Tratamientos</p>
                  <p className="text-3xl font-bold text-white mt-1">160</p>
                  <p className="text-green-100 text-xs mt-1">1.4 promedio por paciente</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-purple-100 text-sm font-medium">Facturación Total</p>
                  <p className="text-3xl font-bold text-white mt-1">€8,290</p>
                  <p className="text-purple-100 text-xs mt-1">€72.7 promedio por paciente</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                  Rendimiento por Profesional
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Profesional
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pacientes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tratamientos</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Horas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Facturación</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">€/Hora</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {fila.profesional.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{fila.profesional}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.pacientes}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {fila.tratamientos}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                            {fila.horas}h
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.facturacion.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            €{Math.round(fila.facturacion / fila.horas)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'presupuestos':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Enviados</p>
                  <p className="text-3xl font-bold text-white mt-1">145</p>
                  <p className="text-blue-100 text-xs mt-1">En los últimos 3 meses</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-green-100 text-sm font-medium">Aceptados</p>
                  <p className="text-3xl font-bold text-white mt-1">95</p>
                  <p className="text-green-100 text-xs mt-1">Conversiones exitosas</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <TrendingDown className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-red-100 text-sm font-medium">Rechazados</p>
                  <p className="text-3xl font-bold text-white mt-1">37</p>
                  <p className="text-red-100 text-xs mt-1">25.5% del total</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <PieChart className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-purple-100 text-sm font-medium">Conversión</p>
                  <p className="text-3xl font-bold text-white mt-1">65%</p>
                  <p className="text-purple-100 text-xs mt-1">Meta: 70%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-purple-600" />
                  Evolución Mensual de Presupuestos
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Mes
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Enviados</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aceptados</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rechazados</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pendientes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Conversión</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {fila.mes}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.enviados}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            {fila.aceptados}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-lg inline-block">
                            {fila.rechazados}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg inline-block">
                            {fila.pendientes}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {fila.conversion}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'financiero':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-white mt-1">€51,960</p>
                  <p className="text-green-100 text-xs mt-1">Últimos 3 meses</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <TrendingDown className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-red-100 text-sm font-medium">Gastos Totales</p>
                  <p className="text-3xl font-bold text-white mt-1">€26,900</p>
                  <p className="text-red-100 text-xs mt-1">Últimos 3 meses</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Beneficio Neto</p>
                  <p className="text-3xl font-bold text-white mt-1">€25,060</p>
                  <p className="text-blue-100 text-xs mt-1">48.2% rentabilidad</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                  Análisis Financiero Mensual
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ingresos</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gastos</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Beneficio</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rentabilidad</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.mes}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.ingresos.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.gastos.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.beneficio.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {fila.rentabilidad}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'satisfaccion':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Puntuación Media: 4.7/5</h3>
                  <p className="text-yellow-100 text-lg">57 encuestas completadas</p>
                  <p className="text-yellow-100 text-sm mt-1">93% recomendaría nuestros servicios</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-yellow-600" />
                  Satisfacción por Profesional
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-yellow-50 to-orange-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Profesional</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Puntuación</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Encuestas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Recomendaría</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {fila.profesional.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{fila.profesional}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg inline-block">
                            {fila.puntuacion}/5
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.encuestas}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            {fila.recomendaria}%
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(fila.puntuacion)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'tratamientos':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-pink-100 text-sm font-medium">Tratamientos Totales</p>
                  <p className="text-3xl font-bold text-white mt-1">231</p>
                  <p className="text-pink-100 text-xs mt-1">En el período seleccionado</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-purple-100 text-sm font-medium">Facturación Total</p>
                  <p className="text-3xl font-bold text-white mt-1">€107,950</p>
                  <p className="text-purple-100 text-xs mt-1">€467 promedio por tratamiento</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-indigo-100 text-sm font-medium">Satisfacción Media</p>
                  <p className="text-3xl font-bold text-white mt-1">4.8/5</p>
                  <p className="text-indigo-100 text-xs mt-1">Muy alta valoración</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-pink-600" />
                  Análisis de Tratamientos Populares
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-pink-50 to-rose-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tratamiento</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Precio Promedio</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Facturado</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Satisfacción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 bg-pink-50 px-3 py-1 rounded-lg inline-block">
                            {fila.tratamiento}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.cantidad}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.promedio}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.total.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg inline-block mr-2">
                              {fila.satisfaccion}/5
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(fila.satisfaccion)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'tiempo':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Duración Promedio: 45 min</h3>
                  <p className="text-cyan-100 text-lg">Tiempo de espera promedio: 12 min</p>
                  <p className="text-cyan-100 text-sm mt-1">94% puntualidad general</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-cyan-600" />
                  Gestión de Tiempo por Profesional
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Profesional</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duración Promedio</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tiempo de Espera</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Puntualidad</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Eficiencia</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {fila.profesional.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{fila.profesional}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.duracionPromedio} min
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-medium px-3 py-1 rounded-lg inline-block ${
                            fila.tiempoEspera <= 10 
                              ? 'text-green-700 bg-green-50' 
                              : fila.tiempoEspera <= 15 
                              ? 'text-yellow-700 bg-yellow-50'
                              : 'text-red-700 bg-red-50'
                          }`}>
                            {fila.tiempoEspera} min
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-bold px-3 py-1 rounded-lg inline-block ${
                            fila.puntualidad >= 95 
                              ? 'text-green-700 bg-green-50' 
                              : fila.puntualidad >= 90 
                              ? 'text-yellow-700 bg-yellow-50'
                              : 'text-red-700 bg-red-50'
                          }`}>
                            {fila.puntualidad}%
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            fila.puntualidad >= 95 && fila.tiempoEspera <= 10
                              ? 'text-green-800 bg-green-100' 
                              : fila.puntualidad >= 90 && fila.tiempoEspera <= 15
                              ? 'text-yellow-800 bg-yellow-100'
                              : 'text-red-800 bg-red-100'
                          }`}>
                            {fila.puntualidad >= 95 && fila.tiempoEspera <= 10 ? 'Excelente' : 
                             fila.puntualidad >= 90 && fila.tiempoEspera <= 15 ? 'Buena' : 'Mejorable'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-orange-100 text-sm font-medium">Nuevos Pacientes</p>
                  <p className="text-3xl font-bold text-white mt-1">117</p>
                  <p className="text-orange-100 text-xs mt-1">En el período seleccionado</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-green-100 text-sm font-medium">Conversión Media</p>
                  <p className="text-3xl font-bold text-white mt-1">29%</p>
                  <p className="text-green-100 text-xs mt-1">De contactos a pacientes</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-purple-100 text-sm font-medium">Coste por Adquisición</p>
                  <p className="text-3xl font-bold text-white mt-1">€18</p>
                  <p className="text-purple-100 text-xs mt-1">Promedio ponderado</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Zap className="h-6 w-6 mr-2 text-orange-600" />
                  Análisis de Fuentes de Pacientes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fuente</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pacientes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% del Total</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Conversión</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Coste</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 bg-orange-50 px-3 py-1 rounded-lg inline-block">
                            {fila.fuente}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            {fila.pacientes}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                            {fila.porcentaje}%
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-medium px-3 py-1 rounded-lg inline-block ${
                            fila.conversion >= 50 
                              ? 'text-green-700 bg-green-50' 
                              : fila.conversion >= 20 
                              ? 'text-yellow-700 bg-yellow-50'
                              : 'text-red-700 bg-red-50'
                          }`}>
                            {fila.conversion}%
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.coste}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            fila.coste === 0 
                              ? 'text-green-800 bg-green-100' 
                              : fila.coste / fila.pacientes <= 50
                              ? 'text-yellow-800 bg-yellow-100'
                              : 'text-red-800 bg-red-100'
                          }`}>
                            {fila.coste === 0 ? 'Gratis' : 
                             fila.coste / fila.pacientes <= 50 ? 'Bueno' : 'Alto'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'inventario':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-indigo-100 text-sm font-medium">Valor Total Stock</p>
                  <p className="text-3xl font-bold text-white mt-1">€3,930</p>
                  <p className="text-indigo-100 text-xs mt-1">249 productos en stock</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-red-100 text-sm font-medium">Stock Bajo</p>
                  <p className="text-3xl font-bold text-white mt-1">2</p>
                  <p className="text-red-100 text-xs mt-1">Productos por debajo del mínimo</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="text-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-green-100 text-sm font-medium">Uso Promedio</p>
                  <p className="text-3xl font-bold text-white mt-1">83%</p>
                  <p className="text-green-100 text-xs mt-1">Rotación de inventario</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2 text-indigo-600" />
                  Control de Inventario
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Actual</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Mínimo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">% Uso</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedReportData.datos.map((fila: any, index: number) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                            {fila.producto}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-bold px-3 py-1 rounded-lg inline-block ${
                            fila.stock < fila.minimo 
                              ? 'text-red-700 bg-red-50' 
                              : fila.stock <= fila.minimo * 1.5
                              ? 'text-yellow-700 bg-yellow-50'
                              : 'text-green-700 bg-green-50'
                          }`}>
                            {fila.stock}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                            {fila.minimo}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                            €{fila.valor}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-medium px-3 py-1 rounded-lg inline-block ${
                            fila.uso >= 80 
                              ? 'text-green-700 bg-green-50' 
                              : fila.uso >= 60 
                              ? 'text-yellow-700 bg-yellow-50'
                              : 'text-red-700 bg-red-50'
                          }`}>
                            {fila.uso}%
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            fila.stock < fila.minimo 
                              ? 'text-red-800 bg-red-100' 
                              : fila.stock <= fila.minimo * 1.5
                              ? 'text-yellow-800 bg-yellow-100'
                              : 'text-green-800 bg-green-100'
                          }`}>
                            {fila.stock < fila.minimo ? 'CRÍTICO' : 
                             fila.stock <= fila.minimo * 1.5 ? 'BAJO' : 'OK'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reportes y Análisis
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Informes completos: citas, no-show, producción por profesional y análisis de presupuestos
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <label className="text-sm font-semibold text-gray-700">Período de análisis:</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={dateRange.inicio}
                onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
              <span className="text-gray-500 font-medium">hasta</span>
              <input
                type="date"
                value={dateRange.fin}
                onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => exportReport('pdf')}
              className="group px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden"
              title="Generar reporte en PDF con análisis detallado"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <Download className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10 font-semibold">PDF</span>
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden"
              title="Exportar datos a Excel (próximamente)"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <Download className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10 font-semibold">Excel</span>
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden"
              title="Descargar datos en formato CSV"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              <Download className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10 font-semibold">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reports.map((report) => {
          const Icon = report.icono;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                selectedReport === report.id
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-2xl ${
                  selectedReport === report.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold ${
                    selectedReport === report.id ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    {report.nombre}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    selectedReport === report.id ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {report.categoria}
                  </p>
                </div>
                {selectedReport === report.id && (
                  <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-purple-600" />
              {selectedReportData?.nombre}
            </h2>
            <p className="text-gray-600 text-lg">{selectedReportData?.descripcion}</p>
          </div>
          <div className="text-right bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Última actualización:</p>
            <p className="text-sm font-bold text-purple-900">
              {selectedReportData?.fechaUltima ? new Date(selectedReportData.fechaUltima).toLocaleDateString('es-ES') : '-'}
            </p>
          </div>
        </div>

        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reportes;