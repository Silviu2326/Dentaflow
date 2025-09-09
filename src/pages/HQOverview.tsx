import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Users, DollarSign, AlertCircle, MapPin, Target } from 'lucide-react';

interface SedeKPIs {
  id: string;
  nombre: string;
  direccion: string;
  kpis: {
    ocupacion: {
      actual: number;
      objetivo: number;
      tendencia: 'up' | 'down' | 'stable';
    };
    noShow: {
      tasa: number;
      objetivo: number;
      casos: number;
      tendencia: 'up' | 'down' | 'stable';
    };
    conversion: {
      tasa: number;
      objetivo: number;
      presupuestosEnviados: number;
      presupuestosAceptados: number;
      tendencia: 'up' | 'down' | 'stable';
    };
    facturacion: {
      mes: number;
      objetivo: number;
      tendencia: 'up' | 'down' | 'stable';
      variacionMesAnterior: number;
    };
    pacientesNuevos: {
      mes: number;
      objetivo: number;
      tendencia: 'up' | 'down' | 'stable';
    };
    satisfaccion: {
      puntuacion: number;
      objetivo: number;
      encuestasRealizadas: number;
    };
  };
  estado: 'excelente' | 'bueno' | 'regular' | 'critico';
}

const HQOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedSede, setSelectedSede] = useState('todas');

  const [sedes] = useState<SedeKPIs[]>([
    {
      id: 'sede1',
      nombre: 'Clínica Centro',
      direccion: 'Calle Mayor 123, Madrid',
      kpis: {
        ocupacion: { actual: 87, objetivo: 85, tendencia: 'up' },
        noShow: { tasa: 4.2, objetivo: 5, casos: 12, tendencia: 'down' },
        conversion: { tasa: 68, objetivo: 65, presupuestosEnviados: 45, presupuestosAceptados: 31, tendencia: 'up' },
        facturacion: { mes: 45890, objetivo: 40000, tendencia: 'up', variacionMesAnterior: 12.5 },
        pacientesNuevos: { mes: 23, objetivo: 20, tendencia: 'up' },
        satisfaccion: { puntuacion: 4.7, objetivo: 4.5, encuestasRealizadas: 67 }
      },
      estado: 'excelente'
    },
    {
      id: 'sede2',
      nombre: 'Clínica Norte',
      direccion: 'Avenida de la Paz 45, Madrid',
      kpis: {
        ocupacion: { actual: 78, objetivo: 85, tendencia: 'down' },
        noShow: { tasa: 6.8, objetivo: 5, casos: 18, tendencia: 'up' },
        conversion: { tasa: 58, objetivo: 65, presupuestosEnviados: 38, presupuestosAceptados: 22, tendencia: 'down' },
        facturacion: { mes: 32150, objetivo: 35000, tendencia: 'down', variacionMesAnterior: -8.3 },
        pacientesNuevos: { mes: 16, objetivo: 20, tendencia: 'down' },
        satisfaccion: { puntuacion: 4.3, objetivo: 4.5, encuestasRealizadas: 42 }
      },
      estado: 'regular'
    },
    {
      id: 'sede3',
      nombre: 'Clínica Sur',
      direccion: 'Plaza del Sol 78, Madrid',
      kpis: {
        ocupacion: { actual: 92, objetivo: 85, tendencia: 'up' },
        noShow: { tasa: 3.1, objetivo: 5, casos: 8, tendencia: 'stable' },
        conversion: { tasa: 72, objetivo: 65, presupuestosEnviados: 52, presupuestosAceptados: 37, tendencia: 'up' },
        facturacion: { mes: 52340, objetivo: 45000, tendencia: 'up', variacionMesAnterior: 18.7 },
        pacientesNuevos: { mes: 28, objetivo: 20, tendencia: 'up' },
        satisfaccion: { puntuacion: 4.8, objetivo: 4.5, encuestasRealizadas: 89 }
      },
      estado: 'excelente'
    }
  ]);

  const filteredSedes = selectedSede === 'todas' ? sedes : sedes.filter(s => s.id === selectedSede);

  const getTendenciaIcon = (tendencia: 'up' | 'down' | 'stable') => {
    switch (tendencia) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="h-4 w-4 bg-yellow-400 rounded-full" />;
    }
  };

  const getTendenciaColor = (tendencia: 'up' | 'down' | 'stable') => {
    switch (tendencia) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-yellow-600';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'excelente': return 'bg-green-100 text-green-800 border-green-300';
      case 'bueno': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'regular': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critico': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const promedioGlobal = {
    ocupacion: Math.round(sedes.reduce((acc, s) => acc + s.kpis.ocupacion.actual, 0) / sedes.length),
    noShow: Math.round((sedes.reduce((acc, s) => acc + s.kpis.noShow.tasa, 0) / sedes.length) * 10) / 10,
    conversion: Math.round(sedes.reduce((acc, s) => acc + s.kpis.conversion.tasa, 0) / sedes.length),
    facturacion: sedes.reduce((acc, s) => acc + s.kpis.facturacion.mes, 0)
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
              <span className="text-purple-800 font-medium text-sm">HEADQUARTERS</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control - Overview</h1>
            <p className="text-gray-600">KPIs por sede: ocupación, no-show, conversión, facturación</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="trimestre">Este trimestre</option>
            <option value="ano">Este año</option>
          </select>
          <select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="todas">Todas las sedes</option>
            {sedes.map(sede => (
              <option key={sede.id} value={sede.id}>{sede.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Global KPIs Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Ocupación Global</p>
              <p className="text-2xl font-bold text-gray-900">{promedioGlobal.ocupacion}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">No-Show Global</p>
              <p className="text-2xl font-bold text-gray-900">{promedioGlobal.noShow}%</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Conversión Global</p>
              <p className="text-2xl font-bold text-gray-900">{promedioGlobal.conversion}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Facturación Total</p>
              <p className="text-2xl font-bold text-gray-900">€{promedioGlobal.facturacion.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sedes Cards */}
      <div className="space-y-6">
        {filteredSedes.map(sede => (
          <div key={sede.id} className={`bg-white rounded-xl shadow-lg border-2 ${getEstadoColor(sede.estado)}`}>
            {/* Sede Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-gray-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{sede.nombre}</h3>
                    <p className="text-gray-600">{sede.direccion}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(sede.estado)}`}>
                  {sede.estado.charAt(0).toUpperCase() + sede.estado.slice(1)}
                </div>
              </div>
            </div>

            {/* KPIs Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ocupación */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Ocupación</h4>
                    {getTendenciaIcon(sede.kpis.ocupacion.tendencia)}
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{sede.kpis.ocupacion.actual}%</span>
                    <span className="text-sm text-gray-500">obj: {sede.kpis.ocupacion.objetivo}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(sede.kpis.ocupacion.actual, 100)}%` }}
                    />
                  </div>
                </div>

                {/* No-Show */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">No-Show</h4>
                    {getTendenciaIcon(sede.kpis.noShow.tendencia)}
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{sede.kpis.noShow.tasa}%</span>
                    <span className="text-sm text-gray-500">({sede.kpis.noShow.casos} casos)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Objetivo: ≤{sede.kpis.noShow.objetivo}%</div>
                </div>

                {/* Conversión */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Conversión</h4>
                    {getTendenciaIcon(sede.kpis.conversion.tendencia)}
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{sede.kpis.conversion.tasa}%</span>
                    <span className="text-sm text-gray-500">obj: {sede.kpis.conversion.objetivo}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sede.kpis.conversion.presupuestosAceptados}/{sede.kpis.conversion.presupuestosEnviados} presupuestos
                  </div>
                </div>

                {/* Facturación */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Facturación</h4>
                    {getTendenciaIcon(sede.kpis.facturacion.tendencia)}
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900">€{sede.kpis.facturacion.mes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Obj: €{sede.kpis.facturacion.objetivo.toLocaleString()}</span>
                    <span className={`text-xs font-medium ${sede.kpis.facturacion.variacionMesAnterior > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sede.kpis.facturacion.variacionMesAnterior > 0 ? '+' : ''}{sede.kpis.facturacion.variacionMesAnterior}% vs mes anterior
                    </span>
                  </div>
                </div>

                {/* Pacientes Nuevos */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Pacientes Nuevos</h4>
                    {getTendenciaIcon(sede.kpis.pacientesNuevos.tendencia)}
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{sede.kpis.pacientesNuevos.mes}</span>
                    <span className="text-sm text-gray-500">obj: {sede.kpis.pacientesNuevos.objetivo}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Este mes</div>
                </div>

                {/* Satisfacción */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Satisfacción</h4>
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <div key={star} className={`w-3 h-3 ${star <= sede.kpis.satisfaccion.puntuacion ? 'bg-yellow-400' : 'bg-gray-300'} rounded-full mr-1`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{sede.kpis.satisfaccion.puntuacion}</span>
                    <span className="text-sm text-gray-500">/ 5.0</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sede.kpis.satisfaccion.encuestasRealizadas} encuestas realizadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas y Recomendaciones */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          Alertas y Recomendaciones
        </h3>
        <div className="space-y-3">
          {sedes.map(sede => {
            const alertas = [];
            if (sede.kpis.ocupacion.actual < sede.kpis.ocupacion.objetivo) {
              alertas.push(`${sede.nombre}: Ocupación por debajo del objetivo (${sede.kpis.ocupacion.actual}% vs ${sede.kpis.ocupacion.objetivo}%)`);
            }
            if (sede.kpis.noShow.tasa > sede.kpis.noShow.objetivo) {
              alertas.push(`${sede.nombre}: Alta tasa de no-show (${sede.kpis.noShow.tasa}% vs objetivo ≤${sede.kpis.noShow.objetivo}%)`);
            }
            if (sede.kpis.conversion.tasa < sede.kpis.conversion.objetivo) {
              alertas.push(`${sede.nombre}: Conversión por debajo del objetivo (${sede.kpis.conversion.tasa}% vs ${sede.kpis.conversion.objetivo}%)`);
            }
            return alertas.map((alerta, index) => (
              <div key={`${sede.id}-${index}`} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-yellow-800">{alerta}</span>
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
};

export default HQOverview;