import React, { useState } from 'react';
import { X, Webhook, Link, Key, Shield, Globe, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface NewWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (webhookData: any) => void;
}

const NewWebhookModal: React.FC<NewWebhookModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    url: '',
    eventos: [] as string[],
    activo: true,
    metodo: 'POST' as 'POST' | 'PUT' | 'PATCH',
    timeout: 30,
    reintentos: 3,
    secreto: '',
    headers: [{ key: '', value: '' }],
    autenticacion: {
      tipo: 'none' as 'none' | 'bearer' | 'basic' | 'api_key',
      token: '',
      username: '',
      password: '',
      api_key: '',
      header_name: ''
    },
    filtros: {
      incluir_metadatos: true,
      solo_cambios: false,
      formatear_fechas: true
    },
    descripcion: ''
  });

  const eventosDisponibles = [
    { category: 'Pacientes', events: ['paciente.creado', 'paciente.actualizado', 'paciente.eliminado'] },
    { category: 'Citas', events: ['cita.agendada', 'cita.cancelada', 'cita.completada', 'cita.reagendada'] },
    { category: 'Tratamientos', events: ['tratamiento.iniciado', 'tratamiento.completado', 'tratamiento.cancelado'] },
    { category: 'Presupuestos', events: ['presupuesto.enviado', 'presupuesto.aceptado', 'presupuesto.rechazado'] },
    { category: 'Facturación', events: ['factura.creada', 'factura.enviada', 'factura.pagada', 'pago.recibido'] },
    { category: 'Sistema', events: ['usuario.creado', 'backup.completado', 'error.critico'] }
  ];

  const metodosHttp = [
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' }
  ];

  const tiposAuth = [
    { value: 'none', label: 'Sin autenticación' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'api_key', label: 'API Key' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const webhookData = {
      ...formData,
      id: `WH${String(Date.now()).slice(-3)}`,
      ultimaEjecucion: null,
      estado: 'pendiente',
      reintentos: 0,
      secreto: formData.secreto || `wh_secret_${Math.random().toString(36).substring(2, 15)}`
    };
    
    onSubmit(webhookData);
    onClose();
    
    // Reset form
    setFormData({
      nombre: '',
      url: '',
      eventos: [],
      activo: true,
      metodo: 'POST',
      timeout: 30,
      reintentos: 3,
      secreto: '',
      headers: [{ key: '', value: '' }],
      autenticacion: {
        tipo: 'none',
        token: '',
        username: '',
        password: '',
        api_key: '',
        header_name: ''
      },
      filtros: {
        incluir_metadatos: true,
        solo_cambios: false,
        formatear_fechas: true
      },
      descripcion: ''
    });
  };

  const toggleEvento = (evento: string) => {
    if (formData.eventos.includes(evento)) {
      setFormData({
        ...formData,
        eventos: formData.eventos.filter(e => e !== evento)
      });
    } else {
      setFormData({
        ...formData,
        eventos: [...formData.eventos, evento]
      });
    }
  };

  const addHeader = () => {
    setFormData({
      ...formData,
      headers: [...formData.headers, { key: '', value: '' }]
    });
  };

  const removeHeader = (index: number) => {
    setFormData({
      ...formData,
      headers: formData.headers.filter((_, i) => i !== index)
    });
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const updatedHeaders = [...formData.headers];
    updatedHeaders[index][field] = value;
    setFormData({
      ...formData,
      headers: updatedHeaders
    });
  };

  const generateSecret = () => {
    const secret = `wh_secret_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setFormData({
      ...formData,
      secreto: secret
    });
  };

  const renderAuthFields = () => {
    switch (formData.autenticacion.tipo) {
      case 'bearer':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bearer Token</label>
            <input
              type="text"
              value={formData.autenticacion.token}
              onChange={(e) => setFormData({
                ...formData,
                autenticacion: { ...formData.autenticacion, token: e.target.value }
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="your-bearer-token"
            />
          </div>
        );
      
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={formData.autenticacion.username}
                onChange={(e) => setFormData({
                  ...formData,
                  autenticacion: { ...formData.autenticacion, username: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={formData.autenticacion.password}
                onChange={(e) => setFormData({
                  ...formData,
                  autenticacion: { ...formData.autenticacion, password: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="password"
              />
            </div>
          </div>
        );
      
      case 'api_key':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Header</label>
              <input
                type="text"
                value={formData.autenticacion.header_name}
                onChange={(e) => setFormData({
                  ...formData,
                  autenticacion: { ...formData.autenticacion, header_name: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="X-API-Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={formData.autenticacion.api_key}
                onChange={(e) => setFormData({
                  ...formData,
                  autenticacion: { ...formData.autenticacion, api_key: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="your-api-key"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Nuevo Webhook</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuración Básica */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Configuración Básica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Webhook className="h-4 w-4 inline mr-1" />
                  Nombre del Webhook *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej: Notificaciones de Pacientes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Link className="h-4 w-4 inline mr-1" />
                  URL del Endpoint *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://api.ejemplo.com/webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción del propósito de este webhook"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Método HTTP</label>
                  <select
                    value={formData.metodo}
                    onChange={(e) => setFormData({ ...formData, metodo: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {metodosHttp.map(metodo => (
                      <option key={metodo.value} value={metodo.value}>{metodo.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (segundos)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reintentos</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.reintentos}
                  onChange={(e) => setFormData({ ...formData, reintentos: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Número de reintentos en caso de fallo</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                  <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
                  Activar webhook inmediatamente
                </label>
              </div>
            </div>

            {/* Eventos */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Eventos</h4>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {eventosDisponibles.map((categoria) => (
                  <div key={categoria.category}>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">{categoria.category}</h5>
                    <div className="space-y-2">
                      {categoria.events.map((evento) => (
                        <div key={evento} className="flex items-center">
                          <input
                            type="checkbox"
                            id={evento}
                            checked={formData.eventos.includes(evento)}
                            onChange={() => toggleEvento(evento)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={evento} className="ml-2 text-sm text-gray-700">{evento}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <strong>Seleccionados:</strong> {formData.eventos.length} eventos
                {formData.eventos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {formData.eventos.map((evento) => (
                      <span key={evento} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {evento}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seguridad y Autenticación */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Seguridad</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Key className="h-4 w-4 inline mr-1" />
                  Secreto del Webhook
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.secreto}
                    onChange={(e) => setFormData({ ...formData, secreto: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Secreto para verificar la autenticidad"
                  />
                  <button
                    type="button"
                    onClick={generateSecret}
                    className="px-3 py-2 bg-blue-100 text-blue-600 border border-l-0 border-gray-300 rounded-r-md hover:bg-blue-200"
                  >
                    Generar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Se enviará en el header X-Webhook-Signature</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Tipo de Autenticación
                </label>
                <select
                  value={formData.autenticacion.tipo}
                  onChange={(e) => setFormData({
                    ...formData,
                    autenticacion: { ...formData.autenticacion, tipo: e.target.value as any }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {tiposAuth.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              {renderAuthFields()}

              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Opciones de Filtrado</h5>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="incluir_metadatos"
                    checked={formData.filtros.incluir_metadatos}
                    onChange={(e) => setFormData({
                      ...formData,
                      filtros: { ...formData.filtros, incluir_metadatos: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="incluir_metadatos" className="ml-2 text-sm text-gray-700">
                    Incluir metadatos del sistema
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="solo_cambios"
                    checked={formData.filtros.solo_cambios}
                    onChange={(e) => setFormData({
                      ...formData,
                      filtros: { ...formData.filtros, solo_cambios: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="solo_cambios" className="ml-2 text-sm text-gray-700">
                    Solo enviar cuando hay cambios
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="formatear_fechas"
                    checked={formData.filtros.formatear_fechas}
                    onChange={(e) => setFormData({
                      ...formData,
                      filtros: { ...formData.filtros, formatear_fechas: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="formatear_fechas" className="ml-2 text-sm text-gray-700">
                    Formatear fechas como ISO 8601
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Headers Personalizados */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Headers Personalizados</h4>
              <button
                type="button"
                onClick={addHeader}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Header
              </button>
            </div>

            {formData.headers.map((header, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del header"
                  />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Valor"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-r-md border border-l-0 border-gray-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Información Importante */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>El webhook debe responder con código HTTP 2xx para considerarse exitoso</li>
                  <li>Los reintentos se realizan con backoff exponencial</li>
                  <li>El payload se enviará en formato JSON en el body de la petición</li>
                  <li>Se incluirá un header User-Agent: "ClinicApp-Webhook/1.0"</li>
                  <li>Los eventos se procesarán de forma asíncrona</li>
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
              disabled={formData.eventos.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Webhook className="h-4 w-4 inline mr-1" />
              Crear Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWebhookModal;