import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'pagos' | 'links' | 'devoluciones' | 'conciliacion'>('pagos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [selectedMetodo, setSelectedMetodo] = useState('todos');

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
    switch (estado) {
      case 'completado':
      case 'pagado':
      case 'completada': return 'text-green-600 bg-green-100';
      case 'pendiente':
      case 'activo':
      case 'solicitada': return 'text-yellow-600 bg-yellow-100';
      case 'procesando': return 'text-blue-600 bg-blue-100';
      case 'fallido':
      case 'rechazada': return 'text-red-600 bg-red-100';
      case 'devuelto':
      case 'vencido':
      case 'cancelado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  const renderPagos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Pagos</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Pago
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Pagos Completados</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{pagos.filter(p => p.estado === 'completado').reduce((acc, p) => acc + p.importe, 0).toLocaleString()}
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
                €{pagos.filter(p => p.estado === 'pendiente').reduce((acc, p) => acc + p.importe, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Fallidos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagos.filter(p => p.estado === 'fallido').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Comisiones</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{pagos.reduce((acc, p) => acc + p.comision, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredPagos.map((pago) => (
            <li key={pago.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{pago.pacienteNombre}</h4>
                    <span className="text-sm text-gray-500">{pago.numeroTransaccion}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pago.estado)}`}>
                      {getEstadoIcon(pago.estado)}
                      <span className="ml-1 capitalize">{pago.estado}</span>
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {getMetodoIcon(pago.metodoPago)}
                      <span className="ml-1 capitalize">{pago.metodoPago.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pago.concepto}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Importe:</span> €{pago.importe.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Comisión:</span> €{pago.comision.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Neto:</span> €{pago.importeNeto.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Fecha:</span> {new Date(pago.fechaPago).toLocaleDateString()}
                    </div>
                  </div>
                  {pago.pasarelaPago && (
                    <div className="mt-1 text-xs text-gray-500">
                      Pasarela: {pago.pasarelaPago} {pago.referenciaExterna && `| Ref: ${pago.referenciaExterna}`}
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
                  {pago.estado === 'fallido' && (
                    <button className="text-red-400 hover:text-red-500">
                      <RefreshCw className="h-4 w-4" />
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

  const renderLinks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Links de Pago</h3>
        <div className="flex space-x-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Estados
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Crear Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Links Pagados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {linksPago.filter(l => l.estado === 'pagado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Link className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Links Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {linksPago.filter(l => l.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Links Vencidos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {linksPago.filter(l => l.estado === 'vencido').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Importe Pendiente</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{linksPago.filter(l => l.estado === 'activo').reduce((acc, l) => acc + l.importe, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredLinks.map((link) => (
            <li key={link.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{link.pacienteNombre}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(link.estado)}`}>
                      {getEstadoIcon(link.estado)}
                      <span className="ml-1 capitalize">{link.estado}</span>
                    </span>
                    {link.intentosPago > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {link.intentosPago} intentos
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{link.concepto}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Importe:</span> €{link.importe.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Creado:</span> {new Date(link.fechaCreacion).toLocaleDateString()}
                    </div>
                    <div className={`${new Date(link.fechaVencimiento) < new Date() ? 'text-red-600' : ''}`}>
                      <span className="font-medium">Vence:</span> {new Date(link.fechaVencimiento).toLocaleDateString()}
                    </div>
                    {link.ultimoIntento && (
                      <div>
                        <span className="font-medium">Último intento:</span> {new Date(link.ultimoIntento).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                    <Link className="h-3 w-3" />
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{link.url}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  {link.estado === 'activo' && (
                    <button className="text-blue-400 hover:text-blue-500">
                      <RefreshCw className="h-4 w-4" />
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

  const renderDevoluciones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Devoluciones y Reembolsos</h3>
        <div className="flex space-x-3">
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Reporte Devoluciones
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Devolución
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Conciliación de Cobros</h3>
        <div className="flex space-x-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Importar Extracto
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ejecutar Conciliación
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Última Conciliación - 15 Enero 2024</h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Stripe - Pagos con tarjeta</p>
                <p className="text-xs text-gray-500">Periodo: 01-15 Enero 2024</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">€8,450.20</p>
              <p className="text-xs text-gray-500">89 transacciones</p>
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Pagos</h1>
        <p className="text-gray-600">TPV/links, conciliación de cobros y devoluciones</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pagos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pagos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="h-4 w-4 inline mr-2" />
            Pagos
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'links'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Link className="h-4 w-4 inline mr-2" />
            Links de Pago
          </button>
          <button
            onClick={() => setActiveTab('devoluciones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'devoluciones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Devoluciones
          </button>
          <button
            onClick={() => setActiveTab('conciliacion')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'conciliacion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Conciliación
          </button>
        </nav>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
            <input
              type="text"
              className="block w-full border-gray-300 rounded-md pl-10 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

      {activeTab === 'pagos' && renderPagos()}
      {activeTab === 'links' && renderLinks()}
      {activeTab === 'devoluciones' && renderDevoluciones()}
      {activeTab === 'conciliacion' && renderConciliacion()}
    </div>
  );
};

export default Pagos;