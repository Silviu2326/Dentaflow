import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, DollarSign, MessageSquare, Users, Globe, Target, Clock, AlertCircle } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: any) => void;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    origen: 'web_directa' as 'web_directa' | 'google_ads' | 'facebook' | 'instagram' | 'referido' | 'telemarketing' | 'evento' | 'otros',
    canal_especifico: '',
    responsable: '',
    sede: 'centro' as 'centro' | 'norte' | 'sur' | 'este' | 'oeste',
    interes_principal: 'consulta_general' as 'consulta_general' | 'limpieza' | 'blanqueamiento' | 'ortodoncia' | 'implantes' | 'endodoncia' | 'cirugia' | 'estetica' | 'urgencia',
    valor_estimado: '',
    prioridad: 'media' as 'baja' | 'media' | 'alta' | 'urgente',
    como_nos_conocio: '',
    presupuesto_aproximado: '',
    fecha_contacto_preferida: '',
    hora_contacto_preferida: 'cualquiera' as 'manana' | 'tarde' | 'noche' | 'cualquiera',
    medio_contacto_preferido: 'telefono' as 'telefono' | 'whatsapp' | 'email' | 'sms',
    consentimiento_marketing: false,
    consentimiento_datos: false,
    notas_iniciales: '',
    observaciones_comerciales: ''
  });

  const origenes = [
    { value: 'web_directa', label: 'Web Directa' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'referido', label: 'Referido' },
    { value: 'telemarketing', label: 'Telemarketing' },
    { value: 'evento', label: 'Evento/Feria' },
    { value: 'otros', label: 'Otros' }
  ];

  const responsables = [
    { value: '', label: 'Asignar automáticamente' },
    { value: 'Ana Rodríguez', label: 'Ana Rodríguez' },
    { value: 'Carlos López', label: 'Carlos López' },
    { value: 'María García', label: 'María García' },
    { value: 'David Martín', label: 'David Martín' }
  ];

  const sedes = [
    { value: 'centro', label: 'Centro' },
    { value: 'norte', label: 'Norte' },
    { value: 'sur', label: 'Sur' },
    { value: 'este', label: 'Este' },
    { value: 'oeste', label: 'Oeste' }
  ];

  const intereses = [
    { value: 'consulta_general', label: 'Consulta General' },
    { value: 'limpieza', label: 'Limpieza Dental' },
    { value: 'blanqueamiento', label: 'Blanqueamiento' },
    { value: 'ortodoncia', label: 'Ortodoncia' },
    { value: 'implantes', label: 'Implantes Dentales' },
    { value: 'endodoncia', label: 'Endodoncia' },
    { value: 'cirugia', label: 'Cirugía Oral' },
    { value: 'estetica', label: 'Estética Dental' },
    { value: 'urgencia', label: 'Urgencia' }
  ];

  const prioridades = [
    { value: 'baja', label: 'Baja', color: 'text-gray-600 bg-gray-100' },
    { value: 'media', label: 'Media', color: 'text-blue-600 bg-blue-100' },
    { value: 'alta', label: 'Alta', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgente', label: 'Urgente', color: 'text-red-600 bg-red-100' }
  ];

  const horariosContacto = [
    { value: 'manana', label: 'Mañana (9:00 - 14:00)' },
    { value: 'tarde', label: 'Tarde (14:00 - 18:00)' },
    { value: 'noche', label: 'Noche (18:00 - 20:00)' },
    { value: 'cualquiera', label: 'Sin preferencia' }
  ];

  const mediosContacto = [
    { value: 'telefono', label: 'Teléfono' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      fechaLead: new Date().toISOString(),
      estado: 'lead',
      notas: [formData.notas_iniciales].filter(Boolean)
    });
    onClose();
    
    setFormData({
      nombre: '',
      apellidos: '',
      telefono: '',
      email: '',
      origen: 'web_directa',
      canal_especifico: '',
      responsable: '',
      sede: 'centro',
      interes_principal: 'consulta_general',
      valor_estimado: '',
      prioridad: 'media',
      como_nos_conocio: '',
      presupuesto_aproximado: '',
      fecha_contacto_preferida: '',
      hora_contacto_preferida: 'cualquiera',
      medio_contacto_preferido: 'telefono',
      consentimiento_marketing: false,
      consentimiento_datos: false,
      notas_iniciales: '',
      observaciones_comerciales: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Nuevo Lead</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Información Personal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Apellidos"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+34 612 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo nos conoció?</label>
                <textarea
                  value={formData.como_nos_conocio}
                  onChange={(e) => setFormData({ ...formData, como_nos_conocio: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Descripción de cómo conoció la clínica"
                />
              </div>
            </div>

            {/* Información Comercial */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Información Comercial</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Origen del Lead *
                </label>
                <select
                  required
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {origenes.map(origen => (
                    <option key={origen.value} value={origen.value}>{origen.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canal Específico</label>
                <input
                  type="text"
                  value={formData.canal_especifico}
                  onChange={(e) => setFormData({ ...formData, canal_especifico: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ej: Campaña Google Ads - Implantes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="h-4 w-4 inline mr-1" />
                  Interés Principal *
                </label>
                <select
                  required
                  value={formData.interes_principal}
                  onChange={(e) => setFormData({ ...formData, interes_principal: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {intereses.map(interes => (
                    <option key={interes.value} value={interes.value}>{interes.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Valor Estimado (€)
                </label>
                <input
                  type="number"
                  value={formData.valor_estimado}
                  onChange={(e) => setFormData({ ...formData, valor_estimado: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="1200"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto Aproximado</label>
                <input
                  type="text"
                  value={formData.presupuesto_aproximado}
                  onChange={(e) => setFormData({ ...formData, presupuesto_aproximado: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="ej: Entre 500-1000€"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Prioridad
                </label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {prioridades.map(prioridad => (
                    <option key={prioridad.value} value={prioridad.value}>{prioridad.label}</option>
                  ))}
                </select>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${prioridades.find(p => p.value === formData.prioridad)?.color}`}>
                    {prioridades.find(p => p.value === formData.prioridad)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Asignación y Contacto */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Asignación y Contacto</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Responsable
                </label>
                <select
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {responsables.map(resp => (
                    <option key={resp.value} value={resp.value}>{resp.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Sede Preferida
                </label>
                <select
                  value={formData.sede}
                  onChange={(e) => setFormData({ ...formData, sede: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {sedes.map(sede => (
                    <option key={sede.value} value={sede.value}>{sede.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha Preferida de Contacto
                </label>
                <input
                  type="date"
                  value={formData.fecha_contacto_preferida}
                  onChange={(e) => setFormData({ ...formData, fecha_contacto_preferida: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Horario Preferido
                </label>
                <select
                  value={formData.hora_contacto_preferida}
                  onChange={(e) => setFormData({ ...formData, hora_contacto_preferida: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {horariosContacto.map(horario => (
                    <option key={horario.value} value={horario.value}>{horario.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medio de Contacto Preferido</label>
                <select
                  value={formData.medio_contacto_preferido}
                  onChange={(e) => setFormData({ ...formData, medio_contacto_preferido: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  {mediosContacto.map(medio => (
                    <option key={medio.value} value={medio.value}>{medio.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consentimiento_datos"
                    checked={formData.consentimiento_datos}
                    onChange={(e) => setFormData({ ...formData, consentimiento_datos: e.target.checked })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="consentimiento_datos" className="ml-2 block text-sm text-gray-900">
                    Consentimiento para tratamiento de datos *
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consentimiento_marketing"
                    checked={formData.consentimiento_marketing}
                    onChange={(e) => setFormData({ ...formData, consentimiento_marketing: e.target.checked })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="consentimiento_marketing" className="ml-2 block text-sm text-gray-900">
                    Acepta recibir comunicaciones comerciales
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notas y Observaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Notas Iniciales
              </label>
              <textarea
                value={formData.notas_iniciales}
                onChange={(e) => setFormData({ ...formData, notas_iniciales: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Información adicional sobre el lead, necesidades específicas, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones Comerciales</label>
              <textarea
                value={formData.observaciones_comerciales}
                onChange={(e) => setFormData({ ...formData, observaciones_comerciales: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Estrategia de contacto, puntos clave a mencionar, etc."
              />
            </div>
          </div>

          {/* Información Importante */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-orange-400 mr-2 mt-0.5" />
              <div className="text-sm text-orange-700">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>El lead será asignado automáticamente según disponibilidad si no se especifica responsable</li>
                  <li>Se enviará notificación inmediata al responsable asignado</li>
                  <li>El primer contacto debe realizarse en las próximas 24 horas</li>
                  <li>Todos los campos marcados con * son obligatorios</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.consentimiento_datos}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <User className="h-4 w-4 inline mr-1" />
              Crear Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;