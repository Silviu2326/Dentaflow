import React, { useState } from 'react';
import { Webhook, Key, Activity, AlertCircle, CheckCircle, Clock, Eye, EyeOff, Copy, Trash2, Plus, RefreshCw } from 'lucide-react';

interface WebhookConfig {
  id: string;
  nombre: string;
  url: string;
  eventos: string[];
  activo: boolean;
  ultimaEjecucion: string;
  estado: 'activo' | 'error' | 'pendiente';
  reintentos: number;
  secreto: string;
}

interface LogWebhook {
  id: string;
  webhookId: string;
  evento: string;
  timestamp: string;
  estado: 'exitoso' | 'fallido' | 'reintentando';
  respuesta: number;
  tiempoRespuesta: number;
  payload: any;
  error?: string;
}

interface ApiKey {
  id: string;
  nombre: string;
  key: string;
  scopes: string[];
  ultimoUso: string;
  requests: number;
  limite: number;
  activa: boolean;
  expira: string;
}

export default function Webhooks() {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'logs' | 'keys' | 'playground'>('webhooks');
  const [mostrarSecreto, setMostrarSecreto] = useState<string>('');

  const webhooks: WebhookConfig[] = [
    {
      id: 'WH001',
      nombre: 'Notificaciones Pacientes',
      url: 'https://api.clinica.com/webhooks/pacientes',
      eventos: ['paciente.creado', 'paciente.actualizado', 'cita.agendada'],
      activo: true,
      ultimaEjecucion: '2024-01-15 10:30:00',
      estado: 'activo',
      reintentos: 0,
      secreto: 'wh_secret_abc123xyz789'
    },
    {
      id: 'WH002',
      nombre: 'Sincronización Contabilidad',
      url: 'https://contabilidad.empresa.com/api/sync',
      eventos: ['factura.creada', 'pago.recibido'],
      activo: true,
      ultimaEjecucion: '2024-01-15 09:45:00',
      estado: 'error',
      reintentos: 3,
      secreto: 'wh_secret_def456uvw012'
    },
    {
      id: 'WH003',
      nombre: 'CRM Marketing',
      url: 'https://crm.marketing.com/webhook',
      eventos: ['presupuesto.enviado', 'presupuesto.aceptado'],
      activo: false,
      ultimaEjecucion: '2024-01-14 16:20:00',
      estado: 'pendiente',
      reintentos: 0,
      secreto: 'wh_secret_ghi789rst345'
    }
  ];

  const logs: LogWebhook[] = [
    {
      id: 'LOG001',
      webhookId: 'WH001',
      evento: 'paciente.creado',
      timestamp: '2024-01-15 10:30:15',
      estado: 'exitoso',
      respuesta: 200,
      tiempoRespuesta: 450,
      payload: { pacienteId: 'PAC001', nombre: 'Juan Pérez' }
    },
    {
      id: 'LOG002',
      webhookId: 'WH002',
      evento: 'factura.creada',
      timestamp: '2024-01-15 09:45:20',
      estado: 'fallido',
      respuesta: 500,
      tiempoRespuesta: 5000,
      payload: { facturaId: 'FAC001' },
      error: 'Error interno del servidor'
    },
    {
      id: 'LOG003',
      webhookId: 'WH001',
      evento: 'cita.agendada',
      timestamp: '2024-01-15 08:15:30',
      estado: 'exitoso',
      respuesta: 201,
      tiempoRespuesta: 320,
      payload: { citaId: 'CIT001', pacienteId: 'PAC002' }
    }
  ];

  const apiKeys: ApiKey[] = [
    {
      id: 'KEY001',
      nombre: 'App Móvil',
      key: 'pk_live_abc123def456ghi789jkl012',
      scopes: ['read:pacientes', 'write:citas', 'read:tratamientos'],
      ultimoUso: '2024-01-15 11:20:00',
      requests: 2450,
      limite: 5000,
      activa: true,
      expira: '2025-01-15'
    },
    {
      id: 'KEY002',
      nombre: 'Integración CRM',
      key: 'pk_test_mno345pqr678stu901vwx234',
      scopes: ['read:pacientes', 'write:presupuestos', 'read:facturas'],
      ultimoUso: '2024-01-15 09:30:00',
      requests: 856,
      limite: 2000,
      activa: true,
      expira: '2024-12-31'
    },
    {
      id: 'KEY003',
      nombre: 'Backup System',
      key: 'pk_live_yza567bcd890efg123hij456',
      scopes: ['read:all'],
      ultimoUso: '2024-01-14 02:00:00',
      requests: 125,
      limite: 1000,
      activa: false,
      expira: '2024-06-30'
    }
  ];

  const eventos = [
    'paciente.creado', 'paciente.actualizado', 'paciente.eliminado',
    'cita.agendada', 'cita.cancelada', 'cita.completada',
    'presupuesto.enviado', 'presupuesto.aceptado', 'presupuesto.rechazado',
    'factura.creada', 'factura.enviada', 'pago.recibido'
  ];

  const scopes = [
    'read:pacientes', 'write:pacientes',
    'read:citas', 'write:citas',
    'read:tratamientos', 'write:tratamientos',
    'read:presupuestos', 'write:presupuestos',
    'read:facturas', 'write:facturas',
    'read:all', 'write:all'
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'exitoso':
        return 'bg-green-100 text-green-800';
      case 'error':
      case 'fallido':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
      case 'reintentando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'exitoso':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
      case 'fallido':
        return <AlertCircle className="h-4 w-4" />;
      case 'pendiente':
      case 'reintentando':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhooks & API</h1>
          <p className="text-gray-600">Gestión de webhooks, claves API, logs y playground para testing</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nuevo Webhook</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'webhooks'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Webhook className="h-4 w-4 inline mr-2" />
          Webhooks
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Logs
        </button>
        <button
          onClick={() => setActiveTab('keys')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'keys'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Key className="h-4 w-4 inline mr-2" />
          API Keys
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'playground'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <RefreshCw className="h-4 w-4 inline mr-2" />
          Playground
        </button>
      </div>

      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Webhook
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eventos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Ejecución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {webhooks.map((webhook) => (
                    <tr key={webhook.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{webhook.nombre}</div>
                          <div className="text-sm text-gray-500">{webhook.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{webhook.url}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {webhook.eventos.slice(0, 2).map((evento, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {evento}
                            </span>
                          ))}
                          {webhook.eventos.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{webhook.eventos.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(webhook.estado)}`}>
                          {getEstadoIcon(webhook.estado)}
                          <span className="ml-1">{webhook.estado}</span>
                        </span>
                        {webhook.reintentos > 0 && (
                          <div className="text-xs text-red-500 mt-1">{webhook.reintentos} reintentos</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{webhook.ultimaEjecucion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Test</button>
                          <button className="text-green-600 hover:text-green-900">Editar</button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Logs de Webhooks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Webhook
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Respuesta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiempo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.timestamp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.webhookId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {log.evento}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(log.estado)}`}>
                          {getEstadoIcon(log.estado)}
                          <span className="ml-1">{log.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${log.respuesta >= 200 && log.respuesta < 300 ? 'text-green-600' : 'text-red-600'}`}>
                          {log.respuesta}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.tiempoRespuesta}ms</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Ver Detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva API Key</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scopes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Uso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expira
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{key.nombre}</div>
                          <div className="text-sm text-gray-500">{key.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-900">
                            {mostrarSecreto === key.id ? key.key : '••••••••••••••••••••••••'}
                          </span>
                          <button
                            onClick={() => setMostrarSecreto(mostrarSecreto === key.id ? '' : key.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {mostrarSecreto === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => copiarTexto(key.key)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {key.scopes.slice(0, 2).map((scope, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {scope}
                            </span>
                          ))}
                          {key.scopes.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{key.scopes.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {key.requests} / {key.limite}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(key.requests / key.limite) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{key.ultimoUso}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{key.expira}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900">Editar</button>
                          <button className="text-red-600 hover:text-red-900">Revocar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'playground' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Playground</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>GET /api/v1/pacientes</option>
                    <option>POST /api/v1/pacientes</option>
                    <option>GET /api/v1/citas</option>
                    <option>POST /api/v1/citas</option>
                    <option>GET /api/v1/tratamientos</option>
                    <option>POST /api/v1/facturas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {apiKeys.filter(key => key.activa).map(key => (
                      <option key={key.id} value={key.id}>{key.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Body (JSON)</label>
                <textarea
                  rows={8}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder='{\n  "nombre": "Juan Pérez",\n  "email": "juan@example.com",\n  "telefono": "123456789"\n}'
                />
              </div>

              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Ejecutar Request
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Respuesta</h3>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-600">
{`{
  "status": 200,
  "data": {
    "id": "PAC001",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "fecha_creacion": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}