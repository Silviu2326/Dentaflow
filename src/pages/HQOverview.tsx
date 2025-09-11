import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign, 
  AlertCircle, 
  MapPin, 
  Target, 
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Star,
  Building2,
  Activity,
  PieChart,
  LineChart,
  Award,
  Zap,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
                <div className="relative p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-purple-800 font-semibold text-sm tracking-wider">HEADQUARTERS DASHBOARD</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Panel de Control Ejecutivo
                </h1>
                <p className="text-gray-600 mt-1">Análisis integral de KPIs por sede • Ocupación • No-show • Conversión • Facturación</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                <RefreshCw className="h-4 w-4" />
                <span className="font-medium">Actualizar</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl hover:bg-white/90 transition-all duration-200">
                <Download className="h-4 w-4" />
                <span className="font-medium">Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Enhanced Filters */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Filter className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-800">Filtros de Análisis</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="pl-10 pr-8 py-3 border-0 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:bg-white/90 text-sm transition-all duration-200 appearance-none cursor-pointer min-w-[160px]"
                  >
                    <option value="semana">📅 Esta semana</option>
                    <option value="mes">📆 Este mes</option>
                    <option value="trimestre">🗓️ Este trimestre</option>
                    <option value="ano">📊 Este año</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedSede}
                    onChange={(e) => setSelectedSede(e.target.value)}
                    className="pl-10 pr-8 py-3 border-0 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:bg-white/90 text-sm transition-all duration-200 appearance-none cursor-pointer min-w-[180px]"
                  >
                    <option value="todas">🏢 Todas las sedes</option>
                    {sedes.map(sede => (
                      <option key={sede.id} value={sede.id}>📍 {sede.nombre}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Search className="h-4 w-4" />
                  <span className="font-medium">Buscar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Global KPIs Summary */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mr-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">KPIs Globales de la Red</h2>
              <p className="text-gray-600">Vista consolidada del rendimiento de todas las sedes</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">META: 85%</div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">+2.3%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ocupación Global</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{promedioGlobal.ocupacion}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{width: `${promedioGlobal.ocupacion}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">META: ≤ 5%</div>
                    <div className="flex items-center text-green-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">-0.8%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">No-Show Global</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{promedioGlobal.noShow}%</p>
                  <div className="text-xs text-gray-500">
                    {sedes.reduce((acc, s) => acc + s.kpis.noShow.casos, 0)} casos en total
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">META: 65%</div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">+4.2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Conversión Global</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{promedioGlobal.conversion}%</p>
                  <div className="text-xs text-gray-500">
                    {sedes.reduce((acc, s) => acc + s.kpis.conversion.presupuestosAceptados, 0)}/{sedes.reduce((acc, s) => acc + s.kpis.conversion.presupuestosEnviados, 0)} presupuestos
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">META: €120K</div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">+8.1%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Facturación Total</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">€{promedioGlobal.facturacion.toLocaleString()}</p>
                  <div className="text-xs text-gray-500">
                    Promedio por sede: €{Math.round(promedioGlobal.facturacion / sedes.length).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes Nuevos (Total)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sedes.reduce((acc, s) => acc + s.kpis.pacientesNuevos.mes, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Este mes</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfacción Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(sedes.reduce((acc, s) => acc + s.kpis.satisfaccion.puntuacion, 0) / sedes.length).toFixed(1)}
                  </p>
                  <div className="flex items-center mt-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`h-3 w-3 mr-0.5 ${
                        star <= Math.round(sedes.reduce((acc, s) => acc + s.kpis.satisfaccion.puntuacion, 0) / sedes.length) 
                          ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`} />
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sedes Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{sedes.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {sedes.filter(s => s.estado === 'excelente').length} excelentes • {sedes.filter(s => s.estado === 'regular').length} regulares
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sedes Cards */}
        <div className="space-y-8">
          {filteredSedes.map(sede => (
            <div key={sede.id} className="group relative">
              <div className={`absolute inset-0 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity ${
                sede.estado === 'excelente' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
                sede.estado === 'bueno' ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' :
                sede.estado === 'regular' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' :
                'bg-gradient-to-r from-red-500/20 to-pink-500/20'
              }`}></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover:bg-white/90 transition-all duration-200">
                {/* Enhanced Sede Header */}
                <div className={`p-8 border-b border-gray-200/50 bg-gradient-to-r rounded-t-3xl ${
                  sede.estado === 'excelente' ? 'from-green-50/80 to-emerald-50/80' :
                  sede.estado === 'bueno' ? 'from-blue-50/80 to-cyan-50/80' :
                  sede.estado === 'regular' ? 'from-yellow-50/80 to-orange-50/80' :
                  'from-red-50/80 to-pink-50/80'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-2xl blur opacity-30 ${
                          sede.estado === 'excelente' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          sede.estado === 'bueno' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          sede.estado === 'regular' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}></div>
                        <div className={`relative p-4 rounded-2xl ${
                          sede.estado === 'excelente' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          sede.estado === 'bueno' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          sede.estado === 'regular' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}>
                          <MapPin className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{sede.nombre}</h3>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {sede.direccion}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 backdrop-blur-sm ${
                        sede.estado === 'excelente' ? 'bg-green-100/80 text-green-800 border-green-300/50' :
                        sede.estado === 'bueno' ? 'bg-blue-100/80 text-blue-800 border-blue-300/50' :
                        sede.estado === 'regular' ? 'bg-yellow-100/80 text-yellow-800 border-yellow-300/50' :
                        'bg-red-100/80 text-red-800 border-red-300/50'
                      }`}>
                        {sede.estado === 'excelente' && '🏆'} 
                        {sede.estado === 'bueno' && '🚀'} 
                        {sede.estado === 'regular' && '⚠️'} 
                        {sede.estado === 'critico' && '🚨'} 
                        {sede.estado.charAt(0).toUpperCase() + sede.estado.slice(1)}
                      </div>
                      
                      <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                      
                      <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
                        <Settings className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced KPIs Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Ocupación */}
                    <div className="relative group/kpi">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur opacity-0 group-hover/kpi:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700">Ocupación</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTendenciaIcon(sede.kpis.ocupacion.tendencia)}
                            <span className={`text-xs font-medium ${getTendenciaColor(sede.kpis.ocupacion.tendencia)}`}>
                              {sede.kpis.ocupacion.actual >= sede.kpis.ocupacion.objetivo ? '+' : ''}
                              {sede.kpis.ocupacion.actual - sede.kpis.ocupacion.objetivo}%
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-end space-x-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">{sede.kpis.ocupacion.actual}%</span>
                            <span className="text-sm text-gray-500 pb-1">meta: {sede.kpis.ocupacion.objetivo}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                sede.kpis.ocupacion.actual >= sede.kpis.ocupacion.objetivo
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              }`}
                              style={{ width: `${Math.min(sede.kpis.ocupacion.actual, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sede.kpis.ocupacion.actual >= sede.kpis.ocupacion.objetivo ? '✅ Meta alcanzada' : '📊 Por debajo de meta'}
                        </div>
                      </div>
                    </div>

                    {/* No-Show */}
                    <div className="relative group/kpi">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover/kpi:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700">No-Show</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTendenciaIcon(sede.kpis.noShow.tendencia)}
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              sede.kpis.noShow.tasa <= sede.kpis.noShow.objetivo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {sede.kpis.noShow.tasa <= sede.kpis.noShow.objetivo ? 'OK' : 'ALERTA'}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-end space-x-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">{sede.kpis.noShow.tasa}%</span>
                            <span className="text-sm text-gray-500 pb-1">({sede.kpis.noShow.casos} casos)</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Objetivo: ≤{sede.kpis.noShow.objetivo}% • {sede.kpis.noShow.tasa <= sede.kpis.noShow.objetivo ? '✅ Cumplido' : '⚠️ Excedido'}
                        </div>
                      </div>
                    </div>

                    {/* Conversión */}
                    <div className="relative group/kpi">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur opacity-0 group-hover/kpi:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Target className="h-4 w-4 text-green-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700">Conversión</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTendenciaIcon(sede.kpis.conversion.tendencia)}
                            <span className={`text-xs font-medium ${getTendenciaColor(sede.kpis.conversion.tendencia)}`}>
                              {sede.kpis.conversion.tasa >= sede.kpis.conversion.objetivo ? '+' : ''}
                              {sede.kpis.conversion.tasa - sede.kpis.conversion.objetivo}%
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-end space-x-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">{sede.kpis.conversion.tasa}%</span>
                            <span className="text-sm text-gray-500 pb-1">meta: {sede.kpis.conversion.objetivo}%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg">
                            <span>Aceptados: {sede.kpis.conversion.presupuestosAceptados}</span>
                            <span>Enviados: {sede.kpis.conversion.presupuestosEnviados}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sede.kpis.conversion.tasa >= sede.kpis.conversion.objetivo ? '✅ Meta superada' : '📊 Mejorar conversión'}
                        </div>
                      </div>
                    </div>

                    {/* Facturación */}
                    <div className="relative group/kpi">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur opacity-0 group-hover/kpi:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <DollarSign className="h-4 w-4 text-yellow-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700">Facturación</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTendenciaIcon(sede.kpis.facturacion.tendencia)}
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              sede.kpis.facturacion.variacionMesAnterior > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {sede.kpis.facturacion.variacionMesAnterior > 0 ? '+' : ''}{sede.kpis.facturacion.variacionMesAnterior}%
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="mb-2">
                            <span className="text-3xl font-bold text-gray-900">€{sede.kpis.facturacion.mes.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg">
                            <span>Meta: €{sede.kpis.facturacion.objetivo.toLocaleString()}</span>
                            <span className={sede.kpis.facturacion.mes >= sede.kpis.facturacion.objetivo ? 'text-green-600' : 'text-red-600'}>
                              {sede.kpis.facturacion.mes >= sede.kpis.facturacion.objetivo ? '✅' : '❌'} 
                              {Math.round(((sede.kpis.facturacion.mes - sede.kpis.facturacion.objetivo) / sede.kpis.facturacion.objetivo) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          vs mes anterior: {sede.kpis.facturacion.variacionMesAnterior > 0 ? '📈 Crecimiento' : '📉 Decrecimiento'}
                        </div>
                      </div>
                    </div>

                    {/* Pacientes Nuevos */}
                    <div className="relative group/kpi">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover/kpi:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700">Pacientes Nuevos</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTendenciaIcon(sede.kpis.pacientesNuevos.tendencia)}
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              sede.kpis.pacientesNuevos.mes >= sede.kpis.pacientesNuevos.objetivo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {((sede.kpis.pacientesNuevos.mes / sede.kpis.pacientesNuevos.objetivo) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-end space-x-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">{sede.kpis.pacientesNuevos.mes}</span>
                            <span className="text-sm text-gray-500 pb-1">meta: {sede.kpis.pacientesNuevos.objetivo}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                sede.kpis.pacientesNuevos.mes >= sede.kpis.pacientesNuevos.objetivo
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
                              }`}
                              style={{ width: `${Math.min((sede.kpis.pacientesNuevos.mes / sede.kpis.pacientesNuevos.objetivo) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Este mes • {sede.kpis.pacientesNuevos.mes >= sede.kpis.pacientesNuevos.objetivo ? '✅ Meta alcanzada' : '📊 Incrementar captación'}
                        </div>
                      </div>
                    </div>

                    {/* Satisfacción */}
                    <div className="relative group/kpi">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl blur opacity-0 group-hover/kpi:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-pink-100 rounded-lg">
                              <Star className="h-4 w-4 text-pink-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700">Satisfacción</h4>
                          </div>
                          <div className="flex space-x-0.5">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={`h-3 w-3 ${
                                star <= sede.kpis.satisfaccion.puntuacion 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-end space-x-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">{sede.kpis.satisfaccion.puntuacion}</span>
                            <span className="text-sm text-gray-500 pb-1">/ 5.0</span>
                          </div>
                          <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg">
                            <span>Encuestas: {sede.kpis.satisfaccion.encuestasRealizadas}</span>
                            <span className={`font-medium ${
                              sede.kpis.satisfaccion.puntuacion >= sede.kpis.satisfaccion.objetivo
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }`}>
                              Meta: {sede.kpis.satisfaccion.objetivo}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sede.kpis.satisfaccion.puntuacion >= sede.kpis.satisfaccion.objetivo ? '✅ Excelente servicio' : '📊 Mejorar calidad'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Performance Chart Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Chart */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tendencias de Rendimiento</h3>
                  <p className="text-sm text-gray-600">Evolución de KPIs principales</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Ocupación Global</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{promedioGlobal.ocupacion}%</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Conversión Media</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{promedioGlobal.conversion}%</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">No-Show Promedio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{promedioGlobal.noShow}%</span>
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Distribution */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Distribución por Estado</h3>
                  <p className="text-sm text-gray-600">Clasificación de sedes por rendimiento</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Excelente</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{sedes.filter(s => s.estado === 'excelente').length}</span>
                    <p className="text-xs text-gray-500">sedes</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Bueno</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{sedes.filter(s => s.estado === 'bueno').length}</span>
                    <p className="text-xs text-gray-500">sedes</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Regular</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{sedes.filter(s => s.estado === 'regular').length}</span>
                    <p className="text-xs text-gray-500">sedes</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Crítico</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{sedes.filter(s => s.estado === 'critico').length}</span>
                    <p className="text-xs text-gray-500">sedes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Alertas y Recomendaciones */}
        <div className="mt-12 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Alertas y Recomendaciones Inteligentes</h3>
                <p className="text-gray-600">Análisis automático de áreas de mejora</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sedes.map(sede => {
                const alertas = [];
                const recomendaciones = [];
                
                if (sede.kpis.ocupacion.actual < sede.kpis.ocupacion.objetivo) {
                  alertas.push({
                    tipo: 'ocupacion',
                    severidad: 'media',
                    mensaje: `Ocupación por debajo del objetivo (${sede.kpis.ocupacion.actual}% vs ${sede.kpis.ocupacion.objetivo}%)`,
                    recomendacion: 'Revisar estrategias de captación y optimizar horarios'
                  });
                }
                
                if (sede.kpis.noShow.tasa > sede.kpis.noShow.objetivo) {
                  alertas.push({
                    tipo: 'noshow',
                    severidad: 'alta',
                    mensaje: `Alta tasa de no-show (${sede.kpis.noShow.tasa}% vs objetivo ≤${sede.kpis.noShow.objetivo}%)`,
                    recomendacion: 'Implementar recordatorios automáticos y políticas de confirmación'
                  });
                }
                
                if (sede.kpis.conversion.tasa < sede.kpis.conversion.objetivo) {
                  alertas.push({
                    tipo: 'conversion',
                    severidad: 'media',
                    mensaje: `Conversión por debajo del objetivo (${sede.kpis.conversion.tasa}% vs ${sede.kpis.conversion.objetivo}%)`,
                    recomendacion: 'Mejorar seguimiento de presupuestos y formación comercial'
                  });
                }
                
                if (sede.kpis.satisfaccion.puntuacion < sede.kpis.satisfaccion.objetivo) {
                  alertas.push({
                    tipo: 'satisfaccion',
                    severidad: 'alta',
                    mensaje: `Satisfacción por debajo del objetivo (${sede.kpis.satisfaccion.puntuacion} vs ${sede.kpis.satisfaccion.objetivo})`,
                    recomendacion: 'Revisar procesos de atención al cliente y formación del personal'
                  });
                }
                
                return alertas.length > 0 && (
                  <div key={sede.id} className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">{sede.nombre}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alertas.some(a => a.severidad === 'alta') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alertas.length} alerta{alertas.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {alertas.map((alerta, index) => (
                      <div key={index} className={`p-4 rounded-xl border-l-4 ${
                        alerta.severidad === 'alta' 
                          ? 'bg-red-50/80 border-red-500' 
                          : alerta.severidad === 'media'
                          ? 'bg-yellow-50/80 border-yellow-500'
                          : 'bg-blue-50/80 border-blue-500'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded-lg ${
                            alerta.severidad === 'alta' ? 'bg-red-100' :
                            alerta.severidad === 'media' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            <AlertCircle className={`h-4 w-4 ${
                              alerta.severidad === 'alta' ? 'text-red-600' :
                              alerta.severidad === 'media' ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              alerta.severidad === 'alta' ? 'text-red-800' :
                              alerta.severidad === 'media' ? 'text-yellow-800' : 'text-blue-800'
                            }`}>
                              {alerta.mensaje}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              💡 Recomendación: {alerta.recomendacion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            
            {sedes.every(sede => 
              sede.kpis.ocupacion.actual >= sede.kpis.ocupacion.objetivo &&
              sede.kpis.noShow.tasa <= sede.kpis.noShow.objetivo &&
              sede.kpis.conversion.tasa >= sede.kpis.conversion.objetivo &&
              sede.kpis.satisfaccion.puntuacion >= sede.kpis.satisfaccion.objetivo
            ) && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-xl">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">✨ ¡Excelente! Todas las sedes están cumpliendo sus objetivos</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Items */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Acciones Recomendadas</h4>
                <p className="text-sm text-gray-600">Próximos pasos para optimizar el rendimiento</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Ver Plan de Acción</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HQOverview;