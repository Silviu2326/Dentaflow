import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus, Clock, User, MapPin } from 'lucide-react';

const Citas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

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
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
            <p className="text-gray-600">Listado y filtros avanzados de citas</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nueva Cita
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por paciente, tratamiento o profesional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
        <p className="text-sm text-gray-600">
          Mostrando {filteredCitas.length} de {citas.length} citas
        </p>
      </div>

      {/* Appointments List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tratamiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCitas.map((cita) => (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">
                          {new Date(cita.date).toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            day: '2-digit', 
                            month: 'short' 
                          })}
                        </div>
                        <div className="text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {cita.time} ({cita.duration}min)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {cita.patient.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cita.patient}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cita.treatment}
                    {cita.notes && (
                      <div className="text-xs text-gray-500 mt-1">{cita.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {cita.professional}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {cita.sede}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cita.status)}`}>
                      {getStatusText(cita.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSourceText(cita.source)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Ver</button>
                    <button className="text-green-600 hover:text-green-900">Editar</button>
                    <button className="text-red-600 hover:text-red-900">Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCitas.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron citas con los filtros seleccionados.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Citas</p>
              <p className="text-2xl font-semibold text-blue-600">{citas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Confirmadas</p>
              <p className="text-2xl font-semibold text-green-600">
                {citas.filter(c => c.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900">Pendientes</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {citas.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-red-500 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900">Canceladas</p>
              <p className="text-2xl font-semibold text-red-600">
                {citas.filter(c => c.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Citas;