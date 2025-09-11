import React, { useState, useContext } from 'react';
import { Plus, Search, Edit, Eye, DollarSign, Target, TrendingUp, Users, Calendar, Filter, Download, RefreshCw, Award, BarChart3, Settings } from 'lucide-react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import NewCommissionRuleModal from '../components/NewCommissionRuleModal';

interface ReglaComision {
  id: string;
  nombre: string;
  tipo: 'tratamiento' | 'objetivo' | 'mixto';
  activa: boolean;
  configuracion: {
    tratamientos?: string[];
    porcentaje?: number;
    montoFijo?: number;
    objetivoMensual?: number;
    bonificacionExtra?: number;
  };
  aplicaA: string[];
  fechaInicio: string;
  fechaFin?: string;
}

interface Liquidacion {
  id: string;
  profesional: string;
  periodo: string;
  estado: 'pendiente' | 'calculada' | 'pagada';
  resumen: {
    baseComisiones: number;
    bonificaciones: number;
    descuentos: number;
    total: number;
  };
  detalle: {
    tratamiento: string;
    cantidad: number;
    valorUnitario: number;
    comision: number;
  }[];
  fechaCalculo?: string;
  fechaPago?: string;
}

const HQComisiones: React.FC = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState<'reglas' | 'liquidaciones'>('reglas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfesional, setSelectedProfesional] = useState('todos');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [dateRange, setDateRange] = useState('mes-actual');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('total');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLiquidaciones, setSelectedLiquidaciones] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [reglas] = useState<ReglaComision[]>([
    {
      id: '1',
      nombre: 'Comisión Implantes',
      tipo: 'tratamiento',
      activa: true,
      configuracion: {
        tratamientos: ['Implante dental', 'Corona sobre implante'],
        porcentaje: 15,
      },
      aplicaA: ['Dr. García', 'Dra. Martín'],
      fechaInicio: '2024-01-01'
    },
    {
      id: '2',
      nombre: 'Objetivo Mensual Ortodoncia',
      tipo: 'objetivo',
      activa: true,
      configuracion: {
        objetivoMensual: 8000,
        bonificacionExtra: 500,
      },
      aplicaA: ['Dra. Martín'],
      fechaInicio: '2024-01-01'
    },
    {
      id: '3',
      nombre: 'Comisión Tratamientos Generales',
      tipo: 'tratamiento',
      activa: true,
      configuracion: {
        tratamientos: ['Limpieza', 'Empaste', 'Endodoncia'],
        porcentaje: 8,
      },
      aplicaA: ['Dr. García', 'Dr. López'],
      fechaInicio: '2024-01-01'
    },
    {
      id: '4',
      nombre: 'Bonificación Pacientes Nuevos',
      tipo: 'objetivo',
      activa: true,
      configuracion: {
        objetivoMensual: 15,
        montoFijo: 50,
      },
      aplicaA: ['Dr. García', 'Dra. Martín', 'Dr. López'],
      fechaInicio: '2024-01-01'
    }
  ]);

  const [liquidaciones] = useState<Liquidacion[]>([
    {
      id: '1',
      profesional: 'Dr. García',
      periodo: '2024-01',
      estado: 'pagada',
      resumen: {
        baseComisiones: 2850,
        bonificaciones: 300,
        descuentos: 0,
        total: 3150
      },
      detalle: [
        { tratamiento: 'Implante dental', cantidad: 3, valorUnitario: 800, comision: 120 },
        { tratamiento: 'Limpieza', cantidad: 25, valorUnitario: 50, comision: 4 },
        { tratamiento: 'Empaste', cantidad: 18, valorUnitario: 80, comision: 6.4 }
      ],
      fechaCalculo: '2024-02-01',
      fechaPago: '2024-02-05'
    },
    {
      id: '2',
      profesional: 'Dra. Martín',
      periodo: '2024-01',
      estado: 'calculada',
      resumen: {
        baseComisiones: 3890,
        bonificaciones: 500,
        descuentos: 0,
        total: 4390
      },
      detalle: [
        { tratamiento: 'Ortodoncia', cantidad: 8, valorUnitario: 1200, comision: 144 },
        { tratamiento: 'Implante dental', cantidad: 2, valorUnitario: 800, comision: 120 }
      ],
      fechaCalculo: '2024-02-01'
    },
    {
      id: '3',
      profesional: 'Dr. López',
      periodo: '2024-01',
      estado: 'pendiente',
      resumen: {
        baseComisiones: 1650,
        bonificaciones: 150,
        descuentos: 0,
        total: 1800
      },
      detalle: [
        { tratamiento: 'Limpieza', cantidad: 32, valorUnitario: 50, comision: 4 },
        { tratamiento: 'Empaste', cantidad: 15, valorUnitario: 80, comision: 6.4 }
      ]
    }
  ]);

  const profesionales = ['todos', ...Array.from(new Set(liquidaciones.map(l => l.profesional)))];

  const filteredReglas = reglas.filter(regla => 
    regla.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLiquidaciones = liquidaciones.filter(liquidacion => {
    const matchesProfesional = selectedProfesional === 'todos' || liquidacion.profesional === selectedProfesional;
    const matchesSearch = liquidacion.profesional.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liquidacion.periodo.includes(searchTerm);
    return matchesProfesional && matchesSearch;
  });

  const getTipoColor = (tipo: string) => {
    const baseClasses = isDarkMode ? {
      tratamiento: 'bg-blue-900/50 text-blue-300 border-blue-700',
      objetivo: 'bg-green-900/50 text-green-300 border-green-700',
      mixto: 'bg-purple-900/50 text-purple-300 border-purple-700'
    } : {
      tratamiento: 'bg-blue-100 text-blue-800 border-blue-200',
      objetivo: 'bg-green-100 text-green-800 border-green-200',
      mixto: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return baseClasses[tipo as keyof typeof baseClasses] || (isDarkMode ? 'bg-gray-800/50 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200');
  };

  const getEstadoColor = (estado: string) => {
    const baseClasses = isDarkMode ? {
      pendiente: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
      calculada: 'bg-blue-900/50 text-blue-300 border-blue-700',
      pagada: 'bg-green-900/50 text-green-300 border-green-700'
    } : {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      calculada: 'bg-blue-100 text-blue-800 border-blue-200',
      pagada: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return baseClasses[estado as keyof typeof baseClasses] || (isDarkMode ? 'bg-gray-800/50 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200');
  };

  const totalComisionesMes = liquidaciones.reduce((acc, l) => acc + l.resumen.total, 0);

  // Sort and filter liquidaciones
  const sortedLiquidaciones = [...filteredLiquidaciones].sort((a, b) => {
    const aValue = sortBy === 'total' ? a.resumen.total : 
                   sortBy === 'profesional' ? a.profesional :
                   sortBy === 'periodo' ? a.periodo : a.estado;
    const bValue = sortBy === 'total' ? b.resumen.total : 
                   sortBy === 'profesional' ? b.profesional :
                   sortBy === 'periodo' ? b.periodo : b.estado;
    
    if (sortBy === 'total') {
      return sortOrder === 'desc' ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number);
    }
    
    const comparison = (aValue as string).localeCompare(bValue as string);
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Bulk actions handlers
  const handleSelectLiquidacion = (id: string) => {
    setSelectedLiquidaciones(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLiquidaciones.length === sortedLiquidaciones.length) {
      setSelectedLiquidaciones([]);
    } else {
      setSelectedLiquidaciones(sortedLiquidaciones.map(l => l.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on liquidaciones:`, selectedLiquidaciones);
    setSelectedLiquidaciones([]);
    setShowBulkActions(false);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting data in ${format} format`);
  };

  const handleCreateRule = (ruleData: any) => {
    console.log('Creating commission rule:', ruleData);
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/20' : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-700/50 shadow-xl shadow-purple-900/20' 
            : 'bg-gradient-to-r from-white/80 to-purple-50/80 border-purple-200/50 shadow-xl shadow-purple-200/20'
        }`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center mb-3">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
                }`}></div>
                <span className={`font-bold text-sm tracking-wider ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-800'
                }`}>HEADQUARTERS</span>
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Gestión de Comisiones
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                Reglas por tratamiento/objetivo y liquidaciones
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg shadow-gray-900/30'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg shadow-gray-200/30'
              }`}>
                <BarChart3 className="h-4 w-4" />
                <span>Reportes</span>
              </button>
              <button 
                onClick={() => setShowNewRuleModal(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-200/30'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Regla</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`mt-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${  
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700/50' 
            : 'bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-200/50'
        }`}>
          <nav className="p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('reglas')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                  activeTab === 'reglas'
                    ? isDarkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200/30'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Target className="h-5 w-5" />
                <span>Reglas de Comisión</span>
              </button>
              <button
                onClick={() => setActiveTab('liquidaciones')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                  activeTab === 'liquidaciones'
                    ? isDarkMode 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-900/30'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200/30'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <span>Liquidaciones</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-700/50 shadow-xl shadow-purple-900/20'
            : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50 shadow-xl shadow-purple-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-purple-800/50' : 'bg-purple-100'
            }`}>
              <Target className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                Reglas Activas
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {reglas.filter(r => r.activa).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-700/50 shadow-xl shadow-green-900/20'
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-xl shadow-green-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
            }`}>
              <DollarSign className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Total Comisiones
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                €{totalComisionesMes.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-700/50 shadow-xl shadow-blue-900/20'
            : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 shadow-xl shadow-blue-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100'
            }`}>
              <Users className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Profesionales
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {profesionales.length - 1}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-700/50 shadow-xl shadow-yellow-900/20'
            : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50 shadow-xl shadow-yellow-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100'
            }`}>
              <Calendar className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Pendientes
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {liquidaciones.filter(l => l.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700/50' 
          : 'bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex items-center space-x-2">
            <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filtros:
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder={activeTab === 'reglas' ? 'Buscar reglas...' : 'Buscar liquidaciones...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 w-full ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            {activeTab === 'liquidaciones' && (
              <>
                <select
                  value={selectedProfesional}
                  onChange={(e) => setSelectedProfesional(e.target.value)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {profesionales.map(prof => (
                    <option key={prof} value={prof}>
                      {prof === 'todos' ? 'Todos los profesionales' : prof}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="calculada">Calculada</option>
                  <option value="pagada">Pagada</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="total">Ordenar por Total</option>
                  <option value="profesional">Ordenar por Profesional</option>
                  <option value="periodo">Ordenar por Período</option>
                  <option value="estado">Ordenar por Estado</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {activeTab === 'liquidaciones' && selectedLiquidaciones.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                    isDarkMode 
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <span>Acciones ({selectedLiquidaciones.length})</span>
                </button>
                {showBulkActions && (
                  <div className={`absolute top-full mt-2 right-0 w-48 rounded-xl border shadow-xl z-10 ${
                    isDarkMode 
                      ? 'bg-gray-800/95 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={() => handleBulkAction('calcular')}
                      className={`w-full px-4 py-3 text-left hover:bg-opacity-50 ${
                        isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      Calcular Comisiones
                    </button>
                    <button
                      onClick={() => handleBulkAction('pagar')}
                      className={`w-full px-4 py-3 text-left hover:bg-opacity-50 ${
                        isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      Procesar Pago
                    </button>
                    <button
                      onClick={() => handleBulkAction('exportar')}
                      className={`w-full px-4 py-3 text-left hover:bg-opacity-50 ${
                        isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      Exportar Selección
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="relative group">
              <button className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <div className={`absolute top-full mt-2 right-0 w-40 rounded-xl border shadow-xl z-10 opacity-0 group-hover:opacity-100 transition-opacity ${
                isDarkMode 
                  ? 'bg-gray-800/95 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <button
                  onClick={() => handleExport('excel')}
                  className={`w-full px-4 py-3 text-left hover:bg-opacity-50 ${
                    isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className={`w-full px-4 py-3 text-left hover:bg-opacity-50 ${
                    isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className={`w-full px-4 py-3 text-left hover:bg-opacity-50 ${
                    isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  CSV
                </button>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
              isDarkMode 
                ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}>
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'reglas' ? (
        <div className="space-y-6">
          {filteredReglas.map(regla => (
            <div key={regla.id} className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 p-6 hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 shadow-xl'
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 shadow-xl'
            }`}>
              <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {regla.nombre}
                  </h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-xl border ${getTipoColor(regla.tipo)}`}>
                    {regla.tipo}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-xl border ${
                    regla.activa 
                      ? (isDarkMode ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200')
                      : (isDarkMode ? 'bg-red-900/50 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-200')
                  }`}>
                    {regla.activa ? '✓ Activa' : '✗ Inactiva'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                      : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                  }`}>
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                      : 'text-green-600 hover:text-green-500 hover:bg-green-50'
                  }`}>
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/20'
                      : 'text-gray-600 hover:text-gray-500 hover:bg-gray-100'
                  }`}>
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <h4 className={`text-base font-bold mb-4 flex items-center ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    <Award className="h-4 w-4 mr-2" />
                    Configuración
                  </h4>
                  <div className="space-y-3">
                    {regla.configuracion.tratamientos && (
                      <div>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Tratamientos:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {regla.configuracion.tratamientos.map((tratamiento, idx) => (
                            <span key={idx} className={`text-xs px-2 py-1 rounded-lg ${
                              isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {tratamiento}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {regla.configuracion.porcentaje && (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Comisión:
                        </span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                          isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                        }`}>
                          {regla.configuracion.porcentaje}%
                        </span>
                      </div>
                    )}
                    {regla.configuracion.montoFijo && (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Monto fijo:
                        </span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                          isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                        }`}>
                          €{regla.configuracion.montoFijo}
                        </span>
                      </div>
                    )}
                    {regla.configuracion.objetivoMensual && (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Objetivo mensual:
                        </span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          €{regla.configuracion.objetivoMensual.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <h4 className={`text-base font-bold mb-4 flex items-center ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    <Users className="h-4 w-4 mr-2" />
                    Aplica a
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {regla.aplicaA.map((profesional, index) => (
                      <span key={index} className={`px-3 py-1 text-sm font-semibold rounded-xl ${
                        isDarkMode ? 'bg-gray-600/50 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {profesional}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <h4 className={`text-base font-bold mb-4 flex items-center ${
                    isDarkMode ? 'text-green-300' : 'text-green-600'
                  }`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Vigencia
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Desde:
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(regla.fechaInicio).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {regla.fechaFin ? (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Hasta:
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(regla.fechaFin).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    ) : (
                      <div className={`text-sm font-semibold px-2 py-1 rounded-lg text-center ${
                        isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                      }`}>
                        ∞ Sin fecha de fin
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 shadow-xl overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50'
            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50'
        }`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-700/50 to-gray-800/50'
                  : 'bg-gradient-to-r from-gray-50 to-gray-100'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedLiquidaciones.length === sortedLiquidaciones.length && sortedLiquidaciones.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Profesional
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Período
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Estado
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Base Comisiones
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Bonificaciones
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Total
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Fechas
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDarkMode ? 'divide-gray-700/50' : 'divide-gray-200'
              }`}>
                {sortedLiquidaciones.map((liquidacion, index) => (
                  <tr key={liquidacion.id} className={`transition-all duration-300 hover:scale-[1.01] ${
                    isDarkMode 
                      ? 'hover:bg-gray-700/30' 
                      : 'hover:bg-blue-50/50'
                  } ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800/20' : 'bg-gray-50/50') : ''} ${
                    selectedLiquidaciones.includes(liquidacion.id) ? (isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50') : ''
                  }`}>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={selectedLiquidaciones.includes(liquidacion.id)}
                        onChange={() => handleSelectLiquidacion(liquidacion.id)}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className={`text-sm font-bold flex items-center ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          liquidacion.estado === 'pagada' 
                            ? 'bg-green-500' 
                            : liquidacion.estado === 'calculada'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`}></div>
                        {liquidacion.profesional}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {liquidacion.periodo}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl border ${getEstadoColor(liquidacion.estado)}`}>
                        {liquidacion.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className={`text-sm font-bold ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        €{liquidacion.resumen.baseComisiones.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className={`text-sm font-bold ${
                        isDarkMode ? 'text-green-300' : 'text-green-600'
                      }`}>
                        €{liquidacion.resumen.bonificaciones.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className={`text-lg font-bold px-3 py-1 rounded-xl ${
                        isDarkMode 
                          ? 'text-purple-300 bg-purple-900/30'
                          : 'text-purple-700 bg-purple-100'
                      }`}>
                        €{liquidacion.resumen.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="space-y-1">
                        {liquidacion.fechaCalculo && (
                          <div className={`text-xs px-2 py-1 rounded-lg ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            Calc: {new Date(liquidacion.fechaCalculo).toLocaleDateString('es-ES')}
                          </div>
                        )}
                        {liquidacion.fechaPago && (
                          <div className={`text-xs px-2 py-1 rounded-lg ${
                            isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                          }`}>
                            Pago: {new Date(liquidacion.fechaPago).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                          isDarkMode 
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                            : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                        }`}>
                          <Eye className="h-4 w-4" />
                        </button>
                        {liquidacion.estado === 'calculada' && (
                          <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                            isDarkMode 
                              ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                              : 'text-green-600 hover:text-green-500 hover:bg-green-50'
                          }`}>
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Section for Liquidaciones */}
      {activeTab === 'liquidaciones' && (
        <div className={`mt-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 shadow-xl p-8 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50'
            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
            }`}>
              <BarChart3 className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Resumen del Período
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700/50'
                : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  €{totalComisionesMes.toLocaleString()}
                </div>
                <div className={`text-sm font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Total Comisiones
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-700/50'
                : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-green-300' : 'text-green-700'
                }`}>
                  {liquidaciones.filter(l => l.estado === 'pagada').length}
                </div>
                <div className={`text-sm font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Pagadas
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-700/50'
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  {liquidaciones.filter(l => l.estado === 'calculada').length}
                </div>
                <div className={`text-sm font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Calculadas
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border border-yellow-700/50'
                : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                }`}>
                  {liquidaciones.filter(l => l.estado === 'pendiente').length}
                </div>
                <div className={`text-sm font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Pendientes
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Commission Rule Modal */}
      <NewCommissionRuleModal
        isOpen={showNewRuleModal}
        onClose={() => setShowNewRuleModal(false)}
        onSubmit={handleCreateRule}
      />
    </div>
  );
};

export default HQComisiones;