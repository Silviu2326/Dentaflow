import React, { useState } from 'react';
import { Plus, Search, Calendar, DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface Movimiento {
  id: string;
  fecha: string;
  tipo: 'ingreso' | 'gasto';
  concepto: string;
  categoria: string;
  importe: number;
  metodoPago: string;
  paciente?: string;
  descripcion: string;
  numeroRecibo?: string;
}

interface ArqueoCaja {
  id: string;
  fecha: string;
  fechaCierre?: string;
  saldoInicial: number;
  totalIngresos: number;
  totalGastos: number;
  saldoTeorico: number;
  saldoReal: number;
  diferencia: number;
  estado: 'abierta' | 'cerrada';
  usuario: string;
  observaciones?: string;
}

const Caja: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'movimientos' | 'arqueos'>('movimientos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  const [movimientos] = useState<Movimiento[]>([
    {
      id: '1',
      fecha: '2024-01-15T10:30:00',
      tipo: 'ingreso',
      concepto: 'Pago consulta',
      categoria: 'Servicios',
      importe: 50,
      metodoPago: 'Efectivo',
      paciente: 'Ana García López',
      descripcion: 'Limpieza dental',
      numeroRecibo: 'R-2024-001'
    },
    {
      id: '2',
      fecha: '2024-01-15T11:45:00',
      tipo: 'ingreso',
      concepto: 'Pago tratamiento',
      categoria: 'Servicios',
      importe: 150,
      metodoPago: 'Tarjeta',
      paciente: 'Carlos Ruiz Mesa',
      descripcion: 'Empaste composite',
      numeroRecibo: 'R-2024-002'
    },
    {
      id: '3',
      fecha: '2024-01-15T14:20:00',
      tipo: 'gasto',
      concepto: 'Compra materiales',
      categoria: 'Suministros',
      importe: 85,
      metodoPago: 'Transferencia',
      descripcion: 'Composite y adhesivos'
    },
    {
      id: '4',
      fecha: '2024-01-15T16:10:00',
      tipo: 'ingreso',
      concepto: 'Pago implante',
      categoria: 'Servicios',
      importe: 800,
      metodoPago: 'Transferencia',
      paciente: 'María Fernández Ruiz',
      descripcion: 'Colocación implante',
      numeroRecibo: 'R-2024-003'
    },
    {
      id: '5',
      fecha: '2024-01-15T17:30:00',
      tipo: 'gasto',
      concepto: 'Gastos generales',
      categoria: 'Administración',
      importe: 45,
      metodoPago: 'Efectivo',
      descripcion: 'Material de oficina'
    }
  ]);

  const [arqueos] = useState<ArqueoCaja[]>([
    {
      id: '1',
      fecha: '2024-01-15',
      fechaCierre: '2024-01-15T18:00:00',
      saldoInicial: 200,
      totalIngresos: 1000,
      totalGastos: 130,
      saldoTeorico: 1070,
      saldoReal: 1065,
      diferencia: -5,
      estado: 'cerrada',
      usuario: 'Dr. Rodriguez',
      observaciones: 'Diferencia mínima, posible redondeo'
    },
    {
      id: '2',
      fecha: '2024-01-16',
      saldoInicial: 1065,
      totalIngresos: 450,
      totalGastos: 75,
      saldoTeorico: 1440,
      saldoReal: 0,
      diferencia: 0,
      estado: 'abierta',
      usuario: 'Dr. Rodriguez'
    }
  ]);

  const categoriasIngreso = ['Servicios', 'Productos', 'Otros'];
  const categoriasGasto = ['Suministros', 'Administración', 'Mantenimiento', 'Otros'];

  const movimientosHoy = movimientos.filter(m => 
    m.fecha.startsWith(selectedDate)
  );

  const totalIngresos = movimientosHoy
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.importe, 0);

  const totalGastos = movimientosHoy
    .filter(m => m.tipo === 'gasto')
    .reduce((sum, m) => sum + m.importe, 0);

  const saldoNeto = totalIngresos - totalGastos;

  const filteredMovimientos = movimientosHoy.filter(movimiento => {
    const matchesSearch = movimiento.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimiento.paciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const arqueoActual = arqueos.find(a => a.estado === 'abierta');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Caja</h1>
            <p className="text-gray-600">Arqueos, cierres diarios, ingresos/gastos y diferencias</p>
          </div>
          <div className="flex space-x-3">
            {arqueoActual && (
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Cerrar Caja
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Movimiento
            </button>
          </div>
        </div>

        {/* Date selector and tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('movimientos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'movimientos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Movimientos
              </button>
              <button
                onClick={() => setActiveTab('arqueos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'arqueos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Arqueos
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">€{totalIngresos.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gastos</p>
              <p className="text-2xl font-bold text-red-600">€{totalGastos.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${saldoNeto >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <DollarSign className={`h-6 w-6 ${saldoNeto >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo Neto</p>
              <p className={`text-2xl font-bold ${saldoNeto >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                €{saldoNeto.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              arqueoActual?.diferencia === 0 ? 'bg-green-100' : 
              Math.abs(arqueoActual?.diferencia || 0) <= 5 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <AlertCircle className={`h-6 w-6 ${
                arqueoActual?.diferencia === 0 ? 'text-green-600' : 
                Math.abs(arqueoActual?.diferencia || 0) <= 5 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estado Caja</p>
              <p className={`text-lg font-bold ${
                arqueoActual ? 'text-green-600' : 'text-gray-400'
              }`}>
                {arqueoActual ? 'Abierta' : 'Cerrada'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'movimientos' ? (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar movimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Movements Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concepto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método Pago
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recibo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(movimiento.fecha).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{movimiento.concepto}</div>
                          <div className="text-sm text-gray-500">{movimiento.descripcion}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movimiento.paciente || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          movimiento.tipo === 'ingreso' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {movimiento.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movimiento.metodoPago}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}€{movimiento.importe.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movimiento.numeroRecibo || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Cash Register Records Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Inicial
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gastos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Teórico
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Real
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diferencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {arqueos.map((arqueo) => (
                  <tr key={arqueo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(arqueo.fecha).toLocaleDateString('es-ES')}
                        </div>
                        {arqueo.fechaCierre && (
                          <div className="text-sm text-gray-500">
                            Cerrada: {new Date(arqueo.fechaCierre).toLocaleTimeString('es-ES')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {arqueo.usuario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      €{arqueo.saldoInicial.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                      €{arqueo.totalIngresos.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                      €{arqueo.totalGastos.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      €{arqueo.saldoTeorico.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      €{arqueo.saldoReal.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                      arqueo.diferencia === 0 ? 'text-green-600' : 
                      Math.abs(arqueo.diferencia) <= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {arqueo.diferencia > 0 ? '+' : ''}€{arqueo.diferencia.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        arqueo.estado === 'cerrada' 
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {arqueo.estado === 'cerrada' ? 'Cerrada' : 'Abierta'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {((activeTab === 'movimientos' && filteredMovimientos.length === 0) || 
        (activeTab === 'arqueos' && arqueos.length === 0)) && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay {activeTab === 'movimientos' ? 'movimientos' : 'arqueos'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'movimientos' 
              ? 'No se encontraron movimientos para la fecha seleccionada.'
              : 'No hay arqueos de caja registrados.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Caja;