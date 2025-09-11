import React, { useState, useContext, useEffect } from 'react';
import { X, Package, MapPin, DollarSign, Calendar, User } from 'lucide-react';
import { DarkModeContext } from '../contexts/DarkModeContext';

interface ProductoInventario {
  id: string;
  nombre: string;
  categoria: string;
  codigo: string;
  unidadMedida: string;
  stockMinimo: number;
  stockActual: number;
  stockMaximo: number;
  ubicacion: string;
  proveedor: string;
  precioUnitario: number;
  ultimaCompra: string;
  estado: 'normal' | 'bajo' | 'critico' | 'agotado';
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductoInventario) => void;
  product: ProductoInventario | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  
  const [formData, setFormData] = useState<ProductoInventario>({
    id: '',
    nombre: '',
    categoria: '',
    codigo: '',
    unidadMedida: '',
    stockMinimo: 0,
    stockActual: 0,
    stockMaximo: 0,
    ubicacion: '',
    proveedor: '',
    precioUnitario: 0,
    ultimaCompra: '',
    estado: 'normal'
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('stock') || name === 'precioUnitario' ? Number(value) : value
    }));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900/75' : 'bg-gray-500/75'}`}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className={`inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
        }`}>
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                }`}>
                  <Package className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Editar Producto
                </h3>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Ej: Amalgama Dental"
                    required
                  />
                </div>

                {/* Código */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Código
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Ej: MAT001"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Materiales de Obturación">Materiales de Obturación</option>
                    <option value="Anestésicos">Anestésicos</option>
                    <option value="Protección Personal">Protección Personal</option>
                    <option value="Instrumentos">Instrumentos</option>
                    <option value="Medicamentos">Medicamentos</option>
                  </select>
                </div>

                {/* Unidad de Medida */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Unidad de Medida
                  </label>
                  <select
                    name="unidadMedida"
                    value={formData.unidadMedida}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Seleccionar unidad</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Cápsulas">Cápsulas</option>
                    <option value="Carpules">Carpules</option>
                    <option value="Jeringas">Jeringas</option>
                    <option value="Cajas">Cajas</option>
                    <option value="Tubos">Tubos</option>
                    <option value="Frascos">Frascos</option>
                  </select>
                </div>

                {/* Stock Actual */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    name="stockActual"
                    value={formData.stockActual}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    min="0"
                    required
                  />
                </div>

                {/* Stock Mínimo */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={formData.stockMinimo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    min="0"
                    required
                  />
                </div>

                {/* Stock Máximo */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    name="stockMaximo"
                    value={formData.stockMaximo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    min="0"
                    required
                  />
                </div>

                {/* Precio Unitario */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Precio Unitario (€)
                  </label>
                  <input
                    type="number"
                    name="precioUnitario"
                    value={formData.precioUnitario}
                    onChange={handleChange}
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    min="0"
                    required
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Ubicación
                  </label>
                  <select
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Seleccionar ubicación</option>
                    <option value="Sede Central - Almacén A">Sede Central - Almacén A</option>
                    <option value="Sede Central - Almacén General">Sede Central - Almacén General</option>
                    <option value="Sede Norte - Consulta 1">Sede Norte - Consulta 1</option>
                    <option value="Sede Norte - Consulta 2">Sede Norte - Consulta 2</option>
                    <option value="Sede Sur - Almacén B">Sede Sur - Almacén B</option>
                    <option value="Sede Sur - Consulta 1">Sede Sur - Consulta 1</option>
                  </select>
                </div>

                {/* Proveedor */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Proveedor
                  </label>
                  <input
                    type="text"
                    name="proveedor"
                    value={formData.proveedor}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Ej: DentalSupply"
                    required
                  />
                </div>

                {/* Última Compra */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Última Compra
                  </label>
                  <input
                    type="date"
                    name="ultimaCompra"
                    value={formData.ultimaCompra}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
                  }`}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;