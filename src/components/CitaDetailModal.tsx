import React from 'react';
import { X, Calendar, Clock, User, MapPin, FileText, Phone, Globe, Users, Star, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface Cita {
  id: number;
  patient: string;
  date: string;
  time: string;
  duration: number;
  treatment: string;
  professional: string;
  sede: string;
  status: string;
  source: string;
  notes: string;
}

interface CitaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
}

const CitaDetailModal: React.FC<CitaDetailModalProps> = ({ isOpen, onClose, cita }) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !cita) return null;

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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'web': return <Globe className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'referral': return <Users className="h-4 w-4" />;
      case 'walk-in': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case 'web': return 'Reserva Web';
      case 'phone': return 'Llamada Telefónica';
      case 'referral': return 'Derivación';
      case 'walk-in': return 'Visita Presencial';
      default: return source;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl transition-all duration-300 transform scale-100 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700/50' 
            : 'bg-white border border-gray-200/50'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Detalles de la Cita
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ID: #{cita.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Patient Info */}
            <div className={`p-4 rounded-2xl border ${
              isDarkMode 
                ? 'bg-gray-700/30 border-gray-600/50' 
                : 'bg-blue-50/50 border-blue-200/50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {cita.patient.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {cita.patient}
                  </h3>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Paciente
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold ${getStatusColor(cita.status)}`}>
                    <Star className="h-4 w-4 mr-1" />
                    {getStatusText(cita.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-green-50/50 border-green-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Fecha
                    </p>
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatDate(cita.date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-orange-50/50 border-orange-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Hora y Duración
                    </p>
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {cita.time} ({cita.duration} min)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment & Professional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-purple-50/50 border-purple-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Tratamiento
                    </p>
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {cita.treatment}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-cyan-50/50 border-cyan-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Profesional
                    </p>
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {cita.professional}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-indigo-50/50 border-indigo-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Ubicación
                    </p>
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {cita.sede}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-pink-50/50 border-pink-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center">
                    {getSourceIcon(cita.source)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Origen
                    </p>
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {getSourceText(cita.source)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {cita.notes && (
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-yellow-50/50 border-yellow-200/50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Notas
                    </p>
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {cita.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end space-x-3 p-6 border-t ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Cerrar
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
              Editar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitaDetailModal;