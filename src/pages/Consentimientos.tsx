import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Send, FileText, CheckCircle, Clock, AlertTriangle, Shield, Star, Zap } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import NewTemplateModal from '../components/NewTemplateModal';
import ViewConsentModal from '../components/ViewConsentModal';
import EditConsentModal from '../components/EditConsentModal';

interface ConsentForm {
  id: string;
  nombre: string;
  categoria: string;
  version: string;
  fechaCreacion: string;
  contenido: string;
  activo: boolean;
  obligatorio: boolean;
}

interface ConsentRecord {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  formularioId: string;
  formularioNombre: string;
  fechaEnvio?: string;
  fechaFirma?: string;
  estado: 'pendiente' | 'enviado' | 'firmado' | 'rechazado';
  ip?: string;
  evidencia?: string;
  version: string;
}

const Consentimientos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plantillas' | 'registros'>('plantillas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<ConsentForm | ConsentRecord | null>(null);
  const { isDarkMode } = useDarkMode();

  const [plantillas] = useState<ConsentForm[]>([
    {
      id: '1',
      nombre: 'Consentimiento Odontología General',
      categoria: 'General',
      version: '2.1',
      fechaCreacion: '2024-01-15',
      contenido: 'He sido informado/a de los riesgos, beneficios y alternativas del tratamiento dental propuesto...',
      activo: true,
      obligatorio: true
    },
    {
      id: '2',
      nombre: 'Consentimiento Cirugía Oral',
      categoria: 'Cirugía',
      version: '1.5',
      fechaCreacion: '2024-01-10',
      contenido: 'Entiendo que la cirugía oral conlleva riesgos inherentes incluyendo pero no limitados a...',
      activo: true,
      obligatorio: true
    },
    {
      id: '3',
      nombre: 'Consentimiento Ortodoncia',
      categoria: 'Ortodoncia',
      version: '1.8',
      fechaCreacion: '2024-01-12',
      contenido: 'Comprendo que el tratamiento de ortodoncia requiere cooperación del paciente...',
      activo: true,
      obligatorio: false
    },
    {
      id: '4',
      nombre: 'Consentimiento Implantes Dentales',
      categoria: 'Implantología',
      version: '2.0',
      fechaCreacion: '2024-01-08',
      contenido: 'He sido informado de que los implantes dentales tienen una tasa de éxito del 95%...',
      activo: true,
      obligatorio: true
    }
  ]);

  const [registros] = useState<ConsentRecord[]>([
    {
      id: '1',
      pacienteId: '1',
      pacienteNombre: 'Ana García López',
      formularioId: '1',
      formularioNombre: 'Consentimiento Odontología General',
      fechaEnvio: '2024-01-15T10:00:00',
      fechaFirma: '2024-01-15T14:30:00',
      estado: 'firmado',
      ip: '192.168.1.100',
      evidencia: 'hash_abc123',
      version: '2.1'
    },
    {
      id: '2',
      pacienteId: '2',
      pacienteNombre: 'Carlos Ruiz Mesa',
      formularioId: '2',
      formularioNombre: 'Consentimiento Cirugía Oral',
      fechaEnvio: '2024-01-16T09:15:00',
      estado: 'enviado',
      version: '1.5'
    },
    {
      id: '3',
      pacienteId: '3',
      pacienteNombre: 'María Fernández Ruiz',
      formularioId: '4',
      formularioNombre: 'Consentimiento Implantes Dentales',
      estado: 'pendiente',
      version: '2.0'
    }
  ]);

  const categorias = ['todos', 'General', 'Cirugía', 'Ortodoncia', 'Implantología', 'Endodoncia', 'Periodoncia'];

  const filteredPlantillas = plantillas.filter(plantilla => {
    const matchesSearch = plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || plantilla.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredRegistros = registros.filter(registro => {
    const matchesSearch = registro.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.formularioNombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getEstadoColor = (estado: string) => {
    if (isDarkMode) {
      switch (estado) {
        case 'firmado': return 'bg-green-900/80 text-green-200 border border-green-700/50';
        case 'enviado': return 'bg-blue-900/80 text-blue-200 border border-blue-700/50';
        case 'pendiente': return 'bg-yellow-900/80 text-yellow-200 border border-yellow-700/50';
        case 'rechazado': return 'bg-red-900/80 text-red-200 border border-red-700/50';
        default: return 'bg-gray-700/80 text-gray-200 border border-gray-600/50';
      }
    } else {
      switch (estado) {
        case 'firmado': return 'bg-green-100 text-green-800 border border-green-200';
        case 'enviado': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'pendiente': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'rechazado': return 'bg-red-100 text-red-800 border border-red-200';
        default: return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'firmado': return <CheckCircle className="h-4 w-4" />;
      case 'enviado': return <Send className="h-4 w-4" />;
      case 'pendiente': return <Clock className="h-4 w-4" />;
      case 'rechazado': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleNewTemplate = (templateData: any) => {
    console.log('Nueva plantilla creada:', templateData);
  };

  const handleViewConsent = (consent: ConsentForm | ConsentRecord) => {
    setSelectedConsent(consent);
    setShowViewModal(true);
  };

  const handleEditConsent = (consent: ConsentForm) => {
    setSelectedConsent(consent);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedConsent(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedConsent(null);
  };

  const handleUpdateConsent = (data: any) => {
    console.log('Consentimiento actualizado:', data);
    setShowEditModal(false);
    setSelectedConsent(null);
  };

  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-8 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent relative z-10`}>
              Consentimientos Informados
            </h1>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Plantillas, envío/firmas, versionado y evidencias legales</p>
          </div>
          <button 
            onClick={() => setShowNewTemplateModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </button>
        </div>

        {/* Tabs */}
        <div className={`border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('plantillas')}
              className={`py-3 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'plantillas'
                  ? (isDarkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-500 text-indigo-600')
                  : (isDarkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab('registros')}
              className={`py-3 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'registros'
                  ? (isDarkMode ? 'border-indigo-400 text-indigo-400' : 'border-indigo-500 text-indigo-600')
                  : (isDarkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )
              }`}
            >
              Registros de Firmas
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 mb-8 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
          : 'bg-white/80 border-white/50 shadow-gray-200/50'
      }`}>
        <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={activeTab === 'plantillas' ? 'Buscar plantillas...' : 'Buscar por paciente o formulario...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-3 border rounded-xl w-full focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-indigo-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500'
            }`}
          />
        </div>
        {activeTab === 'plantillas' && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700/50 text-white focus:border-indigo-400' 
                : 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500'
            }`}
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria === 'todos' ? 'Todas las categorías' : categoria}
              </option>
            ))}
          </select>
        )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 border-indigo-700/50 shadow-indigo-900/20' 
            : 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200/50 shadow-indigo-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-indigo-200' : 'text-indigo-900'
              }`}>Plantillas Activas</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-indigo-100' : 'text-indigo-600'
              }`}>
                {plantillas.filter(p => p.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-700/50 shadow-green-900/20' 
            : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 shadow-green-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-green-200' : 'text-green-900'
              }`}>Firmados</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-green-100' : 'text-green-600'
              }`}>
                {registros.filter(r => r.estado === 'firmado').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border-yellow-700/50 shadow-yellow-900/20' 
            : 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/50 shadow-yellow-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-yellow-200' : 'text-yellow-900'
              }`}>Pendientes</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-yellow-100' : 'text-yellow-600'
              }`}>
                {registros.filter(r => r.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-700/50 shadow-red-900/20' 
            : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 shadow-red-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-red-200' : 'text-red-900'
              }`}>Rechazados</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-red-100' : 'text-red-600'
              }`}>
                {registros.filter(r => r.estado === 'rechazado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'plantillas' ? (
        <div className={`rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Plantilla
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Categoría
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Versión
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Fecha Creación
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Estado
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800/50 divide-gray-700/50' : 'bg-white divide-gray-200'
              }`}>
                {filteredPlantillas.map((plantilla) => (
                  <tr key={plantilla.id} className={`transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`text-sm font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{plantilla.nombre}</div>
                        <div className={`text-sm truncate max-w-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {plantilla.contenido.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-indigo-900/50 text-indigo-200 border-indigo-700/50' 
                          : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}>
                        {plantilla.categoria}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      v{plantilla.version}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {new Date(plantilla.fechaCreacion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${
                          plantilla.activo 
                            ? (isDarkMode ? 'bg-green-900/50 text-green-200 border-green-700/50' : 'bg-green-100 text-green-800 border-green-200')
                            : (isDarkMode ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' : 'bg-gray-100 text-gray-800 border-gray-200')
                        }`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {plantilla.activo ? 'Activa' : 'Inactiva'}
                        </span>
                        {plantilla.obligatorio && (
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50' 
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            <Star className="h-3 w-3 mr-1" />
                            Obligatoria
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewConsent(plantilla)}
                          className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          }`}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditConsent(plantilla)}
                          className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                            isDarkMode 
                              ? 'text-green-400 hover:text-green-300 hover:bg-green-900/30' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }`}
                          title="Editar plantilla"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                            isDarkMode 
                              ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/30' 
                              : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                          }`}
                          title="Enviar consentimiento"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Paciente
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Formulario
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Estado
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Fecha Envío
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Fecha Firma
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Evidencia
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800/50 divide-gray-700/50' : 'bg-white divide-gray-200'
              }`}>
                {filteredRegistros.map((registro) => (
                  <tr key={registro.id} className={`transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{registro.pacienteNombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`text-sm font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{registro.formularioNombre}</div>
                        <div className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>v{registro.version}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor(registro.estado)}`}>
                        {getEstadoIcon(registro.estado)}
                        <span className="ml-2 capitalize">{registro.estado}</span>
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {registro.fechaEnvio ? new Date(registro.fechaEnvio).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {registro.fechaFirma ? new Date(registro.fechaFirma).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registro.evidencia ? (
                        <div className="text-xs">
                          <div className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>IP: {registro.ip}</div>
                          <div className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>Hash: {registro.evidencia.substring(0, 8)}...</div>
                        </div>
                      ) : (
                        <span className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewConsent(registro)}
                          className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          }`}
                          title="Ver registro"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {registro.estado === 'pendiente' && (
                          <button 
                            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                              isDarkMode 
                                ? 'text-green-400 hover:text-green-300 hover:bg-green-900/30' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            title="Enviar recordatorio"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {((activeTab === 'plantillas' && filteredPlantillas.length === 0) || 
        (activeTab === 'registros' && filteredRegistros.length === 0)) && (
        <div className={`text-center py-16 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/40 border-gray-200/50'
        }`}>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-full blur-xl"></div>
            <FileText className={`mx-auto h-16 w-16 relative z-10 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`mt-4 text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            No hay {activeTab === 'plantillas' ? 'plantillas' : 'registros'}
          </h3>
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            No se encontraron {activeTab === 'plantillas' ? 'plantillas' : 'registros'} que coincidan con los filtros aplicados.
          </p>
        </div>
      )}

      {/* Modals */}
      <NewTemplateModal
        isOpen={showNewTemplateModal}
        onClose={() => setShowNewTemplateModal(false)}
        onSubmit={handleNewTemplate}
      />
      
      <ViewConsentModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        consent={selectedConsent}
      />
      
      <EditConsentModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateConsent}
        consent={selectedConsent as ConsentForm}
      />
    </div>
  );
};

export default Consentimientos;