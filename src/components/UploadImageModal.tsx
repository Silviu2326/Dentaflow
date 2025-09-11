import React, { useState, useRef } from 'react';
import { X, Upload, Image, User, Calendar, Tag, Shield, Camera, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (imageData: any) => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    pacienteId: '',
    pacienteNombre: '',
    tipo: 'antes',
    categoria: 'Estética Dental',
    tratamiento: '',
    fechaCaptura: new Date().toISOString().split('T')[0],
    profesional: '',
    descripcion: '',
    tags: [] as string[],
    permisos: {
      usoInterno: true,
      usoMarketing: false,
      usoRedes: false,
      consentimientoFirmado: false,
      fechaConsentimiento: '',
    },
    metadata: {
      dispositivo: '',
      observaciones: '',
    }
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newTag, setNewTag] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const profesionales = [
    'Dr. Martín García',
    'Dra. Ana López',
    'Dr. Carlos Ruiz',
    'Dra. María Fernández',
    'Dr. Pedro Sánchez',
    'Dra. Carmen Torres',
    'Higienista María',
    'Higienista Juan'
  ];

  const categorias = [
    'Estética Dental',
    'Implantología',
    'Ortodoncia',
    'Periodoncia',
    'Diagnóstico',
    'Endodoncia',
    'Cirugía Oral',
    'Prótesis',
    'Odontopediatría'
  ];

  const tratamientos = [
    'Blanqueamiento Dental',
    'Implante Dental',
    'Ortodoncia Invisible',
    'Corona de Porcelana',
    'Limpieza Dental',
    'Endodoncia',
    'Extracción',
    'Carillas Dentales',
    'Tratamiento Periodontal',
    'Brackets',
    'Prótesis Completa',
    'Radiografía Panorámica',
    'Urgencia Dental'
  ];

  const dispositivos = [
    'Canon EOS R5',
    'Nikon D850',
    'Sony Alpha 7R IV',
    'Cámara Intraoral HD',
    'iPhone 14 Pro',
    'Planmeca ProMax 3D',
    'Carestream CS 8100',
    'Smartphone Android',
    'Otro'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.activeElement) {
      e.preventDefault();
      addTag();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Por favor selecciona al menos una imagen');
      return;
    }

    const imageData = {
      ...formData,
      pacienteId: `P${String(pacientes.indexOf(formData.pacienteNombre) + 1).padStart(3, '0')}`,
      files: selectedFiles,
      fechaSubida: new Date().toISOString(),
      id: `img_${Date.now()}`,
    };

    onSubmit(imageData);
    
    // Reset form
    setFormData({
      pacienteId: '',
      pacienteNombre: '',
      tipo: 'antes',
      categoria: 'Estética Dental',
      tratamiento: '',
      fechaCaptura: new Date().toISOString().split('T')[0],
      profesional: '',
      descripcion: '',
      tags: [],
      permisos: {
        usoInterno: true,
        usoMarketing: false,
        usoRedes: false,
        consentimientoFirmado: false,
        fechaConsentimiento: '',
      },
      metadata: {
        dispositivo: '',
        observaciones: '',
      }
    });
    setSelectedFiles([]);
    setNewTag('');
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-blue-600" />
            Subir Imágenes Clínicas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subida de Archivos */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              Selección de Imágenes
            </h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-100' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arrastra y suelta las imágenes aquí
              </p>
              <p className="text-gray-600 mb-4">
                o haz clic para seleccionar archivos
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Seleccionar Imágenes
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                Formatos soportados: JPG, PNG, GIF, WEBP. Máximo 10MB por imagen.
              </p>
            </div>

            {/* Lista de archivos seleccionados */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-900">Archivos Seleccionados ({selectedFiles.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <Image className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Información del Paciente */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
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
                  onChange={(e) => setFormData(prev => ({ ...prev, pacienteNombre: e.target.value }))}
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
                  Profesional Responsable *
                </label>
                <select
                  required
                  value={formData.profesional}
                  onChange={(e) => setFormData(prev => ({ ...prev, profesional: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar profesional</option>
                  {profesionales.map(profesional => (
                    <option key={profesional} value={profesional}>{profesional}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Clasificación */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-yellow-600" />
              Clasificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Imagen *
                </label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="antes">Antes</option>
                  <option value="despues">Después</option>
                  <option value="progreso">Progreso</option>
                  <option value="radiografia">Radiografía</option>
                  <option value="intraoral">Intraoral</option>
                </select>
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
                  Tratamiento *
                </label>
                <select
                  required
                  value={formData.tratamiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, tratamiento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar tratamiento</option>
                  {tratamientos.map(tratamiento => (
                    <option key={tratamiento} value={tratamiento}>{tratamiento}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha de Captura *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaCaptura}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaCaptura: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada de las imágenes"
              />
            </div>

            {/* Tags */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas (Tags)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agregar etiqueta"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Permisos de Uso */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              Permisos de Uso
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.usoInterno}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    permisos: { ...prev.permisos, usoInterno: e.target.checked }
                  }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Uso interno de la clínica</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.usoMarketing}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    permisos: { ...prev.permisos, usoMarketing: e.target.checked }
                  }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Uso para marketing y publicidad</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.usoRedes}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    permisos: { ...prev.permisos, usoRedes: e.target.checked }
                  }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Uso en redes sociales</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.permisos.consentimientoFirmado}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    permisos: { ...prev.permisos, consentimientoFirmado: e.target.checked }
                  }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Consentimiento informado firmado</span>
              </label>
              
              {formData.permisos.consentimientoFirmado && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Consentimiento
                  </label>
                  <input
                    type="date"
                    value={formData.permisos.fechaConsentimiento}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      permisos: { ...prev.permisos, fechaConsentimiento: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Alerta de permisos */}
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Importante sobre permisos</p>
                  <p className="text-sm text-yellow-700">
                    Para usar las imágenes con fines de marketing o redes sociales es obligatorio tener 
                    el consentimiento informado firmado por el paciente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadatos Técnicos */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-purple-600" />
              Metadatos Técnicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispositivo de Captura
                </label>
                <select
                  value={formData.metadata.dispositivo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    metadata: { ...prev.metadata, dispositivo: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar dispositivo</option>
                  {dispositivos.map(dispositivo => (
                    <option key={dispositivo} value={dispositivo}>{dispositivo}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones Técnicas
                </label>
                <textarea
                  value={formData.metadata.observaciones}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    metadata: { ...prev.metadata, observaciones: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Configuraciones de cámara, iluminación, etc."
                />
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-gray-600" />
              Resumen de Subida
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Imágenes:</span>
                <div className="text-lg font-semibold">{selectedFiles.length}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Paciente:</span>
                <div className="text-sm">{formData.pacienteNombre || 'Sin seleccionar'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tipo:</span>
                <div className="text-sm capitalize">{formData.tipo}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Categoría:</span>
                <div className="text-sm">{formData.categoria}</div>
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
              disabled={selectedFiles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subir Imágenes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadImageModal;