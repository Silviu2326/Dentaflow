import React, { useState } from 'react';
import { Code, Book, Activity, Shield, Zap, ExternalLink, Copy, Check } from 'lucide-react';

interface EndpointDoc {
  method: string;
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  response: any;
  example?: string;
}

export default function API() {
  const [activeSection, setActiveSection] = useState<'documentation' | 'limits' | 'status'>('documentation');
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc | null>(null);
  const [copied, setCopied] = useState<string>('');

  const endpoints: { [key: string]: EndpointDoc[] } = {
    'Pacientes': [
      {
        method: 'GET',
        path: '/api/v1/pacientes',
        description: 'Obtener lista de pacientes',
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Número de página' },
          { name: 'limit', type: 'number', required: false, description: 'Elementos por página' },
          { name: 'search', type: 'string', required: false, description: 'Búsqueda por nombre o email' }
        ],
        response: {
          data: [
            {
              id: 'PAC001',
              nombre: 'Juan Pérez',
              email: 'juan@example.com',
              telefono: '123456789',
              fecha_nacimiento: '1985-06-15',
              created_at: '2024-01-15T10:30:00Z'
            }
          ],
          meta: {
            total: 150,
            page: 1,
            per_page: 20,
            total_pages: 8
          }
        },
        example: 'curl -H "Authorization: Bearer your-api-key" https://api.clinica.com/v1/pacientes'
      },
      {
        method: 'POST',
        path: '/api/v1/pacientes',
        description: 'Crear nuevo paciente',
        parameters: [
          { name: 'nombre', type: 'string', required: true, description: 'Nombre completo del paciente' },
          { name: 'email', type: 'string', required: true, description: 'Email del paciente' },
          { name: 'telefono', type: 'string', required: false, description: 'Teléfono de contacto' }
        ],
        response: {
          data: {
            id: 'PAC002',
            nombre: 'María González',
            email: 'maria@example.com',
            telefono: '987654321',
            created_at: '2024-01-15T11:00:00Z'
          }
        },
        example: `curl -X POST -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"nombre": "María González", "email": "maria@example.com"}' \\
  https://api.clinica.com/v1/pacientes`
      }
    ],
    'Citas': [
      {
        method: 'GET',
        path: '/api/v1/citas',
        description: 'Obtener lista de citas',
        parameters: [
          { name: 'fecha_inicio', type: 'date', required: false, description: 'Fecha inicio del rango' },
          { name: 'fecha_fin', type: 'date', required: false, description: 'Fecha fin del rango' },
          { name: 'profesional_id', type: 'string', required: false, description: 'ID del profesional' }
        ],
        response: {
          data: [
            {
              id: 'CIT001',
              paciente_id: 'PAC001',
              profesional_id: 'PROF001',
              fecha_hora: '2024-01-20T09:00:00Z',
              duracion: 60,
              estado: 'confirmada',
              notas: 'Consulta de control'
            }
          ]
        },
        example: 'curl -H "Authorization: Bearer your-api-key" "https://api.clinica.com/v1/citas?fecha_inicio=2024-01-20"'
      }
    ],
    'Tratamientos': [
      {
        method: 'GET',
        path: '/api/v1/tratamientos',
        description: 'Obtener lista de tratamientos',
        response: {
          data: [
            {
              id: 'TRAT001',
              nombre: 'Limpieza dental',
              precio: 60.00,
              duracion_estimada: 30,
              categoria: 'Preventiva'
            }
          ]
        },
        example: 'curl -H "Authorization: Bearer your-api-key" https://api.clinica.com/v1/tratamientos'
      }
    ]
  };

  const rateLimits = [
    { tier: 'Free', requests: 1000, window: 'por hora', burst: 100 },
    { tier: 'Pro', requests: 5000, window: 'por hora', burst: 500 },
    { tier: 'Enterprise', requests: 50000, window: 'por hora', burst: 2000 }
  ];

  const apiStatus = [
    { service: 'API Core', status: 'operational', uptime: '99.9%', response_time: '120ms' },
    { service: 'Webhooks', status: 'operational', uptime: '99.8%', response_time: '200ms' },
    { service: 'Authentication', status: 'operational', uptime: '100%', response_time: '50ms' },
    { service: 'Database', status: 'degraded', uptime: '98.5%', response_time: '350ms' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'outage':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800';
      case 'POST':
        return 'bg-green-100 text-green-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-600">Documentación completa, límites de uso y estado de los servicios API</p>
        </div>
        <div className="flex space-x-2">
          <a
            href="#"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Swagger UI</span>
          </a>
          <a
            href="#"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <Book className="h-4 w-4" />
            <span>ReDoc</span>
          </a>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveSection('documentation')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'documentation'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Book className="h-4 w-4 inline mr-2" />
          Documentación
        </button>
        <button
          onClick={() => setActiveSection('limits')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'limits'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Límites
        </button>
        <button
          onClick={() => setActiveSection('status')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'status'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Estado
        </button>
      </div>

      {activeSection === 'documentation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h3>
              <nav className="space-y-2">
                {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                    {categoryEndpoints.map((endpoint, index) => (
                      <button
                        key={`${category}-${index}`}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        className={`w-full text-left p-2 rounded text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                          selectedEndpoint === endpoint ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <span className="font-mono text-gray-600">{endpoint.path}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-lg font-semibold text-gray-900">
                    {selectedEndpoint.path}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedEndpoint.description}</p>

                {selectedEndpoint.parameters && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Parámetros</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requerido</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedEndpoint.parameters.map((param, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 font-mono text-sm">{param.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{param.type}</td>
                              <td className="px-4 py-2 text-sm">
                                {param.required ? (
                                  <span className="text-red-600">Sí</span>
                                ) : (
                                  <span className="text-gray-400">No</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Respuesta</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      {JSON.stringify(selectedEndpoint.response, null, 2)}
                    </pre>
                  </div>
                </div>

                {selectedEndpoint.example && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">Ejemplo</h4>
                      <button
                        onClick={() => copyToClipboard(selectedEndpoint.example!, 'example')}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        {copied === 'example' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span>Copiar</span>
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-gray-300 text-sm">
                        {selectedEndpoint.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un endpoint</h3>
                <p className="text-gray-500">Elige un endpoint de la lista para ver su documentación detallada</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'limits' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rateLimits.map((limit, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{limit.tier}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Requests:</span>
                      <span className="font-medium">{limit.requests.toLocaleString()} {limit.window}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burst:</span>
                      <span className="font-medium">{limit.burst} requests</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Códigos de Error</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solución</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm">401</td>
                    <td className="px-6 py-4 text-sm">No autorizado</td>
                    <td className="px-6 py-4 text-sm">Verificar API key en header Authorization</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm">429</td>
                    <td className="px-6 py-4 text-sm">Límite de requests excedido</td>
                    <td className="px-6 py-4 text-sm">Esperar antes de hacer más requests</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm">422</td>
                    <td className="px-6 py-4 text-sm">Error de validación</td>
                    <td className="px-6 py-4 text-sm">Verificar formato de datos enviados</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {apiStatus.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{service.service}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium text-green-600">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response:</span>
                    <span className="font-medium">{service.response_time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Incidencias</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Degradación en Base de Datos</h4>
                  <span className="text-xs text-gray-500">Hace 2 horas</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Incremento en tiempo de respuesta debido a mantenimiento programado
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                  Investigando
                </span>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Outage de Webhooks</h4>
                  <span className="text-xs text-gray-500">Hace 1 día</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Problema temporal en el servicio de webhooks. Resuelto en 15 minutos
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Resuelto
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}