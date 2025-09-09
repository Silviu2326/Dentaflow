import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Download, Mail, Phone, Calendar, FileText } from 'lucide-react';

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-gray-600">Gestión de pacientes y expedientes</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
              <Download className="h-5 w-5 mr-2" />
              Exportar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Paciente
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Mostrando {filteredPacientes.length} de {pacientes.length} pacientes
        </p>
      </div>

      {/* Patients Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tratamientos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {paciente.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link 
                            to={`/pacientes/${paciente.id}`}
                            className="hover:text-blue-600"
                          >
                            {paciente.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          Nacimiento: {new Date(paciente.birthDate).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {paciente.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {paciente.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(paciente.lastVisit).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {paciente.nextAppointment ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-green-500 mr-2" />
                        {new Date(paciente.nextAppointment).toLocaleDateString('es-ES')}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin cita</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(paciente.status)}`}>
                      {getStatusText(paciente.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {paciente.treatments.slice(0, 2).map((treatment, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                          {treatment}
                        </span>
                      ))}
                      {paciente.treatments.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                          +{paciente.treatments.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/pacientes/${paciente.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/pacientes/${paciente.id}/historia`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Historia
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPacientes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No se encontraron pacientes con los criterios seleccionados</div>
        </div>
      )}
    </div>
  );
};

export default Pacientes;