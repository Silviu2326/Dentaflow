import React, { useState } from 'react';
import { Eye, Download, User, FileText, Shield, Search, Filter, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface LogAcceso {
  id: string;
  usuario: string;
  accion: string;
  recurso: string;
  detalles: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  resultado: 'exitoso' | 'fallido' | 'bloqueado';
  riesgo: 'bajo' | 'medio' | 'alto';
  ubicacion?: string;
}

interface LogDescarga {
  id: string;
  usuario: string;
  archivo: string;
  tipo: 'documento' | 'imagen' | 'reporte' | 'export' | 'backup';
  tamaño: number;
  timestamp: string;
  ip: string;
  motivo?: string;
  pacienteRelacionado?: string;
}

interface LogFirma {
  id: string;
  usuario: string;
  documento: string;
  tipoDocumento: 'consentimiento' | 'contrato' | 'presupuesto' | 'historia_clinica' | 'otro';
  metodoFirma: 'digital' | 'electronica' | 'manuscrita';
  timestamp: string;
  ip: string;
  certificado?: string;
  validez: 'valida' | 'invalida' | 'pendiente';
  pacienteId?: string;
}

interface AlertaSeguridad {
  id: string;
  tipo: 'acceso_sospechoso' | 'multiples_intentos' | 'ubicacion_inusual' | 'horario_inusual' | 'exportacion_masiva';
  descripcion: string;
  usuario: string;
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  timestamp: string;
  estado: 'nueva' | 'investigando' | 'resuelta' | 'falsa_alarma';
  detalles: any;
}

export default function Auditoria() {
  const [activeTab, setActiveTab] = useState<'accesos' | 'descargas' | 'firmas' | 'alertas'>('accesos');
  const [filtroFecha, setFiltroFecha] = useState<'hoy' | 'semana' | 'mes' | 'personalizado'>('hoy');
  const [busqueda, setBusqueda] = useState<string>('');

  const logsAcceso: LogAcceso[] = [
    {
      id: 'ACC001',
      usuario: 'Dr. González',
      accion: 'Ver paciente',
      recurso: '/pacientes/PAC001',
      detalles: 'Acceso a historia clínica de María López',
      timestamp: '2024-01-15 14:30:15',
      ip: '192.168.1.105',
      userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
      resultado: 'exitoso',
      riesgo: 'bajo',
      ubicacion: 'Madrid, España'
    },
    {
      id: 'ACC002',
      usuario: 'Recepcionista Ana',
      accion: 'Exportar datos',
      recurso: '/exportar/pacientes',
      detalles: 'Exportación masiva de datos de pacientes',
      timestamp: '2024-01-15 13:45:22',
      ip: '192.168.1.110',
      userAgent: 'Mozilla/5.0 Firefox/121.0',
      resultado: 'exitoso',
      riesgo: 'medio',
      ubicacion: 'Madrid, España'
    },
    {
      id: 'ACC003',
      usuario: 'Admin',
      accion: 'Intento login',
      recurso: '/login',
      detalles: 'Múltiples intentos fallidos de inicio de sesión',
      timestamp: '2024-01-15 09:15:33',
      ip: '85.132.45.67',
      userAgent: 'curl/7.68.0',
      resultado: 'fallido',
      riesgo: 'alto',
      ubicacion: 'Ubicación desconocida'
    }
  ];

  const logsDescarga: LogDescarga[] = [
    {
      id: 'DESC001',
      usuario: 'Dr. González',
      archivo: 'radiografia_pac001_2024.jpg',
      tipo: 'imagen',
      tamaño: 2048576,
      timestamp: '2024-01-15 15:20:10',
      ip: '192.168.1.105',
      pacienteRelacionado: 'PAC001',
      motivo: 'Consulta médica'
    },
    {
      id: 'DESC002',
      usuario: 'Contable María',
      archivo: 'informe_financiero_diciembre.pdf',
      tipo: 'reporte',
      tamaño: 1024000,
      timestamp: '2024-01-15 11:30:45',
      ip: '192.168.1.112',
      motivo: 'Revisión mensual'
    },
    {
      id: 'DESC003',
      usuario: 'Dr. Martín',
      archivo: 'backup_historias_clinicas.zip',
      tipo: 'backup',
      tamaño: 157286400,
      timestamp: '2024-01-15 08:00:00',
      ip: '192.168.1.108',
      motivo: 'Backup programado'
    }
  ];

  const logsFirma: LogFirma[] = [
    {
      id: 'FIRM001',
      usuario: 'Dr. González',
      documento: 'Consentimiento informado - Implante dental',
      tipoDocumento: 'consentimiento',
      metodoFirma: 'digital',
      timestamp: '2024-01-15 16:45:30',
      ip: '192.168.1.105',
      certificado: 'CERT_DIG_12345',
      validez: 'valida',
      pacienteId: 'PAC001'
    },
    {
      id: 'FIRM002',
      usuario: 'Paciente María López',
      documento: 'Autorización tratamiento ortodóncico',
      tipoDocumento: 'consentimiento',
      metodoFirma: 'electronica',
      timestamp: '2024-01-15 14:20:15',
      ip: '94.142.33.22',
      validez: 'valida',
      pacienteId: 'PAC002'
    }
  ];

  const alertas: AlertaSeguridad[] = [
    {
      id: 'ALT001',
      tipo: 'acceso_sospechoso',
      descripcion: 'Múltiples intentos de acceso fallidos desde IP externa',
      usuario: 'Admin',
      severidad: 'alta',
      timestamp: '2024-01-15 09:15:33',
      estado: 'investigando',
      detalles: {
        ip: '85.132.45.67',
        intentos: 15,
        tiempo: '5 minutos'
      }
    },
    {
      id: 'ALT002',
      tipo: 'exportacion_masiva',
      descripcion: 'Exportación de gran cantidad de datos de pacientes',
      usuario: 'Recepcionista Ana',
      severidad: 'media',
      timestamp: '2024-01-15 13:45:22',
      estado: 'nueva',
      detalles: {
        registros: 1250,
        tamaño: '45MB'
      }
    },
    {
      id: 'ALT003',
      tipo: 'ubicacion_inusual',
      descripción: 'Acceso desde ubicación no habitual',
      usuario: 'Dr. Martín',
      severidad: 'baja',
      timestamp: '2024-01-15 07:30:00',
      estado: 'resuelta',
      detalles: {
        ubicacion_habitual: 'Madrid',
        ubicacion_detectada: 'Barcelona',
        distancia: '620km'
      }
    }
  ];

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'exitoso':
        return 'bg-green-100 text-green-800';
      case 'fallido':
        return 'bg-red-100 text-red-800';
      case 'bloqueado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'bajo':
        return 'bg-green-100 text-green-800';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'alto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'baja':
        return 'bg-blue-100 text-blue-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'critica':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidezIcon = (validez: string) => {
    switch (validez) {
      case 'valida':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'invalida':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pendiente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditoría</h1>
          <p className="text-gray-600">Registro de accesos, descargas, firmas y alertas de seguridad</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value as any)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="personalizado">Personalizado</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar Logs</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('accesos')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'accesos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Eye className="h-4 w-4 inline mr-2" />
          Accesos
        </button>
        <button
          onClick={() => setActiveTab('descargas')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'descargas'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Download className="h-4 w-4 inline mr-2" />
          Descargas
        </button>
        <button
          onClick={() => setActiveTab('firmas')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'firmas'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Firmas
        </button>
        <button
          onClick={() => setActiveTab('alertas')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alertas'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Alertas
        </button>
      </div>

      {/* Filtros comunes */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario, acción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {activeTab === 'accesos' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recurso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Riesgo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP/Ubicación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logsAcceso
                  .filter(log => log.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                                log.accion.toLowerCase().includes(busqueda.toLowerCase()))
                  .map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.usuario}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.accion}</div>
                      <div className="text-sm text-gray-500">{log.detalles}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{log.recurso}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultadoColor(log.resultado)}`}>
                        {log.resultado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiesgoColor(log.riesgo)}`}>
                        {log.riesgo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.ip}</div>
                      <div className="text-sm text-gray-500">{log.ubicacion}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'descargas' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Archivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logsDescarga
                  .filter(log => log.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                                log.archivo.toLowerCase().includes(busqueda.toLowerCase()))
                  .map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{log.usuario}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{log.archivo}</div>
                      {log.pacienteRelacionado && (
                        <div className="text-sm text-gray-500">Paciente: {log.pacienteRelacionado}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatBytes(log.tamaño)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{log.ip}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.motivo || '-'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'firmas' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validez
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logsFirma
                  .filter(log => log.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                                log.documento.toLowerCase().includes(busqueda.toLowerCase()))
                  .map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.usuario}</div>
                          {log.pacienteId && (
                            <div className="text-sm text-gray-500">Paciente: {log.pacienteId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{log.documento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {log.tipoDocumento.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.metodoFirma}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getValidezIcon(log.validez)}
                        <span className="ml-2 text-sm">{log.validez}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{log.certificado || '-'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'alertas' && (
        <div className="space-y-4">
          {alertas.map((alerta) => (
            <div key={alerta.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className={`h-6 w-6 ${
                      alerta.severidad === 'critica' ? 'text-red-600' :
                      alerta.severidad === 'alta' ? 'text-orange-600' :
                      alerta.severidad === 'media' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{alerta.descripcion}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Usuario: {alerta.usuario}</span>
                      <span>•</span>
                      <span>{alerta.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeveridadColor(alerta.severidad)}`}>
                    {alerta.severidad}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alerta.estado === 'resuelta' ? 'bg-green-100 text-green-800' :
                    alerta.estado === 'falsa_alarma' ? 'bg-gray-100 text-gray-800' :
                    alerta.estado === 'investigando' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {alerta.estado.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Detalles:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {Object.entries(alerta.detalles).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {alerta.estado === 'nueva' && (
                <div className="mt-4 flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Investigar
                  </button>
                  <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                    Marcar como Falsa Alarma
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}