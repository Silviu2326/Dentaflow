import React, { useState } from 'react';
import { X, FileText, Tag, Eye, Save, AlertTriangle } from 'lucide-react';

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (templateData: any) => void;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    version: '1.0',
    contenido: '',
    activo: true,
    obligatorio: false,
    riesgos: '',
    beneficios: '',
    alternativas: '',
    instrucciones_previas: '',
    instrucciones_posteriores: '',
    contacto_emergencia: '',
    validez_dias: 30,
    requiere_testigo: false,
    notas_internas: ''
  });

  const [previewMode, setPreviewMode] = useState(false);

  const categorias = [
    'General',
    'Cirugía',
    'Ortodoncia', 
    'Implantología',
    'Endodoncia',
    'Periodoncia',
    'Estética',
    'Emergencia'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaModificacion: new Date().toISOString()
    });
    setFormData({
      nombre: '',
      categoria: '',
      version: '1.0',
      contenido: '',
      activo: true,
      obligatorio: false,
      riesgos: '',
      beneficios: '',
      alternativas: '',
      instrucciones_previas: '',
      instrucciones_posteriores: '',
      contacto_emergencia: '',
      validez_dias: 30,
      requiere_testigo: false,
      notas_internas: ''
    });
    onClose();
  };

  const generateTemplate = () => {
    const template = `CONSENTIMIENTO INFORMADO - ${formData.nombre.toUpperCase()}

Por medio del presente documento, yo _________________________, con DNI/NIE _____________, 
después de haber sido debidamente informado/a por el Dr./Dra. ___________________ sobre 
el tratamiento de ${formData.nombre.toLowerCase()}, declaro que:

${formData.instrucciones_previas ? `INSTRUCCIONES PREVIAS AL TRATAMIENTO:
${formData.instrucciones_previas}

` : ''}NATURALEZA DEL TRATAMIENTO:
He sido informado/a sobre la naturaleza del tratamiento propuesto y entiendo que:
${formData.contenido || '[Descripción del tratamiento]'}

${formData.riesgos ? `RIESGOS Y COMPLICACIONES:
He sido informado/a de los siguientes riesgos y complicaciones:
${formData.riesgos}

` : ''}${formData.beneficios ? `BENEFICIOS ESPERADOS:
Los beneficios esperados del tratamiento incluyen:
${formData.beneficios}

` : ''}${formData.alternativas ? `ALTERNATIVAS DE TRATAMIENTO:
Se me han explicado las siguientes alternativas:
${formData.alternativas}

` : ''}${formData.instrucciones_posteriores ? `INSTRUCCIONES POST-TRATAMIENTO:
${formData.instrucciones_posteriores}

` : ''}${formData.contacto_emergencia ? `CONTACTO DE EMERGENCIA:
En caso de emergencia, contactar: ${formData.contacto_emergencia}

` : ''}CONSENTIMIENTO:
• Entiendo completamente la información proporcionada
• He tenido la oportunidad de hacer preguntas que han sido respondidas satisfactoriamente
• Comprendo que ningún tratamiento médico/dental tiene garantía de éxito al 100%
• Autorizo al profesional a realizar el tratamiento descrito
${formData.requiere_testigo ? '• Este consentimiento ha sido firmado en presencia de un testigo' : ''}

Fecha: ___________    Firma del paciente: ________________________

${formData.requiere_testigo ? 'Firma del testigo: ________________________' : ''}

Firma del profesional: ________________________

---
Versión: ${formData.version}
Válido por: ${formData.validez_dias} días
Categoría: ${formData.categoria}`;

    setFormData(prev => ({
      ...prev,
      contenido: template
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Nueva Plantilla de Consentimiento
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Editar' : 'Vista previa'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {!previewMode ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Básica */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Información Básica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Plantilla *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Consentimiento Cirugía Oral"
                  />
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
                    Versión
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validez (días)
                  </label>
                  <input
                    type="number"
                    name="validez_dias"
                    value={formData.validez_dias}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Plantilla activa</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="obligatorio"
                      checked={formData.obligatorio}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Obligatorio</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="requiere_testigo"
                      checked={formData.requiere_testigo}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requiere testigo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generador Automático */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-md font-medium text-blue-900 mb-2">Generador Automático de Plantilla</h4>
              <p className="text-sm text-blue-700 mb-4">
                Complete los campos siguientes y haga clic en "Generar Plantilla" para crear automáticamente el contenido.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Riesgos y Complicaciones
                  </label>
                  <textarea
                    name="riesgos"
                    rows={3}
                    value={formData.riesgos}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enumere los riesgos asociados al tratamiento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Beneficios Esperados
                  </label>
                  <textarea
                    name="beneficios"
                    rows={3}
                    value={formData.beneficios}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Beneficios esperados del tratamiento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Alternativas de Tratamiento
                  </label>
                  <textarea
                    name="alternativas"
                    rows={2}
                    value={formData.alternativas}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alternativas disponibles..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Contacto de Emergencia
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia"
                    value={formData.contacto_emergencia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dr. [Nombre] - Tel: [teléfono]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Instrucciones Pre-tratamiento
                  </label>
                  <textarea
                    name="instrucciones_previas"
                    rows={2}
                    value={formData.instrucciones_previas}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Instrucciones antes del tratamiento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Instrucciones Post-tratamiento
                  </label>
                  <textarea
                    name="instrucciones_posteriores"
                    rows={2}
                    value={formData.instrucciones_posteriores}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cuidados después del tratamiento..."
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={generateTemplate}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar Plantilla Automáticamente
              </button>
            </div>

            {/* Contenido Principal */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Contenido del Consentimiento
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto del Consentimiento *
                </label>
                <textarea
                  name="contenido"
                  rows={12}
                  required
                  value={formData.contenido}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Escriba aquí el contenido completo del consentimiento informado o use el generador automático..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  El contenido debe incluir toda la información legal requerida según la normativa vigente.
                </p>
              </div>
            </div>

            {/* Notas Internas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Internas (no visibles para el paciente)
              </label>
              <textarea
                name="notas_internas"
                rows={3}
                value={formData.notas_internas}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notas para el equipo médico, instrucciones especiales, etc..."
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
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Crear Plantilla
              </button>
            </div>
          </form>
        ) : (
          /* Vista Previa */
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Vista Previa del Consentimiento</h4>
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-serif leading-relaxed">
                  {formData.contenido || 'No hay contenido para mostrar. Complete los campos y genere la plantilla.'}
                </pre>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver a Editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTemplateModal;