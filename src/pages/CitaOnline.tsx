import React, { useState } from 'react';
import { Save, Eye, Edit, Globe, Clock, MapPin, Shield, Palette, Code, Settings, Calendar, Users, CheckCircle, XCircle, Plus, Trash2, Type, FileText, DollarSign, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cita Online
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Configura las reglas de disponibilidad, personaliza la landing page y administra el sistema de citas online por sede
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Panel de Configuración</h2>
              <p className="text-gray-600">Gestiona cada sede de forma independiente</p>
            </div>
          </div>
          <button
            onClick={handleSaveConfig}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Save className="h-5 w-5 mr-2" />
            Guardar Cambios
          </button>
        </div>

        {/* Sede selector */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Seleccionar Sede</label>
                <p className="text-xs text-gray-500">Configura cada ubicación por separado</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px]"
              >
                {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre} {!sede.activa && '(Inactiva)'}
                  </option>
                ))}
              </select>
              {sedeActual && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sedeActual.activa 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {sedeActual.activa ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activa
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactiva
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <nav className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('configuracion')}
              className={`flex-1 py-6 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'configuracion'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Settings className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div>Configuración</div>
                  <div className="text-xs opacity-75">Horarios y reglas</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex-1 py-6 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'landing'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Palette className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div>Landing Page</div>
                  <div className="text-xs opacity-75">Diseño y contenido</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-6 px-6 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Eye className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div>Vista Previa</div>
                  <div className="text-xs opacity-75">Resultado final</div>
                </div>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'configuracion' && sedeActual && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reglas de Disponibilidad */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Reglas de Disponibilidad</h3>
                <p className="text-gray-600 text-sm">Configura los tiempos y restricciones</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Duración por defecto (minutos)
                </label>
                <input
                  type="number"
                  value={sedeActual.configuracion.duracionDefecto}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder="30"
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Anticipación mínima (horas)
                </label>
                <input
                  type="number"
                  value={sedeActual.configuracion.anticipacionMinima}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder="2"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Anticipación máxima (días)
                </label>
                <input
                  type="number"
                  value={sedeActual.configuracion.anticipacionMaxima}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder="30"
                />
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sedeActual.configuracion.requiereCaptcha}
                    className="mr-3 h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Requerir verificación CAPTCHA</span>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-8">Añade una capa extra de seguridad al formulario</p>
              </div>
            </div>
          </div>

          {/* Horarios Disponibles */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-100 to-teal-100 p-3 rounded-xl mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Horarios Disponibles</h3>
                <p className="text-gray-600 text-sm">Configura los días y horas de atención</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {diasSemana.map(dia => {
                const horario = sedeActual.configuracion.horariosDisponibles[dia];
                return (
                  <div key={dia} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-24">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={horario?.activo}
                            className="mr-3 h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-semibold text-gray-700 capitalize">{dia}</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="time"
                          value={horario?.inicio || '09:00'}
                          disabled={!horario?.activo}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                        />
                        <span className="text-gray-400 font-medium">-</span>
                        <input
                          type="time"
                          value={horario?.fin || '18:00'}
                          disabled={!horario?.activo}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profesionales y Tratamientos */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Profesionales y Tratamientos</h3>
                <p className="text-gray-600 text-sm">Configura quién puede atender y qué servicios</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  <Users className="h-4 w-4 inline mr-2" />
                  Profesionales Disponibles
                </label>
                <div className="space-y-3">
                  {sedeActual.configuracion.profesionalesDisponibles.map((prof, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                          {prof.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{prof}</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  <Settings className="h-4 w-4 inline mr-2" />
                  Tratamientos Permitidos
                </label>
                <div className="space-y-3">
                  {sedeActual.configuracion.tratamientosPermitidos.map((trat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                          <Zap className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{trat}</span>
                      </div>
                      <button className="text-teal-600 hover:text-teal-800 hover:bg-teal-50 p-2 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Texto Legal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-3 rounded-xl mr-4">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Texto Legal</h3>
                <p className="text-gray-600 text-sm">Avisos legales y políticas que aparecerán en el formulario</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
              <textarea
                value={sedeActual.configuracion.textoLegal}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 resize-none"
                placeholder="Texto legal que aparecerá en el formulario de citas. Incluye políticas de privacidad, términos y condiciones, etc..."
              />
              <p className="text-xs text-gray-500 mt-2">Este texto será mostrado al usuario antes de confirmar su cita</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'landing' && sedeActual && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contenido */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl mr-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contenido de la Landing</h3>
                <p className="text-gray-600 text-sm">Configura el contenido principal de tu página</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Type className="h-4 w-4 inline mr-2" />
                  Título Principal
                </label>
                <input
                  type="text"
                  value={sedeActual.configuracion.landing.titulo}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder="Título que aparecerá en la landing..."
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Type className="h-4 w-4 inline mr-2" />
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={sedeActual.configuracion.landing.subtitulo}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder="Subtítulo descriptivo..."
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Descripción
                </label>
                <textarea
                  value={sedeActual.configuracion.landing.descripcion}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 resize-none"
                  placeholder="Descripción detallada de tus servicios..."
                />
              </div>
            </div>
          </div>

          {/* Diseño */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-3 rounded-xl mr-4">
                <Palette className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Diseño y Colores</h3>
                <p className="text-gray-600 text-sm">Personaliza la apariencia de tu landing</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Palette className="h-4 w-4 inline mr-2" />
                  Color Primario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={sedeActual.configuracion.landing.colorPrimario}
                    className="w-14 h-12 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                  <input
                    type="text"
                    value={sedeActual.configuracion.landing.colorPrimario}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Palette className="h-4 w-4 inline mr-2" />
                  Color Secundario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={sedeActual.configuracion.landing.colorSecundario}
                    className="w-14 h-12 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                  <input
                    type="text"
                    value={sedeActual.configuracion.landing.colorSecundario}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  <Settings className="h-4 w-4 inline mr-2" />
                  Opciones de Visualización
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <input
                      type="checkbox"
                      checked={sedeActual.configuracion.landing.mostrarPrecios}
                      className="mr-3 h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Mostrar precios</span>
                    </div>
                  </label>

                  <label className="flex items-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <input
                      type="checkbox"
                      checked={sedeActual.configuracion.landing.mostrarProfesionales}
                      className="mr-3 h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Mostrar selector de profesionales</span>
                    </div>
                  </label>
                </div>
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