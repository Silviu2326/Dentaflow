import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Calendar, FileText, Circle, Activity, X, Save, MapPin, User, Clock, Stethoscope } from 'lucide-react';

interface DentalRecord {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  fecha: string;
  tipo: 'odontograma' | 'periodontograma' | 'evolutivo' | 'plantilla';
  titulo: string;
  descripcion: string;
  hallazgos: string[];
  tratamientos: string[];
  proximaCita?: string;
}

interface ToothStatus {
  number: number;
  status: 'sano' | 'caries' | 'obturado' | 'corona' | 'ausente' | 'implante';
  surfaces: {
    oclusal: boolean;
    mesial: boolean;
    distal: boolean;
    vestibular: boolean;
    lingual: boolean;
  };
}

const HistoriaClinicaDental: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [showOdontograma, setShowOdontograma] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DentalRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<DentalRecord | null>(null);

  const [records] = useState<DentalRecord[]>([
    {
      id: '1',
      pacienteId: '1',
      pacienteNombre: 'Ana García López',
      fecha: '2024-01-15',
      tipo: 'odontograma',
      titulo: 'Odontograma inicial',
      descripcion: 'Evaluación dental completa de primera consulta',
      hallazgos: ['Caries en 16', 'Gingivitis leve generalizada', 'Ausencia de 36'],
      tratamientos: ['Obturación 16', 'Profilaxis', 'Implante 36'],
      proximaCita: '2024-01-22'
    },
    {
      id: '2',
      pacienteId: '2',
      pacienteNombre: 'Carlos Ruiz Mesa',
      fecha: '2024-01-16',
      tipo: 'periodontograma',
      titulo: 'Evaluación periodontal',
      descripción: 'Sondaje periodontal completo',
      hallazgos: ['Bolsas de 4-5mm sector posterior', 'Sangrado al sondaje generalizado'],
      tratamientos: ['Curetaje por cuadrantes', 'Instrucciones de higiene'],
      proximaCita: '2024-01-30'
    },
    {
      id: '3',
      pacienteId: '1',
      pacienteNombre: 'Ana García López',
      fecha: '2024-01-22',
      tipo: 'evolutivo',
      titulo: 'Control post-obturación',
      descripción: 'Revisión de obturación en 16',
      hallazgos: ['Obturación en buen estado', 'Sin sintomatología'],
      tratamientos: ['Control radiográfico en 6 meses'],
      proximaCita: '2024-07-22'
    }
  ]);

  const [odontograma] = useState<ToothStatus[]>([
    { number: 18, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 17, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 16, status: 'caries', surfaces: { oclusal: true, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 15, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 14, status: 'obturado', surfaces: { oclusal: true, mesial: true, distal: false, vestibular: false, lingual: false } },
    { number: 13, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 12, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 11, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 21, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 22, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 23, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 24, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 25, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 26, status: 'obturado', surfaces: { oclusal: true, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 27, status: 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
    { number: 28, status: 'ausente', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } },
  ]);

  const tipos = ['todos', 'odontograma', 'periodontograma', 'evolutivo', 'plantilla'];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || record.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  const getToothColor = (status: string) => {
    switch (status) {
      case 'sano': return 'text-green-600 bg-green-100 border-green-300';
      case 'caries': return 'text-red-600 bg-red-100 border-red-300';
      case 'obturado': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'corona': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'ausente': return 'text-gray-400 bg-gray-100 border-gray-300';
      case 'implante': return 'text-purple-600 bg-purple-100 border-purple-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const handleViewRecord = (record: DentalRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleEditRecord = (record: DentalRecord) => {
    setEditingRecord({ ...record });
    setShowEditModal(true);
  };

  const handleSaveRecord = () => {
    // Aquí iría la lógica para guardar el registro editado
    setShowEditModal(false);
    setEditingRecord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Historia Clínica Dental
            </h1>
            <p className="text-gray-600 text-lg">Odontogramas, periodontogramas y evoluciones por paciente</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowOdontograma(!showOdontograma)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Circle className="h-5 w-5 mr-2" />
              {showOdontograma ? 'Ocultar' : 'Ver'} Odontograma
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Evaluación
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por paciente o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px]"
          >
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo === 'todos' ? 'Todos los tipos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Odontogram Section */}
      {showOdontograma && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Circle className="h-6 w-6 text-blue-600" />
            </div>
            Odontograma Interactivo
          </h3>
          
          {/* Superior teeth */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Arcada Superior</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {odontograma.filter(tooth => tooth.number >= 11 && tooth.number <= 28).map(tooth => (
                <div
                  key={tooth.number}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-110 ${getToothColor(tooth.status)}`}
                  title={`Diente ${tooth.number} - ${tooth.status}`}
                >
                  <span className="text-sm font-bold">{tooth.number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inferior teeth */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Arcada Inferior</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {[48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38].map(number => {
                const tooth = { number, status: number === 36 ? 'ausente' : 'sano', surfaces: { oclusal: false, mesial: false, distal: false, vestibular: false, lingual: false } };
                return (
                  <div
                    key={number}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-110 ${getToothColor(tooth.status)}`}
                    title={`Diente ${number} - ${tooth.status}`}
                  >
                    <span className="text-sm font-bold">{number}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Leyenda de Estados</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-lg bg-green-100 border-2 border-green-300 mr-3"></div>
                <span className="font-medium text-gray-700">Sano</span>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-lg bg-red-100 border-2 border-red-300 mr-3"></div>
                <span className="font-medium text-gray-700">Caries</span>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-lg bg-blue-100 border-2 border-blue-300 mr-3"></div>
                <span className="font-medium text-gray-700">Obturado</span>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-lg bg-yellow-100 border-2 border-yellow-300 mr-3"></div>
                <span className="font-medium text-gray-700">Corona</span>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-lg bg-gray-100 border-2 border-gray-300 mr-3"></div>
                <span className="font-medium text-gray-700">Ausente</span>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-lg bg-purple-100 border-2 border-purple-300 mr-3"></div>
                <span className="font-medium text-gray-700">Implante</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Registros</p>
              <p className="text-3xl font-bold mt-1">{records.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Odontogramas</p>
              <p className="text-3xl font-bold mt-1">
                {records.filter(r => r.tipo === 'odontograma').length}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Circle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Periodontogramas</p>
              <p className="text-3xl font-bold mt-1">
                {records.filter(r => r.tipo === 'periodontograma').length}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Evolutivos</p>
              <p className="text-3xl font-bold mt-1">
                {records.filter(r => r.tipo === 'evolutivo').length}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Registros Clínicos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Paciente
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Fecha
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 mr-2" />
                    Tipo
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Título
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Hallazgos
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Próxima Cita
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {record.pacienteNombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{record.pacienteNombre}</div>
                        <div className="text-xs text-gray-500">ID: {record.pacienteId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(record.fecha).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.fecha).toLocaleDateString('es-ES', { weekday: 'long' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-2 ${
                      record.tipo === 'odontograma' ? 'bg-green-50 text-green-700 border-green-200' :
                      record.tipo === 'periodontograma' ? 'bg-red-50 text-red-700 border-red-200' :
                      record.tipo === 'evolutivo' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {record.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-900">{record.titulo}</div>
                    <div className="text-sm text-gray-600 mt-1">{record.descripcion}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-900">
                      {record.hallazgos.slice(0, 2).map((hallazgo, index) => (
                        <div key={index} className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                          <span>{hallazgo}</span>
                        </div>
                      ))}
                      {record.hallazgos.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block">
                          +{record.hallazgos.length - 2} hallazgos más
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {record.proximaCita ? (
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(record.proximaCita).toLocaleDateString('es-ES')}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin programar</span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewRecord(record)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition-colors duration-200 group"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleEditRecord(record)}
                        className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-lg transition-colors duration-200 group"
                        title="Editar registro"
                      >
                        <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="p-4 bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay registros</h3>
          <p className="text-gray-500 mb-6">
            No se encontraron registros clínicos que coincidan con los filtros aplicados.
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
            Crear primer registro
          </button>
        </div>
      )}

      {/* Modal para ver detalles */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Detalles del Registro</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información del Paciente
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nombre:</span> {selectedRecord.pacienteNombre}</p>
                    <p><span className="font-medium">ID:</span> {selectedRecord.pacienteId}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Información de la Consulta
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Fecha:</span> {new Date(selectedRecord.fecha).toLocaleDateString('es-ES')}</p>
                    <p><span className="font-medium">Tipo:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedRecord.tipo === 'odontograma' ? 'bg-green-100 text-green-700' :
                        selectedRecord.tipo === 'periodontograma' ? 'bg-red-100 text-red-700' :
                        selectedRecord.tipo === 'evolutivo' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedRecord.tipo}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Detalles del Registro
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Título:</h4>
                    <p className="text-gray-900">{selectedRecord.titulo}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Descripción:</h4>
                    <p className="text-gray-900">{selectedRecord.descripcion}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Hallazgos Clínicos
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecord.hallazgos.map((hallazgo, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-900">{hallazgo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Tratamientos Propuestos
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecord.tratamientos.map((tratamiento, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-900">{tratamiento}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {selectedRecord.proximaCita && (
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Próxima Cita
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {new Date(selectedRecord.proximaCita).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Editar Registro</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingRecord.titulo}
                    onChange={(e) => setEditingRecord({...editingRecord, titulo: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={editingRecord.tipo}
                    onChange={(e) => setEditingRecord({...editingRecord, tipo: e.target.value as any})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="odontograma">Odontograma</option>
                    <option value="periodontograma">Periodontograma</option>
                    <option value="evolutivo">Evolutivo</option>
                    <option value="plantilla">Plantilla</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingRecord.descripcion}
                  onChange={(e) => setEditingRecord({...editingRecord, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hallazgos (uno por línea)
                  </label>
                  <textarea
                    value={editingRecord.hallazgos.join('\n')}
                    onChange={(e) => setEditingRecord({...editingRecord, hallazgos: e.target.value.split('\n').filter(h => h.trim())})}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tratamientos (uno por línea)
                  </label>
                  <textarea
                    value={editingRecord.tratamientos.join('\n')}
                    onChange={(e) => setEditingRecord({...editingRecord, tratamientos: e.target.value.split('\n').filter(t => t.trim())})}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Próxima Cita
                </label>
                <input
                  type="date"
                  value={editingRecord.proximaCita || ''}
                  onChange={(e) => setEditingRecord({...editingRecord, proximaCita: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveRecord}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriaClinicaDental;