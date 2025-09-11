import React from 'react';
import { X, FileText, Calendar, Shield, User, CheckCircle, Clock, Send, AlertTriangle, Tag, Hash } from 'lucide-react';
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

interface ConsentRecord {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  formularioId: string;
  formularioNombre: string;
  fechaEnvio?: string;
  fechaFirma?: string;
  estado: 'pendiente' | 'enviado' | 'firmado' | 'rechazado';
  ip?: string;
  evidencia?: string;
  version: string;
}

interface ViewConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  consent: ConsentForm | ConsentRecord | null;
  type: 'template' | 'record';
}

const ViewConsentModal: React.FC<ViewConsentModalProps> = ({ isOpen, onClose, consent, type }) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !consent) return null;

  const getEstadoColor = (estado: string) => {
    if (isDarkMode) {
      switch (estado) {
        case 'firmado': return 'bg-green-900/80 text-green-200 border border-green-700/50';
        case 'enviado': return 'bg-blue-900/80 text-blue-200 border border-blue-700/50';
        case 'pendiente': return 'bg-yellow-900/80 text-yellow-200 border border-yellow-700/50';
        case 'rechazado': return 'bg-red-900/80 text-red-200 border border-red-700/50';
        default: return 'bg-gray-700/80 text-gray-200 border border-gray-600/50';
      }
    } else {
      switch (estado) {
        case 'firmado': return 'bg-green-100 text-green-800 border border-green-200';
        case 'enviado': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'pendiente': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'rechazado': return 'bg-red-100 text-red-800 border border-red-200';
        default: return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'firmado': return <CheckCircle className="h-4 w-4" />;
      case 'enviado': return <Send className="h-4 w-4" />;
      case 'pendiente': return <Clock className="h-4 w-4" />;
      case 'rechazado': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isTemplate = type === 'template';
  const template = isTemplate ? consent as ConsentForm : null;
  const record = !isTemplate ? consent as ConsentRecord : null;

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
                  {isTemplate ? 'Detalles de Plantilla' : 'Registro de Consentimiento'}
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isTemplate ? template?.nombre : record?.formularioNombre}
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
            {isTemplate ? (
              <>
                {/* Template Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-indigo-50/50 border-indigo-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Categoría
                        </p>
                        <p className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {template?.categoria}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-purple-50/50 border-purple-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <Hash className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Versión
                        </p>
                        <p className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          v{template?.version}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-green-50/50 border-green-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Fecha de Creación
                        </p>
                        <p className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {template && new Date(template.fechaCreacion).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-orange-50/50 border-orange-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Estado
                        </p>
                        <div className="flex space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${
                            template?.activo 
                              ? (isDarkMode ? 'bg-green-900/80 text-green-200' : 'bg-green-100 text-green-800')
                              : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                          }`}>
                            {template?.activo ? 'Activa' : 'Inactiva'}
                          </span>
                          {template?.obligatorio && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${
                              isDarkMode ? 'bg-yellow-900/80 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              Obligatoria
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Content */}
                <div className={`p-6 rounded-2xl border ${
                  isDarkMode 
                    ? 'bg-gray-700/30 border-gray-600/50' 
                    : 'bg-gray-50/50 border-gray-200/50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Contenido del Consentimiento
                  </h3>
                  <div className={`p-4 rounded-xl border max-h-96 overflow-y-auto ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-600/50 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {template?.contenido}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Record Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-blue-50/50 border-blue-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Paciente
                        </p>
                        <p className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {record?.pacienteNombre}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-purple-50/50 border-purple-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <Hash className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Versión
                        </p>
                        <p className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          v{record?.version}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-green-50/50 border-green-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Fechas
                        </p>
                        <div className="text-sm">
                          <p className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Envío: {record?.fechaEnvio ? new Date(record.fechaEnvio).toLocaleDateString('es-ES') : '-'}
                          </p>
                          <p className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Firma: {record?.fechaFirma ? new Date(record.fechaFirma).toLocaleDateString('es-ES') : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-orange-50/50 border-orange-200/50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                        {record && getEstadoIcon(record.estado)}
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Estado
                        </p>
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-xl ${
                          record && getEstadoColor(record.estado)
                        }`}>
                          <span className="capitalize">{record?.estado}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence */}
                {record?.evidencia && (
                  <div className={`p-6 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/50' 
                      : 'bg-gray-50/50 border-gray-200/50'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Evidencia Digital
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Dirección IP
                        </p>
                        <p className={`font-mono text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {record.ip}
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Hash de Evidencia
                        </p>
                        <p className={`font-mono text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {record.evidencia}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end space-x-3 p-6 border-t ${
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

export default ViewConsentModal;