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
import NewIntegrationModal from '../components/NewIntegrationModal';

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
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false);

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

  const handleCreateIntegration = (integrationData: any) => {
    console.log('Creating integration:', integrationData);
  };

  const filteredLogs = logs.filter(log =>
    log.integracionNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderIntegraciones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Integraciones Disponibles</h3>
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Download className="h-5 w-5 mr-2" />
            Exportar Config
          </button>
          <button
            onClick={() => setShowNewIntegrationModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Integración
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Activas</p>
              <p className="text-3xl font-bold text-white mt-1">
                {integraciones.filter(i => i.estado === 'activa').length}
              </p>
              <p className="text-green-100 text-xs mt-1">Funcionando correctamente</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Con Errores</p>
              <p className="text-3xl font-bold text-white mt-1">
                {integraciones.filter(i => i.estado === 'error').length}
              </p>
              <p className="text-red-100 text-xs mt-1">Requieren atención</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Configurando</p>
              <p className="text-3xl font-bold text-white mt-1">
                {integraciones.filter(i => i.estado === 'configurando').length}
              </p>
              <p className="text-yellow-100 text-xs mt-1">En proceso de setup</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Settings className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-white mt-1">{integraciones.length}</p>
              <p className="text-blue-100 text-xs mt-1">Integraciones disponibles</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredIntegraciones.map((integracion) => (
          <div key={integracion.id} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getCategoriaColor(integracion.categoria)} border-2 border-white shadow-lg`}>
                    {getCategoriaIcon(integracion.categoria)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{integracion.nombre}</h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">by {integracion.proveedor}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border-2 ${getCategoriaColor(integracion.categoria)} ${getCategoriaColor(integracion.categoria).includes('blue') ? 'border-blue-200' : getCategoriaColor(integracion.categoria).includes('green') ? 'border-green-200' : getCategoriaColor(integracion.categoria).includes('purple') ? 'border-purple-200' : getCategoriaColor(integracion.categoria).includes('orange') ? 'border-orange-200' : 'border-indigo-200'}`}>
                        <span className="capitalize">{integracion.categoria.replace('_', ' ')}</span>
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getEstadoColor(integracion.estado)} ${getEstadoColor(integracion.estado).includes('green') ? 'border-green-200' : getEstadoColor(integracion.estado).includes('red') ? 'border-red-200' : getEstadoColor(integracion.estado).includes('yellow') ? 'border-yellow-200' : 'border-gray-200'}`}>
                        {getEstadoIcon(integracion.estado)}
                        <span className="ml-1 capitalize">{integracion.estado}</span>
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">v{integracion.version}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">{integracion.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <div className="text-xs font-bold text-blue-600 mb-2">Última sincronización</div>
                    <div className={`text-sm font-bold ${new Date(integracion.ultimaSync) < new Date(Date.now() - 24 * 60 * 60 * 1000) ? 'text-yellow-600' : 'text-green-600'}`}>
                      {new Date(integracion.ultimaSync).toLocaleString('es-ES')}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="text-xs font-bold text-purple-600 mb-2">Configuración</div>
                    <div className="space-y-1">
                      {Object.entries(integracion.configuracion).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="text-xs font-medium text-gray-700">
                          <span className="text-purple-600">{key}:</span> {typeof value === 'string' ? value.substring(0, 20) + (value.length > 20 ? '...' : '') : value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
                    <div className="text-xs font-bold text-green-600 mb-2">Estado de conexión</div>
                    <div className="flex items-center">
                      {integracion.estado === 'activa' ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-bold text-green-600">Conectado</span>
                        </>
                      ) : integracion.estado === 'error' ? (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm font-bold text-red-600">Error de conexión</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-bold text-gray-600">Desconectado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-6">
                <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 group" title="Monitorizar">
                  <Monitor className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
                <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-lg transition-colors duration-200 group" title="Editar">
                  <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
                <button className="bg-green-100 text-green-600 hover:bg-green-200 p-3 rounded-lg transition-colors duration-200 group" title="Sincronizar">
                  <RefreshCw className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
                {integracion.estado === 'error' && (
                  <button className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-lg transition-colors duration-200 group" title="Ver errores">
                    <AlertTriangle className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
          <button className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <RefreshCw className="h-5 w-5 mr-2" />
            Actualizar
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Download className="h-5 w-5 mr-2" />
            Exportar Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Operaciones Exitosas</p>
              <p className="text-3xl font-bold text-white mt-1">
                {logs.filter(l => l.estado === 'exito').length}
              </p>
              <p className="text-green-100 text-xs mt-1">Procesadas correctamente</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Advertencias</p>
              <p className="text-3xl font-bold text-white mt-1">
                {logs.filter(l => l.estado === 'warning').length}
              </p>
              <p className="text-yellow-100 text-xs mt-1">Requieren revisión</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Errores</p>
              <p className="text-3xl font-bold text-white mt-1">
                {logs.filter(l => l.estado === 'error').length}
              </p>
              <p className="text-red-100 text-xs mt-1">Fallaron en el proceso</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <XCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Eventos</p>
              <p className="text-3xl font-bold text-white mt-1">{logs.length}</p>
              <p className="text-blue-100 text-xs mt-1">Registrados en el sistema</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getLogEstadoColor(log.estado)} border-2 border-white shadow-lg`}>
                    {getTipoLogIcon(log.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getLogEstadoColor(log.estado)} ${getLogEstadoColor(log.estado).includes('green') ? 'border-green-200' : getLogEstadoColor(log.estado).includes('yellow') ? 'border-yellow-200' : getLogEstadoColor(log.estado).includes('red') ? 'border-red-200' : 'border-gray-200'}`}>
                        <span className="capitalize">{log.tipo}</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">{log.integracionNombre}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        {new Date(log.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{log.mensaje}</p>
                  {log.detalles && (
                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg">{log.detalles}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-6">
                {log.estado === 'error' && (
                  <button className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-lg transition-colors duration-200 group" title="Notificar error">
                    <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEstadisticas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Estadísticas de Integraciones</h3>
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <BarChart3 className="h-5 w-5 mr-2" />
            Dashboard Completo
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Download className="h-5 w-5 mr-2" />
            Reporte Mensual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl mr-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Resumen por Categoría</h4>
              <p className="text-gray-600 text-sm">Estado actual de cada tipo de integración</p>
            </div>
          </div>
          <div className="space-y-4">
            {estadisticas.map((categoria) => (
              <div key={categoria.categoria} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getCategoriaColor(categoria.categoria)} ${getCategoriaColor(categoria.categoria).includes('blue') ? 'border-blue-200' : getCategoriaColor(categoria.categoria).includes('green') ? 'border-green-200' : getCategoriaColor(categoria.categoria).includes('purple') ? 'border-purple-200' : getCategoriaColor(categoria.categoria).includes('orange') ? 'border-orange-200' : 'border-indigo-200'}`}>
                    {getCategoriaIcon(categoria.categoria)}
                    <span className="ml-2 capitalize">{categoria.categoria.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-lg font-bold text-gray-900">{categoria.total}</div>
                    <div className="text-xs font-medium text-gray-500">Total</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-600">{categoria.activas}</div>
                    <div className="text-xs font-medium text-gray-500">Activas</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-lg font-bold text-gray-600">{categoria.inactivas}</div>
                    <div className="text-xs font-medium text-gray-500">Inactivas</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-600">{categoria.errores}</div>
                    <div className="text-xs font-medium text-gray-500">Errores</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-green-100 to-teal-100 p-3 rounded-xl mr-4">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Actividad Última Semana</h4>
              <p className="text-gray-600 text-sm">Sincronizaciones y errores por categoría</p>
            </div>
          </div>
          <div className="space-y-4">
            {estadisticas.map((categoria) => (
              <div key={categoria.categoria} className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getCategoriaColor(categoria.categoria)} ${getCategoriaColor(categoria.categoria).includes('blue') ? 'border-blue-200' : getCategoriaColor(categoria.categoria).includes('green') ? 'border-green-200' : getCategoriaColor(categoria.categoria).includes('purple') ? 'border-purple-200' : getCategoriaColor(categoria.categoria).includes('orange') ? 'border-orange-200' : 'border-indigo-200'}`}>
                    {getCategoriaIcon(categoria.categoria)}
                    <span className="ml-2 capitalize">{categoria.categoria.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-white p-3 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">{categoria.ultimaSemana.sincronizaciones}</div>
                    <div className="text-xs font-medium text-gray-500">Sincronizaciones</div>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-600">{categoria.ultimaSemana.errores}</div>
                    <div className="text-xs font-medium text-gray-500">Errores</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl mr-4">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Rendimiento General</h4>
            <p className="text-gray-600 text-sm">Métricas clave del sistema de integraciones</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">97.8%</div>
              <div className="text-sm font-medium text-green-100">Disponibilidad</div>
              <div className="text-xs text-green-200 mt-1">Último mes</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">388</div>
              <div className="text-sm font-medium text-blue-100">Sincronizaciones</div>
              <div className="text-xs text-blue-200 mt-1">Última semana</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1.2s</div>
              <div className="text-sm font-medium text-yellow-100">Tiempo respuesta</div>
              <div className="text-xs text-yellow-200 mt-1">Promedio</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4</div>
              <div className="text-sm font-medium text-red-100">Errores totales</div>
              <div className="text-xs text-red-200 mt-1">Última semana</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Integraciones
          </h1>
          <p className="text-gray-600 text-lg">
            Contabilidad (A3/Sage), firma avanzada, TPV (Stripe/RedSys), telefonía, BI
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('integraciones')}
              className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'integraciones'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'integraciones' 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-blue-100'
              }`}>
                <Settings className={`h-5 w-5 ${
                  activeTab === 'integraciones' ? 'text-white' : 'text-blue-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Integraciones</div>
                <div className={`text-xs ${
                  activeTab === 'integraciones' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  Gestionar conexiones
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'logs' 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-green-100'
              }`}>
                <Activity className={`h-5 w-5 ${
                  activeTab === 'logs' ? 'text-white' : 'text-green-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Logs de Actividad</div>
                <div className={`text-xs ${
                  activeTab === 'logs' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  Historial de eventos
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'estadisticas'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'estadisticas' 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-purple-100'
              }`}>
                <BarChart3 className={`h-5 w-5 ${
                  activeTab === 'estadisticas' ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Estadísticas</div>
                <div className={`text-xs ${
                  activeTab === 'estadisticas' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  Métricas y rendimiento
                </div>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                </div>
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
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
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
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
        </div>
      </div>

      {activeTab === 'integraciones' && renderIntegraciones()}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'estadisticas' && renderEstadisticas()}

      {/* New Integration Modal */}
      <NewIntegrationModal
        isOpen={showNewIntegrationModal}
        onClose={() => setShowNewIntegrationModal(false)}
        onSubmit={handleCreateIntegration}
      />
    </div>
  );
};

export default Integraciones;