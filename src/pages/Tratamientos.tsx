import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Clock, DollarSign, Package, Star, Zap, Target } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import NewTreatmentModal from '../components/NewTreatmentModal';
import EditTreatmentModal from '../components/EditTreatmentModal';

interface Tratamiento {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  duracion: number;
  materiales: string[];
  descripcion: string;
  activo: boolean;
}

const Tratamientos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [showNewTreatmentModal, setShowNewTreatmentModal] = useState(false);
  const [showEditTreatmentModal, setShowEditTreatmentModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Tratamiento | null>(null);
  const { isDarkMode } = useDarkMode();

  const [tratamientos] = useState<Tratamiento[]>([
    {
      id: '1',
      nombre: 'Limpieza dental',
      categoria: 'Preventiva',
      precio: 50,
      duracion: 30,
      materiales: ['Ultrasonido', 'Pasta profiláctica', 'Flúor'],
      descripcion: 'Limpieza profesional con ultrasonido y pulido',
      activo: true
    },
    {
      id: '2',
      nombre: 'Empaste composite',
      categoria: 'Operatoria',
      precio: 80,
      duracion: 45,
      materiales: ['Composite', 'Ácido grabador', 'Adhesivo'],
      descripcion: 'Restauración con resina compuesta',
      activo: true
    },
    {
      id: '3',
      nombre: 'Corona de porcelana',
      categoria: 'Prótesis',
      precio: 450,
      duracion: 60,
      materiales: ['Corona de porcelana', 'Cemento', 'Provisional'],
      descripcion: 'Corona de porcelana sobre metal',
      activo: true
    },
    {
      id: '4',
      nombre: 'Extracción simple',
      categoria: 'Cirugía',
      precio: 60,
      duracion: 20,
      materiales: ['Anestesia', 'Fórceps', 'Gasas'],
      descripcion: 'Extracción dental simple',
      activo: true
    }
  ]);

  const categorias = ['todos', 'Preventiva', 'Operatoria', 'Prótesis', 'Cirugía', 'Ortodoncia', 'Endodoncia'];

  const filteredTratamientos = tratamientos.filter(tratamiento => {
    const matchesSearch = tratamiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tratamiento.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || tratamiento.categoria === selectedCategory;
    return matchesSearch && matchesCategory && tratamiento.activo;
  });

  const handleCreateTreatment = (treatmentData: any) => {
    console.log('Creating treatment:', treatmentData);
  };

  const handleEditTreatment = (treatment: Tratamiento) => {
    setSelectedTreatment(treatment);
    setShowEditTreatmentModal(true);
  };

  const handleUpdateTreatment = (treatmentData: any) => {
    console.log('Updating treatment:', treatmentData);
    setShowEditTreatmentModal(false);
    setSelectedTreatment(null);
  };

  const handleCloseEditModal = () => {
    setShowEditTreatmentModal(false);
    setSelectedTreatment(null);
  };

  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-8 min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10`}>
              Catálogo de Tratamientos
            </h1>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Gestiona tratamientos, tarifas, duraciones y materiales</p>
          </div>
          <button
            onClick={() => setShowNewTreatmentModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tratamiento
          </button>
        </div>

        {/* Filters */}
        <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
            : 'bg-white/80 border-white/50 shadow-gray-200/50'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar tratamientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-3 border rounded-xl w-full focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-purple-500'
              }`}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700/50 text-white focus:border-purple-400' 
                : 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
            }`}
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria === 'todos' ? 'Todas las categorías' : categoria}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-700/50 shadow-purple-900/20' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 shadow-purple-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-900'
              }`}>Total Tratamientos</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-purple-100' : 'text-purple-600'
              }`}>{tratamientos.length}</p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-700/50 shadow-green-900/20' 
            : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 shadow-green-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-green-200' : 'text-green-900'
              }`}>Precio Promedio</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-green-100' : 'text-green-600'
              }`}>
                €{Math.round(tratamientos.reduce((acc, t) => acc + t.precio, 0) / tratamientos.length)}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-amber-700/50 shadow-amber-900/20' 
            : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50 shadow-amber-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-amber-200' : 'text-amber-900'
              }`}>Duración Promedio</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-amber-100' : 'text-amber-600'
              }`}>
                {Math.round(tratamientos.reduce((acc, t) => acc + t.duracion, 0) / tratamientos.length)} min
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-pink-900/40 to-pink-800/40 border-pink-700/50 shadow-pink-900/20' 
            : 'bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200/50 shadow-pink-200/20'
        }`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-pink-200' : 'text-pink-900'
              }`}>Categorías</p>
              <p className={`text-3xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-pink-100' : 'text-pink-600'
              }`}>{categorias.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatments Table */}
      <div className={`rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50 shadow-gray-900/50' 
          : 'bg-white/80 border-white/50 shadow-gray-200/50'
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'
            }`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Tratamiento
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Categoría
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Precio
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Duración
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Materiales
                </th>
                <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/40 divide-gray-700/50' 
                : 'bg-white/40 divide-gray-200/50'
            }`}>
              {filteredTratamientos.map((tratamiento) => (
                <tr key={tratamiento.id} className={`transition-all duration-200 hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'hover:bg-gray-700/30 hover:shadow-lg' 
                    : 'hover:bg-purple-50/30 hover:shadow-lg'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`text-sm font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{tratamiento.nombre}</div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{tratamiento.descripcion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-purple-900/80 text-purple-200 border border-purple-700/50' 
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      {tratamiento.categoria}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-green-300' : 'text-green-600'
                  }`}>
                    €{tratamiento.precio}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {tratamiento.duracion} min
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tratamiento.materiales.slice(0, 2).map((material, index) => (
                        <span
                          key={index}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {material}
                        </span>
                      ))}
                      {tratamiento.materiales.length > 2 && (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          +{tratamiento.materiales.length - 2} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditTreatment(tratamiento)}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                          : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                      }`}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                          : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                      }`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTratamientos.length === 0 && (
        <div className={`text-center py-16 rounded-2xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
            </div>
            <Package className={`mx-auto h-16 w-16 relative z-10 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`mt-4 text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>No hay tratamientos</h3>
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No se encontraron tratamientos que coincidan con los filtros aplicados.
          </p>
        </div>
      )}

      {/* New Treatment Modal */}
      <NewTreatmentModal
        isOpen={showNewTreatmentModal}
        onClose={() => setShowNewTreatmentModal(false)}
        onSubmit={handleCreateTreatment}
      />

      {/* Edit Treatment Modal */}
      <EditTreatmentModal
        isOpen={showEditTreatmentModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateTreatment}
        treatment={selectedTreatment}
      />
    </div>
  );
};

export default Tratamientos;