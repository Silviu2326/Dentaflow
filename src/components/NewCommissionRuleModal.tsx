import React, { useState } from 'react';
import { X, Target, DollarSign, Users, Calendar, Settings, TrendingUp, Activity, Plus, Minus } from 'lucide-react';

interface NewCommissionRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ruleData: any) => void;
}

const NewCommissionRuleModal: React.FC<NewCommissionRuleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'tratamiento',
    activa: true,
    configuracion: {
      tratamientos: [] as string[],
      porcentaje: 0,
      montoFijo: 0,
      objetivoMensual: 0,
      bonificacionExtra: 0,
      comisionMinima: 0,
      comisionMaxima: 0,
      escalas: [] as Array<{
        desde: number;
        hasta: number;
        porcentaje: number;
      }>,
    },
    aplicaA: [] as string[],
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    condiciones: {
      pacientesNuevos: false,
      pacientesRecurrentes: false,
      minimoTratamientos: 0,
      importeMinimo: 0,
      diasSemana: [] as string[],
      horarios: {
        desde: '',
        hasta: '',
      },
    },
    notificaciones: {
      alertaObjetivo: false,
      recordatorioLiquidacion: false,
      emailProfesional: false,
    }
  });

  const [newTratamiento, setNewTratamiento] = useState('');
  const [newEscala, setNewEscala] = useState({
    desde: 0,
    hasta: 0,
    porcentaje: 0,
  });

  const profesionales = [
    'Dr. Martín García',
    'Dra. Ana López',
    'Dr. Carlos Ruiz',
    'Dra. María Fernández',
    'Dr. Pedro Sánchez',
    'Dra. Carmen Torres',
    'Higienista María',
    'Higienista Juan',
    'Asistente Ana',
    'Asistente Luis'
  ];

  const tratamientosDisponibles = [
    'Consulta Inicial',
    'Limpieza Dental',
    'Endodoncia',
    'Implante Dental',
    'Corona de Porcelana',
    'Ortodoncia',
    'Blanqueamiento Dental',
    'Extracción',
    'Cirugía Oral',
    'Tratamiento Periodontal',
    'Prótesis Dental',
    'Radiografía',
    'Urgencia Dental',
    'Revisión',
    'Empaste',
    'Corona sobre Implante',
    'Mantenimiento Periodontal',
    'Brackets',
    'Retenedores'
  ];

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const addTratamiento = () => {
    if (newTratamiento && !formData.configuracion.tratamientos.includes(newTratamiento)) {
      setFormData(prev => ({
        ...prev,
        configuracion: {
          ...prev.configuracion,
          tratamientos: [...prev.configuracion.tratamientos, newTratamiento]
        }
      }));
      setNewTratamiento('');
    }
  };

  const removeTratamiento = (tratamiento: string) => {
    setFormData(prev => ({
      ...prev,
      configuracion: {
        ...prev.configuracion,
        tratamientos: prev.configuracion.tratamientos.filter(t => t !== tratamiento)
      }
    }));
  };

  const addEscala = () => {
    if (newEscala.desde >= 0 && newEscala.hasta > newEscala.desde && newEscala.porcentaje > 0) {
      setFormData(prev => ({
        ...prev,
        configuracion: {
          ...prev.configuracion,
          escalas: [...prev.configuracion.escalas, newEscala]
        }
      }));
      setNewEscala({
        desde: 0,
        hasta: 0,
        porcentaje: 0,
      });
    }
  };

  const removeEscala = (index: number) => {
    setFormData(prev => ({
      ...prev,
      configuracion: {
        ...prev.configuracion,
        escalas: prev.configuracion.escalas.filter((_, i) => i !== index)
      }
    }));
  };

  const handleProfesionalChange = (profesional: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      aplicaA: checked 
        ? [...prev.aplicaA, profesional]
        : prev.aplicaA.filter(p => p !== profesional)
    }));
  };

  const handleDiaSeamanaChange = (dia: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      condiciones: {
        ...prev.condiciones,
        diasSemana: checked 
          ? [...prev.condiciones.diasSemana, dia]
          : prev.condiciones.diasSemana.filter(d => d !== dia)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleData = {
      ...formData,
      id: `rule_${Date.now()}`,
      fechaCreacion: new Date().toISOString(),
      ultimaModificacion: new Date().toISOString(),
    };

    onSubmit(ruleData);
    
    // Reset form
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: 'tratamiento',
      activa: true,
      configuracion: {
        tratamientos: [],
        porcentaje: 0,
        montoFijo: 0,
        objetivoMensual: 0,
        bonificacionExtra: 0,
        comisionMinima: 0,
        comisionMaxima: 0,
        escalas: [],
      },
      aplicaA: [],
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      condiciones: {
        pacientesNuevos: false,
        pacientesRecurrentes: false,
        minimoTratamientos: 0,
        importeMinimo: 0,
        diasSemana: [],
        horarios: {
          desde: '',
          hasta: '',
        },
      },
      notificaciones: {
        alertaObjetivo: false,
        recordatorioLiquidacion: false,
        emailProfesional: false,
      }
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            Nueva Regla de Comisión
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
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Regla *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Comisión Implantes 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Comisión *
                </label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="tratamiento">Por Tratamiento</option>
                  <option value="objetivo">Por Objetivo</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.activa}
                  onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label className="text-sm text-gray-700">Regla activa</label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Descripción detallada de la regla de comisión"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Comisión */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Configuración de Comisión
            </h3>

            {/* Tratamientos (solo si tipo es tratamiento o mixto) */}
            {(formData.tipo === 'tratamiento' || formData.tipo === 'mixto') && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tratamientos Aplicables</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="md:col-span-2">
                    <select
                      value={newTratamiento}
                      onChange={(e) => setNewTratamiento(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar tratamiento</option>
                      {tratamientosDisponibles.filter(t => !formData.configuracion.tratamientos.includes(t)).map(tratamiento => (
                        <option key={tratamiento} value={tratamiento}>{tratamiento}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addTratamiento}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.configuracion.tratamientos.map((tratamiento, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {tratamiento}
                      <button
                        type="button"
                        onClick={() => removeTratamiento(tratamiento)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Configuración de Porcentajes/Montos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje de Comisión (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.configuracion.porcentaje}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracion: { ...prev.configuracion, porcentaje: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Fijo (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.configuracion.montoFijo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracion: { ...prev.configuracion, montoFijo: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comisión Mínima (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.configuracion.comisionMinima}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracion: { ...prev.configuracion, comisionMinima: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Objetivos (solo si tipo es objetivo o mixto) */}
            {(formData.tipo === 'objetivo' || formData.tipo === 'mixto') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo Mensual (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.configuracion.objetivoMensual}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracion: { ...prev.configuracion, objetivoMensual: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonificación Extra (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.configuracion.bonificacionExtra}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracion: { ...prev.configuracion, bonificacionExtra: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Escalas de Comisión */}
            <div className="mt-6">
              <h4 className="font-medium mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Escalas de Comisión (Opcional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <input
                    type="number"
                    placeholder="Desde (€)"
                    value={newEscala.desde}
                    onChange={(e) => setNewEscala(prev => ({ ...prev, desde: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Hasta (€)"
                    value={newEscala.hasta}
                    onChange={(e) => setNewEscala(prev => ({ ...prev, hasta: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="% Comisión"
                    value={newEscala.porcentaje}
                    onChange={(e) => setNewEscala(prev => ({ ...prev, porcentaje: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={addEscala}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </button>
              </div>
              <div className="space-y-2">
                {formData.configuracion.escalas.map((escala, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
                    <span className="text-sm">
                      €{escala.desde.toFixed(2)} - €{escala.hasta.toFixed(2)} → {escala.porcentaje}%
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEscala(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profesionales */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Profesionales Aplicables
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profesionales.map(profesional => (
                <label key={profesional} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.aplicaA.includes(profesional)}
                    onChange={(e) => handleProfesionalChange(profesional, e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{profesional}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vigencia */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
              Vigencia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Condiciones Especiales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-gray-600" />
              Condiciones Especiales
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.condiciones.pacientesNuevos}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        condiciones: { ...prev.condiciones, pacientesNuevos: e.target.checked }
                      }))}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Solo pacientes nuevos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.condiciones.pacientesRecurrentes}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        condiciones: { ...prev.condiciones, pacientesRecurrentes: e.target.checked }
                      }))}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Solo pacientes recurrentes</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mínimo de Tratamientos/Mes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.condiciones.minimoTratamientos}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        condiciones: { ...prev.condiciones, minimoTratamientos: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importe Mínimo por Tratamiento (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.condiciones.importeMinimo}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        condiciones: { ...prev.condiciones, importeMinimo: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Días de la Semana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de la Semana Aplicables
                </label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {diasSemana.map(dia => (
                    <label key={dia} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.condiciones.diasSemana.includes(dia)}
                        onChange={(e) => handleDiaSeamanaChange(dia, e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs text-gray-700">{dia}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora Desde
                  </label>
                  <input
                    type="time"
                    value={formData.condiciones.horarios.desde}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      condiciones: { ...prev.condiciones, horarios: { ...prev.condiciones.horarios, desde: e.target.value }}
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora Hasta
                  </label>
                  <input
                    type="time"
                    value={formData.condiciones.horarios.hasta}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      condiciones: { ...prev.condiciones, horarios: { ...prev.condiciones.horarios, hasta: e.target.value }}
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.notificaciones.alertaObjetivo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notificaciones: { ...prev.notificaciones, alertaObjetivo: e.target.checked }
                  }))}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Alerta cuando se alcance el objetivo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.notificaciones.recordatorioLiquidacion}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notificaciones: { ...prev.notificaciones, recordatorioLiquidacion: e.target.checked }
                  }))}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Recordatorio de liquidación mensual</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.notificaciones.emailProfesional}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notificaciones: { ...prev.notificaciones, emailProfesional: e.target.checked }
                  }))}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Enviar email al profesional sobre comisiones</span>
              </label>
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
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Crear Regla de Comisión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCommissionRuleModal;