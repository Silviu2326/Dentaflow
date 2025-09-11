import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown, Calendar, User, FileText, CreditCard, Save } from 'lucide-react';

interface NewCashMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movementData: any) => void;
}

const NewCashMovementModal: React.FC<NewCashMovementModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    tipo: 'ingreso' as 'ingreso' | 'gasto',
    fecha: new Date().toISOString().slice(0, 16),
    concepto: '',
    categoria: '',
    importe: 0,
    metodoPago: '',
    paciente: '',
    descripcion: '',
    numeroRecibo: '',
    numeroFactura: '',
    observaciones: ''
  });

  const conceptosIngreso = [
    'Pago consulta',
    'Pago tratamiento',
    'Pago implante',
    'Pago ortodoncia',
    'Pago emergencia',
    'Anticipo tratamiento',
    'Venta producto',
    'Otros ingresos'
  ];

  const conceptosGasto = [
    'Compra materiales',
    'Gastos generales',
    'Mantenimiento',
    'Servicios profesionales',
    'Alquiler',
    'Suministros oficina',
    'Marketing',
    'Formación',
    'Seguros',
    'Otros gastos'
  ];

  const categoriasIngreso = [
    'Servicios dentales',
    'Productos',
    'Consultas',
    'Urgencias',
    'Otros ingresos'
  ];

  const categoriasGasto = [
    'Suministros dentales',
    'Administración',
    'Mantenimiento',
    'Marketing',
    'Formación',
    'Servicios externos',
    'Otros gastos'
  ];

  const metodosPago = [
    'Efectivo',
    'Tarjeta',
    'Transferencia',
    'Cheque',
    'Bizum',
    'Domiciliación'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importe' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTipoChange = (tipo: 'ingreso' | 'gasto') => {
    setFormData(prev => ({
      ...prev,
      tipo,
      concepto: '',
      categoria: ''
    }));
  };

  const generateReceiptNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `R-${year}-${random}`;
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `F-${year}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString()
    });
    
    // Reset form
    setFormData({
      tipo: 'ingreso',
      fecha: new Date().toISOString().slice(0, 16),
      concepto: '',
      categoria: '',
      importe: 0,
      metodoPago: '',
      paciente: '',
      descripcion: '',
      numeroRecibo: '',
      numeroFactura: '',
      observaciones: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  const conceptos = formData.tipo === 'ingreso' ? conceptosIngreso : conceptosGasto;
  const categorias = formData.tipo === 'ingreso' ? categoriasIngreso : categoriasGasto;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Nuevo Movimiento de Caja
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Movimiento */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Tipo de Movimiento</h4>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleTipoChange('ingreso')}
                className={`flex items-center px-4 py-3 rounded-lg border-2 transition-colors ${
                  formData.tipo === 'ingreso'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Ingreso</div>
                  <div className="text-sm text-gray-500">Entrada de dinero</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleTipoChange('gasto')}
                className={`flex items-center px-4 py-3 rounded-lg border-2 transition-colors ${
                  formData.tipo === 'gasto'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TrendingDown className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Gasto</div>
                  <div className="text-sm text-gray-500">Salida de dinero</div>
                </div>
              </button>
            </div>
          </div>

          {/* Información Básica */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Información Básica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  name="fecha"
                  required
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concepto *
                </label>
                <select
                  name="concepto"
                  required
                  value={formData.concepto}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar concepto</option>
                  {conceptos.map((concepto) => (
                    <option key={concepto} value={concepto}>
                      {concepto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  required
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Importe *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    name="importe"
                    required
                    value={formData.importe}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CreditCard className="h-4 w-4 inline mr-1" />
                  Método de Pago *
                </label>
                <select
                  name="metodoPago"
                  required
                  value={formData.metodoPago}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar método</option>
                  {metodosPago.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo}
                    </option>
                  ))}
                </select>
              </div>

              {formData.tipo === 'ingreso' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    Paciente
                  </label>
                  <input
                    type="text"
                    name="paciente"
                    value={formData.paciente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del paciente (opcional)"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Documentación */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documentación
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.tipo === 'ingreso' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Recibo
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="numeroRecibo"
                        value={formData.numeroRecibo}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="R-2024-001"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, numeroRecibo: generateReceiptNumber() }))}
                        className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-sm"
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Factura
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="numeroFactura"
                        value={formData.numeroFactura}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="F-2024-001"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, numeroFactura: generateInvoiceNumber() }))}
                        className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-sm"
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Detalles Adicionales</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción Detallada *
                </label>
                <textarea
                  name="descripcion"
                  required
                  rows={3}
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={formData.tipo === 'ingreso' ? 
                    "Ej: Pago por limpieza dental y fluorización" : 
                    "Ej: Compra de materiales de composite y adhesivos"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  rows={2}
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas adicionales, referencias, etc..."
                />
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-2">Resumen del Movimiento</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className={`ml-2 font-medium ${
                  formData.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Importe:</span>
                <span className={`ml-2 font-bold text-lg ${
                  formData.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.tipo === 'ingreso' ? '+' : '-'}€{formData.importe.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                formData.tipo === 'ingreso'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              Registrar {formData.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCashMovementModal;