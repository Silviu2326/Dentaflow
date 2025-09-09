import React, { useState } from 'react';
import { FileText, Plus, Download, Edit, Eye, Upload, File, Calendar } from 'lucide-react';

const Documentos = () => {
  const [activeTab, setActiveTab] = useState('plantillas');

  const plantillas = [
    {
      id: 1,
      name: 'Consentimiento Informado - Endodoncia',
      type: 'consentimiento',
      category: 'Endodoncia',
      version: '2.1',
      lastUpdate: '2024-01-15',
      status: 'active',
      usage: 45
    },
    {
      id: 2,
      name: 'Consentimiento Informado - Implantes',
      type: 'consentimiento',
      category: 'Implantología',
      version: '1.8',
      lastUpdate: '2024-01-10',
      status: 'active',
      usage: 23
    },
    {
      id: 3,
      name: 'Contrato de Ortodoncia',
      type: 'contrato',
      category: 'Ortodoncia',
      version: '3.0',
      lastUpdate: '2024-01-20',
      status: 'active',
      usage: 12
    },
    {
      id: 4,
      name: 'Información Post-Operatoria - Cirugía',
      type: 'informacion',
      category: 'Cirugía',
      version: '1.5',
      lastUpdate: '2023-12-15',
      status: 'inactive',
      usage: 8
    }
  ];

  const documentosFirmados = [
    {
      id: 1,
      patient: 'Ana García López',
      document: 'Consentimiento Informado - Endodoncia',
      signedDate: '2024-01-15',
      professional: 'Dr. Rodriguez',
      status: 'signed',
      downloadUrl: '#'
    },
    {
      id: 2,
      patient: 'Carlos López Martín',
      document: 'Contrato de Ortodoncia',
      signedDate: '2024-01-18',
      professional: 'Dra. Martinez',
      status: 'pending',
      downloadUrl: null
    },
    {
      id: 3,
      patient: 'María Fernández Ruiz',
      document: 'Consentimiento Informado - Implantes',
      signedDate: '2024-01-20',
      professional: 'Dr. Lopez',
      status: 'signed',
      downloadUrl: '#'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consentimiento': return 'bg-blue-100 text-blue-800';
      case 'contrato': return 'bg-green-100 text-green-800';
      case 'informacion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'signed': return 'Firmado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const tabs = [
    { id: 'plantillas', name: 'Plantillas', icon: FileText },
    { id: 'firmados', name: 'Documentos Firmados', icon: File },
    { id: 'versiones', name: 'Control de Versiones', icon: Calendar }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
            <p className="text-gray-600">Plantillas, consentimientos y firma digital</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
              <Upload className="h-5 w-5 mr-2" />
              Subir Plantilla
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Plantilla
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-md">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Plantillas Activas</p>
                <p className="text-2xl font-semibold text-gray-900">{plantillas.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-md">
                <File className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Docs. Firmados</p>
                <p className="text-2xl font-semibold text-gray-900">{documentosFirmados.filter(d => d.status === 'signed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-md">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes Firma</p>
                <p className="text-2xl font-semibold text-gray-900">{documentosFirmados.filter(d => d.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-md">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Descargas Mes</p>
                <p className="text-2xl font-semibold text-gray-900">187</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'plantillas' && (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plantilla
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Versión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uso
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plantillas.map((plantilla) => (
                      <tr key={plantilla.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{plantilla.name}</div>
                              <div className="text-xs text-gray-500">
                                Actualizado: {new Date(plantilla.lastUpdate).toLocaleDateString('es-ES')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(plantilla.type)}`}>
                            {plantilla.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {plantilla.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          v{plantilla.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plantilla.status)}`}>
                            {getStatusText(plantilla.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {plantilla.usage} veces
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'firmados' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos Firmados Digitalmente</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Firma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profesional
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
                    {documentosFirmados.map((documento) => (
                      <tr key={documento.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {documento.patient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {documento.document}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(documento.signedDate).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {documento.professional}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(documento.status)}`}>
                            {getStatusText(documento.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Ver</button>
                          {documento.downloadUrl && (
                            <button className="text-green-600 hover:text-green-900">Descargar</button>
                          )}
                          {documento.status === 'pending' && (
                            <button className="text-yellow-600 hover:text-yellow-900">Recordar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'versiones' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Control de Versiones</h3>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>Control de versiones en desarrollo</p>
                <p className="text-sm mt-2">Aquí se mostrarán los cambios históricos en plantillas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentos;