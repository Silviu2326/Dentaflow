import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Plus, Download, Eye, Upload, Trash2, Calendar, User } from 'lucide-react';

const ImagenesPaciente = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('antes-despues');

  const paciente = {
    name: 'Ana García López',
    id: 1
  };

  const imagenesAntesDespues = [
    {
      id: 1,
      title: 'Blanqueamiento Dental',
      date: '2024-01-15',
      professional: 'Dr. Rodriguez',
      before: 'https://images.pexels.com/photos/5726788/pexels-photo-5726788.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      after: 'https://images.pexels.com/photos/5726793/pexels-photo-5726793.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      treatment: 'Blanqueamiento profesional',
      hasPermission: true
    },
    {
      id: 2,
      title: 'Ortodoncia - Progreso 6 meses',
      date: '2024-01-10',
      professional: 'Dra. Martinez',
      before: 'https://images.pexels.com/photos/6529408/pexels-photo-6529408.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      after: 'https://images.pexels.com/photos/6529409/pexels-photo-6529409.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      treatment: 'Corrección de mordida',
      hasPermission: true
    }
  ];

  const radiografias = [
    {
      id: 1,
      title: 'Radiografía Panorámica',
      date: '2024-01-15',
      type: 'panoramica',
      url: 'https://images.pexels.com/photos/8460095/pexels-photo-8460095.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      professional: 'Dr. Rodriguez'
    },
    {
      id: 2,
      title: 'Periapical Pieza 16',
      date: '2024-01-10',
      type: 'periapical',
      url: 'https://images.pexels.com/photos/8460094/pexels-photo-8460094.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      professional: 'Dr. Rodriguez'
    }
  ];

  const documentosAdjuntos = [
    {
      id: 1,
      name: 'Consentimiento_Blanqueamiento.pdf',
      type: 'pdf',
      size: '245 KB',
      date: '2024-01-15',
      uploadedBy: 'Dr. Rodriguez'
    },
    {
      id: 2,
      name: 'Informe_Laboratorio.pdf',
      type: 'pdf',
      size: '512 KB',
      date: '2024-01-12',
      uploadedBy: 'Dra. Martinez'
    }
  ];

  const tabs = [
    { id: 'antes-despues', name: 'Antes/Después' },
    { id: 'radiografias', name: 'Radiografías' },
    { id: 'documentos', name: 'Documentos' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link
            to={`/pacientes/${id}`}
            className="mr-4 p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Galería de Imágenes</h1>
            <p className="text-gray-600">{paciente.name}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Subir Imágenes
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-md">
                <Camera className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Antes/Después</p>
                <p className="text-2xl font-semibold text-gray-900">{imagenesAntesDespues.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-md">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Radiografías</p>
                <p className="text-2xl font-semibold text-gray-900">{radiografias.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-md">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Documentos</p>
                <p className="text-2xl font-semibold text-gray-900">{documentosAdjuntos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-md">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Con Permisos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {imagenesAntesDespues.filter(img => img.hasPermission).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'antes-despues' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Imágenes Antes/Después</h3>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Set
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {imagenesAntesDespues.map((set) => (
                  <div key={set.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{set.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(set.date).toLocaleDateString('es-ES')}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {set.professional}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{set.treatment}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {set.hasPermission ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Autorizado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Sin permisos
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Antes</h5>
                        <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={set.before}
                            alt="Antes"
                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Después</h5>
                        <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={set.after}
                            alt="Después"
                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver ampliado
                      </button>
                      <button className="text-green-600 hover:text-green-800 flex items-center text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {imagenesAntesDespues.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay imágenes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza subiendo el primer set de imágenes antes/después.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'radiografias' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Radiografías</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Radiografía
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {radiografias.map((radio) => (
                  <div key={radio.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={radio.url}
                        alt={radio.title}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{radio.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">{radio.type}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{new Date(radio.date).toLocaleDateString('es-ES')}</span>
                        <span>{radio.professional}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-800 flex items-center text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Documentos Adjuntos</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Documento
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subido por
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documentosAdjuntos.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-medium text-red-800">PDF</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.uploadedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Ver</button>
                          <button className="text-green-600 hover:text-green-900">Descargar</button>
                          <button className="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagenesPaciente;