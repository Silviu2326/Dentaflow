import React, { useState } from 'react';
import { X, Package, Tag, MapPin, Truck, DollarSign, Calendar, AlertCircle, BarChart3 } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    codigo: '',
    descripcion: '',
    unidadMedida: '',
    stockMinimo: 0,
    stockActual: 0,
    stockMaximo: 0,
    ubicacion: '',
    proveedor: '',
    contactoProveedor: {
      telefono: '',
      email: '',
      direccion: '',
    },
    precioUnitario: 0,
    precioCompra: 0,
    precioVenta: 0,
    codigoBarras: '',
    fechaVencimiento: '',
    loteActual: '',
    observaciones: '',
    requiereReceta: false,
    esControlado: false,
    temperatura: 'ambiente',
    estado: 'activo',
  });

  const categorias = [
    'Materiales de Obturación',
    'Anestésicos',
    'Instrumental Quirúrgico',
    'Protección Personal',
    'Materiales de Impresión',
    'Endodoncia',
    'Ortodoncia',
    'Implantología',
    'Periodoncia',
    'Prótesis',
    'Radiología',
    'Limpieza y Desinfección',
    'Medicamentos',
    'Consumibles Generales',
    'Equipos y Dispositivos',
    'Otros'
  ];

  const unidadesMedida = [
    'Unidad',
    'Caja',
    'Paquete',
    'Frasco',
    'Tubo',
    'Jeringa',
    'Ampolla',
    'Carpule',
    'Cápsula',
    'Sobre',
    'Rollo',
    'Metro',
    'Litro',
    'Mililitro',
    'Gramo',
    'Kilogramo',
    'Set',
    'Kit'
  ];

  const ubicaciones = [
    'Sede Central - Almacén A',
    'Sede Central - Almacén B',
    'Sede Central - Almacén General',
    'Sede Central - Farmacia',
    'Sede Norte - Consulta 1',
    'Sede Norte - Consulta 2',
    'Sede Norte - Almacén',
    'Sede Sur - Consulta 1',
    'Sede Sur - Consulta 2',
    'Sede Sur - Almacén B',
    'Refrigerador - Sede Central',
    'Refrigerador - Sede Norte',
    'Refrigerador - Sede Sur'
  ];

  const proveedores = [
    'DentalSupply',
    'PharmaDental',
    'ComposiDent',
    'SafetyDental',
    'MedicalEquip',
    'DentalTech',
    'ProDental',
    'SuppliesDent',
    'InnovateDental',
    'GlobalDental'
  ];

  const temperaturas = [
    { value: 'ambiente', label: 'Temperatura Ambiente (15-25°C)' },
    { value: 'refrigeracion', label: 'Refrigeración (2-8°C)' },
    { value: 'congelacion', label: 'Congelación (-18°C)' },
    { value: 'controlada', label: 'Temperatura Controlada' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generar código automático si no se proporcionó
    const codigo = formData.codigo || `${formData.categoria.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
    
    const productData = {
      ...formData,
      codigo,
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimaModificacion: new Date().toISOString().split('T')[0],
    };

    onSubmit(productData);
    
    // Reset form
    setFormData({
      nombre: '',
      categoria: '',
      codigo: '',
      descripcion: '',
      unidadMedida: '',
      stockMinimo: 0,
      stockActual: 0,
      stockMaximo: 0,
      ubicacion: '',
      proveedor: '',
      contactoProveedor: {
        telefono: '',
        email: '',
        direccion: '',
      },
      precioUnitario: 0,
      precioCompra: 0,
      precioVenta: 0,
      codigoBarras: '',
      fechaVencimiento: '',
      loteActual: '',
      observaciones: '',
      requiereReceta: false,
      esControlado: false,
      temperatura: 'ambiente',
      estado: 'activo',
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Nuevo Producto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-600" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Anestesia Lidocaína 2%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Producto
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Se generará automáticamente si se deja vacío"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  required
                  value={formData.unidadMedida}
                  onChange={(e) => setFormData(prev => ({ ...prev, unidadMedida: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar unidad</option>
                  {unidadesMedida.map(unidad => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Barras
                </label>
                <input
                  type="text"
                  value={formData.codigoBarras}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigoBarras: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Código de barras del producto"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción detallada del producto"
                />
              </div>
            </div>
          </div>

          {/* Stock e Inventario */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Stock e Inventario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Actual *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stockActual}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockActual: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Mínimo *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stockMinimo}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockMinimo: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Máximo *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stockMaximo}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockMaximo: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ubicación *
                </label>
                <select
                  required
                  value={formData.ubicacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar ubicación</option>
                  {ubicaciones.map(ubicacion => (
                    <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lote Actual
                </label>
                <input
                  type="text"
                  value={formData.loteActual}
                  onChange={(e) => setFormData(prev => ({ ...prev, loteActual: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Número de lote actual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaVencimiento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Proveedor y Precios */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              Proveedor y Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor Principal *
                </label>
                <select
                  required
                  value={formData.proveedor}
                  onChange={(e) => setFormData(prev => ({ ...prev, proveedor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor} value={proveedor}>{proveedor}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.contactoProveedor.telefono}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contactoProveedor: { ...prev.contactoProveedor, telefono: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Teléfono del proveedor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  value={formData.contactoProveedor.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contactoProveedor: { ...prev.contactoProveedor, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email del proveedor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Precio de Compra
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioCompra}
                  onChange={(e) => setFormData(prev => ({ ...prev, precioCompra: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Unitario *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.precioUnitario}
                  onChange={(e) => setFormData(prev => ({ ...prev, precioUnitario: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Venta
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioVenta}
                  onChange={(e) => setFormData(prev => ({ ...prev, precioVenta: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Configuraciones Especiales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Configuraciones Especiales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura de Almacenamiento
                </label>
                <select
                  value={formData.temperatura}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperatura: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {temperaturas.map(temp => (
                    <option key={temp.value} value={temp.value}>{temp.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Producto
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="descontinuado">Descontinuado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.requiereReceta}
                      onChange={(e) => setFormData(prev => ({ ...prev, requiereReceta: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Requiere receta médica</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.esControlado}
                      onChange={(e) => setFormData(prev => ({ ...prev, esControlado: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Es medicamento controlado</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Observaciones</h3>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notas adicionales, instrucciones especiales de almacenamiento, etc."
            />
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
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductModal;