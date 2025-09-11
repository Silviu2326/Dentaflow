import React, { useState, useContext } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Link,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  Calendar,
  Eye,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import RegisterPaymentModal from '../components/RegisterPaymentModal';

interface Pago {
  id: string;
  numeroTransaccion: string;
  pacienteId: string;
  pacienteNombre: string;
  concepto: string;
  importe: number;
  metodoPago: 'tarjeta' | 'efectivo' | 'transferencia' | 'link_pago' | 'financiacion';
  estado: 'pendiente' | 'procesando' | 'completado' | 'fallido' | 'devuelto' | 'cancelado';
  fechaPago: string;
  fechaVencimiento?: string;
  pasarelaPago?: string;
  referenciaExterna?: string;
  comision: number;
  importeNeto: number;
}

interface LinkPago {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  concepto: string;
  importe: number;
  fechaCreacion: string;
  fechaVencimiento: string;
  url: string;
  estado: 'activo' | 'pagado' | 'vencido' | 'cancelado';
  intentosPago: number;
  ultimoIntento?: string;
}

interface Devolucion {
  id: string;
  pagoOriginalId: string;
  numeroTransaccion: string;
  pacienteNombre: string;
  conceptoOriginal: string;
  importeOriginal: number;
  importeDevolucion: number;
  motivo: string;
  fechaSolicitud: string;
  fechaProceso?: string;
  estado: 'solicitada' | 'procesando' | 'completada' | 'rechazada';
  aprobadoPor?: string;
}

const Pagos: React.FC = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState<'pagos' | 'links' | 'devoluciones' | 'conciliacion'>('pagos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [selectedMetodo, setSelectedMetodo] = useState('todos');
  const [showRegisterPaymentModal, setShowRegisterPaymentModal] = useState(false);

  const [pagos] = useState<Pago[]>([
    {
      id: '1',
      numeroTransaccion: 'TXN-2024-001',
      pacienteId: 'P001',
      pacienteNombre: 'María García',
      concepto: 'Implante Dental - Primera fase',
      importe: 1200.00,
      metodoPago: 'tarjeta',
      estado: 'completado',
      fechaPago: '2024-01-15T14:30:00',
      pasarelaPago: 'Stripe',
      referenciaExterna: 'pi_1234567890',
      comision: 36.00,
      importeNeto: 1164.00
    },
    {
      id: '2',
      numeroTransaccion: 'TXN-2024-002',
      pacienteId: 'P002',
      pacienteNombre: 'Carlos López',
      concepto: 'Endodoncia + Corona',
      importe: 650.00,
      metodoPago: 'link_pago',
      estado: 'pendiente',
      fechaPago: '2024-01-16T09:00:00',
      fechaVencimiento: '2024-01-23T23:59:59',
      pasarelaPago: 'RedSys',
      comision: 19.50,
      importeNeto: 630.50
    },
    {
      id: '3',
      numeroTransaccion: 'TXN-2024-003',
      pacienteId: 'P003',
      pacienteNombre: 'Ana Martín',
      concepto: 'Limpieza + Blanqueamiento',
      importe: 180.00,
      metodoPago: 'efectivo',
      estado: 'completado',
      fechaPago: '2024-01-14T11:15:00',
      comision: 0.00,
      importeNeto: 180.00
    },
    {
      id: '4',
      numeroTransaccion: 'TXN-2024-004',
      pacienteId: 'P004',
      pacienteNombre: 'José Ruiz',
      concepto: 'Ortodoncia - Cuota mensual',
      importe: 120.00,
      metodoPago: 'transferencia',
      estado: 'fallido',
      fechaPago: '2024-01-13T16:45:00',
      comision: 2.40,
      importeNeto: 117.60
    }
  ]);

  const [linksPago] = useState<LinkPago[]>([
    {
      id: '1',
      pacienteId: 'P005',
      pacienteNombre: 'Laura Fernández',
      concepto: 'Presupuesto #PR-2024-015',
      importe: 850.00,
      fechaCreacion: '2024-01-15T10:00:00',
      fechaVencimiento: '2024-01-22T23:59:59',
      url: 'https://pay.clinicapp.com/lnk_abc123',
      estado: 'activo',
      intentosPago: 0
    },
    {
      id: '2',
      pacienteId: 'P006',
      pacienteNombre: 'Miguel Santos',
      concepto: 'Tratamiento periodontal completo',
      importe: 1500.00,
      fechaCreacion: '2024-01-12T15:30:00',
      fechaVencimiento: '2024-01-19T23:59:59',
      url: 'https://pay.clinicapp.com/lnk_def456',
      estado: 'pagado',
      intentosPago: 2,
      ultimoIntento: '2024-01-14T20:15:00'
    },
    {
      id: '3',
      pacienteId: 'P007',
      pacienteNombre: 'Carmen Díaz',
      concepto: 'Corona de porcelana + Endodoncia',
      importe: 780.00,
      fechaCreacion: '2024-01-08T12:00:00',
      fechaVencimiento: '2024-01-15T23:59:59',
      url: 'https://pay.clinicapp.com/lnk_ghi789',
      estado: 'vencido',
      intentosPago: 1,
      ultimoIntento: '2024-01-10T18:30:00'
    }
  ]);

  const [devoluciones] = useState<Devolucion[]>([
    {
      id: '1',
      pagoOriginalId: '1',
      numeroTransaccion: 'REF-2024-001',
      pacienteNombre: 'Pedro Jiménez',
      conceptoOriginal: 'Tratamiento ortodóncico',
      importeOriginal: 2400.00,
      importeDevolucion: 800.00,
      motivo: 'Cancelación de tratamiento por traslado',
      fechaSolicitud: '2024-01-14T09:30:00',
      fechaProceso: '2024-01-15T14:20:00',
      estado: 'completada',
      aprobadoPor: 'Dr. García'
    },
    {
      id: '2',
      pagoOriginalId: '2',
      numeroTransaccion: 'REF-2024-002',
      pacienteNombre: 'Sofia Morales',
      conceptoOriginal: 'Implante dental',
      importeOriginal: 1200.00,
      importeDevolucion: 1200.00,
      motivo: 'Error en facturación - duplicado',
      fechaSolicitud: '2024-01-13T16:00:00',
      estado: 'procesando',
      aprobadoPor: 'Administración'
    },
    {
      id: '3',
      pagoOriginalId: '3',
      numeroTransaccion: 'REF-2024-003',
      pacienteNombre: 'Roberto Vega',
      conceptoOriginal: 'Limpieza dental',
      importeOriginal: 80.00,
      importeDevolucion: 40.00,
      motivo: 'Descuento por insatisfacción del servicio',
      fechaSolicitud: '2024-01-12T11:45:00',
      estado: 'solicitada'
    }
  ]);

  const getEstadoColor = (estado: string) => {
    const baseClasses = isDarkMode ? {
      completado: 'text-green-300 bg-green-900/50',
      pagado: 'text-green-300 bg-green-900/50',
      completada: 'text-green-300 bg-green-900/50',
      pendiente: 'text-yellow-300 bg-yellow-900/50',
      activo: 'text-yellow-300 bg-yellow-900/50',
      solicitada: 'text-yellow-300 bg-yellow-900/50',
      procesando: 'text-blue-300 bg-blue-900/50',
      fallido: 'text-red-300 bg-red-900/50',
      rechazada: 'text-red-300 bg-red-900/50',
      devuelto: 'text-gray-300 bg-gray-800/50',
      vencido: 'text-gray-300 bg-gray-800/50',
      cancelado: 'text-gray-300 bg-gray-800/50'
    } : {
      completado: 'text-green-600 bg-green-100',
      pagado: 'text-green-600 bg-green-100',
      completada: 'text-green-600 bg-green-100',
      pendiente: 'text-yellow-600 bg-yellow-100',
      activo: 'text-yellow-600 bg-yellow-100',
      solicitada: 'text-yellow-600 bg-yellow-100',
      procesando: 'text-blue-600 bg-blue-100',
      fallido: 'text-red-600 bg-red-100',
      rechazada: 'text-red-600 bg-red-100',
      devuelto: 'text-gray-600 bg-gray-100',
      vencido: 'text-gray-600 bg-gray-100',
      cancelado: 'text-gray-600 bg-gray-100'
    };
    
    return baseClasses[estado as keyof typeof baseClasses] || (isDarkMode ? 'text-gray-300 bg-gray-800/50' : 'text-gray-600 bg-gray-100');
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case 'tarjeta': return <CreditCard className="h-4 w-4" />;
      case 'efectivo': return <DollarSign className="h-4 w-4" />;
      case 'transferencia': return <RefreshCw className="h-4 w-4" />;
      case 'link_pago': return <Link className="h-4 w-4" />;
      case 'financiacion': return <Calendar className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
      case 'pagado':
      case 'completada': return <CheckCircle className="h-4 w-4" />;
      case 'pendiente':
      case 'activo':
      case 'solicitada': return <Clock className="h-4 w-4" />;
      case 'procesando': return <RefreshCw className="h-4 w-4" />;
      case 'fallido':
      case 'rechazada': return <XCircle className="h-4 w-4" />;
      case 'vencido': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPagos = pagos.filter(pago => {
    const matchesSearch = pago.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pago.numeroTransaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pago.concepto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === 'todos' || pago.estado === selectedEstado;
    const matchesMetodo = selectedMetodo === 'todos' || pago.metodoPago === selectedMetodo;
    return matchesSearch && matchesEstado && matchesMetodo;
  });

  const filteredLinks = linksPago.filter(link =>
    link.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.concepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDevoluciones = devoluciones.filter(devolucion =>
    devolucion.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devolucion.conceptoOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devolucion.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterPayment = (paymentData: any) => {
    console.log('Registering payment:', paymentData);
  };

  const renderPagos = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Gestión de Pagos
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-200/30'
          }`}>
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          <button 
            onClick={() => setShowRegisterPaymentModal(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Registrar Pago</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-700/50 shadow-xl shadow-green-900/20'
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-xl shadow-green-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Pagos Completados
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                €{pagos.filter(p => p.estado === 'completado').reduce((acc, p) => acc + p.importe, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-yellow-700/50 shadow-xl shadow-yellow-900/20'
            : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200/50 shadow-xl shadow-yellow-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100'
            }`}>
              <Clock className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Pendientes
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                €{pagos.filter(p => p.estado === 'pendiente').reduce((acc, p) => acc + p.importe, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-700/50 shadow-xl shadow-red-900/20'
            : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50 shadow-xl shadow-red-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-red-800/50' : 'bg-red-100'
            }`}>
              <XCircle className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Fallidos
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {pagos.filter(p => p.estado === 'fallido').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-700/50 shadow-xl shadow-blue-900/20'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-xl shadow-blue-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100'
            }`}>
              <DollarSign className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Comisiones
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                €{pagos.reduce((acc, p) => acc + p.comision, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 shadow-xl'
          : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 shadow-xl'
      }`}>
        <div className="divide-y divide-gray-200/50">
          {filteredPagos.map((pago) => (
            <div key={pago.id} className={`p-6 transition-all duration-300 hover:bg-opacity-80 ${
              isDarkMode ? 'hover:bg-gray-700/20' : 'hover:bg-gray-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {pago.pacienteNombre}
                    </h4>
                    <span className={`text-sm font-mono px-3 py-1 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {pago.numeroTransaccion}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold border ${getEstadoColor(pago.estado)}`}>
                      {getEstadoIcon(pago.estado)}
                      <span className="ml-2 capitalize">{pago.estado}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold border ${
                      isDarkMode ? 'bg-gray-700/50 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {getMetodoIcon(pago.metodoPago)}
                      <span className="ml-2 capitalize">{pago.metodoPago.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <p className={`text-base mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {pago.concepto}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <span className={`block text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Importe</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{pago.importe.toFixed(2)}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <span className={`block text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Comisión</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{pago.comision.toFixed(2)}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <span className={`block text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Neto</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{pago.importeNeto.toFixed(2)}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <span className={`block text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Fecha</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(pago.fechaPago).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {pago.pasarelaPago && (
                    <div className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="font-semibold">Pasarela:</span> {pago.pasarelaPago}
                      {pago.referenciaExterna && (
                        <span className="ml-2">
                          <span className="font-semibold">Ref:</span> {pago.referenciaExterna}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 ml-6">
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}>
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}>
                    <Edit className="h-5 w-5" />
                  </button>
                  {pago.estado === 'fallido' && (
                    <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                        : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                    }`}>
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Links de Pago
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-200/30'
          }`}>
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar Estados</span>
          </button>
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
          }`}>
            <Plus className="h-4 w-4" />
            <span>Crear Link</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-700/50 shadow-xl shadow-green-900/20'
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-xl shadow-green-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Links Pagados
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {linksPago.filter(l => l.estado === 'pagado').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-700/50 shadow-xl shadow-blue-900/20'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-xl shadow-blue-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100'
            }`}>
              <Link className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Links Activos
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {linksPago.filter(l => l.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-700/50 shadow-xl shadow-red-900/20'
            : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50 shadow-xl shadow-red-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-red-800/50' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Links Vencidos
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {linksPago.filter(l => l.estado === 'vencido').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-yellow-700/50 shadow-xl shadow-yellow-900/20'
            : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200/50 shadow-xl shadow-yellow-200/20'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100'
            }`}>
              <DollarSign className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Importe Pendiente
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                €{linksPago.filter(l => l.estado === 'activo').reduce((acc, l) => acc + l.importe, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 shadow-xl'
          : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 shadow-xl'
      }`}>
        <div className="divide-y divide-gray-200/50">
          {filteredLinks.map((link) => (
            <div key={link.id} className={`p-6 transition-all duration-300 hover:bg-opacity-80 ${
              isDarkMode ? 'hover:bg-gray-700/20' : 'hover:bg-gray-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {link.pacienteNombre}
                    </h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold border ${getEstadoColor(link.estado)}`}>
                      {getEstadoIcon(link.estado)}
                      <span className="ml-2 capitalize">{link.estado}</span>
                    </span>
                    {link.intentosPago > 0 && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold border ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-600 border-blue-200'
                      }`}>
                        {link.intentosPago} intentos
                      </span>
                    )}
                  </div>
                  <p className={`text-base mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {link.concepto}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <span className={`block text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Importe</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{link.importe.toFixed(2)}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <span className={`block text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Creado</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(link.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    } ${new Date(link.fechaVencimiento) < new Date() ? (isDarkMode ? 'border border-red-500/50' : 'border border-red-400') : ''}`}>
                      <span className={`block text-xs font-semibold ${
                        new Date(link.fechaVencimiento) < new Date() 
                          ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                      }`}>Vence</span>
                      <span className={`text-lg font-bold ${
                        new Date(link.fechaVencimiento) < new Date() 
                          ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                          : (isDarkMode ? 'text-white' : 'text-gray-900')
                      }`}>
                        {new Date(link.fechaVencimiento).toLocaleDateString()}
                      </span>
                    </div>
                    {link.ultimoIntento && (
                      <div className={`p-3 rounded-xl ${
                        isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                      }`}>
                        <span className={`block text-xs font-semibold ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Último intento</span>
                        <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(link.ultimoIntento).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`mt-4 flex items-center space-x-2 p-3 rounded-xl ${
                    isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                  }`}>
                    <Link className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`font-mono text-sm px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {link.url}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-6">
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}>
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}>
                    <Edit className="h-5 w-5" />
                  </button>
                  {link.estado === 'activo' && (
                    <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                        : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}>
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDevoluciones = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Devoluciones y Reembolsos
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg shadow-red-900/30'
              : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg shadow-red-200/30'
          }`}>
            <Download className="h-4 w-4" />
            <span>Reporte Devoluciones</span>
          </button>
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
          }`}>
            <Plus className="h-4 w-4" />
            <span>Nueva Devolución</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Completadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{devoluciones.filter(d => d.estado === 'completada').reduce((acc, d) => acc + d.importeDevolucion, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">En Proceso</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{devoluciones.filter(d => d.estado === 'procesando').reduce((acc, d) => acc + d.importeDevolucion, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {devoluciones.filter(d => d.estado === 'solicitada').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Total Devuelto</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{devoluciones.reduce((acc, d) => acc + d.importeDevolucion, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDevoluciones.map((devolucion) => (
            <li key={devolucion.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{devolucion.pacienteNombre}</h4>
                    <span className="text-sm text-gray-500">{devolucion.numeroTransaccion}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(devolucion.estado)}`}>
                      {getEstadoIcon(devolucion.estado)}
                      <span className="ml-1 capitalize">{devolucion.estado}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{devolucion.conceptoOriginal}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Motivo:</span> {devolucion.motivo}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Importe original:</span> €{devolucion.importeOriginal.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Importe devolución:</span> €{devolucion.importeDevolucion.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Solicitada:</span> {new Date(devolucion.fechaSolicitud).toLocaleDateString()}
                    </div>
                    {devolucion.fechaProceso && (
                      <div>
                        <span className="font-medium">Procesada:</span> {new Date(devolucion.fechaProceso).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {devolucion.aprobadoPor && (
                    <div className="mt-1 text-xs text-gray-500">
                      Aprobado por: {devolucion.aprobadoPor}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  {devolucion.estado === 'solicitada' && (
                    <button className="text-green-400 hover:text-green-500">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderConciliacion = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Conciliación de Cobros
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-200/30'
          }`}>
            <Upload className="h-4 w-4" />
            <span>Importar Extracto</span>
          </button>
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
          }`}>
            <BarChart3 className="h-4 w-4" />
            <span>Ejecutar Conciliación</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Conciliados</p>
              <p className="text-2xl font-semibold text-gray-900">€15,420.50</p>
              <p className="text-xs text-gray-500">142 transacciones</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">€2,350.00</p>
              <p className="text-xs text-gray-500">8 transacciones</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Discrepancias</p>
              <p className="text-2xl font-semibold text-gray-900">€125.50</p>
              <p className="text-xs text-gray-500">3 transacciones</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 shadow-xl'
          : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 shadow-xl'
      }`}>
        <h4 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Última Conciliación - 15 Enero 2024</h4>
        
        <div className="space-y-4">
          <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-700/50'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50'
          }`}>
            <div className="flex items-center">
              <CheckCircle className={`h-6 w-6 mr-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stripe - Pagos con tarjeta</p>
                <p className={`text-xs ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>Periodo: 01-15 Enero 2024</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>€8,450.20</p>
              <p className={`text-xs ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>89 transacciones</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">RedSys - TPV físico</p>
                <p className="text-xs text-gray-500">Periodo: 01-15 Enero 2024</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">€6,970.30</p>
              <p className="text-xs text-gray-500">53 transacciones</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Transferencias bancarias</p>
                <p className="text-xs text-gray-500">Pendientes de confirmar</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">€2,350.00</p>
              <p className="text-xs text-gray-500">8 transacciones</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Discrepancias detectadas</p>
                <p className="text-xs text-gray-500">Requieren revisión manual</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">€125.50</p>
              <p className="text-xs text-gray-500">3 transacciones</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Total conciliado:</span>
            <span className="text-lg font-semibold text-gray-900">€15,420.50</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Comisiones totales:</span>
            <span className="text-xs text-gray-500">€458.62</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="mb-8">
        <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-700/50 shadow-xl shadow-blue-900/20' 
            : 'bg-gradient-to-r from-white/80 to-blue-50/80 border-blue-200/50 shadow-xl shadow-blue-200/20'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestión de Pagos
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            TPV/links, conciliación de cobros y devoluciones
          </p>
        </div>
      </div>

      <div className={`mb-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${  
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700/50' 
          : 'bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-200/50'
      }`}>
        <nav className="p-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                activeTab === 'pagos'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/30'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Pagos</span>
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                activeTab === 'links'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200/30'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Link className="h-5 w-5" />
              <span>Links de Pago</span>
            </button>
            <button
              onClick={() => setActiveTab('devoluciones')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                activeTab === 'devoluciones'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-900/30'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-200/30'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Devoluciones</span>
            </button>
            <button
              onClick={() => setActiveTab('conciliacion')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                activeTab === 'conciliacion'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-900/30'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-200/30'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Conciliación</span>
            </button>
          </div>
        </nav>
      </div>

      <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700/50' 
          : 'bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-200/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`pointer-events-none absolute inset-y-0 left-0 h-full w-5 ml-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                className={`block w-full px-4 py-3 pl-10 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder={
                  activeTab === 'pagos' ? 'Buscar pagos...' :
                  activeTab === 'links' ? 'Buscar links...' :
                  activeTab === 'devoluciones' ? 'Buscar devoluciones...' :
                  'Buscar transacciones...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {activeTab === 'pagos' && (
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <Filter className="h-5 w-5" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              <select
                className={`px-4 py-2 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="completado">Completado</option>
                <option value="pendiente">Pendiente</option>
                <option value="fallido">Fallido</option>
                <option value="procesando">Procesando</option>
              </select>
              <select
                className={`px-4 py-2 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={selectedMetodo}
                onChange={(e) => setSelectedMetodo(e.target.value)}
              >
                <option value="todos">Todos los métodos</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="link_pago">Link de pago</option>
                <option value="financiacion">Financiación</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'pagos' && renderPagos()}
      {activeTab === 'links' && renderLinks()}
      {activeTab === 'devoluciones' && renderDevoluciones()}
      {activeTab === 'conciliacion' && renderConciliacion()}

      {/* Register Payment Modal */}
      <RegisterPaymentModal
        isOpen={showRegisterPaymentModal}
        onClose={() => setShowRegisterPaymentModal(false)}
        onSubmit={handleRegisterPayment}
      />
    </div>
  );
};

export default Pagos;