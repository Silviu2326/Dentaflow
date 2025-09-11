import React, { useState } from 'react';
import { Plus, Search, Calendar, DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Edit, Eye, Zap, Activity, CreditCard } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import NewCashMovementModal from '../components/NewCashMovementModal';
import ViewCashMovementModal from '../components/ViewCashMovementModal';
import EditCashMovementModal from '../components/EditCashMovementModal';

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
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'movimientos' | 'arqueos'>('movimientos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [showNewMovementModal, setShowNewMovementModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movimiento | null>(null);

  const [movimientos] = useState<Movimiento[]>([
    // Ingresos del día 15 enero
    {
      id: '1',
      fecha: '2024-01-15T09:30:00',
      tipo: 'ingreso',
      concepto: 'Pago consulta',
      categoria: 'Servicios',
      importe: 65,
      metodoPago: 'Efectivo',
      paciente: 'Ana García López',
      descripcion: 'Revisión y limpieza dental',
      numeroRecibo: 'R-2024-001'
    },
    {
      id: '2',
      fecha: '2024-01-15T10:15:00',
      tipo: 'ingreso',
      concepto: 'Pago ortodoncia',
      categoria: 'Servicios',
      importe: 120,
      metodoPago: 'Tarjeta',
      paciente: 'Carlos Ruiz Mesa',
      descripcion: 'Revisión mensual brackets',
      numeroRecibo: 'R-2024-002'
    },
    {
      id: '3',
      fecha: '2024-01-15T11:00:00',
      tipo: 'ingreso',
      concepto: 'Pago empaste',
      categoria: 'Servicios',
      importe: 85,
      metodoPago: 'Efectivo',
      paciente: 'María José Vega',
      descripcion: 'Empaste composite molar',
      numeroRecibo: 'R-2024-003'
    },
    {
      id: '4',
      fecha: '2024-01-15T12:30:00',
      tipo: 'ingreso',
      concepto: 'Pago implante',
      categoria: 'Servicios',
      importe: 850,
      metodoPago: 'Transferencia',
      paciente: 'José Antonio Morales',
      descripcion: 'Colocación implante titanio',
      numeroRecibo: 'R-2024-004'
    },
    {
      id: '5',
      fecha: '2024-01-15T14:45:00',
      tipo: 'ingreso',
      concepto: 'Pago endodoncia',
      categoria: 'Servicios',
      importe: 220,
      metodoPago: 'Tarjeta',
      paciente: 'Carmen Delgado Ruiz',
      descripcion: 'Tratamiento endodoncia premolar',
      numeroRecibo: 'R-2024-005'
    },
    {
      id: '6',
      fecha: '2024-01-15T15:20:00',
      tipo: 'ingreso',
      concepto: 'Pago limpieza',
      categoria: 'Servicios',
      importe: 45,
      metodoPago: 'Efectivo',
      paciente: 'Pedro Sánchez López',
      descripcion: 'Profilaxis dental',
      numeroRecibo: 'R-2024-006'
    },
    {
      id: '7',
      fecha: '2024-01-15T16:00:00',
      tipo: 'ingreso',
      concepto: 'Pago blanqueamiento',
      categoria: 'Servicios',
      importe: 180,
      metodoPago: 'Bizum',
      paciente: 'Laura Martín García',
      descripcion: 'Blanqueamiento dental LED',
      numeroRecibo: 'R-2024-007'
    },
    {
      id: '8',
      fecha: '2024-01-15T17:15:00',
      tipo: 'ingreso',
      concepto: 'Pago prótesis',
      categoria: 'Servicios',
      importe: 450,
      metodoPago: 'Tarjeta',
      paciente: 'Francisco Jiménez Ruiz',
      descripcion: 'Entrega prótesis parcial',
      numeroRecibo: 'R-2024-008'
    },
    {
      id: '9',
      fecha: '2024-01-15T18:00:00',
      tipo: 'ingreso',
      concepto: 'Pago urgencia',
      categoria: 'Servicios',
      importe: 95,
      metodoPago: 'Efectivo',
      paciente: 'Isabella Rodríguez Pérez',
      descripcion: 'Atención urgencia dolor muela',
      numeroRecibo: 'R-2024-009'
    },
    // Gastos del día
    {
      id: '10',
      fecha: '2024-01-15T09:00:00',
      tipo: 'gasto',
      concepto: 'Compra materiales dentales',
      categoria: 'Suministros',
      importe: 165,
      metodoPago: 'Transferencia',
      descripcion: 'Composite, adhesivos y fresas'
    },
    {
      id: '11',
      fecha: '2024-01-15T10:30:00',
      tipo: 'gasto',
      concepto: 'Factura electricidad',
      categoria: 'Administración',
      importe: 128,
      metodoPago: 'Transferencia',
      descripcion: 'Factura mensual Iberdrola'
    },
    {
      id: '12',
      fecha: '2024-01-15T11:15:00',
      tipo: 'gasto',
      concepto: 'Material de oficina',
      categoria: 'Administración',
      importe: 35,
      metodoPago: 'Efectivo',
      descripcion: 'Papel, bolígrafos y carpetas'
    },
    {
      id: '13',
      fecha: '2024-01-15T13:00:00',
      tipo: 'gasto',
      concepto: 'Mantenimiento equipos',
      categoria: 'Mantenimiento',
      importe: 89,
      metodoPago: 'Tarjeta',
      descripcion: 'Revisión sillón dental'
    },
    {
      id: '14',
      fecha: '2024-01-15T14:00:00',
      tipo: 'gasto',
      concepto: 'Guantes y mascarillas',
      categoria: 'Suministros',
      importe: 45,
      metodoPago: 'Efectivo',
      descripcion: 'Material de protección'
    },
    {
      id: '15',
      fecha: '2024-01-15T15:30:00',
      tipo: 'gasto',
      concepto: 'Servicio limpieza',
      categoria: 'Administración',
      importe: 75,
      metodoPago: 'Transferencia',
      descripcion: 'Limpieza semanal clínica'
    },
    {
      id: '16',
      fecha: '2024-01-15T16:45:00',
      tipo: 'gasto',
      concepto: 'Productos desinfección',
      categoria: 'Suministros',
      importe: 28,
      metodoPago: 'Efectivo',
      descripcion: 'Alcohol y desinfectantes'
    },
    {
      id: '17',
      fecha: '2024-01-15T17:30:00',
      tipo: 'gasto',
      concepto: 'Internet y teléfono',
      categoria: 'Administración',
      importe: 55,
      metodoPago: 'Transferencia',
      descripcion: 'Factura mensual telecomunicaciones'
    },
    // Movimientos para hoy (fecha actual)
    {
      id: '18',
      fecha: new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00'),
      tipo: 'ingreso',
      concepto: 'Pago consulta',
      categoria: 'Servicios',
      importe: 75,
      metodoPago: 'Tarjeta',
      paciente: 'Sandra López Martín',
      descripcion: 'Consulta inicial y diagnóstico',
      numeroRecibo: `R-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-001`
    },
    {
      id: '19',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00'),
      tipo: 'ingreso',
      concepto: 'Pago limpieza',
      categoria: 'Servicios',
      importe: 55,
      metodoPago: 'Efectivo',
      paciente: 'Miguel Ángel Torres',
      descripcion: 'Profilaxis y fluorización',
      numeroRecibo: `R-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-002`
    },
    {
      id: '20',
      fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00'),
      tipo: 'gasto',
      concepto: 'Compra material',
      categoria: 'Suministros',
      importe: 42,
      metodoPago: 'Tarjeta',
      descripcion: 'Anestésicos y jeringuillas'
    },
    {
      id: '21',
      fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00'),
      tipo: 'ingreso',
      concepto: 'Pago urgencia',
      categoria: 'Servicios',
      importe: 85,
      metodoPago: 'Bizum',
      paciente: 'Elena Ruiz Gómez',
      descripcion: 'Atención urgencia fractura dental',
      numeroRecibo: `R-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-003`
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

  // Cálculos por método de pago
  const ingresosEfectivo = movimientosHoy
    .filter(m => m.tipo === 'ingreso' && m.metodoPago === 'Efectivo')
    .reduce((sum, m) => sum + m.importe, 0);

  const ingresosTarjeta = movimientosHoy
    .filter(m => m.tipo === 'ingreso' && m.metodoPago === 'Tarjeta')
    .reduce((sum, m) => sum + m.importe, 0);

  const ingresosTransferencia = movimientosHoy
    .filter(m => m.tipo === 'ingreso' && (m.metodoPago === 'Transferencia' || m.metodoPago === 'Bizum'))
    .reduce((sum, m) => sum + m.importe, 0);

  const gastosEfectivo = movimientosHoy
    .filter(m => m.tipo === 'gasto' && m.metodoPago === 'Efectivo')
    .reduce((sum, m) => sum + m.importe, 0);

  const gastosTarjeta = movimientosHoy
    .filter(m => m.tipo === 'gasto' && m.metodoPago === 'Tarjeta')
    .reduce((sum, m) => sum + m.importe, 0);

  const gastosTransferencia = movimientosHoy
    .filter(m => m.tipo === 'gasto' && (m.metodoPago === 'Transferencia' || m.metodoPago === 'Bizum'))
    .reduce((sum, m) => sum + m.importe, 0);

  const cajaEfectivo = ingresosEfectivo - gastosEfectivo;
  const cajaTarjeta = ingresosTarjeta - gastosTarjeta;
  const cajaTransferencia = ingresosTransferencia - gastosTransferencia;

  const filteredMovimientos = movimientosHoy.filter(movimiento => {
    const matchesSearch = movimiento.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimiento.paciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const arqueoActual = arqueos.find(a => a.estado === 'abierta');

  const handleNewMovement = (movementData: any) => {
    console.log('Nuevo movimiento creado:', movementData);
  };

  const handleViewMovement = (movement: Movimiento) => {
    setSelectedMovement(movement);
    setShowViewModal(true);
  };

  const handleEditMovement = (movement: Movimiento) => {
    setSelectedMovement(movement);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedMovement(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMovement(null);
  };

  const handleUpdateMovement = (data: any) => {
    console.log('Movimiento actualizado:', data);
    setShowEditModal(false);
    setSelectedMovement(null);
  };

  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-8 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent relative z-10`}>
              Gestión de Caja
            </h1>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Arqueos, cierres diarios, ingresos/gastos y diferencias</p>
          </div>
          <div className="flex space-x-3">
            {arqueoActual && (
              <button className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <CheckCircle className="h-4 w-4 mr-2" />
                Cerrar Caja
              </button>
            )}
            <button
              onClick={() => setShowNewMovementModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Movimiento
            </button>
          </div>
        </div>

        {/* Date selector and tabs */}
        <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 mb-6 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className={`h-5 w-5 mr-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500/20 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-green-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                  }`}
                />
              </div>
            </div>
            
            <div className={`border-b transition-colors duration-300 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('movimientos')}
                  className={`py-3 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'movimientos'
                      ? (isDarkMode ? 'border-green-400 text-green-400' : 'border-green-500 text-green-600')
                      : (isDarkMode 
                          ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )
                  }`}
                >
                  Movimientos
                </button>
                <button
                  onClick={() => setActiveTab('arqueos')}
                  className={`py-3 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'arqueos'
                      ? (isDarkMode ? 'border-green-400 text-green-400' : 'border-green-500 text-green-600')
                      : (isDarkMode 
                          ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )
                  }`}
                >
                  Arqueos
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-700/50 shadow-green-900/20' 
            : 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-200/50 shadow-green-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-green-200' : 'text-green-900'
              }`}>Ingresos del Día</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-green-100' : 'text-green-600'
              }`}>
                €{totalIngresos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/40 to-rose-800/40 border-red-700/50 shadow-red-900/20' 
            : 'bg-gradient-to-br from-red-50 to-rose-100/50 border-red-200/50 shadow-red-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-red-200' : 'text-red-900'
              }`}>Gastos del Día</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-red-100' : 'text-red-600'
              }`}>
                €{totalGastos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          saldoNeto >= 0 
            ? (isDarkMode 
                ? 'bg-gradient-to-br from-blue-900/40 to-cyan-800/40 border-blue-700/50 shadow-blue-900/20' 
                : 'bg-gradient-to-br from-blue-50 to-cyan-100/50 border-blue-200/50 shadow-blue-200/20')
            : (isDarkMode 
                ? 'bg-gradient-to-br from-orange-900/40 to-amber-800/40 border-orange-700/50 shadow-orange-900/20' 
                : 'bg-gradient-to-br from-orange-50 to-amber-100/50 border-orange-200/50 shadow-orange-200/20')
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl shadow-lg ${
              saldoNeto >= 0 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600' 
                : 'bg-gradient-to-r from-orange-500 to-amber-600'
            }`}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                saldoNeto >= 0 
                  ? (isDarkMode ? 'text-blue-200' : 'text-blue-900')
                  : (isDarkMode ? 'text-orange-200' : 'text-orange-900')
              }`}>Saldo Neto</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                saldoNeto >= 0 
                  ? (isDarkMode ? 'text-blue-100' : 'text-blue-600')
                  : (isDarkMode ? 'text-orange-100' : 'text-orange-600')
              }`}>
                {saldoNeto >= 0 ? '+' : ''}€{saldoNeto.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          arqueoActual?.diferencia === 0 
            ? (isDarkMode 
                ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-700/50 shadow-green-900/20' 
                : 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-200/50 shadow-green-200/20')
            : Math.abs(arqueoActual?.diferencia || 0) <= 5 
              ? (isDarkMode 
                  ? 'bg-gradient-to-br from-yellow-900/40 to-amber-800/40 border-yellow-700/50 shadow-yellow-900/20' 
                  : 'bg-gradient-to-br from-yellow-50 to-amber-100/50 border-yellow-200/50 shadow-yellow-200/20')
              : (isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/40 to-rose-800/40 border-red-700/50 shadow-red-900/20' 
                  : 'bg-gradient-to-br from-red-50 to-rose-100/50 border-red-200/50 shadow-red-200/20')
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl shadow-lg ${
              arqueoActual?.diferencia === 0 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : Math.abs(arqueoActual?.diferencia || 0) <= 5 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600' 
                  : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                arqueoActual?.diferencia === 0 
                  ? (isDarkMode ? 'text-green-200' : 'text-green-900')
                  : Math.abs(arqueoActual?.diferencia || 0) <= 5 
                    ? (isDarkMode ? 'text-yellow-200' : 'text-yellow-900')
                    : (isDarkMode ? 'text-red-200' : 'text-red-900')
              }`}>Estado de Caja</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                arqueoActual 
                  ? (isDarkMode ? 'text-green-100' : 'text-green-600')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-400')
              }`}>
                {arqueoActual ? 'Abierta' : 'Cerrada'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-amber-900/40 to-yellow-800/40 border-amber-700/50 shadow-amber-900/20' 
            : 'bg-gradient-to-br from-amber-50 to-yellow-100/50 border-amber-200/50 shadow-amber-200/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-3 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-amber-200' : 'text-amber-900'
                }`}>Caja Efectivo</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  cajaEfectivo >= 0 
                    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  {cajaEfectivo >= 0 ? '+' : ''}€{cajaEfectivo.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-amber-300' : 'text-amber-700'
              }`}>Ingresos:</span>
              <span className="font-semibold text-green-600">+€{ingresosEfectivo.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-amber-300' : 'text-amber-700'
              }`}>Gastos:</span>
              <span className="font-semibold text-red-600">-€{gastosEfectivo.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-purple-900/40 to-indigo-800/40 border-purple-700/50 shadow-purple-900/20' 
            : 'bg-gradient-to-br from-purple-50 to-indigo-100/50 border-purple-200/50 shadow-purple-200/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-900'
                }`}>Caja Tarjeta</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  cajaTarjeta >= 0 
                    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  {cajaTarjeta >= 0 ? '+' : ''}€{cajaTarjeta.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>Ingresos:</span>
              <span className="font-semibold text-green-600">+€{ingresosTarjeta.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>Gastos:</span>
              <span className="font-semibold text-red-600">-€{gastosTarjeta.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-teal-900/40 to-cyan-800/40 border-teal-700/50 shadow-teal-900/20' 
            : 'bg-gradient-to-br from-teal-50 to-cyan-100/50 border-teal-200/50 shadow-teal-200/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-teal-200' : 'text-teal-900'
                }`}>Digital (Trans./Bizum)</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  cajaTransferencia >= 0 
                    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  {cajaTransferencia >= 0 ? '+' : ''}€{cajaTransferencia.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-teal-300' : 'text-teal-700'
              }`}>Ingresos:</span>
              <span className="font-semibold text-green-600">+€{ingresosTransferencia.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-teal-300' : 'text-teal-700'
              }`}>Gastos:</span>
              <span className="font-semibold text-red-600">-€{gastosTransferencia.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'movimientos' ? (
        <>
          {/* Search */}
          <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 mb-6 ${
            isDarkMode 
              ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
              : 'bg-white/80 border-white/50 shadow-gray-200/50'
          }`}>
            <div className="relative max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Buscar movimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-3 border rounded-xl w-full focus:ring-2 focus:ring-green-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-green-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-green-500'
                }`}
              />
            </div>
          </div>

          {/* Movements Table */}
          <div className={`rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
              : 'bg-white/80 border-white/50 shadow-gray-200/50'
          }`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Hora
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Concepto
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Paciente
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Categoría
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Método Pago
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Importe
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Recibo
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800/50 divide-gray-700/50' : 'bg-white divide-gray-200'
                }`}>
                  {filteredMovimientos.map((movimiento) => (
                    <tr key={movimiento.id} className={`transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                        : 'hover:bg-gray-50 hover:shadow-md'
                    }`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {new Date(movimiento.fecha).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm font-semibold transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{movimiento.concepto}</div>
                          <div className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{movimiento.descripcion}</div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {movimiento.paciente || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${
                          movimiento.tipo === 'ingreso' 
                            ? (isDarkMode 
                                ? 'bg-green-900/50 text-green-200 border-green-700/50' 
                                : 'bg-green-100 text-green-800 border-green-200')
                            : (isDarkMode 
                                ? 'bg-red-900/50 text-red-200 border-red-700/50' 
                                : 'bg-red-100 text-red-800 border-red-200')
                        }`}>
                          {movimiento.tipo === 'ingreso' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {movimiento.categoria}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                          {movimiento.metodoPago}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                        movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}€{movimiento.importe.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {movimiento.numeroRecibo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleViewMovement(movimiento)}
                            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                              isDarkMode 
                                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                            }`}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditMovement(movimiento)}
                            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                              isDarkMode 
                                ? 'text-green-400 hover:text-green-300 hover:bg-green-900/30' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            title="Editar movimiento"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
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
        <div className={`rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Fecha
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Usuario
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Saldo Inicial
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Ingresos
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Gastos
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Saldo Teórico
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Saldo Real
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Diferencia
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800/50 divide-gray-700/50' : 'bg-white divide-gray-200'
              }`}>
                {arqueos.map((arqueo) => (
                  <tr key={arqueo.id} className={`transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`text-sm font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {new Date(arqueo.fecha).toLocaleDateString('es-ES')}
                        </div>
                        {arqueo.fechaCierre && (
                          <div className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Cerrada: {new Date(arqueo.fechaCierre).toLocaleTimeString('es-ES')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {arqueo.usuario}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      €{arqueo.saldoInicial.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold">
                      +€{arqueo.totalIngresos.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-bold">
                      -€{arqueo.totalGastos.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      €{arqueo.saldoTeorico.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      €{arqueo.saldoReal.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                      arqueo.diferencia === 0 ? 'text-green-600' : 
                      Math.abs(arqueo.diferencia) <= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {arqueo.diferencia > 0 ? '+' : ''}€{arqueo.diferencia.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${
                        arqueo.estado === 'cerrada' 
                          ? (isDarkMode 
                              ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' 
                              : 'bg-gray-100 text-gray-800 border-gray-200')
                          : (isDarkMode 
                              ? 'bg-green-900/50 text-green-200 border-green-700/50' 
                              : 'bg-green-100 text-green-800 border-green-200')
                      }`}>
                        <Zap className="h-3 w-3 mr-1" />
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
        <div className={`text-center py-16 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/40 border-gray-200/50'
        }`}>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-full blur-xl"></div>
            <DollarSign className={`mx-auto h-16 w-16 relative z-10 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`mt-4 text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            No hay {activeTab === 'movimientos' ? 'movimientos' : 'arqueos'}
          </h3>
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {activeTab === 'movimientos' 
              ? 'No se encontraron movimientos para la fecha seleccionada.'
              : 'No hay arqueos de caja registrados.'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <NewCashMovementModal
        isOpen={showNewMovementModal}
        onClose={() => setShowNewMovementModal(false)}
        onSubmit={handleNewMovement}
      />
      
      <ViewCashMovementModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        movement={selectedMovement}
      />
      
      <EditCashMovementModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateMovement}
        movement={selectedMovement}
      />
    </div>
  );
};

export default Caja;