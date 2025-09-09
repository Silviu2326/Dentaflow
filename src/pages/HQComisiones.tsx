import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, DollarSign, Target, TrendingUp, Users, Calendar } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'reglas' | 'liquidaciones'>('reglas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfesional, setSelectedProfesional] = useState('todos');

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
    switch (tipo) {
      case 'tratamiento': return 'bg-blue-100 text-blue-800';
      case 'objetivo': return 'bg-green-100 text-green-800';
      case 'mixto': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'calculada': return 'bg-blue-100 text-blue-800';
      case 'pagada': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalComisionesMes = liquidaciones.reduce((acc, l) => acc + l.resumen.total, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Comisiones</h1>
            <p className="text-gray-600">Reglas por tratamiento/objetivo y liquidaciones</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Regla
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reglas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reglas'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reglas de Comisión
            </button>
            <button
              onClick={() => setActiveTab('liquidaciones')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'liquidaciones'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Liquidaciones
            </button>
          </nav>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reglas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{reglas.filter(r => r.activa).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Comisiones</p>
              <p className="text-2xl font-bold text-gray-900">€{totalComisionesMes.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profesionales</p>
              <p className="text-2xl font-bold text-gray-900">{profesionales.length - 1}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {liquidaciones.filter(l => l.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={activeTab === 'reglas' ? 'Buscar reglas...' : 'Buscar liquidaciones...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-purple-300 rounded-lg w-full focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
        </div>
        {activeTab === 'liquidaciones' && (
          <select
            value={selectedProfesional}
            onChange={(e) => setSelectedProfesional(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            {profesionales.map(prof => (
              <option key={prof} value={prof}>
                {prof === 'todos' ? 'Todos los profesionales' : prof}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'reglas' ? (
        <div className="space-y-4">
          {filteredReglas.map(regla => (
            <div key={regla.id} className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">{regla.nombre}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(regla.tipo)}`}>
                      {regla.tipo}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      regla.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {regla.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Configuración</h4>
                  {regla.configuracion.tratamientos && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-700">Tratamientos: </span>
                      <span className="text-sm font-medium">{regla.configuracion.tratamientos.join(', ')}</span>
                    </div>
                  )}
                  {regla.configuracion.porcentaje && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-700">Comisión: </span>
                      <span className="text-sm font-medium text-green-600">{regla.configuracion.porcentaje}%</span>
                    </div>
                  )}
                  {regla.configuracion.montoFijo && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-700">Monto fijo: </span>
                      <span className="text-sm font-medium text-green-600">€{regla.configuracion.montoFijo}</span>
                    </div>
                  )}
                  {regla.configuracion.objetivoMensual && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-700">Objetivo mensual: </span>
                      <span className="text-sm font-medium text-blue-600">€{regla.configuracion.objetivoMensual.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Aplica a</h4>
                  <div className="flex flex-wrap gap-2">
                    {regla.aplicaA.map((profesional, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {profesional}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Vigencia</h4>
                  <div className="text-sm text-gray-700">
                    <div>Desde: {new Date(regla.fechaInicio).toLocaleDateString('es-ES')}</div>
                    {regla.fechaFin && <div>Hasta: {new Date(regla.fechaFin).toLocaleDateString('es-ES')}</div>}
                    {!regla.fechaFin && <div className="text-green-600">Sin fecha de fin</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Comisiones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonificaciones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLiquidaciones.map((liquidacion) => (
                  <tr key={liquidacion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{liquidacion.profesional}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{liquidacion.periodo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(liquidacion.estado)}`}>
                        {liquidacion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      €{liquidacion.resumen.baseComisiones.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                      €{liquidacion.resumen.bonificaciones.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      €{liquidacion.resumen.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {liquidacion.fechaCalculo && <div>Calc: {new Date(liquidacion.fechaCalculo).toLocaleDateString('es-ES')}</div>}
                      {liquidacion.fechaPago && <div>Pago: {new Date(liquidacion.fechaPago).toLocaleDateString('es-ES')}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {liquidacion.estado === 'calculada' && (
                          <button className="text-green-600 hover:text-green-900">
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
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Período</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">€{totalComisionesMes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Comisiones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {liquidaciones.filter(l => l.estado === 'pagada').length}
              </div>
              <div className="text-sm text-gray-600">Pagadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {liquidaciones.filter(l => l.estado === 'calculada').length}
              </div>
              <div className="text-sm text-gray-600">Calculadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {liquidaciones.filter(l => l.estado === 'pendiente').length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HQComisiones;