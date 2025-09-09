import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Calendar, Clock, UserCheck, Key } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'profesionales' | 'roles'>('profesionales');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('todos');
  const [showUserForm, setShowUserForm] = useState(false);

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

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Odontólogo': return 'bg-blue-100 text-blue-800';
      case 'Ortodoncista': return 'bg-green-100 text-green-800';
      case 'Recepcionista': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600">Profesionales, permisos/roles, turnos/agenda propia</p>
          </div>
          <button
            onClick={() => setShowUserForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profesionales')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profesionales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profesionales
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Roles y Permisos
            </button>
          </nav>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profesionales</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.rol.includes('Dr') || u.rol === 'Odontólogo' || u.rol === 'Ortodoncista').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Key className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Roles Definidos</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Línea</p>
              <p className="text-2xl font-bold text-gray-900">
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {rolesUnicos.map(rol => (
              <option key={rol} value={rol}>
                {rol === 'todos' ? 'Todos los roles' : rol}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'profesionales' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario Habitual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => {
                  const diasActivos = diasSemana.filter(dia => usuario.horario[dia]?.activo).length;
                  return (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellidos}
                          </div>
                          <div className="text-sm text-gray-500">{usuario.email}</div>
                          <div className="text-sm text-gray-500">{usuario.telefono}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(usuario.rol)}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {usuario.especialidades.slice(0, 2).map((esp, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700"
                            >
                              {esp}
                            </span>
                          ))}
                          {usuario.especialidades.length > 2 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                              +{usuario.especialidades.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {diasActivos} días/semana
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Lun-Vie: {usuario.horario.lunes?.inicio} - {usuario.horario.viernes?.fin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.ultimoAcceso ? (
                          <div>
                            <div>{new Date(usuario.ultimoAcceso).toLocaleDateString('es-ES')}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(usuario.ultimoAcceso).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Nunca</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Calendar className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permisos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((rol) => (
                  <tr key={rol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rol.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{rol.descripcion}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {rol.permisos.slice(0, 3).map((permiso, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700"
                          >
                            {permiso.replace('_', ' ')}
                          </span>
                        ))}
                        {rol.permisos.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                            +{rol.permisos.length - 3} más
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rol.usuarios} usuario{rol.usuarios !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay {activeTab === 'profesionales' ? 'usuarios' : 'roles'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron {activeTab === 'profesionales' ? 'usuarios' : 'roles'} que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};

export default Usuarios;