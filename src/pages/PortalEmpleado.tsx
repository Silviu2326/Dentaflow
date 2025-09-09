import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  User,
  Clock,
  FileText,
  Search,
  Plus,
  Edit,
  Send,
  Bell,
  BookOpen,
  Target,
  Activity,
  Users,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Filter,
  Download,
  Upload,
  Eye,
  Settings
} from 'lucide-react';

interface TareaDia {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  fechaVencimiento: string;
  horaVencimiento?: string;
  categoria: 'cita' | 'administrativa' | 'clinica' | 'formacion' | 'mantenimiento';
  asignadoPor: string;
  estimacionMinutos?: number;
  paciente?: string;
  ubicacion?: string;
}

interface Protocolo {
  id: string;
  titulo: string;
  categoria: 'limpieza' | 'seguridad' | 'procedimiento' | 'emergencia' | 'administrativa';
  descripcion: string;
  pasos: string[];
  fechaActualizacion: string;
  version: string;
  obligatorio: boolean;
  requiereFormacion: boolean;
  documentoUrl?: string;
  videosUrl?: string[];
}

interface Mensaje {
  id: string;
  emisor: string;
  emisorRol: string;
  receptores: string[];
  asunto: string;
  contenido: string;
  fechaEnvio: string;
  leido: boolean;
  urgente: boolean;
  tipo: 'mensaje' | 'anuncio' | 'emergencia' | 'formacion';
  adjuntos?: string[];
}

interface EmpleadoPerfil {
  id: string;
  nombre: string;
  apellidos: string;
  rol: string;
  especialidad?: string;
  email: string;
  telefono: string;
  fechaIngreso: string;
  sede: string;
  supervisor: string;
  permisos: string[];
  horario: {
    lunes: string;
    martes: string;
    miercoles: string;
    jueves: string;
    viernes: string;
    sabado?: string;
    domingo?: string;
  };
}

