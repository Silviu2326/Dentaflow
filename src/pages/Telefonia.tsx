import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  Download,
  User,
  Clock,
  Calendar,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Mic,
  MicOff,
  Volume2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserPlus,
  DollarSign,
  Target
} from 'lucide-react';

interface Llamada {
  id: string;
  tipo: 'entrante' | 'saliente' | 'perdida';
  numero: string;
  nombreContacto?: string;
  pacienteId?: string;
  duracion: number; // en segundos
  fecha: string;
  hora: string;
  agente: string;
  extension: string;
  estado: 'contestada' | 'no_contestada' | 'ocupado' | 'cancelada';
  grabacionUrl?: string;
  transcripcion?: string;
  tags: string[];
  resultado?: 'cita_agendada' | 'informacion' | 'urgencia' | 'cancelacion' | 'otro';
  notas?: string;
}

interface MetricaTelefonia {
  periodo: string;
  llamadasTotales: number;
  llamadasContestadas: number;
  llamadasPerdidas: number;
  tiempoMedioEspera: number; // ASA en segundos
  tiempoMedioConversacion: number; // en segundos
  tasaContestacion: number;
  tasaAbandono: number;
  tasaConversion: number;
  citasAgendadas: number;
  horasPico: string[];
  agentesMasActivos: {
    nombre: string;
    llamadas: number;
    tiempoTotal: number;
    conversion: number;
  }[];
}

interface ConfiguracionCTI {
  id: string;
  nombre: string;
  tipo: 'pop_ficha' | 'grabacion' | 'transcripcion' | 'routing';
  activo: boolean;
  configuracion: Record<string, any>;
  ultimaActualizacion: string;
}

interface PopupFicha {
  pacienteId: string;
  nombre: string;
  telefono: string;
  ultimaCita?: string;
  proximaCita?: string;
  tratamientosActivos: string[];
  saldoPendiente?: number;
  notas?: string;
  historialLlamadas: number;
  tiempoDesdeUltimaLlamada?: string;
}

const Telefonia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'llamadas' | 'metricas' | 'grabaciones' | 'configuracion'>('llamadas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [selectedPeriodo, setSelectedPeriodo] = useState('hoy');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const [llamadas] = useState<Llamada[]>([
    {
      id: '1',
      tipo: 'entrante',
      numero: '+34 612 345 678',
      nombreContacto: 'María García',
      pacienteId: 'P001',
      duracion: 245,
      fecha: '2024-01-20',
      hora: '10:15:30',
      agente: 'Ana Martínez',
      extension: '101',
      estado: 'contestada',
      grabacionUrl: '/recordings/call_001.mp3',
      tags: ['nueva_cita', 'urgencia'],
      resultado: 'cita_agendada',
      notas: 'Paciente solicita cita urgente por dolor molar'
    },
    {
      id: '2',
      tipo: 'saliente',
      numero: '+34 623 456 789',
      nombreContacto: 'Carlos López',
      pacienteId: 'P002',
      duracion: 180,
      fecha: '2024-01-20',
      hora: '11:30:15',
      agente: 'Pedro Sánchez',
      extension: '102',
      estado: 'contestada',
      grabacionUrl: '/recordings/call_002.mp3',
      tags: ['recordatorio', 'confirmacion'],
      resultado: 'informacion',
      notas: 'Recordatorio de cita para mañana - Confirmado'
    },
    {
      id: '3',
      tipo: 'perdida',
      numero: '+34 634 567 890',
      duracion: 0,
      fecha: '2024-01-20',
      hora: '12:45:00',
      agente: '-',
      extension: '-',
      estado: 'no_contestada',
      tags: ['perdida', 'callback_pendiente']
    },
    {
      id: '4',
      tipo: 'entrante',
      numero: '+34 645 678 901',
      nombreContacto: 'Ana Martín',
      pacienteId: 'P003',
      duracion: 420,
      fecha: '2024-01-20',
      hora: '14:20:45',
      agente: 'Laura Rodríguez',
      extension: '103',
      estado: 'contestada',
      grabacionUrl: '/recordings/call_004.mp3',
      transcripcion: 'Paciente consulta sobre opciones de financiación para implante dental...',
      tags: ['consulta', 'presupuesto', 'financiacion'],
      resultado: 'informacion',
      notas: 'Enviado presupuesto por email. Interesada en financiación 12 meses'
    },
    {
      id: '5',
      tipo: 'entrante',
      numero: '+34 656 789 012',
      nombreContacto: 'José Ruiz',
      pacienteId: 'P004',
      duracion: 90,
      fecha: '2024-01-20',
      hora: '15:45:20',
      agente: 'Ana Martínez',
      extension: '101',
      estado: 'contestada',
      tags: ['cancelacion'],
      resultado: 'cancelacion',
      notas: 'Cancela cita del 22/01 por viaje de trabajo'
    }
  ]);

  const [metricas] = useState<MetricaTelefonia>({
    periodo: 'Hoy - 20 Enero 2024',
    llamadasTotales: 156,
    llamadasContestadas: 142,
    llamadasPerdidas: 14,
    tiempoMedioEspera: 18, // ASA en segundos
    tiempoMedioConversacion: 245,
    tasaContestacion: 91.03,
    tasaAbandono: 8.97,
    tasaConversion: 35.2,
    citasAgendadas: 50,
    horasPico: ['10:00-11:00', '16:00-17:00'],
    agentesMasActivos: [
      { nombre: 'Ana Martínez', llamadas: 45, tiempoTotal: 11025, conversion: 42.2 },
      { nombre: 'Pedro Sánchez', llamadas: 38, tiempoTotal: 9310, conversion: 31.6 },
      { nombre: 'Laura Rodríguez', llamadas: 32, tiempoTotal: 7840, conversion: 37.5 },
      { nombre: 'Carlos García', llamadas: 27, tiempoTotal: 6615, conversion: 29.6 }
    ]
  });

  const [configuracionesCTI] = useState<ConfiguracionCTI[]>([
    {
      id: '1',
      nombre: 'Pop-up Ficha Paciente',
      tipo: 'pop_ficha',
      activo: true,
      configuracion: {
        mostrarAlLlamar: true,
        mostrarHistorial: true,
        mostrarSaldo: true,
        mostrarNotas: true,
        tiempoVisualizacion: 'durante_llamada'
      },
      ultimaActualizacion: '2024-01-15'
    },
    {
      id: '2',
      nombre: 'Grabación Automática',
      tipo: 'grabacion',
      activo: true,
      configuracion: {
        grabarTodas: true,
        calidad: 'alta',
        formatoAudio: 'mp3',
        almacenamiento: 'local',
        retencionDias: 90
      },
      ultimaActualizacion: '2024-01-10'
    },
    {
      id: '3',
      nombre: 'Transcripción Automática',
      tipo: 'transcripcion',
      activo: false,
      configuracion: {
        idioma: 'es-ES',
        precision: 'alta',
        incluirTimestamps: true,
        detectarPalabrasClaves: true
      },
      ultimaActualizacion: '2024-01-08'
    },
    {
      id: '4',
      nombre: 'Enrutamiento Inteligente',
      tipo: 'routing',
      activo: true,
      configuracion: {
        estrategia: 'round_robin',
        prioridades: ['urgencias', 'citas', 'consultas'],
        tiempoMaximoEspera: 60,
        desvioSiNoDisponible: true
      },
      ultimaActualizacion: '2024-01-05'
    }
  ]);

  const [popupFicha] = useState<PopupFicha>({
    pacienteId: 'P001',
    nombre: 'María García López',
    telefono: '+34 612 345 678',
    ultimaCita: '2024-01-10',
    proximaCita: '2024-01-25',
    tratamientosActivos: ['Ortodoncia Invisible', 'Limpieza Trimestral'],
    saldoPendiente: 450.00,
    notas: 'Paciente preferente. Alérgica a la penicilina.',
    historialLlamadas: 8,
    tiempoDesdeUltimaLlamada: 'Hace 5 días'
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrante': return <PhoneIncoming className="h-4 w-4" />;
      case 'saliente': return <PhoneOutgoing className="h-4 w-4" />;
      case 'perdida': return <PhoneMissed className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'entrante': return 'text-green-600 bg-green-100';
      case 'saliente': return 'text-blue-600 bg-blue-100';
      case 'perdida': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'contestada': return 'text-green-600 bg-green-100';
      case 'no_contestada': return 'text-red-600 bg-red-100';
      case 'ocupado': return 'text-yellow-600 bg-yellow-100';
      case 'cancelada': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredLlamadas = llamadas.filter(llamada => {
    const matchesSearch = llamada.numero.includes(searchTerm) ||
                         llamada.nombreContacto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         llamada.agente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === 'todos' || llamada.tipo === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const renderLlamadas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Registro de Llamadas</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button 
            onClick={() => setShowPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <User className="h-4 w-4 mr-2" />
            Ver Popup Demo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Llamadas</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.llamadasTotales}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <PhoneCall className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Contestadas</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.llamadasContestadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <PhoneMissed className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Perdidas</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.llamadasPerdidas}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Conversión</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.tasaConversion}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredLlamadas.map((llamada) => (
            <li key={llamada.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(llamada.tipo)}`}>
                      {getTipoIcon(llamada.tipo)}
                      <span className="ml-1 capitalize">{llamada.tipo}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(llamada.estado)}`}>
                      {llamada.estado === 'contestada' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {llamada.estado === 'no_contestada' && <XCircle className="h-3 w-3 mr-1" />}
                      <span className="capitalize">{llamada.estado.replace('_', ' ')}</span>
                    </span>
                    {llamada.resultado && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                        {llamada.resultado.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {llamada.nombreContacto || 'Número desconocido'}
                    </h4>
                    <span className="text-sm text-gray-600">{llamada.numero}</span>
                    {llamada.pacienteId && (
                      <span className="text-xs text-gray-500">ID: {llamada.pacienteId}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(llamada.fecha).toLocaleDateString()} {llamada.hora}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(llamada.duracion)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{llamada.agente} (Ext: {llamada.extension})</span>
                    </div>
                    {llamada.tags.length > 0 && (
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {llamada.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {llamada.notas && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notas:</span> {llamada.notas}
                    </div>
                  )}
                  
                  {llamada.transcripcion && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <span className="font-medium">Transcripción:</span> {llamada.transcripcion}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {llamada.grabacionUrl && (
                    <button
                      onClick={() => setPlayingAudio(playingAudio === llamada.id ? null : llamada.id)}
                      className="text-blue-400 hover:text-blue-500"
                    >
                      {playingAudio === llamada.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-500">
                    <Eye className="h-5 w-5" />
                  </button>
                  {llamada.tipo === 'perdida' && (
                    <button className="text-green-400 hover:text-green-500">
                      <Phone className="h-5 w-5" />
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

  const renderMetricas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Métricas de Telefonía</h3>
        <div className="flex space-x-3">
          <select
            className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
            <option value="trimestre">Trimestre</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard Completo
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen del Período: {metricas.periodo}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{metricas.llamadasTotales}</div>
            <div className="text-sm text-gray-600">Llamadas Totales</div>
            <div className="mt-2 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% vs ayer</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{metricas.tasaContestacion}%</div>
            <div className="text-sm text-gray-600">Tasa Contestación</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${metricas.tasaContestacion}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{metricas.tiempoMedioEspera}s</div>
            <div className="text-sm text-gray-600">ASA (Tiempo Espera)</div>
            <div className="mt-2 flex items-center justify-center">
              {metricas.tiempoMedioEspera <= 20 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">Óptimo</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600">Mejorable</span>
                </>
              )}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{metricas.tasaConversion}%</div>
            <div className="text-sm text-gray-600">Conversión a Citas</div>
            <div className="mt-2 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-xs text-purple-600">{metricas.citasAgendadas} citas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-md font-medium text-gray-900 mb-3">Rendimiento por Agente</h5>
            <div className="space-y-3">
              {metricas.agentesMasActivos.map((agente, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{agente.nombre}</p>
                      <p className="text-xs text-gray-500">{agente.llamadas} llamadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{agente.conversion}%</p>
                    <p className="text-xs text-gray-500">conversión</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-md font-medium text-gray-900 mb-3">Estadísticas Adicionales</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Tiempo Medio Conversación</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatDuration(metricas.tiempoMedioConversacion)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Horas Pico</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{metricas.horasPico.join(', ')}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Tasa de Abandono</span>
                </div>
                <span className="text-sm font-medium text-red-600">{metricas.tasaAbandono}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Valor por Llamada</span>
                </div>
                <span className="text-sm font-medium text-green-600">€42.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrabaciones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Grabaciones de Llamadas</h3>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Descargar Selección
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Mic className="h-4 w-4 mr-2" />
            Configurar Grabación
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Volume2 className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Grabaciones</p>
              <p className="text-2xl font-semibold text-gray-900">
                {llamadas.filter(l => l.grabacionUrl).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Mic className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Con Transcripción</p>
              <p className="text-2xl font-semibold text-gray-900">
                {llamadas.filter(l => l.transcripcion).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Duración Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDuration(llamadas.reduce((acc, l) => acc + l.duracion, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Calidad Media</p>
              <p className="text-2xl font-semibold text-gray-900">4.2/5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {llamadas.filter(l => l.grabacionUrl).map((llamada) => (
          <div key={llamada.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {llamada.nombreContacto || 'Número desconocido'}
                  </h4>
                  <span className="text-sm text-gray-600">{llamada.numero}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(llamada.tipo)}`}>
                    {getTipoIcon(llamada.tipo)}
                    <span className="ml-1 capitalize">{llamada.tipo}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(llamada.fecha).toLocaleDateString()} {llamada.hora}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(llamada.duracion)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{llamada.agente}</span>
                  </div>
                  {llamada.resultado && (
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      <span className="capitalize">{llamada.resultado.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
                
                {/* Player de Audio */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setPlayingAudio(playingAudio === llamada.id ? null : llamada.id)}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                      >
                        {playingAudio === llamada.id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-600 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        1:26 / {formatDuration(llamada.duracion)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-500">
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {llamada.transcripcion && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Transcripción Automática</span>
                        <button className="text-xs text-blue-600 hover:text-blue-700">
                          Ver completa
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">{llamada.transcripcion}</p>
                    </div>
                  )}
                </div>
                
                {llamada.notas && (
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Notas:</span> {llamada.notas}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfiguracion = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Configuración CTI</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Configuración
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configuracionesCTI.map((config) => (
          <div key={config.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  config.activo ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {config.tipo === 'pop_ficha' && <User className={`h-6 w-6 ${config.activo ? 'text-green-600' : 'text-gray-600'}`} />}
                  {config.tipo === 'grabacion' && <Mic className={`h-6 w-6 ${config.activo ? 'text-green-600' : 'text-gray-600'}`} />}
                  {config.tipo === 'transcripcion' && <Volume2 className={`h-6 w-6 ${config.activo ? 'text-green-600' : 'text-gray-600'}`} />}
                  {config.tipo === 'routing' && <Phone className={`h-6 w-6 ${config.activo ? 'text-green-600' : 'text-gray-600'}`} />}
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">{config.nombre}</h4>
                  <p className="text-xs text-gray-500">Actualizado: {new Date(config.ultimaActualizacion).toLocaleDateString()}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={config.activo} readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="space-y-2">
              {Object.entries(config.configuracion).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-gray-900 font-medium">
                    {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Configurar →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Telefonía CTI</h1>
        <p className="text-gray-600">Gestión de llamadas, grabaciones y métricas de conversión</p>
      </div>

      {/* Popup de Ficha de Paciente */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PhoneIncoming className="h-6 w-6 mr-2 animate-pulse" />
                  <div>
                    <h3 className="text-lg font-medium">Llamada Entrante</h3>
                    <p className="text-sm opacity-90">{popupFicha.telefono}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-white hover:text-gray-200"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{popupFicha.nombre}</h4>
                  <p className="text-sm text-gray-500">ID: {popupFicha.pacienteId}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Última Cita:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(popupFicha.ultimaCita!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Próxima Cita:</span>
                  <span className="text-sm font-medium text-green-600">
                    {new Date(popupFicha.proximaCita!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Saldo Pendiente:</span>
                  <span className="text-sm font-medium text-red-600">
                    €{popupFicha.saldoPendiente?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Historial Llamadas:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {popupFicha.historialLlamadas} ({popupFicha.tiempoDesdeUltimaLlamada})
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Tratamientos Activos:</p>
                <div className="flex flex-wrap gap-2">
                  {popupFicha.tratamientosActivos.map((tratamiento, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      {tratamiento}
                    </span>
                  ))}
                </div>
              </div>
              
              {popupFicha.notas && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800 ml-2">{popupFicha.notas}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Atender
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  Ver Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('llamadas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'llamadas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Phone className="h-4 w-4 inline mr-2" />
            Llamadas
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metricas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Métricas
          </button>
          <button
            onClick={() => setActiveTab('grabaciones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'grabaciones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Mic className="h-4 w-4 inline mr-2" />
            Grabaciones
          </button>
          <button
            onClick={() => setActiveTab('configuracion')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'configuracion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Configuración CTI
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
              placeholder="Buscar por número, nombre o agente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {activeTab === 'llamadas' && (
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="entrante">Entrantes</option>
              <option value="saliente">Salientes</option>
              <option value="perdida">Perdidas</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'llamadas' && renderLlamadas()}
      {activeTab === 'metricas' && renderMetricas()}
      {activeTab === 'grabaciones' && renderGrabaciones()}
      {activeTab === 'configuracion' && renderConfiguracion()}
    </div>
  );
};

export default Telefonia;