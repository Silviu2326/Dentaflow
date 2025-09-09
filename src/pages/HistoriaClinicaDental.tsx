import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Calendar, FileText, Circle, Activity } from 'lucide-react';

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
      case 'sano': return 'text-green-600 bg-green-100';
      case 'caries': return 'text-red-600 bg-red-100';
      case 'obturado': return 'text-blue-600 bg-blue-100';
      case 'corona': return 'text-yellow-600 bg-yellow-100';
      case 'ausente': return 'text-gray-400 bg-gray-100';
      case 'implante': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historia Clínica Dental</h1>
            <p className="text-gray-600">Odontogramas, periodontogramas y evoluciones por paciente</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowOdontograma(!showOdontograma)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Circle className="h-4 w-4 mr-2" />
              {showOdontograma ? 'Ocultar' : 'Ver'} Odontograma
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por paciente o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Circle className="h-5 w-5 mr-2" />
            Odontograma Interactivo
          </h3>
          
          {/* Superior teeth */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Arcada Superior</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {odontograma.filter(tooth => tooth.number >= 11 && tooth.number <= 28).map(tooth => (
                <div
                  key={tooth.number}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow ${getToothColor(tooth.status)}`}
                  title={`Diente ${tooth.number} - ${tooth.status}`}
                >
                  <span className="text-xs font-bold">{tooth.number}</span>
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
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow ${getToothColor(tooth.status)}`}
                    title={`Diente ${number} - ${tooth.status}`}
                  >
                    <span className="text-xs font-bold">{number}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300 mr-2"></div>
              <span>Sano</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300 mr-2"></div>
              <span>Caries</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300 mr-2"></div>
              <span>Obturado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300 mr-2"></div>
              <span>Corona</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300 mr-2"></div>
              <span>Ausente</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300 mr-2"></div>
              <span>Implante</span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Circle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Odontogramas</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.tipo === 'odontograma').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Periodontogramas</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.tipo === 'periodontograma').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Evolutivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.tipo === 'evolutivo').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hallazgos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Cita
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.pacienteNombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.tipo === 'odontograma' ? 'bg-green-100 text-green-800' :
                      record.tipo === 'periodontograma' ? 'bg-red-100 text-red-800' :
                      record.tipo === 'evolutivo' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{record.titulo}</div>
                    <div className="text-sm text-gray-500">{record.descripcion}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {record.hallazgos.slice(0, 2).map((hallazgo, index) => (
                        <div key={index} className="mb-1">• {hallazgo}</div>
                      ))}
                      {record.hallazgos.length > 2 && (
                        <div className="text-xs text-gray-500">+{record.hallazgos.length - 2} más</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.proximaCita ? new Date(record.proximaCita).toLocaleDateString('es-ES') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
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
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron registros clínicos que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoriaClinicaDental;