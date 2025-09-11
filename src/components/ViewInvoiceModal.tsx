import React from 'react';
import { X, User, Phone, Mail, MapPin } from 'lucide-react';

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

interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Factura | null;
}

const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Detalles de la Factura</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información de la Factura</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número:</span>
                  <span className="font-semibold">#{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de emisión:</span>
                  <span className="font-semibold">{new Date(invoice.date).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de vencimiento:</span>
                  <span className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === 'Pagada' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="font-semibold">{invoice.paymentMethod}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información del Paciente</h3>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {invoice.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{invoice.patient}</h4>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <User className="h-4 w-4 mr-1" />
                    Paciente regular
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+34 600 123 456</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{invoice.patient.toLowerCase().replace(' ', '.')}@email.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Madrid, España</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Tratamiento</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{invoice.treatment}</h4>
                  <p className="text-gray-600 mt-1">Tratamiento dental completo</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">€{invoice.amount}</p>
                  <p className="text-gray-500 text-sm">Importe total</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-600 text-white rounded-xl hover:from-blue-600 hover:to-green-700 transition-all duration-200">
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;