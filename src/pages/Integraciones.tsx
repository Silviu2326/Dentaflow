import React, { useState } from 'react';
import {
  Settings,
  Search,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Database,
  Phone,
  CreditCard,
  FileText,
  BarChart3,
  Cloud,
  Shield,
  Key,
  Monitor,
  Wifi,
  Download,
  Upload,
  RefreshCw,
  Link as LinkIcon,
  Activity,
  Filter,
  Bell,
  Clock
} from 'lucide-react';

interface Integracion {
  id: string;
  nombre: string;
  categoria: 'contabilidad' | 'firma_digital' | 'tpv' | 'telefonia' | 'bi' | 'otros';
  proveedor: string;
  estado: 'activa' | 'inactiva' | 'error' | 'configurando';
  descripcion: string;
  ultimaSync: string;
  version: string;
  configuracion: Record<string, any>;
}

interface LogIntegracion {
  id: string;
  integracionId: string;
  integracionNombre: string;
  tipo: 'sync' | 'error' | 'config' | 'auth';
  mensaje: string;
  detalles?: string;
  timestamp: string;
  estado: 'exito' | 'warning' | 'error';
}

interface EstadisticaIntegracion {
  categoria: string;
  total: number;
  activas: number;
  inactivas: number;
  errores: number;
  ultimaSemana: {
    sincronizaciones: number;
    errores: number;
  };
}

const Integraciones: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integraciones' | 'logs' | 'estadisticas'>('integraciones');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [selectedEstado, setSelectedEstado] = useState('todos');

  const [integraciones] = useState<Integracion[]>([
    {
      id: '1',
      nombre: 'A3 Software Contabilidad',
      categoria: 'contabilidad',
      proveedor: 'A3 Software',
      estado: 'activa',
      descripcion: 'Sincronización automática de facturas y cobros con el sistema contable',
      ultimaSync: '2024-01-16T08:00:00',
      version: '2.4.1',
      configuracion: {
        servidor: 'api.a3software.es',
        empresa: 'CLINICA_DENTAL_SL',
        ultimaFactura: 'FAC-2024-0150'
      }
    },
    {
      id: '2',
      nombre: 'Sage 50 Contabilidad',
      categoria: 'contabilidad',
      proveedor: 'Sage',
      estado: 'inactiva',
      descripcion: 'Integración con Sage 50 para gestión contable y fiscal',
      ultimaSync: '2024-01-10T15:30:00',
      version: '1.8.5',
      configuracion: {
        baseDatos: 'SAGE_CLINICA',
        servidor: 'localhost',
        puerto: 1433
      }
    },
    {
      id: '3',
      nombre: 'DocuSign Firma Digital',
      categoria: 'firma_digital',
      proveedor: 'DocuSign',
      estado: 'activa',
      descripcion: 'Firma electrónica avanzada para consentimientos y contratos',
      ultimaSync: '2024-01-16T10:15:00',
      version: '3.2.0',
      configuracion: {
        endpoint: 'https://demo.docusign.net/restapi',
        accountId: 'acc_12345',
        documentosFirmados: 45
      }
    },
    {
      id: '4',
      nombre: 'Stripe Pagos',
      categoria: 'tpv',
      proveedor: 'Stripe',
      estado: 'activa',
      descripcion: 'Procesamiento de pagos online y gestión de suscripciones',
      ultimaSync: '2024-01-16T11:45:00',
      version: '4.1.2',
      configuracion: {
        publishableKey: 'pk_test_...',
        webhook: 'activo',
        transaccionesUltimoMes: 156
      }
    },
    {
      id: '5',
      nombre: 'RedSys TPV',
      categoria: 'tpv',
      proveedor: 'Servired/RedSys',
      estado: 'error',
      descripcion: 'Terminal punto de venta físico para pagos con tarjeta',
      ultimaSync: '2024-01-15T16:20:00',
      version: '2.0.8',
      configuracion: {
        comercio: '123456789',
        terminal: '001',
        ultimoError: 'Conexión timeout'
      }
    },
    {
      id: '6',
      nombre: 'Asterisk PBX',
      categoria: 'telefonia',
      proveedor: 'Asterisk',
      estado: 'activa',
      descripcion: 'Centralita VoIP con grabación de llamadas y gestión de contactos',
      ultimaSync: '2024-01-16T12:00:00',
      version: '18.12.0',
      configuracion: {
        servidor: '192.168.1.100',
        extensiones: 12,
        llamadasHoy: 28
      }
    },
    {
      id: '7',
      nombre: 'Power BI Analytics',
      categoria: 'bi',
      proveedor: 'Microsoft',
      estado: 'configurando',
      descripcion: 'Dashboards e informes avanzados de business intelligence',
      ultimaSync: '2024-01-15T09:30:00',
      version: '1.5.3',
      configuracion: {
        workspace: 'clinica-analytics',
        reportes: 8,
        usuarios: 5
      }
    }
  ]);

  const [logs] = useState<LogIntegracion[]>([
    {
      id: '1',
      integracionId: '1',
      integracionNombre: 'A3 Software Contabilidad',
      tipo: 'sync',
      mensaje: 'Sincronización completada exitosamente',
      detalles: '25 facturas exportadas, 18 cobros registrados',
      timestamp: '2024-01-16T08:00:00',
      estado: 'exito'
    },
    {
      id: '2',
      integracionId: '5',
      integracionNombre: 'RedSys TPV',
      tipo: 'error',
      mensaje: 'Error de conexión con terminal',
      detalles: 'Timeout después de 30 segundos. Verificar conectividad de red.',
      timestamp: '2024-01-15T16:20:00',
      estado: 'error'
    },
    {
      id: '3',
      integracionId: '4',
      integracionNombre: 'Stripe Pagos',
      tipo: 'sync',
      mensaje: 'Webhook recibido correctamente',
      detalles: 'Pago procesado: €350.00 - Implante dental',
      timestamp: '2024-01-16T11:45:00',
      estado: 'exito'
    },
    {
      id: '4',
      integracionId: '3',
      integracionNombre: 'DocuSign Firma Digital',
      tipo: 'auth',
      mensaje: 'Token de autenticación renovado',
      detalles: 'Nuevo token válido hasta: 2024-02-16',
      timestamp: '2024-01-16T10:15:00',
      estado: 'exito'
    },
    {
      id: '5',
      integracionId: '7',
      integracionNombre: 'Power BI Analytics',
      tipo: 'config',
      mensaje: 'Configuración de dataset actualizada',
      detalles: 'Nuevas métricas de KPI agregadas al dashboard principal',
      timestamp: '2024-01-15T14:30:00',
      estado: 'warning'
    }
  ]);

  const estadisticas: EstadisticaIntegracion[] = [
    {
      categoria: 'contabilidad',
      total: 2,
      activas: 1,
      inactivas: 1,
      errores: 0,
      ultimaSemana: { sincronizaciones: 42, errores: 0 }
    },
    {
      categoria: 'firma_digital',
      total: 1,
      activas: 1,
      inactivas: 0,
      errores: 0,
      ultimaSemana: { sincronizaciones: 15, errores: 0 }
    },
    {
      categoria: 'tpv',
      total: 2,
      activas: 1,
      inactivas: 0,
      errores: 1,
      ultimaSemana: { sincronizaciones: 156, errores: 3 }
    },
    {
      categoria: 'telefonia',
      total: 1,
      activas: 1,
      inactivas: 0,
      errores: 0,
      ultimaSemana: { sincronizaciones: 168, errores: 0 }
    },
    {
      categoria: 'bi',
      total: 1,
      activas: 0,
      inactivas: 0,
      errores: 0,
      ultimaSemana: { sincronizaciones: 7, errores: 1 }
    }
  ];

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'contabilidad': return <FileText className="h-5 w-5" />;
      case 'firma_digital': return <Shield className="h-5 w-5" />;
      case 'tpv': return <CreditCard className="h-5 w-5" />;
      case 'telefonia': return <Phone className="h-5 w-5" />;
      case 'bi': return <BarChart3 className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'contabilidad': return 'text-blue-600 bg-blue-100';
      case 'firma_digital': return 'text-green-600 bg-green-100';
      case 'tpv': return 'text-purple-600 bg-purple-100';
      case 'telefonia': return 'text-orange-600 bg-orange-100';
      case 'bi': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'text-green-600 bg-green-100';
      case 'inactiva': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'configurando': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activa': return <CheckCircle className="h-4 w-4" />;
      case 'inactiva': return <XCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'configurando': return <Settings className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getTipoLogIcon = (tipo: string) => {
    switch (tipo) {
      case 'sync': return <RefreshCw className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'config': return <Settings className="h-4 w-4" />;
      case 'auth': return <Key className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getLogEstadoColor = (estado: string) => {
    switch (estado) {
      case 'exito': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredIntegraciones = integraciones.filter(integracion => {
    const matchesSearch = integracion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integracion.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'todas' || integracion.categoria === selectedCategoria;
    const matchesEstado = selectedEstado === 'todos' || integracion.estado === selectedEstado;
    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const filteredLogs = logs.filter(log =>
    log.integracionNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderIntegraciones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Integraciones Disponibles</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Config
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Integración
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Activas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integraciones.filter(i => i.estado === 'activa').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Con Errores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integraciones.filter(i => i.estado === 'error').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Configurando</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integraciones.filter(i => i.estado === 'configurando').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{integraciones.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredIntegraciones.map((integracion) => (
          <div key={integracion.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(integracion.categoria)}`}>
                    {getCategoriaIcon(integracion.categoria)}
                    <span className="ml-2 capitalize">{integracion.categoria.replace('_', ' ')}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(integracion.estado)}`}>
                    {getEstadoIcon(integracion.estado)}
                    <span className="ml-1 capitalize">{integracion.estado}</span>
                  </span>
                  <span className="text-xs text-gray-500">v{integracion.version}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{integracion.nombre}</h4>
                  <span className="text-sm text-gray-500">by {integracion.proveedor}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{integracion.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Última sincronización:</span>
                    <br />
                    <span className={`${new Date(integracion.ultimaSync) < new Date(Date.now() - 24 * 60 * 60 * 1000) ? 'text-yellow-600' : 'text-green-600'}`}>
                      {new Date(integracion.ultimaSync).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Configuración:</span>
                    <br />
                    {Object.entries(integracion.configuracion).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        {key}: {typeof value === 'string' ? value.substring(0, 20) + (value.length > 20 ? '...' : '') : value}
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="font-medium">Estado de conexión:</span>
                    <br />
                    <div className="flex items-center mt-1">
                      {integracion.estado === 'activa' ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">Conectado</span>
                        </>
                      ) : integracion.estado === 'error' ? (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600">Error de conexión</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-gray-600">Desconectado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="text-gray-400 hover:text-gray-500">
                  <Monitor className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-500">
                  <RefreshCw className="h-5 w-5" />
                </button>
                {integracion.estado === 'error' && (
                  <button className="text-red-400 hover:text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Logs de Integraciones</h3>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Operaciones Exitosas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {logs.filter(l => l.estado === 'exito').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Advertencias</p>
              <p className="text-2xl font-semibold text-gray-900">
                {logs.filter(l => l.estado === 'warning').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Errores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {logs.filter(l => l.estado === 'error').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Eventos</p>
              <p className="text-2xl font-semibold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <li key={log.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLogEstadoColor(log.estado)}`}>
                      {getTipoLogIcon(log.tipo)}
                      <span className="ml-1 capitalize">{log.tipo}</span>
                    </span>
                    <span className="text-sm font-medium text-gray-900">{log.integracionNombre}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{log.mensaje}</p>
                  {log.detalles && (
                    <p className="text-xs text-gray-600">{log.detalles}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  {log.estado === 'error' && (
                    <button className="text-red-400 hover:text-red-500">
                      <Bell className="h-4 w-4" />
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

  const renderEstadisticas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Estadísticas de Integraciones</h3>
        <div className="flex space-x-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard Completo
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Reporte Mensual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Resumen por Categoría</h4>
          <div className="space-y-4">
            {estadisticas.map((categoria) => (
              <div key={categoria.categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(categoria.categoria)}`}>
                    {getCategoriaIcon(categoria.categoria)}
                    <span className="ml-2 capitalize">{categoria.categoria.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-gray-900">{categoria.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">{categoria.activas}</div>
                    <div className="text-xs text-gray-500">Activas</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600">{categoria.inactivas}</div>
                    <div className="text-xs text-gray-500">Inactivas</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">{categoria.errores}</div>
                    <div className="text-xs text-gray-500">Errores</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Actividad Última Semana</h4>
          <div className="space-y-4">
            {estadisticas.map((categoria) => (
              <div key={categoria.categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(categoria.categoria)}`}>
                    {getCategoriaIcon(categoria.categoria)}
                    <span className="ml-2 capitalize">{categoria.categoria.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-blue-600">{categoria.ultimaSemana.sincronizaciones}</div>
                    <div className="text-xs text-gray-500">Sincronizaciones</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">{categoria.ultimaSemana.errores}</div>
                    <div className="text-xs text-gray-500">Errores</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Rendimiento General</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">97.8%</div>
            <div className="text-sm text-gray-600">Disponibilidad</div>
            <div className="text-xs text-gray-500 mt-1">Último mes</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">388</div>
            <div className="text-sm text-gray-600">Sincronizaciones</div>
            <div className="text-xs text-gray-500 mt-1">Última semana</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">1.2s</div>
            <div className="text-sm text-gray-600">Tiempo respuesta</div>
            <div className="text-xs text-gray-500 mt-1">Promedio</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">4</div>
            <div className="text-sm text-gray-600">Errores totales</div>
            <div className="text-xs text-gray-500 mt-1">Última semana</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integraciones</h1>
        <p className="text-gray-600">Contabilidad (A3/Sage), firma avanzada, TPV (Stripe/RedSys), telefonía, BI</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('integraciones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'integraciones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Integraciones
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Logs de Actividad
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'estadisticas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Estadísticas
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
                activeTab === 'integraciones' ? 'Buscar integraciones...' :
                activeTab === 'logs' ? 'Buscar en logs...' :
                'Buscar estadísticas...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {activeTab === 'integraciones' && (
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              <option value="contabilidad">Contabilidad</option>
              <option value="firma_digital">Firma Digital</option>
              <option value="tpv">TPV</option>
              <option value="telefonia">Telefonía</option>
              <option value="bi">Business Intelligence</option>
            </select>
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
              <option value="error">Error</option>
              <option value="configurando">Configurando</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'integraciones' && renderIntegraciones()}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'estadisticas' && renderEstadisticas()}
    </div>
  );
};

export default Integraciones;