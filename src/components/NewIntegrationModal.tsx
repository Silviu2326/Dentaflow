import React, { useState } from 'react';
import { X, Plus, Trash2, Key, Shield, Database, Cloud, Settings, Link as LinkIcon } from 'lucide-react';

interface NewIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (integrationData: any) => void;
}

const NewIntegrationModal: React.FC<NewIntegrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'contabilidad' as 'contabilidad' | 'firma_digital' | 'tpv' | 'telefonia' | 'bi' | 'otros',
    proveedor: '',
    descripcion: '',
    version: '',
    configuracion: {
      tipo_auth: 'api_key' as 'api_key' | 'oauth2' | 'basic_auth' | 'bearer_token',
      endpoint: '',
      api_key: '',
      username: '',
      password: '',
      client_id: '',
      client_secret: '',
      token: '',
      servidor: '',
      puerto: '',
      base_datos: '',
      timeout: '30',
      ssl: true,
      webhook_url: '',
      parametros_adicionales: [] as { clave: string; valor: string }[]
    }
  });

  const categorias = [
    { value: 'contabilidad', label: 'Contabilidad' },
    { value: 'firma_digital', label: 'Firma Digital' },
    { value: 'tpv', label: 'TPV / Pagos' },
    { value: 'telefonia', label: 'Telefonía' },
    { value: 'bi', label: 'Business Intelligence' },
    { value: 'otros', label: 'Otros' }
  ];

  const tiposAuth = [
    { value: 'api_key', label: 'API Key' },
    { value: 'oauth2', label: 'OAuth 2.0' },
    { value: 'basic_auth', label: 'Basic Auth' },
    { value: 'bearer_token', label: 'Bearer Token' }
  ];

  const proveedoresComunes = {
    contabilidad: ['A3 Software', 'Sage', 'ContaPlus', 'FacturaScripts', 'Holded'],
    firma_digital: ['DocuSign', 'Adobe Sign', 'Signaturit', 'ViafirMA', 'Uanataca'],
    tpv: ['Stripe', 'PayPal', 'Redsys', 'BBVA', 'CaixaBank', 'Square'],
    telefonia: ['Asterisk', 'FreePBX', '3CX', 'Avaya', 'Cisco'],
    bi: ['Power BI', 'Tableau', 'Qlik', 'Looker', 'Metabase'],
    otros: ['Zapier', 'Microsoft Graph', 'Google Workspace', 'Slack']
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      estado: 'configurando',
      ultimaSync: new Date().toISOString()
    });
    onClose();
    
    setFormData({
      nombre: '',
      categoria: 'contabilidad',
      proveedor: '',
      descripcion: '',
      version: '',
      configuracion: {
        tipo_auth: 'api_key',
        endpoint: '',
        api_key: '',
        username: '',
        password: '',
        client_id: '',
        client_secret: '',
        token: '',
        servidor: '',
        puerto: '',
        base_datos: '',
        timeout: '30',
        ssl: true,
        webhook_url: '',
        parametros_adicionales: []
      }
    });
  };

  const addParametro = () => {
    setFormData({
      ...formData,
      configuracion: {
        ...formData.configuracion,
        parametros_adicionales: [...formData.configuracion.parametros_adicionales, { clave: '', valor: '' }]
      }
    });
  };

  const removeParametro = (index: number) => {
    setFormData({
      ...formData,
      configuracion: {
        ...formData.configuracion,
        parametros_adicionales: formData.configuracion.parametros_adicionales.filter((_, i) => i !== index)
      }
    });
  };

  const updateParametro = (index: number, field: 'clave' | 'valor', value: string) => {
    const updatedParametros = [...formData.configuracion.parametros_adicionales];
    updatedParametros[index][field] = value;
    setFormData({
      ...formData,
      configuracion: {
        ...formData.configuracion,
        parametros_adicionales: updatedParametros
      }
    });
  };

  const renderAuthFields = () => {
    switch (formData.configuracion.tipo_auth) {
      case 'api_key':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="h-4 w-4 inline mr-1" />
              API Key
            </label>
            <input
              type="password"
              value={formData.configuracion.api_key}
              onChange={(e) => setFormData({
                ...formData,
                configuracion: { ...formData.configuracion, api_key: e.target.value }
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu API Key"
            />
          </div>
        );
      
      case 'oauth2':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                <input
                  type="text"
                  value={formData.configuracion.client_id}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuracion: { ...formData.configuracion, client_id: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                <input
                  type="password"
                  value={formData.configuracion.client_secret}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuracion: { ...formData.configuracion, client_secret: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 'basic_auth':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={formData.configuracion.username}
                onChange={(e) => setFormData({
                  ...formData,
                  configuracion: { ...formData.configuracion, username: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={formData.configuracion.password}
                onChange={(e) => setFormData({
                  ...formData,
                  configuracion: { ...formData.configuracion, password: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );
      
      case 'bearer_token':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="h-4 w-4 inline mr-1" />
              Bearer Token
            </label>
            <input
              type="password"
              value={formData.configuracion.token}
              onChange={(e) => setFormData({
                ...formData,
                configuracion: { ...formData.configuracion, token: e.target.value }
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bearer token"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Nueva Integración</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Información Básica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Integración *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej: Sage 50 Contabilidad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
                <input
                  type="text"
                  list="proveedores"
                  required
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del proveedor"
                />
                <datalist id="proveedores">
                  {proveedoresComunes[formData.categoria]?.map(proveedor => (
                    <option key={proveedor} value={proveedor} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Versión</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej: 2.4.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción de la integración y sus funcionalidades"
                />
              </div>
            </div>

            {/* Configuración Técnica */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Configuración Técnica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="h-4 w-4 inline mr-1" />
                  Endpoint / URL Base
                </label>
                <input
                  type="url"
                  value={formData.configuracion.endpoint}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuracion: { ...formData.configuracion, endpoint: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://api.ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Autenticación</label>
                <select
                  value={formData.configuracion.tipo_auth}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuracion: { ...formData.configuracion, tipo_auth: e.target.value as any }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {tiposAuth.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              {renderAuthFields()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Database className="h-4 w-4 inline mr-1" />
                    Servidor
                  </label>
                  <input
                    type="text"
                    value={formData.configuracion.servidor}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracion: { ...formData.configuracion, servidor: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="localhost o IP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Puerto</label>
                  <input
                    type="number"
                    value={formData.configuracion.puerto}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracion: { ...formData.configuracion, puerto: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="8080"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base de Datos</label>
                <input
                  type="text"
                  value={formData.configuracion.base_datos}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuracion: { ...formData.configuracion, base_datos: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la base de datos"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (segundos)</label>
                  <input
                    type="number"
                    value={formData.configuracion.timeout}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracion: { ...formData.configuracion, timeout: e.target.value }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="30"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ssl"
                    checked={formData.configuracion.ssl}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuracion: { ...formData.configuracion, ssl: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ssl" className="ml-2 block text-sm text-gray-900">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Usar SSL/TLS
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Cloud className="h-4 w-4 inline mr-1" />
                  Webhook URL (opcional)
                </label>
                <input
                  type="url"
                  value={formData.configuracion.webhook_url}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuracion: { ...formData.configuracion, webhook_url: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://mi-servidor.com/webhook"
                />
              </div>
            </div>
          </div>

          {/* Parámetros Adicionales */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Parámetros Adicionales</h4>
              <button
                type="button"
                onClick={addParametro}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Parámetro
              </button>
            </div>

            {formData.configuracion.parametros_adicionales.map((parametro, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <input
                    type="text"
                    value={parametro.clave}
                    onChange={(e) => updateParametro(index, 'clave', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del parámetro"
                  />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={parametro.valor}
                    onChange={(e) => updateParametro(index, 'valor', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Valor"
                  />
                  <button
                    type="button"
                    onClick={() => removeParametro(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-r-md border border-l-0 border-gray-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
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
              <Settings className="h-4 w-4 inline mr-1" />
              Crear Integración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIntegrationModal;