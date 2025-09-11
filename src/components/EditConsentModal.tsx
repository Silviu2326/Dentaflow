import React, { useState, useEffect } from 'react';
import { X, FileText, Tag, Hash, Shield, Layers } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface ConsentForm {
  id: string;
  nombre: string;
  categoria: string;
  version: string;
  fechaCreacion: string;
  contenido: string;
  activo: boolean;
  obligatorio: boolean;
}

interface EditConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  consent: ConsentForm | null;
}

const EditConsentModal: React.FC<EditConsentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  consent 
}) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    version: '',
    contenido: '',
    activo: true,
    obligatorio: false
  });

  const categorias = ['General', 'Cirugía', 'Ortodoncia', 'Implantología', 'Endodoncia', 'Periodoncia'];

  useEffect(() => {
    if (consent) {
      setFormData({
        nombre: consent.nombre,
        categoria: consent.categoria,
        version: consent.version,
        contenido: consent.contenido,
        activo: consent.activo,
        obligatorio: consent.obligatorio
      });
    }
  }, [consent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedConsent = {
      id: consent?.id,
      ...formData,
      fechaCreacion: consent?.fechaCreacion || new Date().toISOString().split('T')[0]
    };

    onSubmit(updatedConsent);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  if (!isOpen || !consent) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-4xl rounded-3xl shadow-2xl transition-all duration-300 transform scale-100 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700/50' 
            : 'bg-white border border-gray-200/50'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Editar Consentimiento
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Modifica los detalles del consentimiento informado
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
            {/* Consent Name */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Nombre del Consentimiento</span>
                </div>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-indigo-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500'
                }`}
                placeholder="Ej: Consentimiento Odontología General"
              />
            </div>

            {/* Category and Version */}
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
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-indigo-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500'
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
                    <Hash className="h-4 w-4" />
                    <span>Versión</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-indigo-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500'
                  }`}
                  placeholder="Ej: 2.1"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="h-4 w-4" />
                  <span>Contenido del Consentimiento</span>
                </div>
              </label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                required
                rows={12}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-indigo-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500'
                }`}
                placeholder="Escriba aquí el contenido completo del consentimiento informado..."
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-green-50/50 border-green-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Plantilla Activa
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Disponible para usar en nuevos consentimientos
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-yellow-50/50 border-yellow-200/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="obligatorio"
                    checked={formData.obligatorio}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Consentimiento Obligatorio
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Requerido antes de iniciar tratamientos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
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

export default EditConsentModal;