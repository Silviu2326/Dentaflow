import React, { useState, useEffect } from 'react';
import { X, DollarSign, Clock, User, FileText, CreditCard, Receipt, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface Movimiento {
  id: string;
  fecha: string;
  tipo: 'ingreso' | 'gasto';
  concepto: string;
  categoria: string;
  importe: number;
  metodoPago: string;
  paciente?: string;
  descripcion: string;
  numeroRecibo?: string;
}

interface EditCashMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  movement: Movimiento | null;
}

const EditCashMovementModal: React.FC<EditCashMovementModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  movement 
}) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    tipo: 'ingreso' as 'ingreso' | 'gasto',
    concepto: '',
    categoria: '',
    importe: '',
    metodoPago: '',
    paciente: '',
    descripcion: '',
    numeroRecibo: ''
  });

  const categoriasIngreso = ['Servicios', 'Productos', 'Otros'];
  const categoriasGasto = ['Suministros', 'Administración', 'Mantenimiento', 'Otros'];
  const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Bizum'];

  useEffect(() => {
    if (movement) {
      const movementDate = new Date(movement.fecha);
      setFormData({
        fecha: movementDate.toISOString().split('T')[0],
        hora: movementDate.toTimeString().slice(0, 5),
        tipo: movement.tipo,
        concepto: movement.concepto,
        categoria: movement.categoria,
        importe: movement.importe.toString(),
        metodoPago: movement.metodoPago,
        paciente: movement.paciente || '',
        descripcion: movement.descripcion,
        numeroRecibo: movement.numeroRecibo || ''
      });
    }
  }, [movement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}:00`).toISOString();
    
    const updatedMovement = {
      id: movement?.id,
      fecha: fechaCompleta,
      tipo: formData.tipo,
      concepto: formData.concepto,
      categoria: formData.categoria,
      importe: parseFloat(formData.importe),
      metodoPago: formData.metodoPago,
      paciente: formData.paciente || undefined,
      descripcion: formData.descripcion,
      numeroRecibo: formData.numeroRecibo || undefined
    };

    onSubmit(updatedMovement);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (!isOpen || !movement) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-3xl rounded-3xl shadow-2xl transition-all duration-300 transform scale-100 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700/50' 
            : 'bg-white border border-gray-200/50'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                formData.tipo === 'ingreso' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              }`}>
                {formData.tipo === 'ingreso' ? (
                  <TrendingUp className="h-6 w-6 text-white" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Editar Movimiento
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Modifica los detalles del movimiento de caja
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
            {/* Type and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="h-4 w-4" />
                    <span>Tipo</span>
                  </div>
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="gasto">Gasto</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Importe (€)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="importe"
                  value={formData.importe}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }`}
                  placeholder="0.00"
                />
              </div>

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
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {(formData.tipo === 'ingreso' ? categoriasIngreso : categoriasGasto).map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Time and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Fecha</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Hora</span>
                  </div>
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Método de Pago</span>
                  </div>
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                >
                  <option value="">Seleccionar método</option>
                  {metodosPago.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Concept */}
            <div className="space-y-2">
              <label className={`text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Concepto</span>
                </div>
              </label>
              <input
                type="text"
                name="concepto"
                value={formData.concepto}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                }`}
                placeholder="Ej: Pago consulta"
              />
            </div>

            {/* Patient and Receipt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4" />
                    <span>Paciente (opcional)</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="paciente"
                  value={formData.paciente}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }`}
                  placeholder="Nombre del paciente"
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Receipt className="h-4 w-4" />
                    <span>Número de Recibo (opcional)</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="numeroRecibo"
                  value={formData.numeroRecibo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                  }`}
                  placeholder="Ej: R-2024-001"
                />
              </div>
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
                required
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 resize-none ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
                }`}
                placeholder="Descripción detallada del movimiento..."
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
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

export default EditCashMovementModal;