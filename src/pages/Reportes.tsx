import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, TrendingDown, Users, FileText, AlertCircle } from 'lucide-react';

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
    }
  ];

  const selectedReportData = reports.find(r => r.id === selectedReport);

  const exportReport = (formato: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exportando ${selectedReport} en formato ${formato}`);
  };

  const renderReportContent = () => {
    if (!selectedReportData) return null;

    switch (selectedReport) {
      case 'citas':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total Programadas</p>
                    <p className="text-2xl font-bold text-blue-900">83</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Realizadas</p>
                    <p className="text-2xl font-bold text-green-900">74</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Canceladas</p>
                    <p className="text-2xl font-bold text-yellow-900">6</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">No-Show</p>
                    <p className="text-2xl font-bold text-red-900">3</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programadas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Realizadas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canceladas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No-Show</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Efectividad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedReportData.datos.map((fila: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(fila.fecha).toLocaleDateString('es-ES')}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.programadas}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">{fila.realizadas}</td>
                      <td className="px-6 py-4 text-sm text-yellow-600">{fila.canceladas}</td>
                      <td className="px-6 py-4 text-sm text-red-600">{fila.noShow}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {Math.round((fila.realizadas / fila.programadas) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'no-show':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-red-900">Tasa de No-Show: 3.6%</h3>
                  <p className="text-sm text-red-700">3 no-shows de 83 citas programadas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tratamiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedReportData.datos.map((fila: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fila.paciente}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(fila.fecha).toLocaleDateString('es-ES')}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.tratamiento}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.profesional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'produccion':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-blue-600">Total Pacientes</p>
                  <p className="text-2xl font-bold text-blue-900">114</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-green-600">Total Tratamientos</p>
                  <p className="text-2xl font-bold text-green-900">160</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-purple-600">Facturación Total</p>
                  <p className="text-2xl font-bold text-purple-900">€8,290</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pacientes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tratamientos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facturación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">€/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedReportData.datos.map((fila: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fila.profesional}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.pacientes}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.tratamientos}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.horas}h</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">€{fila.facturacion}</td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        €{Math.round(fila.facturacion / fila.horas)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'presupuestos':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-blue-600">Enviados</p>
                  <p className="text-2xl font-bold text-blue-900">145</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-green-600">Aceptados</p>
                  <p className="text-2xl font-bold text-green-900">95</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-red-600">Rechazados</p>
                  <p className="text-2xl font-bold text-red-900">37</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-purple-600">Conversión</p>
                  <p className="text-2xl font-bold text-purple-900">65%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enviados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aceptados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rechazados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendientes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Conversión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedReportData.datos.map((fila: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fila.mes}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fila.enviados}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">{fila.aceptados}</td>
                      <td className="px-6 py-4 text-sm text-red-600">{fila.rechazados}</td>
                      <td className="px-6 py-4 text-sm text-yellow-600">{fila.pendientes}</td>
                      <td className="px-6 py-4 text-sm font-medium text-purple-600">{fila.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600">Informes estándar: citas, no-show, producción por profesional, presupuestos aceptados</p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Período:</label>
            <input
              type="date"
              value={dateRange.inicio}
              onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">hasta</span>
            <input
              type="date"
              value={dateRange.fin}
              onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Excel
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {reports.map((report) => {
          const Icon = report.icono;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">{report.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.categoria}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedReportData?.nombre}</h2>
            <p className="text-gray-600">{selectedReportData?.descripcion}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última actualización:</p>
            <p className="text-sm font-medium text-gray-900">
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