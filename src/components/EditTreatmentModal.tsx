import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Clock, FileText, Tag, Layers } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

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

interface EditTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  treatment: Tratamiento | null;
}

const EditTreatmentModal: React.FC<EditTreatmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  treatment 
}) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    duracion: '',
    materiales: '',
    descripcion: ''
  });

  const categorias = ['Preventiva', 'Operatoria', 'Prótesis', 'Cirugía', 'Ortodoncia', 'Endodoncia'];

  useEffect(() => {
    if (treatment) {
      setFormData({
        nombre: treatment.nombre,
        categoria: treatment.categoria,
        precio: treatment.precio.toString(),
        duracion: treatment.duracion.toString(),
        materiales: treatment.materiales.join(', '),
        descripcion: treatment.descripcion
      });
    }
  }, [treatment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTreatment = {
      id: treatment?.id,
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      duracion: parseInt(formData.duracion),
      materiales: formData.materiales.split(',').map(m => m.trim()).filter(m => m),
      descripcion: formData.descripcion,
      activo: true
    };

    onSubmit(updatedTreatment);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen || !treatment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl transition-all duration-300 transform scale-100 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700/50' 
            : 'bg-white border border-gray-200/50'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Editar Tratamiento
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Modifica los detalles del tratamiento
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Treatment Name */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Nombre del Tratamiento</span>
                </div>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-purple-500'
                }`}
                placeholder="Ej: Limpieza dental profesional"
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="h-4 w-4" />
                    <span>Categoría</span>
                  </div>
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-purple-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Precio (€)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-purple-500'
                  }`}
                  placeholder="50.00"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Duración (minutos)</span>
                </div>
              </label>
              <input
                type="number"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                required
                min="1"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-purple-500'
                }`}
                placeholder="30"
              />
            </div>

            {/* Materials */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="h-4 w-4" />
                  <span>Materiales (separados por comas)</span>
                </div>
              </label>
              <input
                type="text"
                name="materiales"
                value={formData.materiales}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-purple-500'
                }`}
                placeholder="Ultrasonido, Pasta profiláctica, Flúor"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Descripción</span>
                </div>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 resize-none ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-purple-500'
                }`}
                placeholder="Descripción detallada del tratamiento..."
              />
            </div>

            {/* Buttons */}
            <div className={`flex items-center justify-end space-x-3 pt-6 border-t ${
              isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTreatmentModal;