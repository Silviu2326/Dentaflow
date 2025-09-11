import React, { useState } from 'react';
import { X, Package, DollarSign, Clock, FileText, Plus, Minus, Activity, Target, AlertCircle } from 'lucide-react';

interface NewTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treatmentData: any) => void;
}

const NewTreatmentModal: React.FC<NewTreatmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Preventiva',
    precio: 0,
    duracion: 30,
    descripcion: '',
    materiales: [] as string[],
    procedimiento: '',
    indicaciones: '',
    contraindicaciones: '',
    cuidadosPosteriores: '',
    configuracion: {
      requiereAnestesia: false,
      requiereRadiografia: false,
      numeroSesiones: 1,
      intervaloSesiones: 0,
      tiempoRecuperacion: 0,
      edadMinima: 0,
      edadMaxima: 100,
    },
    precios: {
      precioBase: 0,
      precioNinos: 0,
      precioTerceredad: 0,
      descuentoSeguro: 0,
    },
    competencia: {
      precioMercado: 0,
      ventajas: [] as string[],
      diferenciadores: '',
    },
    activo: true,
    fechaCreacion: new Date().toISOString().split('T')[0],
  });

  const [newMaterial, setNewMaterial] = useState('');
  const [newVentaja, setNewVentaja] = useState('');

  const categorias = [
    'Preventiva',
    'Operatoria',
    'Endodoncia',
    'Periodoncia',
    'Cirugía Oral',
    'Prótesis',
    'Ortodoncia',
    'Implantología',
    'Estética',
    'Odontopediatría',
    'Urgencias',
    'Diagnóstico'
  ];

  const materialesComunes = [
    'Anestesia local',
    'Composite',
    'Amalgama',
    'Ácido grabador',
    'Adhesivo dental',
    'Corona temporal',
    'Corona de porcelana',
    'Implante de titanio',
    'Sutura',
    'Gasas estériles',
    'Instrumental básico',
    'Radiografía',
    'Pasta profiláctica',
    'Flúor tópico',
    'Blanqueador dental',
    'Brackets',
    'Arco ortodóncico',
    'Ligaduras',
    'Férula de descarga',
    'Material de impresión'
  ];

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.materiales.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        materiales: [...prev.materiales, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materiales: prev.materiales.filter(m => m !== material)
    }));
  };

  const addVentaja = () => {
    if (newVentaja.trim() && !formData.competencia.ventajas.includes(newVentaja.trim())) {
      setFormData(prev => ({
        ...prev,
        competencia: {
          ...prev.competencia,
          ventajas: [...prev.competencia.ventajas, newVentaja.trim()]
        }
      }));
      setNewVentaja('');
    }
  };

  const removeVentaja = (ventaja: string) => {
    setFormData(prev => ({
      ...prev,
      competencia: {
        ...prev.competencia,
        ventajas: prev.competencia.ventajas.filter(v => v !== ventaja)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const treatmentData = {
      ...formData,
      id: `treat_${Date.now()}`,
      precios: {
        ...formData.precios,
        precioBase: formData.precio,
      },
      fechaCreacion: new Date().toISOString(),
    };

    onSubmit(treatmentData);
    
    // Reset form
    setFormData({
      nombre: '',
      categoria: 'Preventiva',
      precio: 0,
      duracion: 30,
      descripcion: '',
      materiales: [],
      procedimiento: '',
      indicaciones: '',
      contraindicaciones: '',
      cuidadosPosteriores: '',
      configuracion: {
        requiereAnestesia: false,
        requiereRadiografia: false,
        numeroSesiones: 1,
        intervaloSesiones: 0,
        tiempoRecuperacion: 0,
        edadMinima: 0,
        edadMaxima: 100,
      },
      precios: {
        precioBase: 0,
        precioNinos: 0,
        precioTerceredad: 0,
        descuentoSeguro: 0,
      },
      competencia: {
        precioMercado: 0,
        ventajas: [],
        diferenciadores: '',
      },
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0],
    });
    setNewMaterial('');
    setNewVentaja('');
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Nuevo Tratamiento
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Tratamiento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Limpieza dental con ultrasonido"
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
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.activo ? 'activo' : 'inactivo'}
                  onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.value === 'activo' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción detallada del tratamiento"
                />
              </div>
            </div>
          </div>

          {/* Tiempo y Precio */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Tiempo y Tarifas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  step="5"
                  value={formData.duracion}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracion: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Base (€) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    precio: parseFloat(e.target.value) || 0,
                    precios: { ...prev.precios, precioBase: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Niños (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precios.precioNinos}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    precios: { ...prev.precios, precioNinos: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio 3ª Edad (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precios.precioTerceredad}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    precios: { ...prev.precios, precioTerceredad: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Materiales */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-yellow-600" />
              Materiales Necesarios
            </h3>
            
            {/* Agregar Material */}
            <div className="mb-4 p-3 bg-white rounded-md border">
              <h4 className="font-medium mb-3">Agregar Material</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <select
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar material común</option>
                    {materialesComunes.filter(m => !formData.materiales.includes(m)).map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </button>
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="O escribir material personalizado"
                />
              </div>
            </div>

            {/* Lista de Materiales */}
            <div className="space-y-2">
              {formData.materiales.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
                  <span className="text-sm font-medium text-gray-900">{material}</span>
                  <button
                    type="button"
                    onClick={() => removeMaterial(material)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Configuración del Tratamiento */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Configuración del Tratamiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Sesiones
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.configuracion.numeroSesiones}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracion: { ...prev.configuracion, numeroSesiones: parseInt(e.target.value) || 1 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo entre Sesiones (días)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.configuracion.intervaloSesiones}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracion: { ...prev.configuracion, intervaloSesiones: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de Recuperación (días)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.configuracion.tiempoRecuperacion}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracion: { ...prev.configuracion, tiempoRecuperacion: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.configuracion.requiereAnestesia}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracion: { ...prev.configuracion, requiereAnestesia: e.target.checked }
                    }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Requiere anestesia</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.configuracion.requiereRadiografia}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracion: { ...prev.configuracion, requiereRadiografia: e.target.checked }
                    }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Requiere radiografía</span>
                </label>
              </div>
            </div>

            {/* Rango de Edad */}
            <div className="mt-4">
              <h4 className="font-medium mb-3">Rango de Edad Recomendado</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad Mínima (años)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.configuracion.edadMinima}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracion: { ...prev.configuracion, edadMinima: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad Máxima (años)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.configuracion.edadMaxima}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracion: { ...prev.configuracion, edadMaxima: parseInt(e.target.value) || 100 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información Clínica */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Información Clínica
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procedimiento Detallado
                </label>
                <textarea
                  value={formData.procedimiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, procedimiento: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción paso a paso del procedimiento"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indicaciones
                  </label>
                  <textarea
                    value={formData.indicaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, indicaciones: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuándo está indicado este tratamiento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraindicaciones
                  </label>
                  <textarea
                    value={formData.contraindicaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, contraindicaciones: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuándo NO debe realizarse este tratamiento"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuidados Posteriores
                </label>
                <textarea
                  value={formData.cuidadosPosteriores}
                  onChange={(e) => setFormData(prev => ({ ...prev, cuidadosPosteriores: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instrucciones de cuidado post-tratamiento"
                />
              </div>
            </div>
          </div>

          {/* Análisis de Competencia */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-600" />
              Análisis de Competencia
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Mercado (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.competencia.precioMercado}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    competencia: { ...prev.competencia, precioMercado: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Precio promedio en el mercado"
                />
              </div>
              
              {/* Ventajas Competitivas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ventajas Competitivas
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newVentaja}
                    onChange={(e) => setNewVentaja(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Agregar ventaja competitiva"
                  />
                  <button
                    type="button"
                    onClick={addVentaja}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.competencia.ventajas.map((ventaja, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm">{ventaja}</span>
                      <button
                        type="button"
                        onClick={() => removeVentaja(ventaja)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diferenciadores
                </label>
                <textarea
                  value={formData.competencia.diferenciadores}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    competencia: { ...prev.competencia, diferenciadores: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Qué nos diferencia de la competencia en este tratamiento"
                />
              </div>
            </div>
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
              Crear Tratamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTreatmentModal;