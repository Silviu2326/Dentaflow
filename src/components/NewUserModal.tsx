import React, { useState } from 'react';
import { X, User, Mail, Phone, Shield, Clock, CheckCircle } from 'lucide-react';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    rol: 'Asistente',
    especialidades: [] as string[],
    horario: {
      lunes: { inicio: '09:00', fin: '17:00', activo: true },
      martes: { inicio: '09:00', fin: '17:00', activo: true },
      miercoles: { inicio: '09:00', fin: '17:00', activo: true },
      jueves: { inicio: '09:00', fin: '17:00', activo: true },
      viernes: { inicio: '09:00', fin: '17:00', activo: true },
      sabado: { inicio: '09:00', fin: '13:00', activo: false },
      domingo: { inicio: '09:00', fin: '13:00', activo: false },
    },
    permisos: {
      gestion_pacientes: false,
      gestion_citas: true,
      facturacion: false,
      reportes: false,
      administracion: false,
    },
    activo: true,
  });

  const roles = ['Administrador', 'Odontólogo', 'Higienista', 'Asistente', 'Recepcionista'];
  const especialidadesOptions = [
    'Odontología General',
    'Ortodoncia',
    'Endodoncia',
    'Periodoncia',
    'Cirugía Oral',
    'Odontopediatría',
    'Prostodoncia',
    'Implantología',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      rol: 'Asistente',
      especialidades: [],
      horario: {
        lunes: { inicio: '09:00', fin: '17:00', activo: true },
        martes: { inicio: '09:00', fin: '17:00', activo: true },
        miercoles: { inicio: '09:00', fin: '17:00', activo: true },
        jueves: { inicio: '09:00', fin: '17:00', activo: true },
        viernes: { inicio: '09:00', fin: '17:00', activo: true },
        sabado: { inicio: '09:00', fin: '13:00', activo: false },
        domingo: { inicio: '09:00', fin: '13:00', activo: false },
      },
      permisos: {
        gestion_pacientes: false,
        gestion_citas: true,
        facturacion: false,
        reportes: false,
        administracion: false,
      },
      activo: true,
    });
    onClose();
  };

  const handleEspecialidadChange = (especialidad: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidad)
        ? prev.especialidades.filter(e => e !== especialidad)
        : [...prev.especialidades, especialidad]
    }));
  };

  const handleHorarioChange = (dia: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      horario: {
        ...prev.horario,
        [dia]: {
          ...prev.horario[dia as keyof typeof prev.horario],
          [campo]: valor
        }
      }
    }));
  };

  const handlePermisoChange = (permiso: string) => {
    setFormData(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [permiso]: !prev.permisos[permiso as keyof typeof prev.permisos]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Nuevo Usuario
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={formData.apellidos}
                  onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Rol y Especialidades */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Rol y Especialidades
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  required
                  value={formData.rol}
                  onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(rol => (
                    <option key={rol} value={rol}>{rol}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidades
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {especialidadesOptions.map(especialidad => (
                    <label key={especialidad} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.especialidades.includes(especialidad)}
                        onChange={() => handleEspecialidadChange(especialidad)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{especialidad}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Horario */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Horario de Trabajo
            </h3>
            <div className="space-y-3">
              {Object.entries(formData.horario).map(([dia, config]) => (
                <div key={dia} className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 min-w-[100px]">
                    <input
                      type="checkbox"
                      checked={config.activo}
                      onChange={(e) => handleHorarioChange(dia, 'activo', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium capitalize">{dia}</span>
                  </label>
                  {config.activo && (
                    <>
                      <input
                        type="time"
                        value={config.inicio}
                        onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">a</span>
                      <input
                        type="time"
                        value={config.fin}
                        onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Permisos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
              Permisos del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.gestion_pacientes}
                  onChange={() => handlePermisoChange('gestion_pacientes')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Gestión de Pacientes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.gestion_citas}
                  onChange={() => handlePermisoChange('gestion_citas')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Gestión de Citas</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.facturacion}
                  onChange={() => handlePermisoChange('facturacion')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Facturación</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.reportes}
                  onChange={() => handlePermisoChange('reportes')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Reportes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.administracion}
                  onChange={() => handlePermisoChange('administracion')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Administración</span>
              </label>
            </div>
          </div>

          {/* Estado del Usuario */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Usuario activo
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUserModal;