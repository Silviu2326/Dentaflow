import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Server, Database, Wifi, Shield, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

interface ServicioEstado {
  id: string;
  nombre: string;
  estado: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  ultimaVerificacion: string;
  descripcion: string;
  metricas: {
    requests24h: number;
    errores24h: number;
    disponibilidad30d: number;
  };
}

interface IncidenciaEstado {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severidad: 'low' | 'medium' | 'high' | 'critical';
  fechaInicio: string;
  fechaResolucion?: string;
  serviciosAfectados: string[];
  actualizaciones: {
    timestamp: string;
    mensaje: string;
    autor: string;
  }[];
}

interface MetricaSistema {
  nombre: string;
  valor: number;
  unidad: string;
  estado: 'good' | 'warning' | 'critical';
  tendencia: 'up' | 'down' | 'stable';
  ultimaActualizacion: string;
}

export default function Status() {
  const [vistaActiva, setVistaActiva] = useState<'servicios' | 'incidencias' | 'metricas' | 'historial'>('servicios');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  const servicios: ServicioEstado[] = [
    {
      id: 'api-core',
      nombre: 'API Core',
      estado: 'operational',
      uptime: 99.97,
      responseTime: 145,
      ultimaVerificacion: '2024-01-15 12:30:00',
      descripcion: 'Servicios principales de la API REST',
      metricas: {
        requests24h: 125430,
        errores24h: 23,
        disponibilidad30d: 99.94
      }
    },
    {
      id: 'database',
      nombre: 'Base de Datos',
      estado: 'degraded',
      uptime: 98.85,
      responseTime: 320,
      ultimaVerificacion: '2024-01-15 12:29:45',
      descripcion: 'Cluster principal de PostgreSQL',
      metricas: {
        requests24h: 89650,
        errores24h: 156,
        disponibilidad30d: 98.12
      }
    },
    {
      id: 'web-app',
      nombre: 'Aplicación Web',
      estado: 'operational',
      uptime: 99.99,
      responseTime: 890,
      ultimaVerificacion: '2024-01-15 12:30:15',
      descripcion: 'Frontend de la aplicación web',
      metricas: {
        requests24h: 34520,
        errores24h: 2,
        disponibilidad30d: 99.96
      }
    },
    {
      id: 'webhooks',
      nombre: 'Webhooks',
      estado: 'operational',
      uptime: 99.92,
      responseTime: 230,
      ultimaVerificacion: '2024-01-15 12:29:55',
      descripcion: 'Sistema de notificaciones webhooks',
      metricas: {
        requests24h: 5620,
        errores24h: 8,
        disponibilidad30d: 99.89
      }
    },
    {
      id: 'backup',
      nombre: 'Sistema Backup',
      estado: 'maintenance',
      uptime: 100,
      responseTime: 0,
      ultimaVerificacion: '2024-01-15 02:00:00',
      descripcion: 'Servicios de copia de seguridad',
      metricas: {
        requests24h: 48,
        errores24h: 0,
        disponibilidad30d: 99.98
      }
    },
    {
      id: 'auth',
      nombre: 'Autenticación',
      estado: 'operational',
      uptime: 100,
      responseTime: 85,
      ultimaVerificacion: '2024-01-15 12:30:10',
      descripcion: 'Sistema de autenticación y autorización',
      metricas: {
        requests24h: 15430,
        errores24h: 0,
        disponibilidad30d: 100
      }
    }
  ];

  const incidencias: IncidenciaEstado[] = [
    {
      id: 'INC001',
      titulo: 'Degradación en rendimiento de base de datos',
      descripcion: 'Se ha detectado un incremento en los tiempos de respuesta de las consultas a la base de datos principal.',
      estado: 'monitoring',
      severidad: 'medium',
      fechaInicio: '2024-01-15 09:45:00',
      serviciosAfectados: ['database', 'api-core'],
      actualizaciones: [
        {
          timestamp: '2024-01-15 11:30:00',
          mensaje: 'Se han aplicado optimizaciones a las consultas más lentas. Monitoreando impacto.',
          autor: 'Equipo Técnico'
        },
        {
          timestamp: '2024-01-15 10:15:00',
          mensaje: 'Identificado cuello de botella en consultas de reportes. Implementando solución.',
          autor: 'Admin DB'
        },
        {
          timestamp: '2024-01-15 09:45:00',
          mensaje: 'Detectado incremento en tiempos de respuesta. Investigando causa.',
          autor: 'Monitor Automático'
        }
      ]
    },
    {
      id: 'INC002',
      titulo: 'Mantenimiento programado del sistema de backup',
      descripcion: 'Mantenimiento programado para actualización del sistema de backup.',
      estado: 'resolved',
      severidad: 'low',
      fechaInicio: '2024-01-15 02:00:00',
      fechaResolucion: '2024-01-15 04:30:00',
      serviciosAfectados: ['backup'],
      actualizaciones: [
        {
          timestamp: '2024-01-15 04:30:00',
          mensaje: 'Mantenimiento completado exitosamente. Todos los servicios funcionando normalmente.',
          autor: 'Equipo DevOps'
        },
        {
          timestamp: '2024-01-15 02:00:00',
          mensaje: 'Iniciando mantenimiento programado del sistema de backup.',
          autor: 'Equipo DevOps'
        }
      ]
    }
  ];

  const metricas: MetricaSistema[] = [
    {
      nombre: 'CPU Usage',
      valor: 45.2,
      unidad: '%',
      estado: 'good',
      tendencia: 'stable',
      ultimaActualizacion: '2024-01-15 12:30:00'
    },
    {
      nombre: 'Memory Usage',
      valor: 68.7,
      unidad: '%',
      estado: 'warning',
      tendencia: 'up',
      ultimaActualizacion: '2024-01-15 12:30:00'
    },
    {
      nombre: 'Disk Usage',
      valor: 34.1,
      unidad: '%',
      estado: 'good',
      tendencia: 'stable',
      ultimaActualizacion: '2024-01-15 12:30:00'
    },
    {
      nombre: 'Active Users',
      valor: 234,
      unidad: 'users',
      estado: 'good',
      tendencia: 'up',
      ultimaActualizacion: '2024-01-15 12:30:00'
    },
    {
      nombre: 'API Requests/min',
      valor: 1456,
      unidad: 'req/min',
      estado: 'good',
      tendencia: 'stable',
      ultimaActualizacion: '2024-01-15 12:30:00'
    },
    {
      nombre: 'Error Rate',
      valor: 0.18,
      unidad: '%',
      estado: 'good',
      tendencia: 'down',
      ultimaActualizacion: '2024-01-15 12:30:00'
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'outage':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'outage':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricaColor = (estado: string) => {
    switch (estado) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-gray-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const actualizarEstado = async () => {
    setActualizandoEstado(true);
    // Simular actualización
    await new Promise(resolve => setTimeout(resolve, 2000));
    setActualizandoEstado(false);
  };

  const estadoGeneral = servicios.every(s => s.estado === 'operational') ? 'operational' : 
                       servicios.some(s => s.estado === 'outage') ? 'outage' : 'degraded';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estado del Sistema</h1>
          <p className="text-gray-600">Monitoreo en tiempo real, uptime, incidencias y métricas del sistema</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={actualizarEstado}
            disabled={actualizandoEstado}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${actualizandoEstado ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Estado General */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center space-x-4">
          {getEstadoIcon(estadoGeneral)}
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {estadoGeneral === 'operational' ? 'Todos los sistemas operativos' :
               estadoGeneral === 'outage' ? 'Interrupción del servicio' : 'Rendimiento degradado'}
            </div>
            <div className="text-sm text-gray-500">Última actualización: 15 de enero, 2024 - 12:30</div>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setVistaActiva('servicios')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'servicios'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Server className="h-4 w-4 inline mr-2" />
          Servicios
        </button>
        <button
          onClick={() => setVistaActiva('incidencias')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'incidencias'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertCircle className="h-4 w-4 inline mr-2" />
          Incidencias
        </button>
        <button
          onClick={() => setVistaActiva('metricas')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'metricas'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Métricas
        </button>
        <button
          onClick={() => setVistaActiva('historial')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            vistaActiva === 'historial'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Historial
        </button>
      </div>

      {vistaActiva === 'servicios' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {servicio.id === 'api-core' && <Server className="h-6 w-6 text-blue-600" />}
                    {servicio.id === 'database' && <Database className="h-6 w-6 text-green-600" />}
                    {servicio.id === 'web-app' && <Wifi className="h-6 w-6 text-purple-600" />}
                    {servicio.id === 'webhooks' && <Activity className="h-6 w-6 text-orange-600" />}
                    {servicio.id === 'backup' && <Shield className="h-6 w-6 text-gray-600" />}
                    {servicio.id === 'auth' && <Shield className="h-6 w-6 text-red-600" />}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{servicio.nombre}</h3>
                      <p className="text-sm text-gray-500">{servicio.descripcion}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(servicio.estado)}`}>
                    {getEstadoIcon(servicio.estado)}
                    <span className="ml-1">{servicio.estado}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Uptime:</span>
                    <div className="font-medium">{servicio.uptime}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Response:</span>
                    <div className="font-medium">{servicio.responseTime}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Requests 24h:</span>
                    <div className="font-medium">{servicio.metricas.requests24h.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Errores 24h:</span>
                    <div className="font-medium">{servicio.metricas.errores24h}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Última verificación: {servicio.ultimaVerificacion}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        servicio.uptime >= 99.5 ? 'bg-green-500' :
                        servicio.uptime >= 98 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${servicio.uptime}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vistaActiva === 'incidencias' && (
        <div className="space-y-6">
          {incidencias.map((incidencia) => (
            <div key={incidencia.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{incidencia.titulo}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeveridadColor(incidencia.severidad)}`}>
                      {incidencia.severidad}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(incidencia.estado)}`}>
                      {incidencia.estado}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{incidencia.descripcion}</p>
                  <div className="text-sm text-gray-500">
                    <span>Inicio: {incidencia.fechaInicio}</span>
                    {incidencia.fechaResolucion && (
                      <span className="ml-4">Resolución: {incidencia.fechaResolucion}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Servicios Afectados:</h4>
                <div className="flex flex-wrap gap-2">
                  {incidencia.serviciosAfectados.map((servicio, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {servicios.find(s => s.id === servicio)?.nombre || servicio}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Actualizaciones:</h4>
                <div className="space-y-3">
                  {incidencia.actualizaciones.map((actualizacion, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{actualizacion.autor}</span>
                        <span className="text-xs text-gray-500">{actualizacion.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{actualizacion.mensaje}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {vistaActiva === 'metricas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricas.map((metrica, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{metrica.nombre}</h3>
                  {getTendenciaIcon(metrica.tendencia)}
                </div>
                <div className="text-3xl font-bold mb-2">
                  <span className={getMetricaColor(metrica.estado)}>
                    {metrica.valor.toLocaleString()} {metrica.unidad}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Actualizado: {metrica.ultimaActualizacion}
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metrica.estado === 'good' ? 'bg-green-500' :
                        metrica.estado === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: metrica.nombre === 'CPU Usage' || metrica.nombre === 'Memory Usage' || metrica.nombre === 'Disk Usage' ? 
                          `${metrica.valor}%` : '75%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vistaActiva === 'historial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidad por Servicio (Últimos 30 días)</h3>
            <div className="space-y-4">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{servicio.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{servicio.metricas.disponibilidad30d}%</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          servicio.metricas.disponibilidad30d >= 99.5 ? 'bg-green-500' :
                          servicio.metricas.disponibilidad30d >= 98 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${servicio.metricas.disponibilidad30d}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidencias Resueltas Recientes</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Lentitud en consultas de reportes</span>
                  <span className="text-xs text-gray-500">Hace 3 días</span>
                </div>
                <p className="text-sm text-gray-600">Optimización de índices en base de datos. Duración: 2h 15min</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Timeout en webhooks de terceros</span>
                  <span className="text-xs text-gray-500">Hace 1 semana</span>
                </div>
                <p className="text-sm text-gray-600">Incremento en timeout de requests externos. Duración: 45min</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}