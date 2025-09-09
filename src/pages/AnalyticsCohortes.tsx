import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Filter, Download, Eye, ArrowRight, Target, Percent } from 'lucide-react';

interface CohortePaciente {
  id: string;
  nombre: string;
  fechaPrimeraVisita: string;
  origen: 'web' | 'telefono' | 'referido' | 'redes' | 'presencial';
  estadoActual: 'primera_visita' | 'presupuesto_enviado' | 'presupuesto_aceptado' | 'tratamiento_completado' | 'revision_realizada' | 'perdido';
  fechaUltimaActividad: string;
  valorPresupuesto?: number;
  tratamientoCompletado?: boolean;
  tiempoEnEtapa: number; // días
}

interface EtapaFunnel {
  nombre: string;
  color: string;
  icono: string;
  descripcion: string;
}

interface MetricaCohorte {
  periodo: string;
  primerasVisitas: number;
  presupuestosEnviados: number;
  presupuestosAceptados: number;
  tratamientosCompletados: number;
  revisionesRealizadas: number;
  tasaConversionPresupuesto: number;
  tasaAceptacionPresupuesto: number;
  tasaCompletacionTratamiento: number;
  tasaRevision: number;
  valorMedioPresupuesto: number;
  ingresosTotales: number;
}

export default function AnalyticsCohortes() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<'mes' | 'trimestre' | 'semestre' | 'año'>('trimestre');
  const [origenFiltro, setOrigenFiltro] = useState<string>('todos');
  const [vistaActiva, setVistaActiva] = useState<'funnel' | 'cohortes' | 'pacientes'>('funnel');

  const etapasFunnel: EtapaFunnel[] = [
    { nombre: 'Primera Visita', color: 'bg-blue-500', icono: 'Eye', descripcion: 'Paciente acude por primera vez' },
    { nombre: 'Presupuesto Enviado', color: 'bg-yellow-500', icono: 'FileText', descripcion: 'Se envía presupuesto detallado' },
    { nombre: 'Presupuesto Aceptado', color: 'bg-green-500', icono: 'CheckCircle', descripcion: 'Paciente acepta el presupuesto' },
    { nombre: 'Tratamiento Completado', color: 'bg-purple-500', icono: 'Award', descripcion: 'Finaliza el tratamiento' },
    { nombre: 'Revisión Realizada', color: 'bg-indigo-500', icono: 'RefreshCw', descripcion: 'Acude a revisión posterior' }
  ];

  const metricas: MetricaCohorte[] = [
    {
      periodo: '2024 Q1',
      primerasVisitas: 120,
      presupuestosEnviados: 95,
      presupuestosAceptados: 72,
      tratamientosCompletados: 58,
      revisionesRealizadas: 45,
      tasaConversionPresupuesto: 79.2,
      tasaAceptacionPresupuesto: 75.8,
      tasaCompletacionTratamiento: 80.6,
      tasaRevision: 77.6,
      valorMedioPresupuesto: 2850,
      ingresosTotales: 205200
    },
    {
      periodo: '2024 Q2',
      primerasVisitas: 135,
      presupuestosEnviados: 110,
      presupuestosAceptados: 88,
      tratamientosCompletados: 71,
      revisionesRealizadas: 55,
      tasaConversionPresupuesto: 81.5,
      tasaAceptacionPresupuesto: 80.0,
      tasaCompletacionTratamiento: 80.7,
      tasaRevision: 77.5,
      valorMedioPresupuesto: 3100,
      ingresosTotales: 272800
    },
    {
      periodo: '2024 Q3',
      primerasVisitas: 148,
      presupuestosEnviados: 125,
      presupuestosAceptados: 102,
      tratamientosCompletados: 84,
      revisionesRealizadas: 68,
      tasaConversionPresupuesto: 84.5,
      tasaAceptacionPresupuesto: 81.6,
      tasaCompletacionTratamiento: 82.4,
      tasaRevision: 81.0,
      valorMedioPresupuesto: 3200,
      ingresosTotales: 326400
    }
  ];

  const pacientesCohorte: CohortePaciente[] = [
    {
      id: 'PAC001',
      nombre: 'María González',
      fechaPrimeraVisita: '2024-01-15',
      origen: 'web',
      estadoActual: 'revision_realizada',
      fechaUltimaActividad: '2024-03-20',
      valorPresupuesto: 2800,
      tratamientoCompletado: true,
      tiempoEnEtapa: 65
    },
    {
      id: 'PAC002',
      nombre: 'Carlos Ruiz',
      fechaPrimeraVisita: '2024-01-18',
      origen: 'telefono',
      estadoActual: 'presupuesto_aceptado',
      fechaUltimaActividad: '2024-02-10',
      valorPresupuesto: 3500,
      tiempoEnEtapa: 23
    },
    {
      id: 'PAC003',
      nombre: 'Ana Torres',
      fechaPrimeraVisita: '2024-01-22',
      origen: 'referido',
      estadoActual: 'tratamiento_completado',
      fechaUltimaActividad: '2024-03-15',
      valorPresupuesto: 4200,
      tratamientoCompletado: true,
      tiempoEnEtapa: 52
    },
    {
      id: 'PAC004',
      nombre: 'Luis Martín',
      fechaPrimeraVisita: '2024-02-05',
      origen: 'redes',
      estadoActual: 'presupuesto_enviado',
      fechaUltimaActividad: '2024-02-12',
      valorPresupuesto: 1800,
      tiempoEnEtapa: 35
    },
    {
      id: 'PAC005',
      nombre: 'Elena Rodríguez',
      fechaPrimeraVisita: '2024-02-10',
      origen: 'presencial',
      estadoActual: 'perdido',
      fechaUltimaActividad: '2024-02-10',
      tiempoEnEtapa: 45
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'primera_visita':
        return 'bg-blue-100 text-blue-800';
      case 'presupuesto_enviado':
        return 'bg-yellow-100 text-yellow-800';
      case 'presupuesto_aceptado':
        return 'bg-green-100 text-green-800';
      case 'tratamiento_completado':
        return 'bg-purple-100 text-purple-800';
      case 'revision_realizada':
        return 'bg-indigo-100 text-indigo-800';
      case 'perdido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrigenColor = (origen: string) => {
    switch (origen) {
      case 'web':
        return 'bg-blue-100 text-blue-800';
      case 'telefono':
        return 'bg-green-100 text-green-800';
      case 'referido':
        return 'bg-purple-100 text-purple-800';
      case 'redes':
        return 'bg-pink-100 text-pink-800';
      case 'presencial':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularPorcentajeEtapa = (actual: number, anterior: number) => {
    if (anterior === 0) return 0;
    return ((actual / anterior) * 100).toFixed(1);
  };

  const ultimaMetrica = metricas[metricas.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics - Cohortes</h1>
          <p className="text-gray-600">Análisis del funnel de conversión: 1ª visita → presupuesto → aceptado → revisiones</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value as any)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mes">Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="semestre">Último semestre</option>
            <option value="año">Último año</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setVistaActiva('funnel')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'funnel'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Target className="h-4 w-4 inline mr-2" />
          Funnel de Conversión
        </button>
        <button
          onClick={() => setVistaActiva('cohortes')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'cohortes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Evolución por Cohortes
        </button>
        <button
          onClick={() => setVistaActiva('pacientes')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'pacientes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Seguimiento Pacientes
        </button>
      </div>

      {vistaActiva === 'funnel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Primeras Visitas</p>
                  <p className="text-2xl font-semibold text-blue-600">{ultimaMetrica.primerasVisitas}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-xs text-gray-500">100% del funnel</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Presupuestos</p>
                  <p className="text-2xl font-semibold text-yellow-600">{ultimaMetrica.presupuestosEnviados}</p>
                </div>
                <ArrowRight className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-xs text-green-600">
                {calcularPorcentajeEtapa(ultimaMetrica.presupuestosEnviados, ultimaMetrica.primerasVisitas)}% conversión
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aceptados</p>
                  <p className="text-2xl font-semibold text-green-600">{ultimaMetrica.presupuestosAceptados}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xs text-green-600">
                {calcularPorcentajeEtapa(ultimaMetrica.presupuestosAceptados, ultimaMetrica.presupuestosEnviados)}% aceptación
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-semibold text-purple-600">{ultimaMetrica.tratamientosCompletados}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-xs text-green-600">
                {calcularPorcentajeEtapa(ultimaMetrica.tratamientosCompletados, ultimaMetrica.presupuestosAceptados)}% completados
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revisiones</p>
                  <p className="text-2xl font-semibold text-indigo-600">{ultimaMetrica.revisionesRealizadas}</p>
                </div>
                <Percent className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="text-xs text-green-600">
                {calcularPorcentajeEtapa(ultimaMetrica.revisionesRealizadas, ultimaMetrica.tratamientosCompletados)}% revisiones
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualización del Funnel</h3>
            <div className="space-y-4">
              {[
                { etapa: 'Primera Visita', valor: ultimaMetrica.primerasVisitas, color: 'bg-blue-500', width: '100%' },
                { etapa: 'Presupuesto Enviado', valor: ultimaMetrica.presupuestosEnviados, color: 'bg-yellow-500', width: `${(ultimaMetrica.presupuestosEnviados / ultimaMetrica.primerasVisitas) * 100}%` },
                { etapa: 'Presupuesto Aceptado', valor: ultimaMetrica.presupuestosAceptados, color: 'bg-green-500', width: `${(ultimaMetrica.presupuestosAceptados / ultimaMetrica.primerasVisitas) * 100}%` },
                { etapa: 'Tratamiento Completado', valor: ultimaMetrica.tratamientosCompletados, color: 'bg-purple-500', width: `${(ultimaMetrica.tratamientosCompletados / ultimaMetrica.primerasVisitas) * 100}%` },
                { etapa: 'Revisión Realizada', valor: ultimaMetrica.revisionesRealizadas, color: 'bg-indigo-500', width: `${(ultimaMetrica.revisionesRealizadas / ultimaMetrica.primerasVisitas) * 100}%` }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-48 text-sm font-medium text-gray-700">{item.etapa}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <div 
                      className={`${item.color} h-8 rounded-full flex items-center justify-end pr-4 text-white text-sm font-medium transition-all duration-500`}
                      style={{ width: item.width }}
                    >
                      {item.valor}
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-500">
                    {((item.valor / ultimaMetrica.primerasVisitas) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {vistaActiva === 'cohortes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Evolución por Trimestres</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      1ª Visitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presupuestos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aceptados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revisiones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Medio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos
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
                        <div className="text-sm text-gray-900">{metrica.primerasVisitas}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metrica.presupuestosEnviados}</div>
                        <div className="text-xs text-green-600">{metrica.tasaConversionPresupuesto}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metrica.presupuestosAceptados}</div>
                        <div className="text-xs text-green-600">{metrica.tasaAceptacionPresupuesto}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metrica.tratamientosCompletados}</div>
                        <div className="text-xs text-green-600">{metrica.tasaCompletacionTratamiento}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metrica.revisionesRealizadas}</div>
                        <div className="text-xs text-green-600">{metrica.tasaRevision}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {metrica.valorMedioPresupuesto.toLocaleString()}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {metrica.ingresosTotales.toLocaleString()}€
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

      {vistaActiva === 'pacientes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select 
                value={origenFiltro}
                onChange={(e) => setOrigenFiltro(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los orígenes</option>
                <option value="web">Web</option>
                <option value="telefono">Teléfono</option>
                <option value="referido">Referido</option>
                <option value="redes">Redes Sociales</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Seguimiento Individual de Pacientes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      1ª Visita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Actual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiempo en Etapa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actividad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pacientesCohorte
                    .filter(p => origenFiltro === 'todos' || p.origen === origenFiltro)
                    .map((paciente) => (
                    <tr key={paciente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{paciente.nombre}</div>
                        <div className="text-sm text-gray-500">{paciente.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrigenColor(paciente.origen)}`}>
                          {paciente.origen}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{paciente.fechaPrimeraVisita}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(paciente.estadoActual)}`}>
                          {paciente.estadoActual.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{paciente.tiempoEnEtapa} días</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paciente.valorPresupuesto && (
                          <div className="text-sm font-medium text-gray-900">
                            {paciente.valorPresupuesto.toLocaleString()}€
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{paciente.fechaUltimaActividad}</div>
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