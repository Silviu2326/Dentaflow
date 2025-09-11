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
  Settings,
  BarChart3,
  Award,
  TrendingUp,
  Zap,
  Coffee,
  Calendar as CalendarIcon,
  ClipboardCheck,
  MessageCircle,
  FileCheck,
  Home,
  ChevronRight,
  Timer,
  PlayCircle,
  PauseCircle,
  StopCircle
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tareas' | 'protocolos' | 'mensajes' | 'perfil'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [taskTimers, setTaskTimers] = useState<{[key: string]: {running: boolean, seconds: number}}>({});

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

  const handleStartTask = (taskId: string) => {
    console.log('Iniciando tarea:', taskId);
  };

  const handleCompleteTask = (taskId: string) => {
    console.log('Completando tarea:', taskId);
  };

  const handleToggleTimer = (taskId: string) => {
    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        running: !(prev[taskId]?.running || false),
        seconds: prev[taskId]?.seconds || 0
      }
    }));
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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">👋 ¡Hola, {empleado.nombre}!</h2>
                <p className="text-blue-100 text-lg mb-4">
                  Tienes {tareas.filter(t => t.estado === 'pendiente').length} tareas pendientes para hoy
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-100">
                  <span>📅 {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>🕰️ {empleado.horario[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof empleado.horario] || 'Descanso'}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <Coffee className="h-16 w-16 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tareas.filter(t => t.estado === 'pendiente').length}
                </p>
                <p className="text-xs text-blue-600 mt-1">🕰️ Para hoy</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tareas.filter(t => t.estado === 'completada').length}
                </p>
                <p className="text-xs text-green-600 mt-1">🎆 Esta semana</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mensajes Nuevos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {mensajes.filter(m => !m.leido).length}
                </p>
                <p className="text-xs text-purple-600 mt-1">📬 Sin leer</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Protocolos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{protocolos.length}</p>
                <p className="text-xs text-yellow-600 mt-1">📚 Disponibles</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button 
            onClick={() => setActiveTab('tareas')}
            className="flex flex-col items-center p-4 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-200 group border border-white/20"
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Ver Tareas</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('mensajes')}
            className="flex flex-col items-center p-4 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-200 group border border-white/20"
          >
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Mensajes</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('protocolos')}
            className="flex flex-col items-center p-4 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-200 group border border-white/20"
          >
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Protocolos</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-200 group border border-white/20">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Agenda</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('perfil')}
            className="flex flex-col items-center p-4 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-200 group border border-white/20"
          >
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Mi Perfil</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl bg-white/70 hover:bg-white/90 transition-all duration-200 group border border-white/20">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Logros</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Tareas Recientes
          </h3>
          <div className="space-y-3">
            {tareas.slice(0, 3).map((tarea) => (
              <div key={tarea.id} className="flex items-center p-3 rounded-xl bg-white/50 border border-white/20">
                <div className={`p-2 rounded-lg mr-3 ${
                  tarea.estado === 'completada' ? 'bg-green-100' :
                  tarea.estado === 'en_progreso' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  {getCategoriaIcon(tarea.categoria)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tarea.titulo}</p>
                  <p className="text-xs text-gray-500">{tarea.fechaVencimiento}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getEstadoTareaColor(tarea.estado)}`}>
                  {tarea.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Rendimiento del Mes
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tareas Completadas</span>
              <span className="text-lg font-semibold text-gray-900">23/25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '92%'}}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Puntualidad</span>
              <span className="text-lg font-semibold text-gray-900">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Formación</span>
              <span className="text-lg font-semibold text-gray-900">3 cursos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tareas.filter(t => t.estado === 'pendiente').length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">🕰️ Urgentes hoy</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tareas.filter(t => t.estado === 'en_progreso').length}
                </p>
                <p className="text-xs text-blue-600 mt-1">🏃 Activas ahora</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tareas.filter(t => t.estado === 'completada').length}
                </p>
                <p className="text-xs text-green-600 mt-1">✅ Finalizadas</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tareas.length}</p>
                <p className="text-xs text-purple-600 mt-1">🎡 Todas las tareas</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredTareas.map((tarea) => (
          <div key={tarea.id} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200">
                      {getCategoriaIcon(tarea.categoria)}
                      <span className="ml-2 capitalize">{tarea.categoria}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium border ${getPrioridadColor(tarea.prioridad)}`}>
                      <span className="capitalize">{tarea.prioridad}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium border ${getEstadoTareaColor(tarea.estado)}`}>
                      {tarea.estado === 'completada' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {tarea.estado === 'en_progreso' && <Activity className="h-4 w-4 mr-2" />}
                      {tarea.estado === 'pendiente' && <Clock className="h-4 w-4 mr-2" />}
                      {tarea.estado === 'cancelada' && <XCircle className="h-4 w-4 mr-2" />}
                      <span className="capitalize">{tarea.estado.replace('_', ' ')}</span>
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{tarea.titulo}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{tarea.descripcion}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center p-3 rounded-xl bg-blue-50/50">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Fecha y Hora</p>
                        <p className="text-sm text-gray-900">
                          {new Date(tarea.fechaVencimiento).toLocaleDateString()}
                          {tarea.horaVencimiento && ` • ${tarea.horaVencimiento}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-xl bg-purple-50/50">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Asignado por</p>
                        <p className="text-sm text-gray-900">{tarea.asignadoPor}</p>
                      </div>
                    </div>
                    
                    {tarea.estimacionMinutos && (
                      <div className="flex items-center p-3 rounded-xl bg-green-50/50">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <Timer className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Duración</p>
                          <p className="text-sm text-gray-900">{tarea.estimacionMinutos} min</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {(tarea.paciente || tarea.ubicacion) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {tarea.paciente && (
                        <div className="flex items-center p-3 rounded-xl bg-yellow-50/50">
                          <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                            <Users className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Paciente</p>
                            <p className="text-sm text-gray-900 font-medium">{tarea.paciente}</p>
                          </div>
                        </div>
                      )}
                      {tarea.ubicacion && (
                        <div className="flex items-center p-3 rounded-xl bg-indigo-50/50">
                          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                            <Settings className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Ubicación</p>
                            <p className="text-sm text-gray-900 font-medium">{tarea.ubicacion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Timer display */}
                  {taskTimers[tarea.id] && taskTimers[tarea.id].running && (
                    <div className="mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">⏱️ Tiempo transcurrido</span>
                        <span className="text-lg font-bold text-blue-900">
                          {Math.floor(taskTimers[tarea.id].seconds / 60)}:{(taskTimers[tarea.id].seconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  {tarea.estado === 'pendiente' && (
                    <>
                      <button 
                        onClick={() => handleStartTask(tarea.id)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Iniciar</span>
                      </button>
                      <button 
                        onClick={() => handleToggleTimer(tarea.id)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Timer className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Timer</span>
                      </button>
                    </>
                  )}
                  {tarea.estado === 'en_progreso' && (
                    <>
                      <button 
                        onClick={() => handleCompleteTask(tarea.id)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Completar</span>
                      </button>
                      <button 
                        onClick={() => handleToggleTimer(tarea.id)}
                        className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${
                          taskTimers[tarea.id]?.running 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
                        }`}
                      >
                        {taskTimers[tarea.id]?.running ? <PauseCircle className="h-4 w-4 mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
                        <span className="text-sm font-medium">
                          {taskTimers[tarea.id]?.running ? 'Pausar' : 'Reanudar'}
                        </span>
                      </button>
                    </>
                  )}
                  <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200">
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Protocolos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{protocolos.length}</p>
                <p className="text-xs text-blue-600 mt-1">📚 Disponibles</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Obligatorios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {protocolos.filter(p => p.obligatorio).length}
                </p>
                <p className="text-xs text-red-600 mt-1">⚠️ Cumplimiento</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Con Formación</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {protocolos.filter(p => p.requiereFormacion).length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">🎓 Certificación</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actualizados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {protocolos.filter(p => new Date(p.fechaActualizacion) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-xs text-green-600 mt-1">🆕 Último mes</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredProtocolos.map((protocolo) => (
          <div key={protocolo.id} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200">
                      {getCategoriaProtocoloIcon(protocolo.categoria)}
                      <span className="ml-2 capitalize">{protocolo.categoria}</span>
                    </span>
                    {protocolo.obligatorio && (
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Obligatorio
                      </span>
                    )}
                    {protocolo.requiereFormacion && (
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Requiere formación
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200">
                      📜 v{protocolo.version}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{protocolo.titulo}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{protocolo.descripcion}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center p-3 rounded-xl bg-blue-50/50">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Última actualización</p>
                        <p className="text-sm text-gray-900 font-medium">{new Date(protocolo.fechaActualizacion).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-xl bg-green-50/50">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Total de pasos</p>
                        <p className="text-sm text-gray-900 font-medium">{protocolo.pasos.length} procedimientos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="font-semibold text-gray-800">Pasos del protocolo:</p>
                    </div>
                    <ol className="text-sm text-gray-700 space-y-2">
                      {protocolo.pasos.slice(0, 3).map((paso, index) => (
                        <li key={index} className="flex items-start p-2 rounded-lg bg-white/60">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{paso}</span>
                        </li>
                      ))}
                      {protocolo.pasos.length > 3 && (
                        <li className="flex items-center p-2 rounded-lg bg-blue-50/50">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-3">
                            +
                          </span>
                          <span className="text-blue-600 font-medium">... y {protocolo.pasos.length - 3} pasos adicionales</span>
                        </li>
                      )}
                    </ol>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  {protocolo.documentoUrl && (
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Download className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">PDF</span>
                    </button>
                  )}
                  {protocolo.videosUrl && protocolo.videosUrl.length > 0 && (
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Videos</span>
                    </button>
                  )}
                  <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Leer</span>
                  </button>
                </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mensajes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mensajes.length}</p>
                <p className="text-xs text-blue-600 mt-1">📬 Recibidos</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Leídos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {mensajes.filter(m => !m.leido).length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">🔔 Pendientes</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {mensajes.filter(m => m.urgente).length}
                </p>
                <p className="text-xs text-red-600 mt-1">⚡ Prioridad alta</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Formación</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {mensajes.filter(m => m.tipo === 'formacion').length}
                </p>
                <p className="text-xs text-green-600 mt-1">🎓 Educativos</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredMensajes.map((mensaje) => (
          <div key={mensaje.id} className="group relative">
            <div className={`absolute inset-0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity ${
              !mensaje.leido ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' : 'bg-gradient-to-r from-gray-500/10 to-slate-500/10'
            }`}></div>
            <div className={`relative backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/90 transition-all duration-200 ${
              !mensaje.leido 
                ? 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-200/50' 
                : 'bg-white/80 border-white/20'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200">
                      {getTipoMensajeIcon(mensaje.tipo)}
                      <span className="ml-2 capitalize">{mensaje.tipo}</span>
                    </span>
                    {mensaje.urgente && (
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200 animate-pulse">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Urgente
                      </span>
                    )}
                    {!mensaje.leido && (
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                        Nuevo
                      </span>
                    )}
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {new Date(mensaje.fechaEnvio).toLocaleString()}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{mensaje.asunto}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center p-3 rounded-xl bg-purple-50/50">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Remitente</p>
                        <p className="text-sm text-gray-900 font-medium">{mensaje.emisor}</p>
                        <p className="text-xs text-gray-600">{mensaje.emisorRol}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-xl bg-blue-50/50">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Destinatarios</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {mensaje.receptores.length === 1 
                            ? mensaje.receptores[0] 
                            : `${mensaje.receptores.length} destinatarios`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 mb-4">
                    <p className="text-gray-700 leading-relaxed">{mensaje.contenido}</p>
                  </div>
                  
                  {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                    <div className="flex items-center p-3 rounded-xl bg-yellow-50/50 border border-yellow-200/50">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <Download className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Archivos adjuntos</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {mensaje.adjuntos.map((adjunto, index) => (
                            <span key={index} className="inline-block mr-2 px-2 py-1 bg-white rounded-lg text-xs border">
                              📄 {adjunto}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Send className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Responder</span>
                  </button>
                  
                  {!mensaje.leido && (
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Marcar Leído</span>
                    </button>
                  )}
                  
                  {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Download className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Descargar</span>
                    </button>
                  )}
                </div>
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

      {/* Profile Header */}
      <div className="relative overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/30 rounded-full blur"></div>
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center text-2xl font-bold backdrop-blur-sm border border-white/20">
                  {empleado.nombre.charAt(0)}{empleado.apellidos.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{empleado.nombre} {empleado.apellidos}</h2>
                <p className="text-lg text-indigo-100 mb-1">{empleado.rol}</p>
                {empleado.especialidad && (
                  <p className="text-indigo-200">Especialidad en {empleado.especialidad}</p>
                )}
                <div className="flex items-center space-x-4 mt-3 text-sm text-indigo-100">
                  <span>🏢 {empleado.sede}</span>
                  <span>•</span>
                  <span>📅 Desde {new Date(empleado.fechaIngreso).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>👨‍💼 Supervisor: {empleado.supervisor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Información Personal</h4>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-blue-50/50">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nombre Completo</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.nombre} {empleado.apellidos}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Rol</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.rol}</p>
                </div>
              </div>
              {empleado.especialidad && (
                <div className="p-3 rounded-xl bg-green-50/50">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Especialidad</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.especialidad}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-yellow-50/50">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Sede</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.sede}</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/50">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Supervisor</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.supervisor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Información de Contacto</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-xl bg-blue-50/50">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Email Corporativo</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.email}</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-xl bg-green-50/50">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Teléfono</label>
                  <p className="text-sm font-medium text-gray-900">{empleado.telefono}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Horario Laboral</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(empleado.horario).map(([dia, horario]) => (
                <div key={dia} className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50">
                  <span className="text-sm font-medium text-gray-700 capitalize flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    {dia}
                  </span>
                  <span className="text-sm font-medium text-gray-900 px-2 py-1 bg-white rounded-lg">
                    {horario || '😴 Descanso'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Permisos y Accesos</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-3">Módulos Autorizados</label>
                <div className="grid grid-cols-2 gap-2">
                  {empleado.permisos.map((permiso, index) => (
                    <div key={index} className="flex items-center p-2 rounded-lg bg-green-50/50 border border-green-200/50">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700 capitalize">{permiso}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/90 transition-all duration-200">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">Rendimiento del Mes</h4>
              <p className="text-sm text-gray-600">Estadísticas de productividad y desempeño</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group/card">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover/card:opacity-40 transition-opacity"></div>
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-3">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">23</div>
                <div className="text-sm text-gray-600 font-medium">Tareas Completadas</div>
                <div className="text-xs text-blue-600 mt-1">✅ Meta: 25</div>
              </div>
            </div>
            
            <div className="relative group/card">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover/card:opacity-40 transition-opacity"></div>
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
                <div className="text-sm text-gray-600 font-medium">Puntualidad</div>
                <div className="text-xs text-green-600 mt-1">✨ Excelente</div>
              </div>
            </div>
            
            <div className="relative group/card">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover/card:opacity-40 transition-opacity"></div>
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-sm text-gray-600 font-medium">Cursos Completados</div>
                <div className="text-xs text-purple-600 mt-1">🎓 En progreso: 2</div>
              </div>
            </div>
            
            <div className="relative group/card">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover/card:opacity-40 transition-opacity"></div>
              <div className="relative text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl w-fit mx-auto mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
                <div className="text-sm text-gray-600 font-medium">Valoración Promedio</div>
                <div className="text-xs text-yellow-600 mt-1">🏆 Top performer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header del portal */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30"></div>
                <Users className="relative h-10 w-10 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Portal del Empleado
                </h1>
                <p className="text-sm text-gray-600 mt-1">Bienvenido/a, {empleado.nombre} • {empleado.rol}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString('es-ES', { day: '2-digit' })}</div>
                  <div className="text-xs text-gray-500">{new Date().toLocaleDateString('es-ES', { month: 'short' })}</div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-xs text-gray-500">Hora actual</div>
                </div>
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                {mensajes.filter(m => !m.leido).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs text-white font-medium">
                      {mensajes.filter(m => !m.leido).length}
                    </span>
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{empleado.nombre} {empleado.apellidos}</div>
                  <div className="text-xs text-gray-500">{empleado.rol} • {empleado.sede}</div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-30"></div>
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-semibold text-white">
                      {empleado.nombre.charAt(0)}{empleado.apellidos.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navegación mejorada */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`relative flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
                {activeTab === 'dashboard' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 -z-10"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('tareas')}
                className={`relative flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'tareas'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Tareas
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  {tareas.filter(t => t.estado === 'pendiente').length}
                </span>
                {activeTab === 'tareas' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 -z-10"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('protocolos')}
                className={`relative flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'protocolos'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Protocolos
                {activeTab === 'protocolos' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 -z-10"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('mensajes')}
                className={`relative flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'mensajes'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensajes
                {mensajes.filter(m => !m.leido).length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                    {mensajes.filter(m => !m.leido).length}
                  </span>
                )}
                {activeTab === 'mensajes' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 -z-10"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`relative flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'perfil'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
                {activeTab === 'perfil' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 -z-10"></div>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Búsqueda y filtros mejorados */}
        {activeTab !== 'dashboard' && (
          <div className="mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/90 text-sm transition-all duration-200 placeholder-gray-500"
                      placeholder={
                        activeTab === 'tareas' ? '🔍 Buscar tareas, pacientes o ubicaciones...' :
                        activeTab === 'protocolos' ? '🔍 Buscar protocolos o procedimientos...' :
                        activeTab === 'mensajes' ? '🔍 Buscar mensajes por emisor o contenido...' :
                        '🔍 Buscar...'
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {activeTab === 'tareas' && (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        className="pl-10 pr-8 py-3 border-0 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/90 text-sm transition-all duration-200 appearance-none cursor-pointer"
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
                      <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Nueva Tarea</span>
                    </button>
                  </div>
                )}
                
                {activeTab === 'protocolos' && (
                  <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Descargar Todos</span>
                  </button>
                )}
                
                {activeTab === 'mensajes' && (
                  <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Nuevo Mensaje</span>
                  </button>
                )}
                
                {activeTab === 'perfil' && (
                  <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span className="text-sm font-medium">Editar Perfil</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'tareas' && renderTareas()}
        {activeTab === 'protocolos' && renderProtocolos()}
        {activeTab === 'mensajes' && renderMensajes()}
        {activeTab === 'perfil' && renderPerfil()}
      </div>
    </div>
  );
};

export default PortalEmpleado;