import React from 'react';
import { Euro } from 'lucide-react';

const RecibosSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recibos Emitidos</h3>
      <div className="text-center py-12 text-gray-500">
        <Euro className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p>Módulo de recibos en desarrollo</p>
        <p className="text-sm mt-2">Aquí se mostrarán los recibos generados</p>
      </div>
    </div>
  );
};

export default RecibosSection;