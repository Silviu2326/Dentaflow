import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus, Clock, User, MapPin, Star, Phone, Globe, Users, X } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import NewAppointmentModal from '../components/NewAppointmentModal';
import CitaDetailModal from '../components/CitaDetailModal';

const Citas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showCitaDetailModal, setShowCitaDetailModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState<any>(null);
  const { isDarkMode } = useDarkMode();

  const citas = [
    {
      id: 1,
      patient: 'Ana García López',
      date: '2024-01-25',
      time: '09:00',
      duration: 60,
      treatment: 'Limpieza dental',
      professional: 'Dr. Rodriguez',
      sede: 'Sede Centro',
      status: 'confirmed',
      source: 'web',
      notes: 'Paciente con sensibilidad dental'
    },
    {
      id: 2,
      patient: 'Carlos López Martín',
      date: '2024-01-25',
      time: '10:00',
      duration: 30,
      treatment: 'Revisión',
      professional: 'Dra. Martinez',
      sede: 'Sede Norte',
      status: 'pending',
      source: 'phone',
      notes: ''
    },
    {
      id: 3,
      patient: 'María Fernández Ruiz',
      date: '2024-01-25',
      time: '11:00',
      duration: 90,
      treatment: 'Endodoncia',
      professional: 'Dr. Rodriguez',
      sede: 'Sede Centro',
      status: 'confirmed',
      source: 'referral',
      notes: 'Tratamiento de urgencia'
    },
    {
      id: 4,
      patient: 'José Martín Pérez',
      date: '2024-01-26',
      time: '09:30',
      duration: 45,
      treatment: 'Consulta implante',
      professional: 'Dr. Lopez',
      sede: 'Sede Centro',
      status: 'cancelled',
      source: 'web',
      notes: 'Cancelado por el paciente'
    },
    {
      id: 5,
      patient: 'Laura Ruiz Santos',
      date: '2024-01-26',
      time: '14:00',
      duration: 120,
      treatment: 'Cirugía',
      professional: 'Dra. Martinez',
      sede: 'Sede Norte',
      status: 'scheduled',
      source: 'web',
      notes: 'Requiere ayuno previo'
    }
  ];

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'confirmed': return 'bg-green-900/80 text-green-200 border border-green-700/50';
        case 'pending': return 'bg-yellow-900/80 text-yellow-200 border border-yellow-700/50';
        case 'cancelled': return 'bg-red-900/80 text-red-200 border border-red-700/50';
        case 'scheduled': return 'bg-blue-900/80 text-blue-200 border border-blue-700/50';
        case 'completed': return 'bg-gray-700/80 text-gray-200 border border-gray-600/50';
        default: return 'bg-gray-700/80 text-gray-200 border border-gray-600/50';
      }
    } else {
      switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800 border border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
        case 'scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'scheduled': return 'Programada';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case 'web': return 'Web';
      case 'phone': return 'Teléfono';
      case 'referral': return 'Derivación';
      case 'walk-in': return 'Presencial';
      default: return source;
    }
  };

  const filteredCitas = citas.filter(cita => {
    const matchesSearch = cita.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.professional.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cita.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || cita.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleNewAppointment = (appointmentData: any) => {
    console.log('Nueva cita creada:', appointmentData);
  };

  const handleViewCita = (cita: any) => {
    setSelectedCita(cita);
    setShowCitaDetailModal(true);
  };

  const handleCloseCitaDetail = () => {
    setShowCitaDetailModal(false);
    setSelectedCita(null);
  };

  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-8 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative z-10`}>
              Gestión de Citas
            </h1>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Listado y filtros avanzados de citas médicas</p>
          </div>
          <button 
            onClick={() => setShowNewAppointmentModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Cita
          </button>
        </div>

        {/* Search and Filters */}
        <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por paciente, tratamiento o profesional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="all">Todos los estados</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendientes</option>
                <option value="scheduled">Programadas</option>
                <option value="cancelled">Canceladas</option>
                <option value="completed">Completadas</option>
              </select>
            </div>

            <div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className={`w-full rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="all">Todas las fuentes</option>
                <option value="web">Web</option>
                <option value="phone">Teléfono</option>
                <option value="referral">Derivación</option>
                <option value="walk-in">Presencial</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          isDarkMode 
            ? 'bg-gray-800/50 text-gray-300 border border-gray-700/50' 
            : 'bg-blue-50 text-blue-700 border border-blue-200/50'
        }`}>
          <Calendar className="w-4 h-4 mr-2" />
          Mostrando {filteredCitas.length} de {citas.length} citas
        </div>
      </div>

      {/* Appointments List */}
      <div className={`shadow-xl rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
          : 'bg-white/80 border-white/50 shadow-gray-200/50'
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'
            }`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Fecha y Hora
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Paciente
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Tratamiento
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Profesional
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Estado
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Fuente
                </th>
                <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/40 divide-gray-700/50' 
                : 'bg-white/40 divide-gray-200/50'
            }`}>
              {filteredCitas.map((cita) => (
                <tr key={cita.id} className={`transition-all duration-200 hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                    : 'hover:bg-blue-50/30 hover:shadow-lg'
                }`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {new Date(cita.date).toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            day: '2-digit', 
                            month: 'short' 
                          })}
                        </div>
                        <div className={`flex items-center transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {cita.time} ({cita.duration}min)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold text-white">
                            {cita.patient.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{cita.patient}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {cita.treatment}
                    {cita.notes && (
                      <div className={`text-xs mt-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{cita.notes}</div>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    <div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {cita.professional}
                      </div>
                      <div className={`flex items-center text-xs mt-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <MapPin className="h-3 w-3 mr-1" />
                        {cita.sede}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 ${getStatusColor(cita.status)}`}>
                      {getStatusText(cita.status)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {getSourceText(cita.source)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewCita(cita)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                          : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                      }`}>Ver</button>
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'text-green-400 hover:text-green-300 hover:bg-green-900/30' 
                          : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                      }`}>Editar</button>
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                          : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                      }`}>Cancelar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCitas.length === 0 && (
        <div className={`text-center py-16 rounded-2xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            </div>
            <Calendar className={`mx-auto h-16 w-16 relative z-10 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`mt-4 text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>No hay citas</h3>
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No se encontraron citas con los filtros seleccionados.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-700/50 shadow-blue-900/20' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 shadow-blue-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-900'
              }`}>Total Citas</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-100' : 'text-blue-600'
              }`}>{citas.length}</p>
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
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-green-200' : 'text-green-900'
              }`}>Confirmadas</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-green-100' : 'text-green-600'
              }`}>
                {citas.filter(c => c.status === 'confirmed').length}
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
                {citas.filter(c => c.status === 'pending').length}
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
              <X className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-red-200' : 'text-red-900'
              }`}>Canceladas</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-red-100' : 'text-red-600'
              }`}>
                {citas.filter(c => c.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Cita */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSubmit={handleNewAppointment}
      />

      {/* Modal Detalle Cita */}
      <CitaDetailModal
        isOpen={showCitaDetailModal}
        onClose={handleCloseCitaDetail}
        cita={selectedCita}
      />
    </div>
  );
};

export default Citas;