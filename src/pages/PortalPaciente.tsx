import React, { useState } from 'react';
import { Calendar, FileText, CreditCard, Shield, User } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const PortalPaciente: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'citas' | 'documentos' | 'pagos' | 'facturas' | 'perfil'>('citas');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Portal del Paciente
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <nav className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('citas')}
              className={`px-4 py-2 rounded ${
                activeTab === 'citas' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Citas
            </button>
            <button
              onClick={() => setActiveTab('documentos')}
              className={`px-4 py-2 rounded ${
                activeTab === 'documentos' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Documentos
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-4 py-2 rounded ${
                activeTab === 'pagos' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Pagos
            </button>
          </nav>
          
          <div className="mt-6">
            {activeTab === 'citas' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Mis Citas</h2>
                <p className="text-gray-600">Aquí verás tus citas programadas.</p>
              </div>
            )}
            
            {activeTab === 'documentos' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Mis Documentos</h2>
                <p className="text-gray-600">Aquí verás tus documentos.</p>
              </div>
            )}
            
            {activeTab === 'pagos' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Mis Pagos</h2>
                <p className="text-gray-600">Aquí verás tus pagos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPaciente;