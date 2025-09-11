import React, { useState } from 'react';
import { X, User, Euro, Calendar, FileText, Plus, Trash2, Calculator, Save } from 'lucide-react';

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budgetData: any) => void;
}

interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

const NewBudgetModal: React.FC<NewBudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    professional: '',
    date: new Date().toISOString().split('T')[0],
    validity_days: 30,
    priority: 'medium',
    status: 'pendiente',
    notes: '',
    terms_conditions: 'Este presupuesto es válido por 30 días. Los precios incluyen IVA. Se requiere un 50% de anticipo para iniciar el tratamiento.',
    discount_percentage: 0,
    tax_percentage: 21
  });

  const [items, setItems] = useState<BudgetItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    }
  ]);

  const professionals = [
    'Dr. Rodriguez',
    'Dra. Martinez',
    'Dr. Lopez'
  ];

  const priorities = [
    { value: 'high', label: 'Alta', color: 'text-red-600' },
    { value: 'medium', label: 'Media', color: 'text-yellow-600' },
    { value: 'low', label: 'Baja', color: 'text-green-600' }
  ];

  const commonTreatments = [
    'Limpieza dental',
    'Empaste',
    'Endodoncia',
    'Corona dental',
    'Implante dental',
    'Extracción',
    'Ortodoncia',
    'Blanqueamiento',
    'Prótesis dental',
    'Cirugía periodontal'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'price' || field === 'discount') {
          const quantity = field === 'quantity' ? Number(value) : updatedItem.quantity;
          const price = field === 'price' ? Number(value) : updatedItem.price;
          const discount = field === 'discount' ? Number(value) : updatedItem.discount;
          
          updatedItem.total = (quantity * price) - discount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (formData.discount_percentage / 100);
  };

  const calculateTax = () => {
    const subtotalWithDiscount = calculateSubtotal() - calculateDiscount();
    return subtotalWithDiscount * (formData.tax_percentage / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      items: items,
      amount: calculateTotal(),
      subtotal: calculateSubtotal(),
      discount_amount: calculateDiscount(),
      tax_amount: calculateTax(),
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    
    // Reset form
    setFormData({
      patient_id: '',
      patient_name: '',
      professional: '',
      date: new Date().toISOString().split('T')[0],
      validity_days: 30,
      priority: 'medium',
      status: 'pendiente',
      notes: '',
      terms_conditions: 'Este presupuesto es válido por 30 días. Los precios incluyen IVA. Se requiere un 50% de anticipo para iniciar el tratamiento.',
      discount_percentage: 0,
      tax_percentage: 21
    });
    
    setItems([{
      id: '1',
      description: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    }]);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Nuevo Presupuesto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Paciente */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Información del Paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Paciente *
                </label>
                <input
                  type="text"
                  name="patient_name"
                  required
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre completo del paciente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profesional Responsable *
                </label>
                <select
                  name="professional"
                  required
                  value={formData.professional}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar profesional</option>
                  {professionals.map((professional) => (
                    <option key={professional} value={professional}>
                      {professional}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha del Presupuesto
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validez (días)
                </label>
                <input
                  type="number"
                  name="validity_days"
                  value={formData.validity_days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tratamientos y Servicios */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <Euro className="h-4 w-4 mr-2" />
                Tratamientos y Servicios
              </h4>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción *
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción del tratamiento"
                        list={`treatments-${item.id}`}
                      />
                      <datalist id={`treatments-${item.id}`}>
                        {commonTreatments.map((treatment) => (
                          <option key={treatment} value={treatment} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Unitario
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descuento
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(item.id, 'discount', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-900">
                          €{item.total.toFixed(2)}
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cálculos Totales */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Totales
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descuento General (%)
                  </label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IVA (%)
                  </label>
                  <input
                    type="number"
                    name="tax_percentage"
                    value={formData.tax_percentage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>€{calculateSubtotal().toFixed(2)}</span>
                </div>
                {formData.discount_percentage > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Descuento ({formData.discount_percentage}%):</span>
                    <span>-€{calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>IVA ({formData.tax_percentage}%):</span>
                  <span>€{calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>€{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas y Términos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observaciones, instrucciones especiales..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Términos y Condiciones
              </label>
              <textarea
                name="terms_conditions"
                rows={4}
                value={formData.terms_conditions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Crear Presupuesto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBudgetModal;