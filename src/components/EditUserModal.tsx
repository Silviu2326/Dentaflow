import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield, Calendar, Key, Star, Activity, Settings } from 'lucide-react';
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: Usuario | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user 
}) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    rol: '',
    especialidades: [] as string[],
    activo: true,
    horario: {
      lunes: { inicio: '09:00', fin: '18:00', activo: true },
      martes: { inicio: '09:00', fin: '18:00', activo: true },
      miercoles: { inicio: '09:00', fin: '18:00', activo: true },
      jueves: { inicio: '09:00', fin: '18:00', activo: true },
      viernes: { inicio: '09:00', fin: '18:00', activo: true },
      sabado: { inicio: '09:00', fin: '13:00', activo: false },
      domingo: { inicio: '09:00', fin: '13:00', activo: false }
    },
    permisos: [] as string[]
  });

  const roles = [
    'Administrador',
    'Odontólogo', 
    'Ortodoncista',
    'Recepcionista',
    'Higienista',
    'Auxiliar'
  ];

  const especialidadesDisponibles = [
    'Odontología General',
    'Ortodoncia',
    'Endodoncia',
    'Periodoncia',
    'Cirugía Oral',
    'Implantología',
    'Odontopediatría',
    'Prótesis Dental',
    'Estética Dental',
    'Atención al Cliente'
  ];

  const permisosDisponibles = [
    'ver_pacientes',
    'editar_pacientes',
    'crear_citas',
    'ver_reportes',
    'admin_total',
    'gestionar_usuarios',
    'configuracion',
    'facturacion',
    'historia_clinica',
    'ortodoncia',
    'gestionar_agenda'
  ];

  const diasSemana = [
    { key: 'lunes', nombre: 'Lunes' },
    { key: 'martes', nombre: 'Martes' },
    { key: 'miercoles', nombre: 'Miércoles' },
    { key: 'jueves', nombre: 'Jueves' },
    { key: 'viernes', nombre: 'Viernes' },
    { key: 'sabado', nombre: 'Sábado' },
    { key: 'domingo', nombre: 'Domingo' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        especialidades: user.especialidades,
        activo: user.activo,
        horario: user.horario,
        permisos: user.permisos
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser = {
      id: user?.id,
      ...formData,
      fechaCreacion: user?.fechaCreacion || new Date().toISOString().split('T')[0],
      ultimoAcceso: user?.ultimoAcceso
    };

    onSubmit(updatedUser);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleEspecialidadToggle = (especialidad: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidad)
        ? prev.especialidades.filter(e => e !== especialidad)
        : [...prev.especialidades, especialidad]
    }));
  };

  const handlePermisoToggle = (permiso: string) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.includes(permiso)
        ? prev.permisos.filter(p => p !== permiso)
        : [...prev.permisos, permiso]
    }));
  };

  const handleHorarioChange = (dia: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      horario: {
        ...prev.horario,
        [dia]: {
          ...prev.horario[dia],
          [field]: value
        }
      }
    }));
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-6xl rounded-3xl shadow-2xl transition-all duration-300 transform scale-100 ${
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
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Editar Usuario
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Modifica la información del profesional
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode 
                ? 'bg-gray-700/30 border-gray-600/50' 
                : 'bg-gray-50/50 border-gray-200/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Nombre"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Apellidos
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Apellidos"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="+34 666 123 456"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map(rol => (
                      <option key={rol} value={rol}>{rol}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Usuario Activo
                  </label>
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
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {especialidadesDisponibles.map((especialidad) => (
                    <label key={especialidad} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.especialidades.includes(especialidad)}
                        onChange={() => handleEspecialidadToggle(especialidad)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {especialidad}
                      </span>
                    </label>
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
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {permisosDisponibles.map((permiso) => (
                    <label key={permiso} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permisos.includes(permiso)}
                        onChange={() => handlePermisoToggle(permiso)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {permiso.replace('_', ' ')}
                      </span>
                    </label>
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
              <div className="space-y-4">
                {diasSemana.map((dia) => (
                  <div key={dia.key} className={`p-4 rounded-xl border transition-all duration-200 ${
                    formData.horario[dia.key]?.activo
                      ? (isDarkMode 
                          ? 'bg-green-900/30 border-green-700/50' 
                          : 'bg-green-50 border-green-200')
                      : (isDarkMode 
                          ? 'bg-gray-800/50 border-gray-600/50' 
                          : 'bg-gray-100 border-gray-200')
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.horario[dia.key]?.activo || false}
                          onChange={(e) => handleHorarioChange(dia.key, 'activo', e.target.checked)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {dia.nombre}
                        </span>
                      </label>
                      <Activity className={`h-4 w-4 ${
                        formData.horario[dia.key]?.activo
                          ? 'text-green-600'
                          : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                      }`} />
                    </div>
                    {formData.horario[dia.key]?.activo && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`text-xs font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Hora inicio
                          </label>
                          <input
                            type="time"
                            value={formData.horario[dia.key]?.inicio || '09:00'}
                            onChange={(e) => handleHorarioChange(dia.key, 'inicio', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-green-500/20 ${
                              isDarkMode 
                                ? 'border-gray-600 bg-gray-700/50 text-white focus:border-green-400' 
                                : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Hora fin
                          </label>
                          <input
                            type="time"
                            value={formData.horario[dia.key]?.fin || '18:00'}
                            onChange={(e) => handleHorarioChange(dia.key, 'fin', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-green-500/20 ${
                              isDarkMode 
                                ? 'border-gray-600 bg-gray-700/50 text-white focus:border-green-400' 
                                : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className={`flex items-center justify-end space-x-3 pt-6 border-t ${
              isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;