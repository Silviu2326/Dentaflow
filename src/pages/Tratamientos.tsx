import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Clock, DollarSign, Package } from 'lucide-react';

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catálogo de Tratamientos</h1>
            <p className="text-gray-600">Gestiona tratamientos, tarifas, duraciones y materiales</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tratamiento
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar tratamientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tratamientos</p>
              <p className="text-2xl font-bold text-gray-900">{tratamientos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                €{Math.round(tratamientos.reduce((acc, t) => acc + t.precio, 0) / tratamientos.length)}
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
              <p className="text-sm font-medium text-gray-600">Duración Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(tratamientos.reduce((acc, t) => acc + t.duracion, 0) / tratamientos.length)} min
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{categorias.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tratamiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materiales
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTratamientos.map((tratamiento) => (
                <tr key={tratamiento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tratamiento.nombre}</div>
                      <div className="text-sm text-gray-500">{tratamiento.descripcion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {tratamiento.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{tratamiento.precio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tratamiento.duracion} min
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tratamiento.materiales.slice(0, 2).map((material, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700"
                        >
                          {material}
                        </span>
                      ))}
                      {tratamiento.materiales.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                          +{tratamiento.materiales.length - 2} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tratamientos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron tratamientos que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tratamientos;