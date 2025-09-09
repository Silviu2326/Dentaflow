import React, { useState } from 'react';
import { Shield, Download, Trash2, Clock, User, FileText, AlertCircle, CheckCircle, Eye, Search, Filter, Calendar } from 'lucide-react';

interface ConsentimientoRGPD {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: 'tratamiento_datos' | 'marketing' | 'terceros' | 'transferencia_internacional';
  estado: 'otorgado' | 'retirado' | 'pendiente';
  fecha: string;
  version: string;
  origen: 'web' | 'presencial' | 'telefono' | 'email';
  detalles: string;
}

interface SolicitudExportacion {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'procesando' | 'completada' | 'enviada';
  tipoExportacion: 'completa' | 'basica' | 'personalizada';
  archivoGenerado?: string;
  fechaEnvio?: string;
  email: string;
}

interface SolicitudEliminacion {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'evaluacion' | 'aprobada' | 'completada' | 'rechazada';
  motivo: string;
  fechaEjecucion?: string;
  responsable?: string;
  observaciones?: string;
}

interface ConfiguracionRetencion {
  categoria: string;
  tiempoRetencion: number;
  unidad: 'dias' | 'meses' | 'años';
  criterioEliminacion: string;
  activo: boolean;
}

export default function AjustesPrivacidad() {
  const [activeTab, setActiveTab] = useState<'consentimientos' | 'exportaciones' | 'eliminacion' | 'retencion' | 'dpa'>('consentimientos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  const consentimientos: ConsentimientoRGPD[] = [
    {
      id: 'CONS001',
      pacienteId: 'PAC001',
      pacienteNombre: 'María González',
      tipo: 'tratamiento_datos',
      estado: 'otorgado',
      fecha: '2024-01-15',
      version: 'v2.1',
      origen: 'web',
      detalles: 'Consentimiento para tratamiento de datos personales y sanitarios'
    },
    {
      id: 'CONS002',
      pacienteId: 'PAC002',
      pacienteNombre: 'Carlos Ruiz',
      tipo: 'marketing',
      estado: 'retirado',
      fecha: '2024-01-10',
      version: 'v2.0',
      origen: 'email',
      detalles: 'Consentimiento para comunicaciones comerciales retirado'
    },
    {
      id: 'CONS003',
      pacienteId: 'PAC003',
      pacienteNombre: 'Ana Torres',
      tipo: 'terceros',
      estado: 'pendiente',
      fecha: '2024-01-18',
      version: 'v2.1',
      origen: 'presencial',
      detalles: 'Consentimiento para compartir datos con laboratorio externo'
    }
  ];

  const exportaciones: SolicitudExportacion[] = [
    {
      id: 'EXP001',
      pacienteId: 'PAC001',
      pacienteNombre: 'María González',
      fechaSolicitud: '2024-01-15',
      estado: 'completada',
      tipoExportacion: 'completa',
      archivoGenerado: 'maria_gonzalez_datos_completos.zip',
      fechaEnvio: '2024-01-16',
      email: 'maria@example.com'
    },
    {
      id: 'EXP002',
      pacienteId: 'PAC004',
      pacienteNombre: 'Luis Martín',
      fechaSolicitud: '2024-01-18',
      estado: 'procesando',
      tipoExportacion: 'basica',
      email: 'luis@example.com'
    }
  ];

  const eliminaciones: SolicitudEliminacion[] = [
    {
      id: 'DEL001',
      pacienteId: 'PAC005',
      pacienteNombre: 'Elena Rodríguez',
      fechaSolicitud: '2024-01-12',
      estado: 'evaluacion',
      motivo: 'Solicitud del interesado - derecho al olvido',
      responsable: 'Dr. González'
    },
    {
      id: 'DEL002',
      pacienteId: 'PAC006',
      pacienteNombre: 'Pedro López',
      fechaSolicitud: '2024-01-05',
      estado: 'completada',
      motivo: 'Finalización de relación comercial',
      fechaEjecucion: '2024-01-20',
      responsable: 'Admin',
      observaciones: 'Datos históricos conservados por obligación legal'
    }
  ];

  const configuracionRetencion: ConfiguracionRetencion[] = [
    {
      categoria: 'Datos Personales Básicos',
      tiempoRetencion: 10,
      unidad: 'años',
      criterioEliminacion: 'Desde última visita médica',
      activo: true
    },
    {
      categoria: 'Historia Clínica',
      tiempoRetencion: 15,
      unidad: 'años',
      criterioEliminacion: 'Obligación legal sanitaria',
      activo: true
    },
    {
      categoria: 'Datos de Marketing',
      tiempoRetencion: 3,
      unidad: 'años',
      criterioEliminacion: 'Desde última interacción',
      activo: true
    },
    {
      categoria: 'Registros de Auditoría',
      tiempoRetencion: 6,
      unidad: 'años',
      criterioEliminacion: 'Desde creación del registro',
      activo: true
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'otorgado':
      case 'completada':
      case 'enviada':
        return 'bg-green-100 text-green-800';
      case 'retirado':
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'procesando':
      case 'evaluacion':
        return 'bg-blue-100 text-blue-800';
      case 'aprobada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'otorgado':
      case 'completada':
      case 'enviada':
        return <CheckCircle className="h-4 w-4" />;
      case 'retirado':
      case 'rechazada':
        return <AlertCircle className="h-4 w-4" />;
      case 'pendiente':
      case 'procesando':
      case 'evaluacion':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const exportarDatosPaciente = (pacienteId: string) => {
    console.log(`Iniciando exportación para paciente ${pacienteId}`);
  };

  const procesarEliminacion = (solicitudId: string) => {
    console.log(`Procesando eliminación ${solicitudId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajustes de Privacidad</h1>
          <p className="text-gray-600">Gestión RGPD, DPA, retención/borrado de datos y exportaciones por paciente</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Informe Cumplimiento</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('consentimientos')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'consentimientos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Consentimientos
        </button>
        <button
          onClick={() => setActiveTab('exportaciones')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'exportaciones'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Download className="h-4 w-4 inline mr-2" />
          Exportaciones
        </button>
        <button
          onClick={() => setActiveTab('eliminacion')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'eliminacion'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Trash2 className="h-4 w-4 inline mr-2" />
          Eliminación
        </button>
        <button
          onClick={() => setActiveTab('retencion')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'retencion'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          Retención
        </button>
        <button
          onClick={() => setActiveTab('dpa')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'dpa'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          DPA
        </button>
      </div>

      {activeTab === 'consentimientos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="otorgado">Otorgado</option>
                <option value="retirado">Retirado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Versión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consentimientos
                    .filter(c => filtroEstado === 'todos' || c.estado === filtroEstado)
                    .filter(c => c.pacienteNombre.toLowerCase().includes(busqueda.toLowerCase()))
                    .map((consentimiento) => (
                    <tr key={consentimiento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{consentimiento.pacienteNombre}</div>
                          <div className="text-sm text-gray-500">{consentimiento.pacienteId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {consentimiento.tipo.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(consentimiento.estado)}`}>
                          {getEstadoIcon(consentimiento.estado)}
                          <span className="ml-1">{consentimiento.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consentimiento.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consentimiento.version}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consentimiento.origen}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                        <button className="text-green-600 hover:text-green-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exportaciones' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Nueva Exportación</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo Exportación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Archivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exportaciones.map((exportacion) => (
                    <tr key={exportacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{exportacion.pacienteNombre}</div>
                          <div className="text-sm text-gray-500">{exportacion.pacienteId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {exportacion.tipoExportacion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(exportacion.estado)}`}>
                          {getEstadoIcon(exportacion.estado)}
                          <span className="ml-1">{exportacion.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exportacion.fechaSolicitud}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exportacion.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exportacion.archivoGenerado ? (
                          <button className="text-blue-600 hover:text-blue-900 text-sm">
                            {exportacion.archivoGenerado}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {exportacion.estado === 'completada' && (
                          <button className="text-green-600 hover:text-green-900 mr-3">Reenviar</button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'eliminacion' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Solicitudes de Eliminación</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eliminaciones.map((eliminacion) => (
                    <tr key={eliminacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{eliminacion.pacienteNombre}</div>
                          <div className="text-sm text-gray-500">{eliminacion.pacienteId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(eliminacion.estado)}`}>
                          {getEstadoIcon(eliminacion.estado)}
                          <span className="ml-1">{eliminacion.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{eliminacion.fechaSolicitud}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{eliminacion.motivo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{eliminacion.responsable || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {eliminacion.estado === 'pendiente' && (
                          <>
                            <button 
                              onClick={() => procesarEliminacion(eliminacion.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Aprobar
                            </button>
                            <button className="text-red-600 hover:text-red-900 mr-3">Rechazar</button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'retencion' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Políticas de Retención de Datos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiempo Retención
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criterio Eliminación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {configuracionRetencion.map((config, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{config.categoria}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {config.tiempoRetencion} {config.unidad}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{config.criterioEliminacion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          config.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {config.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ejecutar Limpieza Automática</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Ejecutar proceso automático de eliminación de datos según las políticas configuradas
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Última ejecución: 15 de enero, 2024 a las 02:00 AM
                </p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Ejecutar Limpieza</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dpa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Processing Agreements (DPA)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Procesadores de Datos Externos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">Laboratorio Dental XYZ</div>
                      <div className="text-xs text-gray-500">DPA firmado: 15/03/2023</div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Activo</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">Servicio de Backup Cloud</div>
                      <div className="text-xs text-gray-500">DPA firmado: 10/01/2024</div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Activo</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">Sistema de Email Marketing</div>
                      <div className="text-xs text-red-500">Vence: 28/02/2024</div>
                    </div>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Venciendo</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Registros de Actividades</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de tratamientos:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categorías de datos:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bases legales activas:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transferencias internacionales:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="pt-3 border-t">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                      Generar Registro Completo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración RGPD</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notificaciones de Brecha</h4>
                  <p className="text-xs text-gray-500">Notificar automáticamente a las autoridades en caso de brecha</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Log de Accesos</h4>
                  <p className="text-xs text-gray-500">Registrar todos los accesos a datos personales</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Anonimización Automática</h4>
                  <p className="text-xs text-gray-500">Anonimizar datos cuando expire el periodo de retención</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}