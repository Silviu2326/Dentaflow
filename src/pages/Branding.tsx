import React, { useState } from 'react';
import { Palette, Upload, Eye, Download, Globe, Mail, FileText, Image, Save } from 'lucide-react';

interface ConfiguracionBranding {
  logoEmpresa: string;
  logoSecundario: string;
  favicon: string;
  colorPrimario: string;
  colorSecundario: string;
  colorAccento: string;
  tipoLetraHeadings: string;
  tipoLetraBody: string;
  dominioPersonalizado: string;
  subdominioPortal: string;
}

interface PlantillaEmail {
  id: string;
  nombre: string;
  tipo: 'cita' | 'recordatorio' | 'presupuesto' | 'factura' | 'marketing' | 'bienvenida';
  asunto: string;
  contenidoHtml: string;
  variables: string[];
  activa: boolean;
  ultimaModificacion: string;
}

interface PlantillaDocumento {
  id: string;
  nombre: string;
  tipo: 'presupuesto' | 'factura' | 'consentimiento' | 'receta' | 'informe' | 'certificado';
  formato: 'A4' | 'A5' | 'Carta';
  orientacion: 'vertical' | 'horizontal';
  contenidoHtml: string;
  css: string;
  activa: boolean;
  version: string;
}

export default function Branding() {
  const [activeTab, setActiveTab] = useState<'identidad' | 'dominios' | 'plantillas-email' | 'plantillas-doc'>('identidad');
  const [configuracion, setConfiguracion] = useState<ConfiguracionBranding>({
    logoEmpresa: '/logos/clinica-logo.png',
    logoSecundario: '/logos/clinica-iso.png',
    favicon: '/logos/favicon.ico',
    colorPrimario: '#2563eb',
    colorSecundario: '#64748b',
    colorAccento: '#059669',
    tipoLetraHeadings: 'Inter',
    tipoLetraBody: 'Inter',
    dominioPersonalizado: 'mi-clinica.com',
    subdominioPortal: 'portal'
  });

  const plantillasEmail: PlantillaEmail[] = [
    {
      id: 'EMAIL001',
      nombre: 'Confirmación de Cita',
      tipo: 'cita',
      asunto: 'Confirmación de su cita - {{fecha}} a las {{hora}}',
      contenidoHtml: '<div>Estimado/a {{paciente_nombre}}, confirmamos su cita...</div>',
      variables: ['paciente_nombre', 'fecha', 'hora', 'profesional', 'tratamiento'],
      activa: true,
      ultimaModificacion: '2024-01-15'
    },
    {
      id: 'EMAIL002',
      nombre: 'Recordatorio 24h',
      tipo: 'recordatorio',
      asunto: 'Recordatorio: Cita mañana a las {{hora}}',
      contenidoHtml: '<div>No olvide su cita de mañana...</div>',
      variables: ['paciente_nombre', 'fecha', 'hora', 'profesional'],
      activa: true,
      ultimaModificacion: '2024-01-12'
    },
    {
      id: 'EMAIL003',
      nombre: 'Envío de Presupuesto',
      tipo: 'presupuesto',
      asunto: 'Su presupuesto personalizado',
      contenidoHtml: '<div>Adjunto encontrará su presupuesto...</div>',
      variables: ['paciente_nombre', 'total', 'tratamientos', 'validez'],
      activa: true,
      ultimaModificacion: '2024-01-10'
    }
  ];

  const plantillasDocumento: PlantillaDocumento[] = [
    {
      id: 'DOC001',
      nombre: 'Presupuesto Estándar',
      tipo: 'presupuesto',
      formato: 'A4',
      orientacion: 'vertical',
      contenidoHtml: '<div class="presupuesto">...</div>',
      css: '.presupuesto { font-family: Arial; }',
      activa: true,
      version: 'v2.1'
    },
    {
      id: 'DOC002',
      nombre: 'Factura Oficial',
      tipo: 'factura',
      formato: 'A4',
      orientacion: 'vertical',
      contenidoHtml: '<div class="factura">...</div>',
      css: '.factura { color: #000; }',
      activa: true,
      version: 'v1.5'
    }
  ];

  const coloresPredefinidos = [
    '#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#ca8a04',
    '#4338ca', '#7e22ce', '#0d9488', '#be123c', '#c2410c', '#a16207'
  ];

  const tiposLetra = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
    'Source Sans Pro', 'Nunito', 'Playfair Display', 'Crimson Text'
  ];

  const handleColorChange = (campo: string, color: string) => {
    setConfiguracion(prev => ({ ...prev, [campo]: color }));
  };

  const handleFileUpload = (campo: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // En una implementación real, subirías el archivo al servidor
      const url = URL.createObjectURL(file);
      setConfiguracion(prev => ({ ...prev, [campo]: url }));
    }
  };

  const previewBranding = () => {
    window.open('/preview-branding', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branding</h1>
          <p className="text-gray-600">Personalización de logos, dominios, colores y plantillas</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={previewBranding}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Vista Previa</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('identidad')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'identidad'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="h-4 w-4 inline mr-2" />
          Identidad Visual
        </button>
        <button
          onClick={() => setActiveTab('dominios')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'dominios'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Globe className="h-4 w-4 inline mr-2" />
          Dominios
        </button>
        <button
          onClick={() => setActiveTab('plantillas-email')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'plantillas-email'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail className="h-4 w-4 inline mr-2" />
          Plantillas Email
        </button>
        <button
          onClick={() => setActiveTab('plantillas-doc')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'plantillas-doc'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Plantillas Documentos
        </button>
      </div>

      {activeTab === 'identidad' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logos</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Principal
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                      {configuracion.logoEmpresa ? (
                        <img src={configuracion.logoEmpresa} alt="Logo" className="max-w-full max-h-full" />
                      ) : (
                        <Image className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('logoEmpresa', e)}
                        className="hidden"
                        id="logo-principal"
                      />
                      <label
                        htmlFor="logo-principal"
                        className="bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Subir Logo</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Secundario/Isotipo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                      {configuracion.logoSecundario ? (
                        <img src={configuracion.logoSecundario} alt="Logo Secundario" className="max-w-full max-h-full" />
                      ) : (
                        <Image className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('logoSecundario', e)}
                        className="hidden"
                        id="logo-secundario"
                      />
                      <label
                        htmlFor="logo-secundario"
                        className="bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Subir Logo</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-2 border-gray-200 rounded flex items-center justify-center bg-gray-50">
                      {configuracion.favicon ? (
                        <img src={configuracion.favicon} alt="Favicon" className="max-w-full max-h-full" />
                      ) : (
                        <Image className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".ico,.png"
                        onChange={(e) => handleFileUpload('favicon', e)}
                        className="hidden"
                        id="favicon"
                      />
                      <label
                        htmlFor="favicon"
                        className="bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Subir Favicon</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">ICO, PNG 32x32px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colores */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paleta de Colores</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Primario
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={configuracion.colorPrimario}
                      onChange={(e) => handleColorChange('colorPrimario', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={configuracion.colorPrimario}
                      onChange={(e) => handleColorChange('colorPrimario', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm font-mono flex-1"
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {coloresPredefinidos.slice(0, 6).map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange('colorPrimario', color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={configuracion.colorSecundario}
                      onChange={(e) => handleColorChange('colorSecundario', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={configuracion.colorSecundario}
                      onChange={(e) => handleColorChange('colorSecundario', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm font-mono flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Acento
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={configuracion.colorAccento}
                      onChange={(e) => handleColorChange('colorAccento', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={configuracion.colorAccento}
                      onChange={(e) => handleColorChange('colorAccento', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm font-mono flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tipografía */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipografía</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuente para Títulos
                </label>
                <select
                  value={configuracion.tipoLetraHeadings}
                  onChange={(e) => setConfiguracion(prev => ({ ...prev, tipoLetraHeadings: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {tiposLetra.map(fuente => (
                    <option key={fuente} value={fuente} style={{ fontFamily: fuente }}>
                      {fuente}
                    </option>
                  ))}
                </select>
                <div className="mt-3 p-3 bg-gray-50 rounded" style={{ fontFamily: configuracion.tipoLetraHeadings }}>
                  <h1 className="text-xl font-bold">Título de Ejemplo</h1>
                  <h2 className="text-lg font-semibold">Subtítulo de Ejemplo</h2>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuente para Texto
                </label>
                <select
                  value={configuracion.tipoLetraBody}
                  onChange={(e) => setConfiguracion(prev => ({ ...prev, tipoLetraBody: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {tiposLetra.map(fuente => (
                    <option key={fuente} value={fuente} style={{ fontFamily: fuente }}>
                      {fuente}
                    </option>
                  ))}
                </select>
                <div className="mt-3 p-3 bg-gray-50 rounded" style={{ fontFamily: configuracion.tipoLetraBody }}>
                  <p>Este es un párrafo de ejemplo que muestra cómo se ve el texto del cuerpo con la fuente seleccionada.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dominios' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Dominios</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dominio Personalizado Principal
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">https://</span>
                  <input
                    type="text"
                    value={configuracion.dominioPersonalizado}
                    onChange={(e) => setConfiguracion(prev => ({ ...prev, dominioPersonalizado: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="mi-clinica.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Dominio principal para acceder a la aplicación
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdominio del Portal Paciente
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">https://</span>
                  <input
                    type="text"
                    value={configuracion.subdominioPortal}
                    onChange={(e) => setConfiguracion(prev => ({ ...prev, subdominioPortal: e.target.value }))}
                    className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="portal"
                  />
                  <span className="text-sm text-gray-500">.{configuracion.dominioPersonalizado}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL del portal para pacientes: https://{configuracion.subdominioPortal}.{configuracion.dominioPersonalizado}
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Estado de SSL/TLS</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">mi-clinica.com</div>
                      <div className="text-sm text-green-600">Certificado válido hasta: 15/12/2024</div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Activo
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">portal.mi-clinica.com</div>
                      <div className="text-sm text-green-600">Certificado válido hasta: 15/12/2024</div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Activo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plantillas-email' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Nueva Plantilla</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variables
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plantillasEmail.map((plantilla) => (
                    <tr key={plantilla.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plantilla.nombre}</div>
                          <div className="text-sm text-gray-500">{plantilla.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plantilla.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{plantilla.asunto}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {plantilla.variables.slice(0, 3).map((variable, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {variable}
                            </span>
                          ))}
                          {plantilla.variables.length > 3 && (
                            <span className="text-xs text-gray-500">+{plantilla.variables.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plantilla.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plantilla.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Editar</button>
                          <button className="text-green-600 hover:text-green-900">Vista Previa</button>
                          <button className="text-purple-600 hover:text-purple-900">Duplicar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plantillas-doc' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Nueva Plantilla</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orientación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Versión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plantillasDocumento.map((plantilla) => (
                    <tr key={plantilla.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plantilla.nombre}</div>
                          <div className="text-sm text-gray-500">{plantilla.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {plantilla.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{plantilla.formato}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{plantilla.orientacion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{plantilla.version}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plantilla.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plantilla.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Editar</button>
                          <button className="text-green-600 hover:text-green-900">Vista Previa</button>
                          <button className="text-orange-600 hover:text-orange-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}