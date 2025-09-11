import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  Users,
  Activity,
  Clock,
  Eye,
  Edit,
  MoreVertical,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import NewPatientModal from '../components/NewPatientModal';

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  const pacientes = [
    {
      id: 1,
      name: 'Ana García López',
      email: 'ana.garcia@email.com',
      phone: '+34 600 123 456',
      birthDate: '1985-03-15',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      status: 'active',
      treatments: ['Limpieza', 'Endodoncia']
    },
    {
      id: 2,
      name: 'Carlos López Martín',
      email: 'carlos.lopez@email.com',
      phone: '+34 600 789 012',
      birthDate: '1978-07-22',
      lastVisit: '2024-01-10',
      nextAppointment: null,
      status: 'inactive',
      treatments: ['Implante', 'Corona']
    },
    {
      id: 3,
      name: 'María Fernández Ruiz',
      email: 'maria.fernandez@email.com',
      phone: '+34 600 345 678',
      birthDate: '1992-11-08',
      lastVisit: '2024-01-18',
      nextAppointment: '2024-01-28',
      status: 'active',
      treatments: ['Ortodoncia']
    },
    {
      id: 4,
      name: 'José Martín Pérez',
      email: 'jose.martin@email.com',
      phone: '+34 600 901 234',
      birthDate: '1965-05-30',
      lastVisit: '2023-12-20',
      nextAppointment: '2024-01-30',
      status: 'pending',
      treatments: ['Prótesis']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const filteredPacientes = pacientes.filter(paciente => {
    const matchesSearch = paciente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.phone.includes(searchTerm);
    
    const matchesFilter = filterBy === 'all' || paciente.status === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  const handleNewPatient = (patientData: any) => {
    console.log('Nuevo paciente creado:', patientData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Professional Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
                  <p className="text-gray-600">Gestión profesional de pacientes y expedientes</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{pacientes.filter(p => p.status === 'active').length} activos</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">{pacientes.filter(p => p.status === 'pending').length} pendientes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">{pacientes.length} total</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/80 border border-gray-200/50 text-gray-700 px-6 py-3 rounded-xl flex items-center hover:bg-white hover:shadow-md transition-all duration-200 backdrop-blur-sm">
                <Download className="h-5 w-5 mr-2" />
                Exportar
              </button>
              <button 
                onClick={() => setShowNewPatientModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Paciente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Search and Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            
            {/* Enhanced Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200/50 rounded-xl bg-white/80 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Estado:</span>
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="rounded-xl border border-gray-200/50 bg-white/80 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200/50 focus:outline-none transition-all duration-200 hover:bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Results Summary */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-700">
              Mostrando <span className="text-blue-600 font-semibold">{filteredPacientes.length}</span> de <span className="font-semibold">{pacientes.length}</span> pacientes
            </p>
            {searchTerm && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Search className="h-4 w-4" />
                <span>Filtrado por: "{searchTerm}"</span>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg border border-gray-200/50 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600">
              <TrendingUp className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg border border-gray-200/50 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Professional Patients Table */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Lista de Pacientes</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="h-4 w-4" />
                <span>Actualizado hace 2 min</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50/20 border-b border-gray-200/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Paciente</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Contacto</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Última Visita</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Próxima Cita</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Tratamientos</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 backdrop-blur-sm">
                {filteredPacientes.map((paciente, index) => {
                  const statusIcons = {
                    active: CheckCircle,
                    inactive: AlertCircle,
                    pending: Clock
                  };
                  const StatusIcon = statusIcons[paciente.status as keyof typeof statusIcons];
                  
                  return (
                    <tr key={paciente.id} className={`border-b border-gray-100/50 hover:bg-blue-50/30 transition-all duration-200 group ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white/30'}`}>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                              <span className="text-sm font-bold text-white">
                                {paciente.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              <Link 
                                to={`/pacientes/${paciente.id}`}
                                className="hover:text-blue-600 flex items-center space-x-2"
                              >
                                <span>{paciente.name}</span>
                                <Eye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Nacimiento: {new Date(paciente.birthDate).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <div className="p-1 bg-blue-100 rounded-md">
                              <Mail className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="font-medium">{paciente.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <div className="p-1 bg-green-100 rounded-md">
                              <Phone className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="font-medium">{paciente.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-gray-100 rounded-md">
                            <Clock className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(paciente.lastVisit).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        {paciente.nextAppointment ? (
                          <div className="flex items-center space-x-2">
                            <div className="p-1 bg-green-100 rounded-md">
                              <Calendar className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-700">
                              {new Date(paciente.nextAppointment).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="p-1 bg-gray-100 rounded-md">
                              <AlertCircle className="h-3 w-3 text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-500">Sin cita programada</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border ${getStatusColor(paciente.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1.5" />
                          {getStatusText(paciente.status)}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {paciente.treatments.slice(0, 2).map((treatment, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50">
                              {treatment}
                            </span>
                          ))}
                          {paciente.treatments.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200/50">
                              +{paciente.treatments.length - 2} más
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/pacientes/${paciente.id}`}
                            className="p-2 rounded-lg bg-blue-100/50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                            title="Ver perfil"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/pacientes/${paciente.id}/historia`}
                            className="p-2 rounded-lg bg-green-100/50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 hover:scale-105"
                            title="Ver historia"
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                          <button 
                            className="p-2 rounded-lg bg-gray-100/50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 hover:scale-105"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
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
      </div>

      {filteredPacientes.length === 0 && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pacientes</h3>
            <p className="text-gray-600 mb-6">No hay pacientes que coincidan con los criterios de búsqueda seleccionados</p>
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
              <button 
                onClick={() => setShowNewPatientModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Agregar nuevo paciente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Paciente */}
      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onSubmit={handleNewPatient}
      />
    </div>
  );
};

export default Pacientes;