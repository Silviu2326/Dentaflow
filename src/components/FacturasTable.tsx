import React from 'react';
import { Search, Eye, Edit, Download, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface Factura {
  id: string;
  patient: string;
  amount: number;
  status: 'Pagada' | 'Pendiente' | 'Vencida';
  date: string;
  dueDate: string;
  treatment: string;
  paymentMethod: string;
}

interface FacturasTableProps {
  facturas: Factura[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewInvoice: (invoice: Factura) => void;
  onEditInvoice: (invoice: Factura) => void;
}

const FacturasTable: React.FC<FacturasTableProps> = ({
  facturas,
  searchTerm,
  onSearchChange,
  onViewInvoice,
  onEditInvoice
}) => {
  const filteredFacturas = facturas.filter(factura =>
    factura.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.treatment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pagada': 'bg-green-100 text-green-800 border-green-200',
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Vencida': 'bg-red-100 text-red-800 border-red-200'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar facturas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Facturación Total</p>
              <p className="text-3xl font-bold text-white mt-1">€12,450</p>
              <p className="text-green-100 text-xs mt-1">Este mes</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Facturas Pagadas</p>
              <p className="text-3xl font-bold text-white mt-1">15</p>
              <p className="text-blue-100 text-xs mt-1">De 20 totales</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pendiente Cobro</p>
              <p className="text-3xl font-bold text-white mt-1">€3,250</p>
              <p className="text-yellow-100 text-xs mt-1">5 facturas</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Lista de Facturas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Importe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredFacturas.map((factura) => (
                <tr key={factura.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                      #{factura.id}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {factura.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{factura.patient}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg inline-block">
                      €{factura.amount}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(factura.status)}`}>
                      {factura.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                      {new Date(factura.date).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onViewInvoice(factura)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition-colors duration-200 group" 
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => onEditInvoice(factura)}
                        className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-lg transition-colors duration-200 group" 
                        title="Editar factura"
                      >
                        <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200 group" title="Descargar PDF">
                        <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacturasTable;