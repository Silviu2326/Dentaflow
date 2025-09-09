import React, { useState } from 'react';
import { TrendingUp, Calendar, AlertCircle, Clock, Target, Users, Euro, Activity, ChevronRight, Filter, Download } from 'lucide-react';

interface PrediccionProduccion {
  fecha: string;
  citasProgramadas: number;
  citasEstimadas: number;
  huecosDisponibles: number;
  ingresosPotenciales: number;
  profesional: string;
  confianza: number;
}

interface HuecoSugerido {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  profesional: string;
  tipoTratamiento: string;
  ingresoEstimado: number;
  probabilidadLlenado: number;
  sugerencia: string;
  prioridad: 'alta' | 'media' | 'baja';
}

interface MetricaProductividad {
  periodo: string;
  ocupacion: number;
  ingresosProgramados: number;
  ingresosRealizados: number;
  citasCanceladas: number;
  huecosPerdidos: number;
  eficiencia: number;
}

export default function AnalyticsForecast() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<'semana' | 'mes' | 'trimestre'>('semana');
  const [profesionalFiltro, setProfesionalFiltro] = useState<string>('todos');
  const [vistaActiva, setVistaActiva] = useState<'prediccion' | 'huecos' | 'productividad'>('prediccion');

  const predicciones: PrediccionProduccion[] = [
    {
      fecha: '2024-01-15',
      citasProgramadas: 18,
      citasEstimadas: 22,
      huecosDisponibles: 6,
      ingresosPotenciales: 3200,
      profesional: 'Dr. González',
      confianza: 85
    },
    {
      fecha: '2024-01-16',
      citasProgramadas: 15,
      citasEstimadas: 19,
      huecosDisponibles: 9,
      ingresosPotenciales: 4500,
      profesional: 'Dra. Martín',
      confianza: 78
    },
    {
      fecha: '2024-01-17',
      citasProgramadas: 20,
      citasEstimadas: 24,
      huecosDisponibles: 4,
      ingresosPotenciales: 2800,
      profesional: 'Dr. López',
      confianza: 92
    },
    {
      fecha: '2024-01-18',
      citasProgramadas: 12,
      citasEstimadas: 16,
      huecosDisponibles: 12,
      ingresosPotenciales: 6200,
      profesional: 'Dr. González',
      confianza: 70
    }
  ];

  const huecosSugeridos: HuecoSugerido[] = [
    {
      id: 'H001',
      fecha: '2024-01-15',
      horaInicio: '10:00',
      horaFin: '11:00',
      profesional: 'Dr. González',
      tipoTratamiento: 'Limpieza',
      ingresoEstimado: 80,
      probabilidadLlenado: 85,
      sugerencia: 'Contactar pacientes pendientes de profilaxis',
      prioridad: 'alta'
    },
    {
      id: 'H002',
      fecha: '2024-01-15',
      horaInicio: '16:00',
      horaFin: '17:30',
      profesional: 'Dr. González',
      tipoTratamiento: 'Endodoncia',
      ingresoEstimado: 450,
      probabilidadLlenado: 65,
      sugerencia: 'Ofrecer descuento por pronto pago',
      prioridad: 'media'
    },
    {
      id: 'H003',
      fecha: '2024-01-16',
      horaInicio: '09:00',
      horaFin: '10:00',
      profesional: 'Dra. Martín',
      tipoTratamiento: 'Consulta',
      ingresoEstimado: 60,
      probabilidadLlenado: 92,
      sugerencia: 'Activar campaña de primeras visitas',
      prioridad: 'alta'
    },
    {
      id: 'H004',
      fecha: '2024-01-17',
      horaInicio: '14:00',
      horaFin: '16:00',
      profesional: 'Dr. López',
      tipoTratamiento: 'Implante',
      ingresoEstimado: 1200,
      probabilidadLlenado: 45,
      sugerencia: 'Contactar pacientes de lista de espera premium',
      prioridad: 'baja'
    }
  ];

  const metricas: MetricaProductividad[] = [
    {
      periodo: 'Semana 2',
      ocupacion: 78,
      ingresosProgramados: 15400,
      ingresosRealizados: 13200,
      citasCanceladas: 8,
      huecosPerdidos: 12,
      eficiencia: 85.7
    },
    {
      periodo: 'Semana 3',
      ocupacion: 82,
      ingresosProgramados: 16800,
      ingresosRealizados: 15100,
      citasCanceladas: 5,
      huecosPerdidos: 9,
      eficiencia: 89.9
    },
    {
      periodo: 'Semana 4',
      ocupacion: 75,
      ingresosProgramados: 14200,
      ingresosRealizados: 12800,
      citasCanceladas: 11,
      huecosPerdidos: 15,
      eficiencia: 82.1
    }
  ];

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfianzaColor = (confianza: number) => {
    if (confianza >= 85) return 'text-green-600';
    if (confianza >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const profesionales = ['todos', 'Dr. González', 'Dra. Martín', 'Dr. López'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics - Forecast</h1>
          <p className="text-gray-600">Predicción de producción, huecos disponibles y sugerencias para optimizar la ocupación</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value as any)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="semana">Próxima semana</option>
            <option value="mes">Próximo mes</option>
            <option value="trimestre">Próximo trimestre</option>
          </select>
          <select 
            value={profesionalFiltro}
            onChange={(e) => setProfesionalFiltro(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {profesionales.map(prof => (
              <option key={prof} value={prof}>{prof === 'todos' ? 'Todos los profesionales' : prof}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setVistaActiva('prediccion')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'prediccion'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Predicción
        </button>
        <button
          onClick={() => setVistaActiva('huecos')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'huecos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          Huecos Sugeridos
        </button>
        <button
          onClick={() => setVistaActiva('productividad')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'productividad'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Productividad
        </button>
      </div>

      {vistaActiva === 'prediccion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Citas Programadas</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {predicciones.reduce((sum, p) => sum + p.citasProgramadas, 0)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimación Final</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {predicciones.reduce((sum, p) => sum + p.citasEstimadas, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Huecos Disponibles</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {predicciones.reduce((sum, p) => sum + p.huecosDisponibles, 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Potenciales</p>
                  <p className="text-2xl font-semibold text-purple-600">
                    {predicciones.reduce((sum, p) => sum + p.ingresosPotenciales, 0).toLocaleString()}€
                  </p>
                </div>
                <Euro className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Predicción por Día</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programadas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimadas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Huecos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos Potenciales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confianza
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predicciones
                    .filter(p => profesionalFiltro === 'todos' || p.profesional === profesionalFiltro)
                    .map((prediccion, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prediccion.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prediccion.profesional}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prediccion.citasProgramadas}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{prediccion.citasEstimadas}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-yellow-600">{prediccion.huecosDisponibles}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-purple-600">
                          {prediccion.ingresosPotenciales.toLocaleString()}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getConfianzaColor(prediccion.confianza)}`}>
                          {prediccion.confianza}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {vistaActiva === 'huecos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Huecos Sugeridos para Llenar</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {huecosSugeridos
                  .filter(h => profesionalFiltro === 'todos' || h.profesional === profesionalFiltro)
                  .map((hueco) => (
                  <div key={hueco.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">
                          {hueco.fecha} - {hueco.horaInicio} a {hueco.horaFin}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(hueco.prioridad)}`}>
                          {hueco.prioridad}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {hueco.ingresoEstimado}€
                        </div>
                        <div className="text-xs text-gray-500">
                          {hueco.probabilidadLlenado}% probabilidad
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Profesional:</span>
                        <div className="font-medium">{hueco.profesional}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tratamiento:</span>
                        <div className="font-medium">{hueco.tipoTratamiento}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Sugerencia:</span>
                        <div className="font-medium text-blue-600">{hueco.sugerencia}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                        Aplicar Sugerencia
                      </button>
                      <button className="border border-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-50">
                        Ver Pacientes Disponibles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {vistaActiva === 'productividad' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Análisis de Productividad</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ocupación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos Programados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos Realizados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancelaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Huecos Perdidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eficiencia
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metricas.map((metrica, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{metrica.periodo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metrica.ocupacion}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${metrica.ocupacion}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {metrica.ingresosProgramados.toLocaleString()}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {metrica.ingresosRealizados.toLocaleString()}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600">{metrica.citasCanceladas}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-yellow-600">{metrica.huecosPerdidos}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          metrica.eficiencia >= 85 ? 'text-green-600' : 
                          metrica.eficiencia >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {metrica.eficiencia}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}