import React, { useState } from 'react';
import { FileText, Plus, Download, Edit, Eye, Upload, File, Calendar, BarChart, TrendingUp, Shield } from 'lucide-react';
import NewDocumentTemplateModal from '../components/NewDocumentTemplateModal';

const Documentos = () => {
  const [activeTab, setActiveTab] = useState('plantillas');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);

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

  const handleCreateTemplate = (templateData: any) => {
    console.log('Creating template:', templateData);
  };

  const tabs = [
    { 
      id: 'plantillas', 
      name: 'Plantillas', 
      icon: FileText, 
      description: 'Gestiona plantillas de documentos',
      count: plantillas.filter(p => p.status === 'active').length
    },
    { 
      id: 'firmados', 
      name: 'Documentos Firmados', 
      icon: Shield, 
      description: 'Documentos con firma digital',
      count: documentosFirmados.length
    },
    { 
      id: 'versiones', 
      name: 'Control de Versiones', 
      icon: BarChart, 
      description: 'Historial y cambios',
      count: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Documentos
            </h1>
            <p className="text-gray-600 text-lg">
              Plantillas, consentimientos y firma digital
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl flex items-center hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Upload className="h-5 w-5 mr-2" />
              Subir Plantilla
            </button>
            <button 
              onClick={() => setShowNewTemplateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Plantilla
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Plantillas Activas</p>
                <p className="text-3xl font-bold text-white mt-1">{plantillas.filter(p => p.status === 'active').length}</p>
                <p className="text-blue-100 text-xs mt-1">En uso actualmente</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Docs. Firmados</p>
                <p className="text-3xl font-bold text-white mt-1">{documentosFirmados.filter(d => d.status === 'signed').length}</p>
                <p className="text-green-100 text-xs mt-1">Completados</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pendientes Firma</p>
                <p className="text-3xl font-bold text-white mt-1">{documentosFirmados.filter(d => d.status === 'pending').length}</p>
                <p className="text-yellow-100 text-xs mt-1">Requieren atención</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Descargas Mes</p>
                <p className="text-3xl font-bold text-white mt-1">187</p>
                <p className="text-purple-100 text-xs mt-1">↗ +23% vs anterior</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <nav className="flex space-x-2 p-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    isActive 
                      ? 'bg-white bg-opacity-20' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{tab.name}</div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                  {tab.count > 0 && (
                    <div className={`ml-3 px-2 py-1 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {tab.count}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'plantillas' && (
            <div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">Plantillas de Documentos</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Plantilla
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Versión
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Uso
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {plantillas.map((plantilla) => (
                        <tr key={plantilla.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                                <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">{plantilla.name}</div>
                                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg inline-block mt-1">
                                  Actualizado: {new Date(plantilla.lastUpdate).toLocaleDateString('es-ES')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(plantilla.type)} ${getTypeColor(plantilla.type).includes('blue') ? 'border-blue-200' : getTypeColor(plantilla.type).includes('green') ? 'border-green-200' : 'border-purple-200'}`}>
                              {plantilla.type}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                              {plantilla.category}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                              v{plantilla.version}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(plantilla.status)} ${getStatusColor(plantilla.status).includes('green') ? 'border-green-200' : 'border-gray-200'}`}>
                              {getStatusText(plantilla.status)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
                              {plantilla.usage} veces
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition-colors duration-200 group" title="Ver detalles">
                                <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-lg transition-colors duration-200 group" title="Editar">
                                <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200 group" title="Descargar">
                                <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firmados' && (
            <div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">Documentos Firmados Digitalmente</h3>
                  <p className="text-sm text-gray-600 mt-1">Registro completo de firmas digitales</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-green-50 to-teal-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Documento
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Fecha Firma
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Profesional
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {documentosFirmados.map((documento) => (
                        <tr key={documento.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-200">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                {documento.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div className="text-sm font-bold text-gray-900">{documento.patient}</div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                              {documento.document}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                              {new Date(documento.signedDate).toLocaleDateString('es-ES')}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                              {documento.professional}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(documento.status)} ${getStatusColor(documento.status).includes('green') ? 'border-green-200' : 'border-yellow-200'}`}>
                              {getStatusText(documento.status)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-lg transition-colors duration-200 text-xs font-medium">
                                Ver
                              </button>
                              {documento.downloadUrl && (
                                <button className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded-lg transition-colors duration-200 text-xs font-medium">
                                  Descargar
                                </button>
                              )}
                              {documento.status === 'pending' && (
                                <button className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 px-3 py-1 rounded-lg transition-colors duration-200 text-xs font-medium">
                                  Recordar
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
            </div>
          )}

          {activeTab === 'versiones' && (
            <div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">Control de Versiones</h3>
                  <p className="text-sm text-gray-600 mt-1">Historial y seguimiento de cambios en plantillas</p>
                </div>
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <BarChart className="h-12 w-12 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Control de Versiones</h4>
                  <p className="text-gray-600 mb-4">Esta funcionalidad está en desarrollo</p>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl max-w-md mx-auto border border-purple-200">
                    <p className="text-sm text-gray-700 mb-4">
                      Próximamente podrás ver:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Historial completo de cambios
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Comparación entre versiones
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Restauración de versiones anteriores
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Auditoría de modificaciones
                      </li>
                    </ul>
                  </div>
                  <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Notificarme cuando esté disponible
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Document Template Modal */}
      <NewDocumentTemplateModal
        isOpen={showNewTemplateModal}
        onClose={() => setShowNewTemplateModal(false)}
        onSubmit={handleCreateTemplate}
      />
    </div>
  );
};

export default Documentos;