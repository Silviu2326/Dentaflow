import React from 'react';
import { X, User, Mail, Phone, Shield, Calendar, Clock, Key, Star, Activity, MapPin } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
  especialidades: string[];
  horario: {
    [key: string]: { inicio: string; fin: string; activo: boolean };
  };
  permisos: string[];
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ 
  isOpen, 
  onClose, 
  user 
}) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !user) return null;

  const diasSemana = [
    { key: 'lunes', nombre: 'Lunes' },
    { key: 'martes', nombre: 'Martes' },
    { key: 'miercoles', nombre: 'Miércoles' },
    { key: 'jueves', nombre: 'Jueves' },
    { key: 'viernes', nombre: 'Viernes' },
    { key: 'sabado', nombre: 'Sábado' },
    { key: 'domingo', nombre: 'Domingo' }
  ];

  const getRoleColor = () => {
    if (isDarkMode) {
      switch (user.rol) {
        case 'Administrador': return 'bg-red-900/50 text-red-200 border-red-700/50';
        case 'Odontólogo': return 'bg-blue-900/50 text-blue-200 border-blue-700/50';
        case 'Ortodoncista': return 'bg-green-900/50 text-green-200 border-green-700/50';
        case 'Recepcionista': return 'bg-purple-900/50 text-purple-200 border-purple-700/50';
        default: return 'bg-gray-700/50 text-gray-300 border-gray-600/50';
      }
    } else {
      switch (user.rol) {
        case 'Administrador': return 'bg-red-100 text-red-800 border-red-200';
        case 'Odontólogo': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Ortodoncista': return 'bg-green-100 text-green-800 border-green-200';
        case 'Recepcionista': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const diasActivos = diasSemana.filter(dia => user.horario[dia.key]?.activo);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-4xl rounded-3xl shadow-2xl transition-all duration-300 transform scale-100 ${
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
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Perfil de Usuario
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Información detallada del profesional
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
            {/* Personal Information */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode 
                ? 'bg-gray-700/30 border-gray-600/50' 
                : 'bg-gray-50/50 border-gray-200/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Nombre completo</p>
                      <p className={`text-lg font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.nombre} {user.apellidos}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Email</p>
                      <p className={`text-lg font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Teléfono</p>
                      <p className={`text-lg font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.telefono}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Rol</p>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getRoleColor()}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.rol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Specialties */}
              <div className={`p-6 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-gray-50/50 border-gray-200/50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Star className="h-5 w-5 mr-2" />
                  Especialidades
                </h3>
                <div className="space-y-2">
                  {user.especialidades.map((especialidad, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-full border mr-2 mb-2 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-blue-900/50 text-blue-200 border-blue-700/50' 
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {especialidad}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div className={`p-6 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-gray-50/50 border-gray-200/50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Key className="h-5 w-5 mr-2" />
                  Permisos
                </h3>
                <div className="space-y-2">
                  {user.permisos.map((permiso, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-full border mr-2 mb-2 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-purple-900/50 text-purple-200 border-purple-700/50' 
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                    >
                      <Key className="h-3 w-3 mr-1" />
                      {permiso.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode 
                ? 'bg-gray-700/30 border-gray-600/50' 
                : 'bg-gray-50/50 border-gray-200/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Calendar className="h-5 w-5 mr-2" />
                Horario de Trabajo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diasSemana.map((dia) => {
                  const horarioDia = user.horario[dia.key];
                  return (
                    <div
                      key={dia.key}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        horarioDia?.activo
                          ? (isDarkMode 
                              ? 'bg-green-900/30 border-green-700/50' 
                              : 'bg-green-50 border-green-200')
                          : (isDarkMode 
                              ? 'bg-gray-800/50 border-gray-600/50' 
                              : 'bg-gray-100 border-gray-200')
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {dia.nombre}
                        </p>
                        <Activity className={`h-4 w-4 ${
                          horarioDia?.activo
                            ? 'text-green-600'
                            : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`} />
                      </div>
                      {horarioDia?.activo ? (
                        <p className={`text-sm mt-1 transition-colors duration-300 ${
                          isDarkMode ? 'text-green-300' : 'text-green-700'
                        }`}>
                          {horarioDia.inicio} - {horarioDia.fin}
                        </p>
                      ) : (
                        <p className={`text-sm mt-1 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          No laboral
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status and Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-xl border ${
                user.activo
                  ? (isDarkMode 
                      ? 'bg-green-900/30 border-green-700/50' 
                      : 'bg-green-50 border-green-200')
                  : (isDarkMode 
                      ? 'bg-red-900/30 border-red-700/50' 
                      : 'bg-red-50 border-red-200')
              }`}>
                <div className="flex items-center space-x-3">
                  <Activity className={`h-5 w-5 ${
                    user.activo ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Estado</p>
                    <p className={`font-bold ${
                      user.activo ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600/50' 
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Calendar className={`h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Fecha de alta</p>
                    <p className={`font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {new Date(user.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600/50' 
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Clock className={`h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Último acceso</p>
                    <p className={`font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.ultimoAcceso 
                        ? new Date(user.ultimoAcceso).toLocaleDateString('es-ES')
                        : 'Nunca'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end p-6 border-t ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;