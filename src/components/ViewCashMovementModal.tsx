import React from 'react';
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

interface ViewCashMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: Movimiento | null;
}

const ViewCashMovementModal: React.FC<ViewCashMovementModalProps> = ({ 
  isOpen, 
  onClose, 
  movement 
}) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !movement) return null;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDateTime(movement.fecha);

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
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                movement.tipo === 'ingreso' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              }`}>
                {movement.tipo === 'ingreso' ? (
                  <TrendingUp className="h-6 w-6 text-white" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Detalle del Movimiento
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {movement.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} - {movement.concepto}
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Amount and Type */}
            <div className={`p-6 rounded-2xl border backdrop-blur-sm ${
              movement.tipo === 'ingreso'
                ? (isDarkMode 
                    ? 'bg-green-900/20 border-green-700/30' 
                    : 'bg-green-50/80 border-green-200/50')
                : (isDarkMode 
                    ? 'bg-red-900/20 border-red-700/30' 
                    : 'bg-red-50/80 border-red-200/50')
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className={`h-8 w-8 ${
                    movement.tipo === 'ingreso' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {movement.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                    </p>
                    <p className={`text-3xl font-bold ${
                      movement.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.tipo === 'ingreso' ? '+' : '-'}€{movement.importe.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border font-semibold ${
                  movement.tipo === 'ingreso'
                    ? (isDarkMode 
                        ? 'bg-green-900/50 text-green-200 border-green-700/50' 
                        : 'bg-green-100 text-green-800 border-green-200')
                    : (isDarkMode 
                        ? 'bg-red-900/50 text-red-200 border-red-700/50' 
                        : 'bg-red-100 text-red-800 border-red-200')
                }`}>
                  {movement.categoria}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date and Time */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-gray-50/50 border-gray-200/50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className={`h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Fecha y Hora
                  </p>
                </div>
                <div>
                  <p className={`text-lg font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {date}
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {time}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/50' 
                  : 'bg-gray-50/50 border-gray-200/50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className={`h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Método de Pago
                  </p>
                </div>
                <p className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {movement.metodoPago}
                </p>
              </div>

              {/* Patient (if applicable) */}
              {movement.paciente && (
                <div className={`p-4 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700/30 border-gray-600/50' 
                    : 'bg-gray-50/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <User className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Paciente
                    </p>
                  </div>
                  <p className={`text-lg font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {movement.paciente}
                  </p>
                </div>
              )}

              {/* Receipt Number (if applicable) */}
              {movement.numeroRecibo && (
                <div className={`p-4 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700/30 border-gray-600/50' 
                    : 'bg-gray-50/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <Receipt className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <p className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Número de Recibo
                    </p>
                  </div>
                  <p className={`text-lg font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {movement.numeroRecibo}
                  </p>
                </div>
              )}
            </div>

            {/* Concept and Description */}
            <div className={`p-4 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-700/30 border-gray-600/50' 
                : 'bg-gray-50/50 border-gray-200/50'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <FileText className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Concepto y Descripción
                </p>
              </div>
              <div>
                <p className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {movement.concepto}
                </p>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {movement.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end p-6 border-t ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCashMovementModal;