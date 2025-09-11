import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Calendar, Clock, UserCheck, Key, Eye, Settings, Star, Users, Activity } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import NewUserModal from '../components/NewUserModal';
import ViewUserModal from '../components/ViewUserModal';
import EditUserModal from '../components/EditUserModal';

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

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  usuarios: number;
}

const Usuarios: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'profesionales' | 'roles'>('profesionales');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('todos');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const [usuarios] = useState<Usuario[]>([
    {
      id: '1',
      nombre: 'Dr. Juan',
      apellidos: 'García Pérez',
      email: 'juan.garcia@clinica.com',
      telefono: '+34 666 123 456',
      rol: 'Odontólogo',
      especialidades: ['Odontología General', 'Endodoncia'],
      horario: {
        lunes: { inicio: '09:00', fin: '18:00', activo: true },
        martes: { inicio: '09:00', fin: '18:00', activo: true },
        miercoles: { inicio: '09:00', fin: '18:00', activo: true },
        jueves: { inicio: '09:00', fin: '18:00', activo: true },
        viernes: { inicio: '09:00', fin: '15:00', activo: true },
        sabado: { inicio: '09:00', fin: '13:00', activo: false },
        domingo: { inicio: '09:00', fin: '13:00', activo: false }
      },
      permisos: ['ver_pacientes', 'editar_pacientes', 'crear_citas', 'ver_reportes'],
      activo: true,
      fechaCreacion: '2024-01-01',
      ultimoAcceso: '2024-01-17T10:30:00'
    },
    {
      id: '2',
      nombre: 'Dra. María',
      apellidos: 'Martín López',
      email: 'maria.martin@clinica.com',
      telefono: '+34 666 234 567',
      rol: 'Ortodoncista',
      especialidades: ['Ortodoncia', 'Odontopediatría'],
      horario: {
        lunes: { inicio: '10:00', fin: '19:00', activo: true },
        martes: { inicio: '10:00', fin: '19:00', activo: true },
        miercoles: { inicio: '10:00', fin: '19:00', activo: true },
        jueves: { inicio: '10:00', fin: '19:00', activo: true },
        viernes: { inicio: '10:00', fin: '16:00', activo: true },
        sabado: { inicio: '09:00', fin: '13:00', activo: true },
        domingo: { inicio: '09:00', fin: '13:00', activo: false }
      },
      permisos: ['ver_pacientes', 'editar_pacientes', 'crear_citas', 'ver_reportes', 'ortodoncia'],
      activo: true,
      fechaCreacion: '2024-01-01',
      ultimoAcceso: '2024-01-17T09:15:00'
    },
    {
      id: '3',
      nombre: 'Ana',
      apellidos: 'Rodríguez Sánchez',
      email: 'ana.rodriguez@clinica.com',
      telefono: '+34 666 345 678',
      rol: 'Recepcionista',
      especialidades: ['Atención al Cliente'],
      horario: {
        lunes: { inicio: '08:30', fin: '17:30', activo: true },
        martes: { inicio: '08:30', fin: '17:30', activo: true },
        miercoles: { inicio: '08:30', fin: '17:30', activo: true },
        jueves: { inicio: '08:30', fin: '17:30', activo: true },
        viernes: { inicio: '08:30', fin: '17:30', activo: true },
        sabado: { inicio: '09:00', fin: '13:00', activo: false },
        domingo: { inicio: '09:00', fin: '13:00', activo: false }
      },
      permisos: ['ver_pacientes', 'crear_citas', 'gestionar_agenda'],
      activo: true,
      fechaCreacion: '2024-01-05',
      ultimoAcceso: '2024-01-17T08:45:00'
    },
    {
      id: '4',
      nombre: 'Carlos',
      apellidos: 'López Fernández',
      email: 'carlos.lopez@clinica.com',
      telefono: '+34 666 456 789',
      rol: 'Administrador',
      especialidades: ['Gestión', 'Sistemas'],
      horario: {
        lunes: { inicio: '08:00', fin: '18:00', activo: true },
        martes: { inicio: '08:00', fin: '18:00', activo: true },
        miercoles: { inicio: '08:00', fin: '18:00', activo: true },
        jueves: { inicio: '08:00', fin: '18:00', activo: true },
        viernes: { inicio: '08:00', fin: '18:00', activo: true },
        sabado: { inicio: '09:00', fin: '13:00', activo: false },
        domingo: { inicio: '09:00', fin: '13:00', activo: false }
      },
      permisos: ['admin_total', 'ver_reportes', 'gestionar_usuarios', 'configuracion'],
      activo: true,
      fechaCreacion: '2024-01-01',
      ultimoAcceso: '2024-01-17T07:30:00'
    }
  ]);

  const [roles] = useState<Rol[]>([
    {
      id: '1',
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      permisos: ['admin_total', 'ver_reportes', 'gestionar_usuarios', 'configuracion', 'facturacion'],
      usuarios: 1
    },
    {
      id: '2',
      nombre: 'Odontólogo',
      descripcion: 'Profesional de odontología general',
      permisos: ['ver_pacientes', 'editar_pacientes', 'crear_citas', 'ver_reportes', 'historia_clinica'],
      usuarios: 1
    },
    {
      id: '3',
      nombre: 'Ortodoncista',
      descripcion: 'Especialista en ortodoncia',
      permisos: ['ver_pacientes', 'editar_pacientes', 'crear_citas', 'ver_reportes', 'ortodoncia', 'historia_clinica'],
      usuarios: 1
    },
    {
      id: '4',
      nombre: 'Recepcionista',
      descripcion: 'Atención al cliente y gestión de agenda',
      permisos: ['ver_pacientes', 'crear_citas', 'gestionar_agenda'],
      usuarios: 1
    }
  ]);

  const rolesUnicos = ['todos', ...Array.from(new Set(usuarios.map(u => u.rol)))];

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = (usuario.nombre + ' ' + usuario.apellidos).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'todos' || usuario.rol === selectedRole;
    return matchesSearch && matchesRole;
  });

  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  const handleCreateUser = (userData: any) => {
    console.log('Creating user:', userData);
  };

  const handleViewUser = (user: Usuario) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = (data: any) => {
    console.log('Usuario actualizado:', data);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getRoleColor = (rol: string) => {
    if (isDarkMode) {
      switch (rol) {
        case 'Administrador': return 'bg-red-900/50 text-red-200 border-red-700/50';
        case 'Odontólogo': return 'bg-blue-900/50 text-blue-200 border-blue-700/50';
        case 'Ortodoncista': return 'bg-green-900/50 text-green-200 border-green-700/50';
        case 'Recepcionista': return 'bg-purple-900/50 text-purple-200 border-purple-700/50';
        default: return 'bg-gray-700/50 text-gray-300 border-gray-600/50';
      }
    } else {
      switch (rol) {
        case 'Administrador': return 'bg-red-100 text-red-800 border-red-200';
        case 'Odontólogo': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Ortodoncista': return 'bg-green-100 text-green-800 border-green-200';
        case 'Recepcionista': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
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
              Gestión de Usuarios
            </h1>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Profesionales, permisos/roles, turnos/agenda propia</p>
          </div>
          <button
            onClick={() => setShowNewUserModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Tabs */}
        <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className={`border-b transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profesionales')}
                className={`py-3 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'profesionales'
                    ? (isDarkMode ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600')
                    : (isDarkMode 
                        ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Profesionales</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-3 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'roles'
                    ? (isDarkMode ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600')
                    : (isDarkMode 
                        ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Roles y Permisos</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/40 to-indigo-800/40 border-blue-700/50 shadow-blue-900/20' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-100/50 border-blue-200/50 shadow-blue-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-900'
              }`}>Usuarios Activos</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-100' : 'text-blue-600'
              }`}>
                {usuarios.filter(u => u.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-700/50 shadow-green-900/20' 
            : 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-200/50 shadow-green-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-green-200' : 'text-green-900'
              }`}>Profesionales</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-green-100' : 'text-green-600'
              }`}>
                {usuarios.filter(u => u.rol.includes('Dr') || u.rol === 'Odontólogo' || u.rol === 'Ortodoncista').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-purple-900/40 to-violet-800/40 border-purple-700/50 shadow-purple-900/20' 
            : 'bg-gradient-to-br from-purple-50 to-violet-100/50 border-purple-200/50 shadow-purple-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl shadow-lg">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-900'
              }`}>Roles Definidos</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-purple-100' : 'text-purple-600'
              }`}>{roles.length}</p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-amber-900/40 to-yellow-800/40 border-amber-700/50 shadow-amber-900/20' 
            : 'bg-gradient-to-br from-amber-50 to-yellow-100/50 border-amber-200/50 shadow-amber-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-3 rounded-xl shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-amber-200' : 'text-amber-900'
              }`}>En Línea</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-amber-100' : 'text-amber-600'
              }`}>
                {usuarios.filter(u => u.ultimoAcceso && 
                  new Date(u.ultimoAcceso).getTime() > Date.now() - 30 * 60 * 1000
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'profesionales' && (
        <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 mb-6 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-3 border rounded-xl w-full focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                }`}
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
              }`}
            >
              {rolesUnicos.map(rol => (
                <option key={rol} value={rol}>
                  {rol === 'todos' ? 'Todos los roles' : rol}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'profesionales' ? (
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
                    Usuario
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Rol
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Especialidades
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Horario Habitual
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Último Acceso
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
                {filteredUsuarios.map((usuario) => {
                  const diasActivos = diasSemana.filter(dia => usuario.horario[dia]?.activo).length;
                  return (
                    <tr key={usuario.id} className={`transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                        : 'hover:bg-gray-50 hover:shadow-md'
                    }`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm font-semibold transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {usuario.nombre} {usuario.apellidos}
                          </div>
                          <div className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{usuario.email}</div>
                          <div className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{usuario.telefono}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${getRoleColor(usuario.rol)}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {usuario.especialidades.slice(0, 2).map((esp, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-300 ${
                                isDarkMode 
                                  ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' 
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }`}
                            >
                              <Star className="h-3 w-3 mr-1" />
                              {esp}
                            </span>
                          ))}
                          {usuario.especialidades.length > 2 && (
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-300 ${
                              isDarkMode 
                                ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' 
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              +{usuario.especialidades.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center">
                          <Calendar className={`h-4 w-4 mr-2 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                          {diasActivos} días/semana
                        </div>
                        <div className={`text-xs mt-1 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Lun-Vie: {usuario.horario.lunes?.inicio} - {usuario.horario.viernes?.fin}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {usuario.ultimoAcceso ? (
                          <div>
                            <div className="font-medium">{new Date(usuario.ultimoAcceso).toLocaleDateString('es-ES')}</div>
                            <div className={`text-xs transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {new Date(usuario.ultimoAcceso).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>Nunca</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-300 ${
                          usuario.activo 
                            ? (isDarkMode 
                                ? 'bg-green-900/50 text-green-200 border-green-700/50' 
                                : 'bg-green-100 text-green-800 border-green-200')
                            : (isDarkMode 
                                ? 'bg-red-900/50 text-red-200 border-red-700/50' 
                                : 'bg-red-100 text-red-800 border-red-200')
                        }`}>
                          <Activity className="h-3 w-3 mr-1" />
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleViewUser(usuario)}
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
                            onClick={() => handleEditUser(usuario)}
                            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                              isDarkMode 
                                ? 'text-green-400 hover:text-green-300 hover:bg-green-900/30' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            title="Editar usuario"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                              isDarkMode 
                                ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/30' 
                                : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                            }`}
                            title="Gestionar horarios"
                          >
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Roles Table */
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
                    Rol
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Descripción
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Permisos
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Usuarios
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
                {roles.map((rol) => (
                  <tr key={rol.id} className={`transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{rol.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{rol.descripcion}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {rol.permisos.slice(0, 3).map((permiso, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-300 ${
                              isDarkMode 
                                ? 'bg-blue-900/50 text-blue-200 border-blue-700/50' 
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            <Key className="h-3 w-3 mr-1" />
                            {permiso.replace('_', ' ')}
                          </span>
                        ))}
                        {rol.permisos.length > 3 && (
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' 
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            +{rol.permisos.length - 3} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      <div className="flex items-center">
                        <Users className={`h-4 w-4 mr-2 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                        {rol.usuarios} usuario{rol.usuarios !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                          isDarkMode 
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}>
                          <Settings className="h-4 w-4" />
                        </button>
                        <button className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                          isDarkMode 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {((activeTab === 'profesionales' && filteredUsuarios.length === 0) || 
        (activeTab === 'roles' && roles.length === 0)) && (
        <div className={`text-center py-16 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/50' 
            : 'bg-white/40 border-gray-200/50'
        }`}>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-400/20 rounded-full blur-xl"></div>
            <UserCheck className={`mx-auto h-16 w-16 relative z-10 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`mt-4 text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            No hay {activeTab === 'profesionales' ? 'usuarios' : 'roles'}
          </h3>
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            No se encontraron {activeTab === 'profesionales' ? 'usuarios' : 'roles'} que coincidan con los filtros aplicados.
          </p>
        </div>
      )}

      {/* Modals */}
      <NewUserModal
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onSubmit={handleCreateUser}
      />
      
      <ViewUserModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        user={selectedUser}
      />
      
      <EditUserModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />
    </div>
  );
};

export default Usuarios;