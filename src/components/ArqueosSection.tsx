import React from 'react';
import { FileText } from 'lucide-react';

const ArqueosSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cierres y Arqueos</h3>
      <div className="text-center py-12 text-gray-500">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p>Funcionalidad de arqueos en desarrollo</p>
        <p className="text-sm mt-2">Aquí se mostrarán los cierres de caja históricos</p>
      </div>
    </div>
  );
};

export default ArqueosSection;