import React, { useState } from 'react';
import { X, Calendar, Clock, User, MapPin, MessageSquare, Phone, Mail, AlertTriangle, CheckCircle } from 'lucide-react';

interface RequestAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: any) => void;
}

const RequestAppointmentModal: React.FC<RequestAppointmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tipo_cita: 'consulta' as 'consulta' | 'revision' | 'tratamiento' | 'urgencia',
    especialidad: 'odontologia_general' as 'odontologia_general' | 'endodoncia' | 'periodoncia' | 'cirugia' | 'ortodencia' | 'implantologia' | 'estetica' | 'pediatrica' | 'higiene',
    profesional_preferido: '',
    fecha_preferida: '',
    horario_preferido: 'manana' as 'manana' | 'tarde' | 'cualquiera',
    hora_especifica: '',
    motivo: '',
    sintomas: '',
    dolor_nivel: 1,
    urgente: false,
    ha_venido_antes: true,
    ultimo_tratamiento: '',
    medicamentos_actuales: '',
    alergias: '',
    preferencias_contacto: 'telefono' as 'telefono' | 'email' | 'sms',
    telefono_contacto: '',
    email_contacto: '',
    notas_adicionales: ''
  });

  const tiposCita = [
    { value: 'consulta', label: 'Consulta inicial' },
    { value: 'revision', label: 'Revisión / Control' },
    { value: 'tratamiento', label: 'Tratamiento programado' },
    { value: 'urgencia', label: 'Urgencia dental' }
  ];

  const especialidades = [
    { value: 'odontologia_general', label: 'Odontología General' },
    { value: 'endodoncia', label: 'Endodoncia' },
    { value: 'periodoncia', label: 'Periodoncia' },
    { value: 'cirugia', label: 'Cirugía Oral' },
    { value: 'ortodoncia', label: 'Ortodoncia' },
    { value: 'implantologia', label: 'Implantología' },
    { value: 'estetica', label: 'Estética Dental' },
    { value: 'pediatrica', label: 'Odontopediatría' },
    { value: 'higiene', label: 'Higiene Dental' }
  ];

  const profesionales = [
    { value: '', label: 'Sin preferencia' },
    { value: 'dr_martinez', label: 'Dr. Martín García - Endodoncia' },
    { value: 'dra_lopez', label: 'Dra. Ana López - Implantología' },
    { value: 'dr_rodriguez', label: 'Dr. Carlos Rodríguez - Cirugía' },
    { value: 'dra_fernandez', label: 'Dra. Laura Fernández - Ortodoncia' },
    { value: 'higienista_maria', label: 'María - Higienista Dental' }
  ];

  const horariosPreferidos = [
    { value: 'manana', label: 'Mañana (9:00 - 14:00)' },
    { value: 'tarde', label: 'Tarde (15:00 - 20:00)' },
    { value: 'cualquiera', label: 'Sin preferencia' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      fecha_solicitud: new Date().toISOString(),
      estado: 'pendiente_confirmacion'
    });
    onClose();
    
    setFormData({
      tipo_cita: 'consulta',
      especialidad: 'odontologia_general',
      profesional_preferido: '',
      fecha_preferida: '',
      horario_preferido: 'manana',
      hora_especifica: '',
      motivo: '',
      sintomas: '',
      dolor_nivel: 1,
      urgente: false,
      ha_venido_antes: true,
      ultimo_tratamiento: '',
      medicamentos_actuales: '',
      alergias: '',
      preferencias_contacto: 'telefono',
      telefono_contacto: '',
      email_contacto: '',
      notas_adicionales: ''
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Solicitar Nueva Cita</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de la Cita */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Información de la Cita</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Tipo de Cita *
                </label>
                <select
                  required
                  value={formData.tipo_cita}
                  onChange={(e) => setFormData({ ...formData, tipo_cita: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {tiposCita.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad *</label>
                <select
                  required
                  value={formData.especialidad}
                  onChange={(e) => setFormData({ ...formData, especialidad: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {especialidades.map(esp => (
                    <option key={esp.value} value={esp.value}>{esp.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Profesional Preferido
                </label>
                <select
                  value={formData.profesional_preferido}
                  onChange={(e) => setFormData({ ...formData, profesional_preferido: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {profesionales.map(prof => (
                    <option key={prof.value} value={prof.value}>{prof.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Preferida *</label>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={formData.fecha_preferida}
                    onChange={(e) => setFormData({ ...formData, fecha_preferida: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Horario Preferido
                  </label>
                  <select
                    value={formData.horario_preferido}
                    onChange={(e) => setFormData({ ...formData, horario_preferido: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {horariosPreferidos.map(horario => (
                      <option key={horario.value} value={horario.value}>{horario.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora Específica (opcional)</label>
                <input
                  type="time"
                  value={formData.hora_especifica}
                  onChange={(e) => setFormData({ ...formData, hora_especifica: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="09:00"
                  max="20:00"
                />
                <p className="text-xs text-gray-500 mt-1">Horario de atención: 9:00 - 20:00</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgente"
                  checked={formData.urgente}
                  onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="urgente" className="ml-2 block text-sm text-gray-900">
                  <AlertTriangle className="h-4 w-4 inline mr-1 text-red-500" />
                  Marcar como urgencia
                </label>
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Información Médica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Motivo de la Consulta *
                </label>
                <textarea
                  required
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describa brevemente el motivo de su consulta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Síntomas Actuales</label>
                <textarea
                  value={formData.sintomas}
                  onChange={(e) => setFormData({ ...formData, sintomas: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describa los síntomas que presenta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Dolor (1-10)
                  <span className="ml-2 text-sm text-gray-500">Actual: {formData.dolor_nivel}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.dolor_nivel}
                  onChange={(e) => setFormData({ ...formData, dolor_nivel: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sin dolor</span>
                  <span>Dolor severo</span>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ha_venido_antes"
                  checked={formData.ha_venido_antes}
                  onChange={(e) => setFormData({ ...formData, ha_venido_antes: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ha_venido_antes" className="ml-2 block text-sm text-gray-900">
                  <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
                  Ya he sido paciente de esta clínica
                </label>
              </div>

              {formData.ha_venido_antes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Último Tratamiento Recibido</label>
                  <input
                    type="text"
                    value={formData.ultimo_tratamiento}
                    onChange={(e) => setFormData({ ...formData, ultimo_tratamiento: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ej: Limpieza dental, Empaste, etc."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicamentos Actuales</label>
                <textarea
                  value={formData.medicamentos_actuales}
                  onChange={(e) => setFormData({ ...formData, medicamentos_actuales: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Indique los medicamentos que está tomando actualmente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alergias Conocidas</label>
                <input
                  type="text"
                  value={formData.alergias}
                  onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej: Penicilina, Látex, Anestesia local, etc."
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b pb-2">Preferencias de Contacto</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Contacto Preferido</label>
                <select
                  value={formData.preferencias_contacto}
                  onChange={(e) => setFormData({ ...formData, preferencias_contacto: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="telefono">Teléfono</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.telefono_contacto}
                  onChange={(e) => setFormData({ ...formData, telefono_contacto: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+34 612 345 678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email de Contacto
                </label>
                <input
                  type="email"
                  value={formData.email_contacto}
                  onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="su.email@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas Adicionales</label>
              <textarea
                value={formData.notas_adicionales}
                onChange={(e) => setFormData({ ...formData, notas_adicionales: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cualquier información adicional que considere relevante para su cita"
              />
            </div>
          </div>

          {/* Información Importante */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Su solicitud será revisada por nuestro equipo médico en un plazo máximo de 24 horas</li>
                  <li>Recibirá confirmación por su método de contacto preferido</li>
                  <li>Para urgencias fuera del horario de atención, llame al teléfono de emergencias</li>
                  <li>Si necesita cancelar o modificar la cita, hágalo con al menos 24 horas de antelación</li>
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4 inline mr-1" />
              Solicitar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAppointmentModal;