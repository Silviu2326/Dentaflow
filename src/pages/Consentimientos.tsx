import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Send, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ConsentForm {
  id: string;
  nombre: string;
  categoria: string;
  version: string;
  fechaCreacion: string;
  contenido: string;
  activo: boolean;
  obligatorio: boolean;
}

interface ConsentRecord {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  formularioId: string;
  formularioNombre: string;
  fechaEnvio?: string;
  fechaFirma?: string;
  estado: 'pendiente' | 'enviado' | 'firmado' | 'rechazado';
  ip?: string;
  evidencia?: string;
  version: string;
}

const Consentimientos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plantillas' | 'registros'>('plantillas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const [plantillas] = useState<ConsentForm[]>([
    {
      id: '1',
      nombre: 'Consentimiento Odontología General',
      categoria: 'General',
      version: '2.1',
      fechaCreacion: '2024-01-15',
      contenido: 'He sido informado/a de los riesgos, beneficios y alternativas del tratamiento dental propuesto...',
      activo: true,
      obligatorio: true
    },
    {
      id: '2',
      nombre: 'Consentimiento Cirugía Oral',
      categoria: 'Cirugía',
      version: '1.5',
      fechaCreacion: '2024-01-10',
      contenido: 'Entiendo que la cirugía oral conlleva riesgos inherentes incluyendo pero no limitados a...',
      activo: true,
      obligatorio: true
    },
    {
      id: '3',
      nombre: 'Consentimiento Ortodoncia',
      categoria: 'Ortodoncia',
      version: '1.8',
      fechaCreacion: '2024-01-12',
      contenido: 'Comprendo que el tratamiento de ortodoncia requiere cooperación del paciente...',
      activo: true,
      obligatorio: false
    },
    {
      id: '4',
      nombre: 'Consentimiento Implantes Dentales',
      categoria: 'Implantología',
      version: '2.0',
      fechaCreacion: '2024-01-08',
      contenido: 'He sido informado de que los implantes dentales tienen una tasa de éxito del 95%...',
      activo: true,
      obligatorio: true
    }
  ]);

  const [registros] = useState<ConsentRecord[]>([
    {
      id: '1',
      pacienteId: '1',
      pacienteNombre: 'Ana García López',
      formularioId: '1',
      formularioNombre: 'Consentimiento Odontología General',
      fechaEnvio: '2024-01-15T10:00:00',
      fechaFirma: '2024-01-15T14:30:00',
      estado: 'firmado',
      ip: '192.168.1.100',
      evidencia: 'hash_abc123',
      version: '2.1'
    },
    {
      id: '2',
      pacienteId: '2',
      pacienteNombre: 'Carlos Ruiz Mesa',
      formularioId: '2',
      formularioNombre: 'Consentimiento Cirugía Oral',
      fechaEnvio: '2024-01-16T09:15:00',
      estado: 'enviado',
      version: '1.5'
    },
    {
      id: '3',
      pacienteId: '3',
      pacienteNombre: 'María Fernández Ruiz',
      formularioId: '4',
      formularioNombre: 'Consentimiento Implantes Dentales',
      estado: 'pendiente',
      version: '2.0'
    }
  ]);

  const categorias = ['todos', 'General', 'Cirugía', 'Ortodoncia', 'Implantología', 'Endodoncia', 'Periodoncia'];

  const filteredPlantillas = plantillas.filter(plantilla => {
    const matchesSearch = plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || plantilla.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredRegistros = registros.filter(registro => {
    const matchesSearch = registro.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.formularioNombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'firmado': return 'bg-green-100 text-green-800';
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'firmado': return <CheckCircle className="h-4 w-4" />;
      case 'enviado': return <Send className="h-4 w-4" />;
      case 'pendiente': return <Clock className="h-4 w-4" />;
      case 'rechazado': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consentimientos Informados</h1>
            <p className="text-gray-600">Plantillas, envío/firmas, versionado y evidencias legales</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('plantillas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plantillas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab('registros')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registros'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registros de Firmas
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={activeTab === 'plantillas' ? 'Buscar plantillas...' : 'Buscar por paciente o formulario...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {activeTab === 'plantillas' && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria === 'todos' ? 'Todas las categorías' : categoria}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plantillas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {plantillas.filter(p => p.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Firmados</p>
              <p className="text-2xl font-bold text-gray-900">
                {registros.filter(r => r.estado === 'firmado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {registros.filter(r => r.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rechazados</p>
              <p className="text-2xl font-bold text-gray-900">
                {registros.filter(r => r.estado === 'rechazado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'plantillas' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plantilla
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Creación
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
                {filteredPlantillas.map((plantilla) => (
                  <tr key={plantilla.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plantilla.nombre}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {plantilla.contenido.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {plantilla.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      v{plantilla.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(plantilla.fechaCreacion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          plantilla.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plantilla.activo ? 'Activa' : 'Inactiva'}
                        </span>
                        {plantilla.obligatorio && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Obligatoria
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formulario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Envío
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Firma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evidencia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistros.map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{registro.pacienteNombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registro.formularioNombre}</div>
                        <div className="text-sm text-gray-500">v{registro.version}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(registro.estado)}`}>
                        {getEstadoIcon(registro.estado)}
                        <span className="ml-1 capitalize">{registro.estado}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.fechaEnvio ? new Date(registro.fechaEnvio).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.fechaFirma ? new Date(registro.fechaFirma).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registro.evidencia ? (
                        <div className="text-xs">
                          <div className="text-gray-900">IP: {registro.ip}</div>
                          <div className="text-gray-500">Hash: {registro.evidencia.substring(0, 8)}...</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {registro.estado === 'pendiente' && (
                          <button className="text-green-600 hover:text-green-900">
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {((activeTab === 'plantillas' && filteredPlantillas.length === 0) || 
        (activeTab === 'registros' && filteredRegistros.length === 0)) && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay {activeTab === 'plantillas' ? 'plantillas' : 'registros'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron {activeTab === 'plantillas' ? 'plantillas' : 'registros'} que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};

export default Consentimientos;