const PortalEmpleado: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tareas' | 'protocolos' | 'mensajes' | 'perfil'>('tareas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');

  // Datos del empleado logueado
  const empleado: EmpleadoPerfil = {
    id: 'E001',
    nombre: 'Ana',
    apellidos: 'Martínez Ruiz',
    rol: 'Higienista Dental',
    especialidad: 'Periodoncia',
    email: 'ana.martinez@clinica.com',
    telefono: '+34 612 345 678',
    fechaIngreso: '2022-03-15',
    sede: 'Sede Central',
    supervisor: 'Dr. García',
    permisos: ['agenda', 'pacientes', 'historias', 'limpieza'],
    horario: {
      lunes: '08:00-16:00',
      martes: '08:00-16:00',
      miercoles: '08:00-16:00',
      jueves: '08:00-16:00',
      viernes: '08:00-14:00',
      sabado: '09:00-13:00'
    }
  };

  const [tareas] = useState<TareaDia[]>([
    {
      id: '1',
      titulo: 'Limpieza dental - María García',
      descripcion: 'Limpieza dental completa con aplicación de flúor',
      prioridad: 'alta',
      estado: 'pendiente',
      fechaVencimiento: '2024-01-16',
      horaVencimiento: '10:00',
      categoria: 'cita',
      asignadoPor: 'Dr. García',
      estimacionMinutos: 45,
      paciente: 'María García',
      ubicacion: 'Consulta 2'
    },
    {
      id: '2',
      titulo: 'Revisión protocolo de esterilización',
      descripcion: 'Revisar y actualizar el protocolo de esterilización de instrumentos',
      prioridad: 'media',
      estado: 'en_progreso',
      fechaVencimiento: '2024-01-16',
      categoria: 'administrativa',
      asignadoPor: 'Supervisora López',
      estimacionMinutos: 30
    },
    {
      id: '3',
      titulo: 'Formación: Nuevas técnicas de limpieza',
      descripcion: 'Completar módulo online sobre técnicas avanzadas de limpieza dental',
      prioridad: 'media',
      estado: 'pendiente',
      fechaVencimiento: '2024-01-18',
      categoria: 'formacion',
      asignadoPor: 'Recursos Humanos',
      estimacionMinutos: 120
    },
    {
      id: '4',
      titulo: 'Mantenimiento equipos consulta 2',
      descripcion: 'Realizar mantenimiento preventivo de equipos de la consulta 2',
      prioridad: 'baja',
      estado: 'completada',
      fechaVencimiento: '2024-01-15',
      categoria: 'mantenimiento',
      asignadoPor: 'Mantenimiento',
      estimacionMinutos: 60,
      ubicacion: 'Consulta 2'
    },
    {
      id: '5',
      titulo: 'Profilaxis dental - Carlos López',
      descripcion: 'Profilaxis dental y educación en higiene oral',
      prioridad: 'alta',
      estado: 'completada',
      fechaVencimiento: '2024-01-15',
      horaVencimiento: '14:30',
      categoria: 'cita',
      asignadoPor: 'Dr. García',
      estimacionMinutos: 60,
      paciente: 'Carlos López',
      ubicacion: 'Consulta 2'
    }
  ]);

  const [protocolos] = useState<Protocolo[]>([
    {
      id: '1',
      titulo: 'Protocolo de Esterilización de Instrumentos',
      categoria: 'seguridad',
      descripcion: 'Procedimiento estándar para la esterilización y desinfección de instrumental clínico',
      pasos: [
        'Prelavado con agua y detergente enzimático',
        'Limpieza ultrasónica durante 10 minutos',
        'Enjuague con agua destilada',
        'Secado completo',
        'Empaquetado en bolsas de esterilización',
        'Autoclave a 134°C durante 4 minutos',
        'Verificación de indicadores de esterilización',
        'Almacenamiento en área estéril'
      ],
      fechaActualizacion: '2024-01-10',
      version: '3.2',
      obligatorio: true,
      requiereFormacion: true,
      documentoUrl: '/protocolos/esterilizacion_v3.2.pdf',
      videosUrl: ['/videos/esterilizacion_paso_a_paso.mp4']
    },
    {
      id: '2',
      titulo: 'Procedimiento de Limpieza Dental Profesional',
      categoria: 'procedimiento',
      descripcion: 'Protocolo estándar para realizar limpieza dental profesional',
      pasos: [
        'Revisión del historial médico del paciente',
        'Examen clínico visual',
        'Detección de sarro y placa bacteriana',
        'Remoción de sarro supragingival con ultrasonidos',
        'Remoción de sarro subgingival con curetas',
        'Pulido dental con copa de goma y pasta abrasiva',
        'Irrigación con suero fisiológico',
        'Aplicación de flúor tópico',
        'Educación en higiene oral',
        'Programación de próxima cita'
      ],
      fechaActualizacion: '2024-01-08',
      version: '2.1',
      obligatorio: true,
      requiereFormacion: false,
      documentoUrl: '/protocolos/limpieza_dental_v2.1.pdf'
    },
    {
      id: '3',
      titulo: 'Protocolo de Emergencias Médicas',
      categoria: 'emergencia',
      descripcion: 'Procedimientos de actuación ante emergencias médicas en la clínica',
      pasos: [
        'Valoración del estado de consciencia',
        'Comprobación de signos vitales',
        'Posicionamiento del paciente',
        'Aviso al médico responsable',
        'Llamada al 112 si es necesario',
        'Administración de oxígeno si está disponible',
        'RCP básica si es necesario',
        'Registro del incidente',
        'Seguimiento post-emergencia'
      ],
      fechaActualizacion: '2024-01-05',
      version: '1.8',
      obligatorio: true,
      requiereFormacion: true,
      documentoUrl: '/protocolos/emergencias_v1.8.pdf',
      videosUrl: ['/videos/rcp_basica.mp4', '/videos/emergencias_clinica.mp4']
    },
    {
      id: '4',
      titulo: 'Protocolo de Limpieza y Desinfección de Consultas',
      categoria: 'limpieza',
      descripcion: 'Procedimiento de limpieza y desinfección entre pacientes',
      pasos: [
        'Retirada de material desechable',
        'Limpieza de superficies con paño húmedo',
        'Aplicación de desinfectante de superficies',
        'Tiempo de contacto de 5 minutos',
        'Reposición de material desechable',
        'Preparación de instrumental estéril',
        'Verificación de funcionamiento de equipos',
        'Registro en hoja de control'
      ],
      fechaActualizacion: '2024-01-12',
      version: '2.3',
      obligatorio: true,
      requiereFormacion: false,
      documentoUrl: '/protocolos/limpieza_consultas_v2.3.pdf'
    }
  ]);

  const [mensajes] = useState<Mensaje[]>([
    {
      id: '1',
      emisor: 'Dr. García',
      emisorRol: 'Director Médico',
      receptores: ['Todos los empleados'],
      asunto: 'Nuevos protocolos de seguridad COVID-19',
      contenido: 'Se han actualizado los protocolos de seguridad. Por favor, revisen la documentación adjunta y confirmen su lectura.',
      fechaEnvio: '2024-01-16T08:30:00',
      leido: false,
      urgente: true,
      tipo: 'anuncio',
      adjuntos: ['protocolo_covid_v4.pdf']
    },
    {
      id: '2',
      emisor: 'Supervisora López',
      emisorRol: 'Supervisora',
      receptores: ['Ana Martínez'],
      asunto: 'Evaluación mensual - Enero 2024',
      contenido: 'Hola Ana, necesito programar tu evaluación mensual. ¿Podrías confirmarme tu disponibilidad para mañana a las 15:00?',
      fechaEnvio: '2024-01-15T16:20:00',
      leido: true,
      urgente: false,
      tipo: 'mensaje'
    },
    {
      id: '3',
      emisor: 'Recursos Humanos',
      emisorRol: 'RRHH',
      receptores: ['Higienistas', 'Auxiliares'],
      asunto: 'Curso de formación continua disponible',
      contenido: 'Ya está disponible el nuevo curso online "Técnicas avanzadas en periodoncia". Recordad que es obligatorio completarlo antes del 31 de enero.',
      fechaEnvio: '2024-01-14T10:15:00',
      leido: false,
      urgente: false,
      tipo: 'formacion',
      adjuntos: ['info_curso_periodoncia.pdf']
    },
    {
      id: '4',
      emisor: 'Mantenimiento',
      emisorRol: 'Técnico',
      receptores: ['Ana Martínez'],
      asunto: 'Mantenimiento equipos consulta 2 - Completado',
      contenido: 'Se ha completado el mantenimiento preventivo de todos los equipos de la consulta 2. Todo funcionando correctamente.',
      fechaEnvio: '2024-01-15T17:45:00',
      leido: true,
      urgente: false,
      tipo: 'mensaje'
    }
  ]);

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoTareaColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'text-green-600 bg-green-100';
      case 'en_progreso': return 'text-blue-600 bg-blue-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'cita': return <Calendar className="h-4 w-4" />;
      case 'administrativa': return <FileText className="h-4 w-4" />;
      case 'clinica': return <Activity className="h-4 w-4" />;
      case 'formacion': return <BookOpen className="h-4 w-4" />;
      case 'mantenimiento': return <Settings className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getCategoriaProtocoloIcon = (categoria: string) => {
    switch (categoria) {
      case 'limpieza': return <Activity className="h-4 w-4" />;
      case 'seguridad': return <AlertTriangle className="h-4 w-4" />;
      case 'procedimiento': return <FileText className="h-4 w-4" />;
      case 'emergencia': return <Bell className="h-4 w-4" />;
      case 'administrativa': return <Settings className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTipoMensajeIcon = (tipo: string) => {
    switch (tipo) {
      case 'mensaje': return <MessageSquare className="h-4 w-4" />;
      case 'anuncio': return <Bell className="h-4 w-4" />;
      case 'emergencia': return <AlertTriangle className="h-4 w-4" />;
      case 'formacion': return <BookOpen className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredTareas = tareas.filter(tarea => {
    const matchesSearch = tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'todas' || tarea.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const filteredProtocolos = protocolos.filter(protocolo =>
    protocolo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMensajes = mensajes.filter(mensaje =>
    mensaje.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mensaje.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mensaje.emisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTareas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tareas del Día</h3>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tareas.filter(t => t.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">En Progreso</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tareas.filter(t => t.estado === 'en_progreso').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Completadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tareas.filter(t => t.estado === 'completada').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Total Hoy</p>
              <p className="text-2xl font-semibold text-gray-900">{tareas.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTareas.map((tarea) => (
          <div key={tarea.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoriaIcon(tarea.categoria) ? 'bg-gray-100 text-gray-600' : ''}`}>
                    {getCategoriaIcon(tarea.categoria)}
                    <span className="ml-1 capitalize">{tarea.categoria}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(tarea.prioridad)}`}>
                    <span className="capitalize">{tarea.prioridad}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoTareaColor(tarea.estado)}`}>
                    {tarea.estado === 'completada' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {tarea.estado === 'en_progreso' && <Activity className="h-3 w-3 mr-1" />}
                    {tarea.estado === 'pendiente' && <Clock className="h-3 w-3 mr-1" />}
                    {tarea.estado === 'cancelada' && <XCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{tarea.estado.replace('_', ' ')}</span>
                  </span>
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">{tarea.titulo}</h4>
                <p className="text-sm text-gray-600 mb-3">{tarea.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(tarea.fechaVencimiento).toLocaleDateString()}
                      {tarea.horaVencimiento && ` a las ${tarea.horaVencimiento}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Asignado por {tarea.asignadoPor}</span>
                  </div>
                  {tarea.estimacionMinutos && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{tarea.estimacionMinutos} minutos</span>
                    </div>
                  )}
                </div>
                
                {(tarea.paciente || tarea.ubicacion) && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    {tarea.paciente && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Paciente: {tarea.paciente}</span>
                      </div>
                    )}
                    {tarea.ubicacion && (
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Ubicación: {tarea.ubicacion}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                {tarea.estado === 'pendiente' && (
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Iniciar
                  </button>
                )}
                {tarea.estado === 'en_progreso' && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Completar
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProtocolos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Protocolos y SOPs</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Descargar Todos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Protocolos</p>
              <p className="text-2xl font-semibold text-gray-900">{protocolos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Obligatorios</p>
              <p className="text-2xl font-semibold text-gray-900">
                {protocolos.filter(p => p.obligatorio).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Con Formación</p>
              <p className="text-2xl font-semibold text-gray-900">
                {protocolos.filter(p => p.requiereFormacion).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Actualizados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {protocolos.filter(p => new Date(p.fechaActualizacion) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProtocolos.map((protocolo) => (
          <div key={protocolo.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    {getCategoriaProtocoloIcon(protocolo.categoria)}
                    <span className="ml-2 capitalize">{protocolo.categoria}</span>
                  </span>
                  {protocolo.obligatorio && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Obligatorio
                    </span>
                  )}
                  {protocolo.requiereFormacion && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Requiere formación
                    </span>
                  )}
                  <span className="text-xs text-gray-500">v{protocolo.version}</span>
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">{protocolo.titulo}</h4>
                <p className="text-sm text-gray-600 mb-3">{protocolo.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Última actualización:</span> {new Date(protocolo.fechaActualizacion).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Pasos:</span> {protocolo.pasos.length} procedimientos
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Pasos del protocolo:</p>
                  <ol className="text-xs text-gray-600 space-y-1">
                    {protocolo.pasos.slice(0, 3).map((paso, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-medium mr-2">{index + 1}.</span>
                        <span>{paso}</span>
                      </li>
                    ))}
                    {protocolo.pasos.length > 3 && (
                      <li className="text-blue-600">... y {protocolo.pasos.length - 3} pasos más</li>
                    )}
                  </ol>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {protocolo.documentoUrl && (
                  <button className="text-blue-400 hover:text-blue-500">
                    <Download className="h-5 w-5" />
                  </button>
                )}
                {protocolo.videosUrl && protocolo.videosUrl.length > 0 && (
                  <button className="text-purple-400 hover:text-purple-500">
                    <Eye className="h-5 w-5" />
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-500">
                  <BookOpen className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMensajes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Mensajería Interna</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mensaje
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Mensajes</p>
              <p className="text-2xl font-semibold text-gray-900">{mensajes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">No Leídos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mensajes.filter(m => !m.leido).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Urgentes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mensajes.filter(m => m.urgente).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Formación</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mensajes.filter(m => m.tipo === 'formacion').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMensajes.map((mensaje) => (
          <div key={mensaje.id} className={`border rounded-lg p-6 ${!mensaje.leido ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    {getTipoMensajeIcon(mensaje.tipo)}
                    <span className="ml-2 capitalize">{mensaje.tipo}</span>
                  </span>
                  {mensaje.urgente && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgente
                    </span>
                  )}
                  {!mensaje.leido && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      Nuevo
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{mensaje.asunto}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{mensaje.emisor} ({mensaje.emisorRol})</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{new Date(mensaje.fechaEnvio).toLocaleString()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{mensaje.contenido}</p>
                
                {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Download className="h-4 w-4" />
                    <span>Adjuntos: {mensaje.adjuntos.join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="text-blue-400 hover:text-blue-500">
                  <Send className="h-5 w-5" />
                </button>
                {!mensaje.leido && (
                  <button className="text-green-400 hover:text-green-500">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerfil = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Mi Perfil de Empleado</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{empleado.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                <p className="mt-1 text-sm text-gray-900">{empleado.apellidos}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <p className="mt-1 text-sm text-gray-900">{empleado.rol}</p>
              </div>
              {empleado.especialidad && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                  <p className="mt-1 text-sm text-gray-900">{empleado.especialidad}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sede</label>
                <p className="mt-1 text-sm text-gray-900">{empleado.sede}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                <p className="mt-1 text-sm text-gray-900">{empleado.supervisor}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(empleado.fechaIngreso).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Corporativo</label>
                <p className="text-sm text-gray-900">{empleado.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-sm text-gray-900">{empleado.telefono}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Horario Laboral</h4>
          <div className="space-y-3">
            {Object.entries(empleado.horario).map(([dia, horario]) => (
              <div key={dia} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">{dia}</span>
                <span className="text-sm text-gray-900">{horario || 'Descanso'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Permisos y Accesos</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Módulos Autorizados</label>
              <div className="flex flex-wrap gap-2">
                {empleado.permisos.map((permiso, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {permiso}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Estadísticas del Mes</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600">Tareas Completadas</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-sm text-gray-600">Puntualidad</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Cursos Completados</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">4.8</div>
            <div className="text-sm text-gray-600">Valoración Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del portal */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Portal del Empleado</h1>
                <p className="text-sm text-gray-500">Bienvenido/a, {empleado.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">
                    {mensajes.filter(m => !m.leido).length}
                  </span>
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{empleado.nombre} {empleado.apellidos}</div>
                  <div className="text-xs text-gray-500">{empleado.rol}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {empleado.nombre.charAt(0)}{empleado.apellidos.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navegación */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tareas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tareas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckSquare className="h-4 w-4 inline mr-2" />
              Tareas del Día
            </button>
            <button
              onClick={() => setActiveTab('protocolos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'protocolos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Protocolos
            </button>
            <button
              onClick={() => setActiveTab('mensajes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mensajes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Mensajes
              {mensajes.filter(m => !m.leido).length > 0 && (
                <span className="ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  {mensajes.filter(m => !m.leido).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'perfil'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Mi Perfil
            </button>
          </nav>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
              <input
                type="text"
                className="block w-full border-gray-300 rounded-md pl-10 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={
                  activeTab === 'tareas' ? 'Buscar tareas...' :
                  activeTab === 'protocolos' ? 'Buscar protocolos...' :
                  activeTab === 'mensajes' ? 'Buscar mensajes...' :
                  'Buscar...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {activeTab === 'tareas' && (
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                <option value="cita">Citas</option>
                <option value="administrativa">Administrativa</option>
                <option value="clinica">Clínica</option>
                <option value="formacion">Formación</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          )}
        </div>

        {/* Contenido */}
        {activeTab === 'tareas' && renderTareas()}
        {activeTab === 'protocolos' && renderProtocolos()}
        {activeTab === 'mensajes' && renderMensajes()}
        {activeTab === 'perfil' && renderPerfil()}
      </div>
    </div>
  );
};

export default PortalEmpleado;