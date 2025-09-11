import React, { useState } from 'react';
import { X, CreditCard, DollarSign, User, Calendar, FileText, Calculator, AlertCircle, Link } from 'lucide-react';

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: any) => void;
}

const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    pacienteId: '',
    pacienteNombre: '',
    concepto: '',
    importe: 0,
    metodoPago: 'tarjeta',
    estado: 'completado',
    fechaPago: new Date().toISOString().split('T')[0],
    horaPago: new Date().toTimeString().slice(0, 5),
    pasarelaPago: '',
    referenciaExterna: '',
    numeroTransaccion: '',
    comision: 0,
    desglose: {
      tratamiento: '',
      descuento: 0,
      impuestos: 0,
      importeBase: 0,
    },
    planPago: {
      esCuota: false,
      numeroCuota: 1,
      totalCuotas: 1,
      siguienteCuota: '',
    },
    observaciones: '',
    adjuntos: [] as Array<{
      nombre: string;
      tipo: string;
      url: string;
    }>,
  });

  const pacientes = [
    'María García López',
    'Carlos López Martín', 
    'Ana Martín Ruiz',
    'José Ruiz Fernández',
    'Laura Fernández Santos',
    'Miguel Santos Díaz',
    'Carmen Díaz Pérez',
    'Pedro Jiménez Torres',
    'Sofia Morales García',
    'Roberto Vega López'
  ];

  const conceptos = [
    'Consulta Inicial',
    'Limpieza Dental',
    'Endodoncia',
    'Implante Dental',
    'Corona de Porcelana',
    'Ortodoncia - Cuota Mensual',
    'Blanqueamiento Dental',
    'Extracción',
    'Cirugía Oral',
    'Tratamiento Periodontal',
    'Prótesis Dental',
    'Radiografía',
    'Urgencia Dental',
    'Revisión'
  ];

  const pasarelasPago = [
    { value: '', label: 'Sin pasarela (efectivo/transferencia)' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'redsys', label: 'RedSys' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bizum', label: 'Bizum' },
    { value: 'sabadell', label: 'Banco Sabadell' },
    { value: 'caixabank', label: 'CaixaBank' },
    { value: 'santander', label: 'Banco Santander' }
  ];

  const calculateTotals = () => {
    const importeBase = formData.desglose.importeBase || formData.importe;
    const descuento = formData.desglose.descuento || 0;
    const impuestos = formData.desglose.impuestos || 0;
    const subtotal = importeBase - descuento;
    const total = subtotal + impuestos;
    
    return {
      importeBase,
      descuento,
      impuestos,
      subtotal,
      total
    };
  };

  const calculateCommission = (amount: number, gateway: string) => {
    const rates: { [key: string]: number } = {
      'stripe': 0.029,
      'redsys': 0.025,
      'paypal': 0.034,
      'bizum': 0.015,
      'sabadell': 0.022,
      'caixabank': 0.020,
      'santander': 0.024
    };
    
    return gateway && rates[gateway] ? amount * rates[gateway] : 0;
  };

  const totals = calculateTotals();
  const commission = calculateCommission(totals.total, formData.pasarelaPago);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData = {
      ...formData,
      numeroTransaccion: formData.numeroTransaccion || `TXN-${Date.now()}`,
      fechaPago: `${formData.fechaPago}T${formData.horaPago}:00`,
      comision: commission,
      importeNeto: totals.total - commission,
      desglose: {
        ...formData.desglose,
        importeBase: totals.importeBase,
        total: totals.total,
      },
      fechaCreacion: new Date().toISOString(),
    };

    onSubmit(paymentData);
    
    // Reset form
    setFormData({
      pacienteId: '',
      pacienteNombre: '',
      concepto: '',
      importe: 0,
      metodoPago: 'tarjeta',
      estado: 'completado',
      fechaPago: new Date().toISOString().split('T')[0],
      horaPago: new Date().toTimeString().slice(0, 5),
      pasarelaPago: '',
      referenciaExterna: '',
      numeroTransaccion: '',
      comision: 0,
      desglose: {
        tratamiento: '',
        descuento: 0,
        impuestos: 0,
        importeBase: 0,
      },
      planPago: {
        esCuota: false,
        numeroCuota: 1,
        totalCuotas: 1,
        siguienteCuota: '',
      },
      observaciones: '',
      adjuntos: [],
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
            Registrar Pago
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Paciente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente *
                </label>
                <select
                  required
                  value={formData.pacienteNombre}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    pacienteNombre: e.target.value,
                    pacienteId: `P${String(pacientes.indexOf(e.target.value) + 1).padStart(3, '0')}`
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente} value={paciente}>{paciente}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto del Pago *
                </label>
                <select
                  required
                  value={formData.concepto}
                  onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar concepto</option>
                  {conceptos.map(concepto => (
                    <option key={concepto} value={concepto}>{concepto}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detalles del Pago */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Detalles del Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importe Total *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.importe}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    importe: parseFloat(e.target.value) || 0,
                    desglose: { ...prev.desglose, importeBase: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  required
                  value={formData.metodoPago}
                  onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="link_pago">Link de Pago</option>
                  <option value="financiacion">Financiación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Pago *
                </label>
                <select
                  required
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="completado">Completado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="procesando">Procesando</option>
                  <option value="fallido">Fallido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha del Pago *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaPago}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaPago: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora del Pago
                </label>
                <input
                  type="time"
                  value={formData.horaPago}
                  onChange={(e) => setFormData(prev => ({ ...prev, horaPago: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Transacción
                </label>
                <input
                  type="text"
                  value={formData.numeroTransaccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroTransaccion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Se generará automáticamente"
                />
              </div>
            </div>
          </div>

          {/* Pasarela de Pago */}
          {(formData.metodoPago === 'tarjeta' || formData.metodoPago === 'link_pago') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Link className="w-5 h-5 mr-2 text-blue-600" />
                Pasarela de Pago
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pasarela Utilizada
                  </label>
                  <select
                    value={formData.pasarelaPago}
                    onChange={(e) => setFormData(prev => ({ ...prev, pasarelaPago: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pasarelasPago.map(pasarela => (
                      <option key={pasarela.value} value={pasarela.value}>{pasarela.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia Externa
                  </label>
                  <input
                    type="text"
                    value={formData.referenciaExterna}
                    onChange={(e) => setFormData(prev => ({ ...prev, referenciaExterna: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ID de transacción de la pasarela"
                  />
                </div>
              </div>
              {formData.pasarelaPago && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="text-sm font-medium text-blue-900">Comisión Estimada</div>
                  <div className="text-lg font-bold text-blue-600">€{commission.toFixed(2)}</div>
                  <div className="text-xs text-blue-700">Importe neto: €{(totals.total - commission).toFixed(2)}</div>
                </div>
              )}
            </div>
          )}

          {/* Desglose Financiero */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Desglose Financiero
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento Aplicado
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.desglose.descuento}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    desglose: { ...prev.desglose, descuento: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impuestos (IVA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.desglose.impuestos}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    desglose: { ...prev.desglose, impuestos: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="p-3 bg-green-50 rounded-md">
                  <div className="text-sm font-medium text-green-900">Total Final</div>
                  <div className="text-xl font-bold text-green-600">€{totals.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan de Pago */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Plan de Pago
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.planPago.esCuota}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    planPago: { ...prev.planPago, esCuota: e.target.checked }
                  }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Este pago forma parte de un plan de cuotas</span>
              </label>
              
              {formData.planPago.esCuota && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuota Número
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.planPago.numeroCuota}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        planPago: { ...prev.planPago, numeroCuota: parseInt(e.target.value) || 1 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total de Cuotas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.planPago.totalCuotas}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        planPago: { ...prev.planPago, totalCuotas: parseInt(e.target.value) || 1 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Próxima Cuota
                    </label>
                    <input
                      type="date"
                      value={formData.planPago.siguienteCuota}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        planPago: { ...prev.planPago, siguienteCuota: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Observaciones
            </h3>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notas adicionales sobre el pago, condiciones especiales, etc."
            />
          </div>

          {/* Resumen */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Resumen del Pago
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Importe Base:</span>
                <div className="text-lg font-semibold">€{totals.importeBase.toFixed(2)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Descuento:</span>
                <div className="text-lg font-semibold text-red-600">-€{totals.descuento.toFixed(2)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Impuestos:</span>
                <div className="text-lg font-semibold">€{totals.impuestos.toFixed(2)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total:</span>
                <div className="text-xl font-bold text-green-600">€{totals.total.toFixed(2)}</div>
              </div>
            </div>
            {commission > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Comisión ({formData.pasarelaPago}):</span>
                  <span className="text-red-600">-€{commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-medium text-gray-700">Importe Neto:</span>
                  <span className="font-bold text-blue-600">€{(totals.total - commission).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Registrar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPaymentModal;