import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Download, Edit, Calendar } from 'lucide-react';
import NewEvaluationModal from '../components/NewEvaluationModal';

const HistoriaClinica = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('historia');
  const [showNewEvaluationModal, setShowNewEvaluationModal] = useState(false);

  const paciente = {
    name: 'Ana García López',
    age: 39,
    id: 1
  };

  const historiaEntries = [
    {
      id: 1,
      date: '2024-01-15',
      professional: 'Dr. Rodriguez',
      treatment: 'Limpieza dental',
      description: 'Limpieza rutinaria. Paciente presenta buena higiene oral. Se recomienda continuar con rutina actual.',
      teeth: ['11', '12', '13', '21', '22', '23'],
      images: ['before_1.jpg', 'after_1.jpg']
    },
    {
      id: 2,
      date: '2024-01-10',
      professional: 'Dr. Rodriguez',
      treatment: 'Consulta inicial endodoncia',
      description: 'Evaluación para tratamiento de endodoncia en pieza 16. Se observa caries profunda con afectación pulpar.',
      teeth: ['16'],
      images: ['radiografia_16.jpg']
    },
    {
      id: 3,
      date: '2023-12-20',
      professional: 'Dra. Martinez',
      treatment: 'Revisión semestral',
      description: 'Revisión rutinaria. Estado general bueno. Se detecta inicio de caries en pieza 16.',
      teeth: ['16'],
      images: []
    }
  ];

  const odontograma = {
    // Mapa de dientes con su estado
    teeth: {
      '18': { status: 'healthy', notes: '' },
      '17': { status: 'healthy', notes: '' },
      '16': { status: 'caries', notes: 'Caries profunda, requiere endodoncia' },
      '15': { status: 'healthy', notes: '' },
      '14': { status: 'healthy', notes: '' },
      '13': { status: 'healthy', notes: '' },
      '12': { status: 'healthy', notes: '' },
      '11': { status: 'healthy', notes: '' },
      '21': { status: 'healthy', notes: '' },
      '22': { status: 'healthy', notes: '' },
      '23': { status: 'healthy', notes: '' },
      '24': { status: 'healthy', notes: '' },
      '25': { status: 'healthy', notes: '' },
      '26': { status: 'filled', notes: 'Empaste de amalgama' },
      '27': { status: 'healthy', notes: '' },
      '28': { status: 'missing', notes: 'Extraído' }
    }
  };

  const getToothColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'fill-white stroke-gray-300';
      case 'caries': return 'fill-red-200 stroke-red-400';
      case 'filled': return 'fill-blue-200 stroke-blue-400';
      case 'crown': return 'fill-yellow-200 stroke-yellow-400';
      case 'missing': return 'fill-gray-200 stroke-gray-400';
      default: return 'fill-white stroke-gray-300';
    }
  };

  const tabs = [
    { id: 'historia', name: 'Historia Clínica' },
    { id: 'odontograma', name: 'Odontograma' },
    { id: 'periodontograma', name: 'Periodontograma' },
    { id: 'plantillas', name: 'Plantillas' }
  ];

  const handleNewEvaluation = (evaluationData: any) => {
    console.log('Nueva evaluación creada:', evaluationData);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Historia Clínica</h1>
            <p className="text-gray-600">{paciente.name} - {paciente.age} años</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
              <Download className="h-5 w-5 mr-2" />
              Exportar PDF
            </button>
            <button 
              onClick={() => {
                console.log('Botón clickeado, abriendo modal');
                setShowNewEvaluationModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Entrada
            </button>
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
          {activeTab === 'historia' && (
            <div className="space-y-6">
              {historiaEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{entry.treatment}</h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(entry.date).toLocaleDateString('es-ES')}
                          </span>
                          <span>{entry.professional}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                    <p className="text-gray-700">{entry.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Piezas tratadas</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.teeth.map((tooth) => (
                          <span key={tooth} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {tooth}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {entry.images.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Imágenes adjuntas</h4>
                        <div className="flex space-x-2">
                          {entry.images.map((image, index) => (
                            <div key={index} className="bg-gray-200 p-2 rounded text-sm text-gray-600">
                              {image}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'odontograma' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Odontograma</h3>
                <p className="text-gray-600">Estado actual de las piezas dentales</p>
              </div>

              {/* Dental Chart */}
              <div className="bg-gray-50 rounded-lg p-8 mb-6">
                <div className="max-w-4xl mx-auto">
                  {/* Upper jaw */}
                  <div className="mb-8">
                    <h4 className="text-center font-medium text-gray-700 mb-4">Maxilar Superior</h4>
                    <div className="grid grid-cols-8 gap-2 justify-items-center">
                      {['18', '17', '16', '15', '14', '13', '12', '11'].map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div 
                            className={`w-8 h-8 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${getToothColor(odontograma.teeth[tooth]?.status || 'healthy')}`}
                            title={odontograma.teeth[tooth]?.notes || ''}
                          />
                          <div className="text-xs text-gray-600 mt-1">{tooth}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-8 gap-2 justify-items-center mt-2">
                      {['21', '22', '23', '24', '25', '26', '27', '28'].map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div 
                            className={`w-8 h-8 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${getToothColor(odontograma.teeth[tooth]?.status || 'healthy')}`}
                            title={odontograma.teeth[tooth]?.notes || ''}
                          />
                          <div className="text-xs text-gray-600 mt-1">{tooth}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lower jaw */}
                  <div>
                    <h4 className="text-center font-medium text-gray-700 mb-4">Maxilar Inferior</h4>
                    <div className="grid grid-cols-8 gap-2 justify-items-center">
                      {['48', '47', '46', '45', '44', '43', '42', '41'].map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div 
                            className={`w-8 h-8 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${getToothColor(odontograma.teeth[tooth]?.status || 'healthy')}`}
                            title={odontograma.teeth[tooth]?.notes || ''}
                          />
                          <div className="text-xs text-gray-600 mt-1">{tooth}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-8 gap-2 justify-items-center mt-2">
                      {['31', '32', '33', '34', '35', '36', '37', '38'].map((tooth) => (
                        <div key={tooth} className="text-center">
                          <div 
                            className={`w-8 h-8 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${getToothColor(odontograma.teeth[tooth]?.status || 'healthy')}`}
                            title={odontograma.teeth[tooth]?.notes || ''}
                          />
                          <div className="text-xs text-gray-600 mt-1">{tooth}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Leyenda</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded border-2 fill-white stroke-gray-300 mr-2"></div>
                    <span className="text-sm text-gray-700">Sano</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded border-2 bg-red-200 border-red-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Caries</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded border-2 bg-blue-200 border-blue-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Empaste</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded border-2 bg-yellow-200 border-yellow-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Corona</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded border-2 bg-gray-200 border-gray-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Ausente</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'periodontograma' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Periodontograma</h3>
                <p className="text-gray-600">Evaluación del estado periodontal</p>
              </div>
              <div className="text-center py-12 text-gray-500">
                Funcionalidad de periodontograma en desarrollo
              </div>
            </div>
          )}

          {activeTab === 'plantillas' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Plantillas por Especialidad</h3>
                <p className="text-gray-600">Formularios específicos según tratamiento</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Ortodoncia', 
                  'Endodoncia', 
                  'Implantología', 
                  'Periodoncia', 
                  'Cirugía Oral',
                  'Prostodoncia'
                ].map((especialidad) => (
                  <div key={especialidad} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
                    <h4 className="font-medium text-gray-900">{especialidad}</h4>
                    <p className="text-sm text-gray-500 mt-1">Formulario específico de {especialidad.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nueva Evaluación */}
      <NewEvaluationModal
        isOpen={showNewEvaluationModal}
        onClose={() => setShowNewEvaluationModal(false)}
        onSubmit={handleNewEvaluation}
      />
    </div>
  );
};

export default HistoriaClinica;