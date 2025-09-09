import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  FileText
} from 'lucide-react';

interface PlantillaComunicacion {
  id: string;
  nombre: string;
  tipo: 'email' | 'sms' | 'whatsapp';
  asunto?: string;
  contenido: string;
  variables: string[];
  activa: boolean;
  fechaCreacion: string;
}

interface ConsentimientoComunicacion {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  email?: string;
  telefono?: string;
  consentimientoEmail: boolean;
  consentimientoSMS: boolean;
  consentimientoWhatsApp: boolean;
  fechaConsentimiento: string;
  ipConsentimiento: string;
  evidenciaLegal: string;
}

interface Campana {
  id: string;
  nombre: string;
  tipo: 'email' | 'sms' | 'whatsapp';
  plantillaId: string;
  estado: 'borrador' | 'programada' | 'enviando' | 'completada' | 'pausada';
  fechaProgramada?: string;
  segmentoObjetivo: string;
  totalDestinatarios: number;
  enviados: number;
  entregados: number;
  abiertos: number;
  clicks: number;
  respuestas: number;
  fechaCreacion: string;
}

const MarketingComunicaciones: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plantillas' | 'consentimientos' | 'campanas'>('plantillas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('todos');

  const [plantillas] = useState<PlantillaComunicacion[]>([
    {
      id: '1',
      nombre: 'Recordatorio de Cita',
      tipo: 'email',
      asunto: 'Recordatorio: Su cita del {fecha} a las {hora}',
      contenido: 'Estimado/a {paciente_nombre}, le recordamos su cita programada para el {fecha} a las {hora} con {doctor_nombre}.',
      variables: ['paciente_nombre', 'fecha', 'hora', 'doctor_nombre'],
      activa: true,
      fechaCreacion: '2024-01-15'
    },
    {
      id: '2',
      nombre: 'Confirmacion de Cita',
      tipo: 'sms',
      contenido: 'Hola {paciente_nombre}, su cita ha sido confirmada para el {fecha} a las {hora}. Responda SI para confirmar.',
      variables: ['paciente_nombre', 'fecha', 'hora'],
      activa: true,
      fechaCreacion: '2024-01-14'
    },
    {
      id: '3',
      nombre: 'Seguimiento Post-Tratamiento',
      tipo: 'whatsapp',
      contenido: 'Hola {paciente_nombre}, esperamos que se encuentre bien después de su tratamiento. ¿Cómo se siente?',
      variables: ['paciente_nombre'],
      activa: true,
      fechaCreacion: '2024-01-10'
    }
  ]);

  const [consentimientos] = useState<ConsentimientoComunicacion[]>([
    {
      id: '1',
      pacienteId: 'P001',
      pacienteNombre: 'María García',
      email: 'maria.garcia@email.com',
      telefono: '+34 612 345 678',
      consentimientoEmail: true,
      consentimientoSMS: true,
      consentimientoWhatsApp: false,
      fechaConsentimiento: '2024-01-15T10:30:00',
      ipConsentimiento: '192.168.1.100',
      evidenciaLegal: 'hash_legal_abc123'
    },
    {
      id: '2',
      pacienteId: 'P002',
      pacienteNombre: 'Carlos López',
      email: 'carlos.lopez@email.com',
      telefono: '+34 623 456 789',
      consentimientoEmail: true,
      consentimientoSMS: false,
      consentimientoWhatsApp: true,
      fechaConsentimiento: '2024-01-14T15:45:00',
      ipConsentimiento: '192.168.1.101',
      evidenciaLegal: 'hash_legal_def456'
    }
  ]);

  const [campanas] = useState<Campana[]>([
    {
      id: '1',
      nombre: 'Campaña Recordatorios Enero',
      tipo: 'email',
      plantillaId: '1',
      estado: 'completada',
      fechaProgramada: '2024-01-15T09:00:00',
      segmentoObjetivo: 'Pacientes con citas próximas',
      totalDestinatarios: 150,
      enviados: 150,
      entregados: 147,
      abiertos: 89,
      clicks: 23,
      respuestas: 5,
      fechaCreacion: '2024-01-10'
    },
    {
      id: '2',
      nombre: 'SMS Confirmaciones',
      tipo: 'sms',
      plantillaId: '2',
      estado: 'enviando',
      fechaProgramada: '2024-01-16T08:00:00',
      segmentoObjetivo: 'Pacientes sin confirmar',
      totalDestinatarios: 85,
      enviados: 45,
      entregados: 43,
      abiertos: 43,
      clicks: 0,
      respuestas: 12,
      fechaCreacion: '2024-01-15'
    }
  ]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'whatsapp': return <Phone className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'sms': return 'text-green-600 bg-green-100';
      case 'whatsapp': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'text-green-600 bg-green-100';
      case 'enviando': return 'text-blue-600 bg-blue-100';
      case 'programada': return 'text-yellow-600 bg-yellow-100';
      case 'pausada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPlantillas = plantillas.filter(plantilla => {
    const matchesSearch = plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === 'todos' || plantilla.tipo === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const filteredConsentimientos = consentimientos.filter(consentimiento =>
    consentimiento.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCampanas = campanas.filter(campana => {
    const matchesSearch = campana.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === 'todos' || campana.tipo === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const renderPlantillas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Plantillas de Comunicación</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Plantilla
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPlantillas.map((plantilla) => (
          <div key={plantilla.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(plantilla.tipo)}`}>
                    {getTipoIcon(plantilla.tipo)}
                    <span className="ml-1 capitalize">{plantilla.tipo}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${plantilla.activa ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {plantilla.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{plantilla.nombre}</h4>
                {plantilla.asunto && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Asunto:</span> {plantilla.asunto}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-3">{plantilla.contenido}</p>
                <div className="flex flex-wrap gap-1">
                  {plantilla.variables.map((variable) => (
                    <span key={variable} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="text-gray-400 hover:text-gray-500">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConsentimientos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Consentimientos de Comunicación</h3>
        <div className="flex space-x-3">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Verificar Consentimientos
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Evidencias
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredConsentimientos.map((consentimiento) => (
            <li key={consentimiento.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{consentimiento.pacienteNombre}</h4>
                    <span className="text-sm text-gray-500">ID: {consentimiento.pacienteId}</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{consentimiento.email}</span>
                    <span>{consentimiento.telefono}</span>
                  </div>
                  <div className="mt-3 flex space-x-4">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">Email:</span>
                      {consentimiento.consentimientoEmail ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">SMS:</span>
                      {consentimiento.consentimientoSMS ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs">WhatsApp:</span>
                      {consentimiento.consentimientoWhatsApp ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(consentimiento.fechaConsentimiento).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">IP: {consentimiento.ipConsentimiento}</p>
                  <p className="text-xs text-gray-400">Hash: {consentimiento.evidenciaLegal}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCampanas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Campañas de Comunicación</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCampanas.map((campana) => (
          <div key={campana.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(campana.tipo)}`}>
                    {getTipoIcon(campana.tipo)}
                    <span className="ml-1 capitalize">{campana.tipo}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(campana.estado)}`}>
                    {campana.estado === 'completada' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {campana.estado === 'enviando' && <Clock className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{campana.estado}</span>
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">{campana.nombre}</h4>
                <p className="text-sm text-gray-600 mb-2">Segmento: {campana.segmentoObjetivo}</p>
                {campana.fechaProgramada && (
                  <p className="text-sm text-gray-500">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(campana.fechaProgramada).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-500">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{campana.totalDestinatarios}</div>
                <div className="text-xs text-gray-500">Destinatarios</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{campana.enviados}</div>
                <div className="text-xs text-gray-500">Enviados</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{campana.entregados}</div>
                <div className="text-xs text-gray-500">Entregados</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{campana.abiertos}</div>
                <div className="text-xs text-gray-500">Abiertos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">{campana.clicks}</div>
                <div className="text-xs text-gray-500">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{campana.respuestas}</div>
                <div className="text-xs text-gray-500">Respuestas</div>
              </div>
            </div>

            {campana.entregados > 0 && (
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Tasa de apertura: {((campana.abiertos / campana.entregados) * 100).toFixed(1)}%
                {campana.clicks > 0 && (
                  <span className="ml-4">
                    CTR: {((campana.clicks / campana.abiertos) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing - Comunicaciones</h1>
        <p className="text-gray-600">Gestión de plantillas, consentimientos y campañas de comunicación</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plantillas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plantillas'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Plantillas
          </button>
          <button
            onClick={() => setActiveTab('consentimientos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'consentimientos'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Consentimientos
          </button>
          <button
            onClick={() => setActiveTab('campanas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campanas'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Send className="h-4 w-4 inline mr-2" />
            Campañas
          </button>
        </nav>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
            <input
              type="text"
              className="block w-full border-gray-300 rounded-md pl-10 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder={
                activeTab === 'plantillas' ? 'Buscar plantillas...' :
                activeTab === 'consentimientos' ? 'Buscar pacientes...' :
                'Buscar campañas...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {(activeTab === 'plantillas' || activeTab === 'campanas') && (
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'plantillas' && renderPlantillas()}
      {activeTab === 'consentimientos' && renderConsentimientos()}
      {activeTab === 'campanas' && renderCampanas()}
    </div>
  );
};

export default MarketingComunicaciones;