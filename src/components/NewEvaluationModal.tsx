import React, { useState } from 'react';
import { X, FileText, Calendar, User, Stethoscope, Camera, Activity } from 'lucide-react';

interface NewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evaluationData: any) => void;
}

const NewEvaluationModal: React.FC<NewEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    professional: '',
    treatment: '',
    description: '',
    symptoms: '',
    diagnosis: '',
    treatment_plan: '',
    teeth: [] as string[],
    anesthesia: '',
    complications: '',
    post_operative_instructions: '',
    next_appointment: '',
    images: [] as string[],
    radiographs: [] as string[],
    medications: '',
    notes: ''
  });

  const professionals = [
    'Dr. Rodriguez',
    'Dra. Martinez',
    'Dr. Lopez'
  ];

  const treatments = [
    'Consulta inicial',
    'Revisión rutinaria',
    'Limpieza dental',
    'Empaste',
    'Endodoncia',
    'Extracción',
    'Corona',
    'Puente',
    'Implante',
    'Ortodoncia',
    'Blanqueamiento',
    'Cirugía oral',
    'Periodontal',
    'Prótesis'
  ];

  const anesthesiaTypes = [
    'No aplicada',
    'Tópica',
    'Infiltrativa',
    'Troncular',
    'Sedación consciente',
    'Anestesia general'
  ];

  const teethOptions = [
    // Maxilar superior
    '18', '17', '16', '15', '14', '13', '12', '11',
    '21', '22', '23', '24', '25', '26', '27', '28',
    // Maxilar inferior
    '48', '47', '46', '45', '44', '43', '42', '41',
    '31', '32', '33', '34', '35', '36', '37', '38'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeethChange = (tooth: string) => {
    setFormData(prev => ({
      ...prev,
      teeth: prev.teeth.includes(tooth)
        ? prev.teeth.filter(t => t !== tooth)
        : [...prev.teeth, tooth]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now(), // Temporal ID
      createdAt: new Date().toISOString()
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      professional: '',
      treatment: '',
      description: '',
      symptoms: '',
      diagnosis: '',
      treatment_plan: '',
      teeth: [],
      anesthesia: '',
      complications: '',
      post_operative_instructions: '',
      next_appointment: '',
      images: [],
      radiographs: [],
      medications: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) {
    console.log('Modal cerrado, isOpen:', isOpen);
    return null;
  }
  console.log('Modal abierto, isOpen:', isOpen);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Nueva Evaluación Clínica
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información General */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Información General
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4 inline mr-1" />
                  Profesional *
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
                  Tipo de Tratamiento *
                </label>
                <select
                  name="treatment"
                  required
                  value={formData.treatment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar tratamiento</option>
                  {treatments.map((treatment) => (
                    <option key={treatment} value={treatment}>
                      {treatment}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Evaluación Clínica */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Stethoscope className="h-4 w-4 mr-2" />
              Evaluación Clínica
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Síntomas Reportados
                </label>
                <textarea
                  name="symptoms"
                  rows={3}
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Síntomas que presenta el paciente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico
                </label>
                <textarea
                  name="diagnosis"
                  rows={3}
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Diagnóstico clínico..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Tratamiento *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción detallada del procedimiento realizado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan de Tratamiento
                </label>
                <textarea
                  name="treatment_plan"
                  rows={3}
                  value={formData.treatment_plan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Plan de tratamiento futuro..."
                />
              </div>
            </div>
          </div>

          {/* Piezas Dentales */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Piezas Dentales Involucradas
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="text-xs text-center text-gray-600 font-medium col-span-8">Maxilar Superior</div>
                {['18', '17', '16', '15', '14', '13', '12', '11'].map((tooth) => (
                  <label key={tooth} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teeth.includes(tooth)}
                      onChange={() => handleTeethChange(tooth)}
                      className="mb-1"
                    />
                    <span className="text-xs">{tooth}</span>
                  </label>
                ))}
                {['21', '22', '23', '24', '25', '26', '27', '28'].map((tooth) => (
                  <label key={tooth} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teeth.includes(tooth)}
                      onChange={() => handleTeethChange(tooth)}
                      className="mb-1"
                    />
                    <span className="text-xs">{tooth}</span>
                  </label>
                ))}
              </div>
              
              <div className="grid grid-cols-8 gap-2">
                <div className="text-xs text-center text-gray-600 font-medium col-span-8">Maxilar Inferior</div>
                {['48', '47', '46', '45', '44', '43', '42', '41'].map((tooth) => (
                  <label key={tooth} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teeth.includes(tooth)}
                      onChange={() => handleTeethChange(tooth)}
                      className="mb-1"
                    />
                    <span className="text-xs">{tooth}</span>
                  </label>
                ))}
                {['31', '32', '33', '34', '35', '36', '37', '38'].map((tooth) => (
                  <label key={tooth} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teeth.includes(tooth)}
                      onChange={() => handleTeethChange(tooth)}
                      className="mb-1"
                    />
                    <span className="text-xs">{tooth}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Detalles del Procedimiento */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Detalles del Procedimiento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Anestesia
                </label>
                <select
                  name="anesthesia"
                  value={formData.anesthesia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar anestesia</option>
                  {anesthesiaTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próxima Cita
                </label>
                <input
                  type="date"
                  name="next_appointment"
                  value={formData.next_appointment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complicaciones o Eventos Adversos
                </label>
                <textarea
                  name="complications"
                  rows={2}
                  value={formData.complications}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Complicaciones durante el procedimiento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrucciones Post-operatorias
                </label>
                <textarea
                  name="post_operative_instructions"
                  rows={3}
                  value={formData.post_operative_instructions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Instrucciones para el paciente después del tratamiento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamentos Prescritos
                </label>
                <textarea
                  name="medications"
                  rows={2}
                  value={formData.medications}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Medicamentos prescritos, dosis y duración..."
                />
              </div>
            </div>
          </div>

          {/* Notas Adicionales */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Observaciones Adicionales
            </h4>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas adicionales, observaciones especiales..."
            />
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
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar Evaluación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEvaluationModal;