import React, { useState } from 'react';
import { X, Calculator, DollarSign, Clock, User, Package, Target, BarChart3, Activity } from 'lucide-react';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (analysisData: any) => void;
}

const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tratamiento: '',
    categoria: '',
    descripcion: '',
    duracionMinutos: 0,
    profesionalPrincipal: '',
    profesionalesSecundarios: [] as string[],
    costeManoObra: {
      principal: 0,
      secundarios: 0,
      total: 0,
    },
    costeMaterial: {
      materiales: [] as Array<{
        nombre: string;
        cantidad: number;
        precioUnitario: number;
        costeTotal: number;
      }>,
      total: 0,
    },
    costesIndirectos: {
      equipos: 0,
      instalaciones: 0,
      electricidad: 0,
      otros: 0,
      total: 0,
    },
    precioVenta: 0,
    objetivos: {
      margenMinimo: 20,
      margenObjetivo: 40,
      tiempoMaximo: 120,
    },
    notas: '',
    fechaCreacion: new Date().toISOString().split('T')[0],
  });

  const [newMaterial, setNewMaterial] = useState({
    nombre: '',
    cantidad: 1,
    precioUnitario: 0,
  });

  const categorias = [
    'Endodoncia',
    'Implantología', 
    'Ortodoncia',
    'Prótesis',
    'Cirugía Oral',
    'Periodoncia',
    'Odontopediatría',
    'Estética Dental',
    'Preventiva',
    'Urgencias',
    'Otros'
  ];

  const profesionales = [
    'Dr. Martín García',
    'Dr. Ana López',
    'Dr. Carlos Ruiz',
    'Dra. María Fernández',
    'Dr. Pedro Sánchez',
    'Dra. Carmen Torres',
    'Higienista María',
    'Higienista Juan',
    'Asistente Ana',
    'Asistente Luis'
  ];

  const materialesComunes = [
    'Anestesia Lidocaína 2%',
    'Lima Endodóntica',
    'Gutapercha',
    'Composite',
    'Amalgama',
    'Implante Titanio',
    'Tornillo de Cicatrización',
    'Corona Porcelana',
    'Bracket Metálico',
    'Arco Ortodóntico',
    'Pasta Profiláctica',
    'Fluoruro Tópico'
  ];

  const addMaterial = () => {
    if (newMaterial.nombre && newMaterial.cantidad > 0 && newMaterial.precioUnitario > 0) {
      const costeTotal = newMaterial.cantidad * newMaterial.precioUnitario;
      const materialToAdd = {
        ...newMaterial,
        costeTotal
      };

      setFormData(prev => ({
        ...prev,
        costeMaterial: {
          ...prev.costeMaterial,
          materiales: [...prev.costeMaterial.materiales, materialToAdd],
          total: prev.costeMaterial.total + costeTotal
        }
      }));

      setNewMaterial({
        nombre: '',
        cantidad: 1,
        precioUnitario: 0,
      });
    }
  };

  const removeMaterial = (index: number) => {
    const material = formData.costeMaterial.materiales[index];
    setFormData(prev => ({
      ...prev,
      costeMaterial: {
        ...prev.costeMaterial,
        materiales: prev.costeMaterial.materiales.filter((_, i) => i !== index),
        total: prev.costeMaterial.total - material.costeTotal
      }
    }));
  };

  const calculateTotals = () => {
    const manoObraTotal = formData.costeManoObra.principal + formData.costeManoObra.secundarios;
    const indirectosTotal = Object.values(formData.costesIndirectos).reduce((acc, val) => {
      return typeof val === 'number' ? acc + val : acc;
    }, 0);
    
    const costeTotal = manoObraTotal + formData.costeMaterial.total + indirectosTotal;
    const margen = formData.precioVenta - costeTotal;
    const margenPorcentaje = formData.precioVenta > 0 ? (margen / formData.precioVenta) * 100 : 0;

    return {
      costeTotal,
      margen,
      margenPorcentaje,
      manoObraTotal,
      indirectosTotal
    };
  };

  const totals = calculateTotals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const analysisData = {
      ...formData,
      costeManoObra: {
        ...formData.costeManoObra,
        total: totals.manoObraTotal
      },
      costesIndirectos: {
        ...formData.costesIndirectos,
        total: totals.indirectosTotal
      },
      costeTotal: totals.costeTotal,
      margen: totals.margen,
      margenPorcentaje: totals.margenPorcentaje,
      ultimaActualizacion: new Date().toISOString().split('T')[0],
    };

    onSubmit(analysisData);
    
    // Reset form
    setFormData({
      tratamiento: '',
      categoria: '',
      descripcion: '',
      duracionMinutos: 0,
      profesionalPrincipal: '',
      profesionalesSecundarios: [],
      costeManoObra: {
        principal: 0,
        secundarios: 0,
        total: 0,
      },
      costeMaterial: {
        materiales: [],
        total: 0,
      },
      costesIndirectos: {
        equipos: 0,
        instalaciones: 0,
        electricidad: 0,
        otros: 0,
        total: 0,
      },
      precioVenta: 0,
      objetivos: {
        margenMinimo: 20,
        margenObjetivo: 40,
        tiempoMaximo: 120,
      },
      notas: '',
      fechaCreacion: new Date().toISOString().split('T')[0],
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-blue-600" />
            Nuevo Análisis de Costes
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Tratamiento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tratamiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, tratamiento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Endodoncia Molar Completa"
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
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duracionMinutos}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracionMinutos: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="Descripción detallada del procedimiento y consideraciones especiales"
                />
              </div>
            </div>
          </div>

          {/* Personal y Mano de Obra */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal y Mano de Obra
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profesional Principal *
                </label>
                <select
                  required
                  value={formData.profesionalPrincipal}
                  onChange={(e) => setFormData(prev => ({ ...prev, profesionalPrincipal: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar profesional</option>
                  {profesionales.map(profesional => (
                    <option key={profesional} value={profesional}>{profesional}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Coste Mano de Obra Principal *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.costeManoObra.principal}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    costeManoObra: { ...prev.costeManoObra, principal: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coste Personal Secundario
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costeManoObra.secundarios}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    costeManoObra: { ...prev.costeManoObra, secundarios: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Asistentes, higienistas, etc."
                />
              </div>
              <div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="text-sm font-medium text-blue-900">Total Mano de Obra</div>
                  <div className="text-xl font-bold text-blue-600">€{totals.manoObraTotal.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Materiales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Materiales y Consumibles
            </h3>
            
            {/* Agregar Material */}
            <div className="mb-4 p-3 bg-white rounded-md border">
              <h4 className="font-medium mb-3">Agregar Material</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <select
                    value={newMaterial.nombre}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar material</option>
                    {materialesComunes.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={newMaterial.cantidad}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cantidad"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newMaterial.precioUnitario}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, precioUnitario: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Precio unitario"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Materiales */}
            <div className="space-y-2">
              {formData.costeMaterial.materiales.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
                  <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                    <div><span className="font-medium">{material.nombre}</span></div>
                    <div>Cantidad: {material.cantidad}</div>
                    <div>Precio: €{material.precioUnitario.toFixed(2)}</div>
                    <div>Total: €{material.costeTotal.toFixed(2)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="ml-3 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <div className="text-sm font-medium text-green-900">Total Materiales</div>
              <div className="text-xl font-bold text-green-600">€{formData.costeMaterial.total.toFixed(2)}</div>
            </div>
          </div>

          {/* Costes Indirectos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Costes Indirectos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipos y Amortización
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costesIndirectos.equipos}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    costesIndirectos: { ...prev.costesIndirectos, equipos: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instalaciones y Alquiler
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costesIndirectos.instalaciones}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    costesIndirectos: { ...prev.costesIndirectos, instalaciones: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricidad y Servicios
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costesIndirectos.electricidad}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    costesIndirectos: { ...prev.costesIndirectos, electricidad: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otros Costes
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costesIndirectos.otros}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    costesIndirectos: { ...prev.costesIndirectos, otros: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-orange-50 rounded-md">
              <div className="text-sm font-medium text-orange-900">Total Costes Indirectos</div>
              <div className="text-xl font-bold text-orange-600">€{totals.indirectosTotal.toFixed(2)}</div>
            </div>
          </div>

          {/* Precio y Objetivos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Precio y Objetivos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Precio de Venta *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.precioVenta}
                  onChange={(e) => setFormData(prev => ({ ...prev, precioVenta: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margen Mínimo (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.objetivos.margenMinimo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    objetivos: { ...prev.objetivos, margenMinimo: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margen Objetivo (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.objetivos.margenObjetivo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    objetivos: { ...prev.objetivos, margenObjetivo: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo Máximo (min)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.objetivos.tiempoMaximo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    objetivos: { ...prev.objetivos, tiempoMaximo: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Resumen de Análisis */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Resumen del Análisis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-red-50 rounded-md text-center">
                <div className="text-sm font-medium text-red-900">Coste Total</div>
                <div className="text-xl font-bold text-red-600">€{totals.costeTotal.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-md text-center">
                <div className="text-sm font-medium text-green-900">Precio Venta</div>
                <div className="text-xl font-bold text-green-600">€{formData.precioVenta.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-md text-center">
                <div className="text-sm font-medium text-blue-900">Margen</div>
                <div className="text-xl font-bold text-blue-600">€{totals.margen.toFixed(2)}</div>
              </div>
              <div className={`p-3 rounded-md text-center ${
                totals.margenPorcentaje >= formData.objetivos.margenObjetivo ? 'bg-green-50' :
                totals.margenPorcentaje >= formData.objetivos.margenMinimo ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className={`text-sm font-medium ${
                  totals.margenPorcentaje >= formData.objetivos.margenObjetivo ? 'text-green-900' :
                  totals.margenPorcentaje >= formData.objetivos.margenMinimo ? 'text-yellow-900' : 'text-red-900'
                }`}>
                  Margen %
                </div>
                <div className={`text-xl font-bold ${
                  totals.margenPorcentaje >= formData.objetivos.margenObjetivo ? 'text-green-600' :
                  totals.margenPorcentaje >= formData.objetivos.margenMinimo ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {totals.margenPorcentaje.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Notas y Observaciones</h3>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones adicionales, variaciones del procedimiento, consideraciones especiales..."
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
              Crear Análisis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAnalysisModal;