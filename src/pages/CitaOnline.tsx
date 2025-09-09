import React, { useState } from 'react';
import { Save, Eye, Edit, Globe, Clock, MapPin, Shield, Palette, Code } from 'lucide-react';

interface SedeConfig {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  activa: boolean;
  configuracion: {
    duracionDefecto: number;
    horariosDisponibles: {
      [key: string]: { inicio: string; fin: string; activo: boolean };
    };
    anticipacionMinima: number;
    anticipacionMaxima: number;
    profesionalesDisponibles: string[];
    tratamientosPermitidos: string[];
    requiereCaptcha: boolean;
    textoLegal: string;
    landing: {
      titulo: string;
      subtitulo: string;
      descripcion: string;
      colorPrimario: string;
      colorSecundario: string;
      logo?: string;
      imagen?: string;
      mostrarPrecios: boolean;
      mostrarProfesionales: boolean;
      camposOpcionales: string[];
      camposObligatorios: string[];
    };
  };
}

const CitaOnline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'configuracion' | 'landing' | 'preview'>('configuracion');
  const [selectedSede, setSelectedSede] = useState<string>('sede1');

  const [sedes, setSedes] = useState<SedeConfig[]>([
    {
      id: 'sede1',
      nombre: 'Clínica Centro',
      direccion: 'Calle Mayor 123, 28001 Madrid',
      telefono: '+34 911 234 567',
      activa: true,
      configuracion: {
        duracionDefecto: 30,
        horariosDisponibles: {
          lunes: { inicio: '09:00', fin: '18:00', activo: true },
          martes: { inicio: '09:00', fin: '18:00', activo: true },
          miércoles: { inicio: '09:00', fin: '18:00', activo: true },
          jueves: { inicio: '09:00', fin: '18:00', activo: true },
          viernes: { inicio: '09:00', fin: '15:00', activo: true },
          sábado: { inicio: '09:00', fin: '13:00', activo: false },
          domingo: { inicio: '09:00', fin: '13:00', activo: false }
        },
        anticipacionMinima: 2, // horas
        anticipacionMaxima: 30, // días
        profesionalesDisponibles: ['Dr. García', 'Dra. Martín'],
        tratamientosPermitidos: ['Consulta', 'Limpieza', 'Revisión', 'Urgencia'],
        requiereCaptcha: true,
        textoLegal: 'Al solicitar una cita acepta nuestras condiciones de uso y política de privacidad. La cita quedará confirmada tras la verificación telefónica.',
        landing: {
          titulo: 'Pide tu Cita Online',
          subtitulo: 'Reserva tu consulta dental de forma rápida y segura',
          descripcion: 'Solicita tu cita en nuestra clínica dental. Nuestro equipo de profesionales te ofrecerá la mejor atención.',
          colorPrimario: '#2563eb',
          colorSecundario: '#1e40af',
          mostrarPrecios: false,
          mostrarProfesionales: true,
          camposOpcionales: ['observaciones', 'preferencia_horario'],
          camposObligatorios: ['nombre', 'email', 'telefono', 'tipo_cita']
        }
      }
    },
    {
      id: 'sede2',
      nombre: 'Clínica Norte',
      direccion: 'Avenida de la Paz 45, 28003 Madrid',
      telefono: '+34 911 345 678',
      activa: false,
      configuracion: {
        duracionDefecto: 45,
        horariosDisponibles: {
          lunes: { inicio: '08:00', fin: '19:00', activo: true },
          martes: { inicio: '08:00', fin: '19:00', activo: true },
          miércoles: { inicio: '08:00', fin: '19:00', activo: true },
          jueves: { inicio: '08:00', fin: '19:00', activo: true },
          viernes: { inicio: '08:00', fin: '16:00', activo: true },
          sábado: { inicio: '09:00', fin: '14:00', activo: true },
          domingo: { inicio: '09:00', fin: '13:00', activo: false }
        },
        anticipacionMinima: 4,
        anticipacionMaxima: 45,
        profesionalesDisponibles: ['Dr. López', 'Dra. Sánchez'],
        tratamientosPermitidos: ['Consulta', 'Limpieza', 'Revisión', 'Ortodoncia'],
        requiereCaptcha: false,
        textoLegal: 'Al enviar este formulario acepta el tratamiento de sus datos según nuestra política de privacidad.',
        landing: {
          titulo: 'Reserva tu Cita',
          subtitulo: 'Atención dental especializada',
          descripcion: 'Centro especializado en ortodoncia y tratamientos avanzados.',
          colorPrimario: '#059669',
          colorSecundario: '#047857',
          mostrarPrecios: true,
          mostrarProfesionales: false,
          camposOpcionales: ['edad', 'motivo_consulta'],
          camposObligatorios: ['nombre', 'apellidos', 'email', 'telefono']
        }
      }
    }
  ]);

  const sedeActual = sedes.find(s => s.id === selectedSede);
  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  const handleSaveConfig = () => {
    console.log('Guardando configuración para sede:', selectedSede);
  };

  const renderPreview = () => {
    if (!sedeActual) return null;

    const { landing } = sedeActual.configuracion;

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header del preview */}
        <div className="bg-gray-100 px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                clinica.com/cita-online/{selectedSede}
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Landing page preview */}
        <div 
          className="min-h-96" 
          style={{ backgroundColor: `${landing.colorPrimario}10` }}
        >
          {/* Hero section */}
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-12"
            style={{ 
              background: `linear-gradient(to right, ${landing.colorPrimario}, ${landing.colorSecundario})` 
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">{landing.titulo}</h1>
              <h2 className="text-xl mb-6 opacity-90">{landing.subtitulo}</h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">{landing.descripcion}</p>
            </div>
          </div>

          {/* Form section */}
          <div className="px-8 py-12 bg-white">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Solicitar Cita
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Cita *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      {sedeActual.configuracion.tratamientosPermitidos.map(tratamiento => (
                        <option key={tratamiento} value={tratamiento}>{tratamiento}</option>
                      ))}
                    </select>
                  </div>

                  {landing.mostrarProfesionales && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profesional (opcional)
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Sin preferencia</option>
                        {sedeActual.configuracion.profesionalesDisponibles.map(prof => (
                          <option key={prof} value={prof}>{prof}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Comentarios adicionales..."
                    ></textarea>
                  </div>

                  {sedeActual.configuracion.requiereCaptcha && (
                    <div className="bg-gray-100 p-4 rounded border">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-700">Verificación de seguridad requerida</span>
                      </div>
                    </div>
                  )}

                  <button
                    className="w-full py-3 px-4 text-white font-semibold rounded-lg"
                    style={{ backgroundColor: landing.colorPrimario }}
                  >
                    Solicitar Cita
                  </button>

                  <div className="text-xs text-gray-500 text-center mt-4">
                    {sedeActual.configuracion.textoLegal}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="bg-gray-100 px-8 py-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">{sedeActual.direccion}</span>
              </div>
              <p className="text-gray-600">{sedeActual.telefono}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cita Online</h1>
            <p className="text-gray-600">Reglas públicas, duración, disponibilidad, texto legal y landing por sede</p>
          </div>
          <button
            onClick={handleSaveConfig}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </button>
        </div>

        {/* Sede selector */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-sm font-medium text-gray-700">Sede:</label>
          <select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {sedes.map(sede => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre} {!sede.activa && '(Inactiva)'}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('configuracion')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'configuracion'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Configuración
              </div>
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'landing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Landing Page
              </div>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'configuracion' && sedeActual && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reglas de Disponibilidad */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reglas de Disponibilidad</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración por defecto (minutos)
                </label>
                <input
                  type="number"
                  value={sedeActual.configuracion.duracionDefecto}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anticipación mínima (horas)
                </label>
                <input
                  type="number"
                  value={sedeActual.configuracion.anticipacionMinima}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anticipación máxima (días)
                </label>
                <input
                  type="number"
                  value={sedeActual.configuracion.anticipacionMaxima}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sedeActual.configuracion.requiereCaptcha}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Requerir CAPTCHA</span>
                </label>
              </div>
            </div>
          </div>

          {/* Horarios Disponibles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Horarios Disponibles</h3>
            
            <div className="space-y-3">
              {diasSemana.map(dia => {
                const horario = sedeActual.configuracion.horariosDisponibles[dia];
                return (
                  <div key={dia} className="flex items-center space-x-3">
                    <div className="w-20">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={horario?.activo}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{dia}</span>
                      </label>
                    </div>
                    <input
                      type="time"
                      value={horario?.inicio || '09:00'}
                      disabled={!horario?.activo}
                      className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={horario?.fin || '18:00'}
                      disabled={!horario?.activo}
                      className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profesionales y Tratamientos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profesionales y Tratamientos</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profesionales Disponibles
                </label>
                <div className="space-y-2">
                  {sedeActual.configuracion.profesionalesDisponibles.map((prof, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{prof}</span>
                      <button className="text-red-600 hover:text-red-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamientos Permitidos
                </label>
                <div className="space-y-2">
                  {sedeActual.configuracion.tratamientosPermitidos.map((trat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{trat}</span>
                      <button className="text-red-600 hover:text-red-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Texto Legal */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Texto Legal</h3>
            <textarea
              value={sedeActual.configuracion.textoLegal}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Texto legal que aparecerá en el formulario..."
            />
          </div>
        </div>
      )}

      {activeTab === 'landing' && sedeActual && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contenido */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido de la Landing</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={sedeActual.configuracion.landing.titulo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={sedeActual.configuracion.landing.subtitulo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={sedeActual.configuracion.landing.descripcion}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Diseño */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Diseño y Colores</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={sedeActual.configuracion.landing.colorPrimario}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={sedeActual.configuracion.landing.colorPrimario}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={sedeActual.configuracion.landing.colorSecundario}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={sedeActual.configuracion.landing.colorSecundario}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sedeActual.configuracion.landing.mostrarPrecios}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Mostrar precios</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sedeActual.configuracion.landing.mostrarProfesionales}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Mostrar selector de profesionales</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && renderPreview()}
    </div>
  );
};

export default CitaOnline;