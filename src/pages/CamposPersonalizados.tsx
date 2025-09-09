import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Save, Settings, List, Grid, Search, Filter } from 'lucide-react';

interface CampoPersonalizado {
  id: string;
  nombre: string;
  etiqueta: string;
  tipo: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'email' | 'phone' | 'file';
  entidad: 'paciente' | 'cita' | 'tratamiento' | 'presupuesto' | 'factura' | 'historia_clinica';
  requerido: boolean;
  activo: boolean;
  orden: number;
  opciones?: string[];
  validacion?: {
    min?: number;
    max?: number;
    patron?: string;
    mensaje?: string;
  };
  descripcion?: string;
  seccion?: string;
  dependencias?: {
    campo: string;
    valor: string;
    accion: 'mostrar' | 'ocultar' | 'requerir';
  }[];
}

interface VistaGuardada {
  id: string;
  nombre: string;
  entidad: 'pacientes' | 'citas' | 'tratamientos' | 'presupuestos' | 'facturas';
  campos: string[];
  filtros: any[];
  ordenacion: {
    campo: string;
    direccion: 'asc' | 'desc';
  };
  publica: boolean;
  autor: string;
  fechaCreacion: string;
  ultimoUso: string;
  usos: number;
}

export default function CamposPersonalizados() {
  const [activeTab, setActiveTab] = useState<'campos' | 'vistas'>('campos');
  const [entidadFiltro, setEntidadFiltro] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const campos: CampoPersonalizado[] = [
    {
      id: 'CAMPO001',
      nombre: 'preferencia_contacto',
      etiqueta: 'Preferencia de Contacto',
      tipo: 'select',
      entidad: 'paciente',
      requerido: false,
      activo: true,
      orden: 1,
      opciones: ['Email', 'Teléfono', 'SMS', 'WhatsApp'],
      seccion: 'Comunicación',
      descripcion: 'Método preferido para contactar al paciente'
    },
    {
      id: 'CAMPO002',
      nombre: 'alergias_medicamentos',
      etiqueta: 'Alergias a Medicamentos',
      tipo: 'textarea',
      entidad: 'historia_clinica',
      requerido: true,
      activo: true,
      orden: 2,
      seccion: 'Historial Médico',
      validacion: {
        max: 500,
        mensaje: 'Máximo 500 caracteres'
      }
    },
    {
      id: 'CAMPO003',
      nombre: 'descuento_aplicado',
      etiqueta: 'Descuento Aplicado (%)',
      tipo: 'number',
      entidad: 'presupuesto',
      requerido: false,
      activo: true,
      orden: 3,
      validacion: {
        min: 0,
        max: 100,
        mensaje: 'Debe ser entre 0 y 100'
      },
      seccion: 'Pricing'
    },
    {
      id: 'CAMPO004',
      nombre: 'urgente',
      etiqueta: 'Cita Urgente',
      tipo: 'checkbox',
      entidad: 'cita',
      requerido: false,
      activo: true,
      orden: 4,
      seccion: 'Clasificación',
      dependencias: [{
        campo: 'urgente',
        valor: 'true',
        accion: 'mostrar'
      }]
    },
    {
      id: 'CAMPO005',
      nombre: 'seguro_medico',
      etiqueta: 'Compañía de Seguro',
      tipo: 'select',
      entidad: 'paciente',
      requerido: false,
      activo: false,
      orden: 5,
      opciones: ['Sanitas', 'Mapfre', 'Adeslas', 'DKV', 'Asisa', 'Otro'],
      seccion: 'Seguros'
    }
  ];

  const vistas: VistaGuardada[] = [
    {
      id: 'VISTA001',
      nombre: 'Pacientes con Alergias',
      entidad: 'pacientes',
      campos: ['nombre', 'telefono', 'email', 'alergias_medicamentos', 'ultima_visita'],
      filtros: [{ campo: 'alergias_medicamentos', operador: 'no_vacio' }],
      ordenacion: { campo: 'nombre', direccion: 'asc' },
      publica: true,
      autor: 'Dr. González',
      fechaCreacion: '2024-01-10',
      ultimoUso: '2024-01-15',
      usos: 45
    },
    {
      id: 'VISTA002',
      nombre: 'Citas Urgentes Pendientes',
      entidad: 'citas',
      campos: ['paciente', 'fecha', 'hora', 'tratamiento', 'urgente', 'estado'],
      filtros: [
        { campo: 'urgente', operador: 'igual', valor: true },
        { campo: 'estado', operador: 'igual', valor: 'pendiente' }
      ],
      ordenacion: { campo: 'fecha', direccion: 'asc' },
      publica: false,
      autor: 'Recepcionista Ana',
      fechaCreacion: '2024-01-12',
      ultimoUso: '2024-01-15',
      usos: 23
    },
    {
      id: 'VISTA003',
      nombre: 'Presupuestos con Descuento',
      entidad: 'presupuestos',
      campos: ['paciente', 'fecha', 'total', 'descuento_aplicado', 'estado'],
      filtros: [{ campo: 'descuento_aplicado', operador: 'mayor_que', valor: 0 }],
      ordenacion: { campo: 'descuento_aplicado', direccion: 'desc' },
      publica: true,
      autor: 'Comercial Luis',
      fechaCreacion: '2024-01-08',
      ultimoUso: '2024-01-14',
      usos: 67
    }
  ];

  const tiposCampo = [
    { valor: 'text', etiqueta: 'Texto', descripcion: 'Campo de texto simple' },
    { valor: 'textarea', etiqueta: 'Área de texto', descripcion: 'Campo de texto multilínea' },
    { valor: 'number', etiqueta: 'Número', descripcion: 'Campo numérico' },
    { valor: 'date', etiqueta: 'Fecha', descripcion: 'Selector de fecha' },
    { valor: 'select', etiqueta: 'Lista desplegable', descripcion: 'Selección única de opciones' },
    { valor: 'radio', etiqueta: 'Botones radio', descripcion: 'Selección única con botones' },
    { valor: 'checkbox', etiqueta: 'Casilla de verificación', descripcion: 'Campo verdadero/falso' },
    { valor: 'email', etiqueta: 'Email', descripcion: 'Campo de correo electrónico' },
    { valor: 'phone', etiqueta: 'Teléfono', descripcion: 'Campo de número de teléfono' },
    { valor: 'file', etiqueta: 'Archivo', descripcion: 'Carga de archivos' }
  ];

  const entidades = [
    { valor: 'paciente', etiqueta: 'Paciente', icono: '👤' },
    { valor: 'cita', etiqueta: 'Cita', icono: '📅' },
    { valor: 'tratamiento', etiqueta: 'Tratamiento', icono: '🦷' },
    { valor: 'presupuesto', etiqueta: 'Presupuesto', icono: '💰' },
    { valor: 'factura', etiqueta: 'Factura', icono: '📄' },
    { valor: 'historia_clinica', etiqueta: 'Historia Clínica', icono: '📋' }
  ];

  const getTipoColor = (tipo: string) => {
    const colores = {
      text: 'bg-blue-100 text-blue-800',
      textarea: 'bg-indigo-100 text-indigo-800',
      number: 'bg-green-100 text-green-800',
      date: 'bg-purple-100 text-purple-800',
      select: 'bg-yellow-100 text-yellow-800',
      radio: 'bg-pink-100 text-pink-800',
      checkbox: 'bg-gray-100 text-gray-800',
      email: 'bg-red-100 text-red-800',
      phone: 'bg-orange-100 text-orange-800',
      file: 'bg-teal-100 text-teal-800'
    };
    return colores[tipo as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  const getEntidadColor = (entidad: string) => {
    const colores = {
      paciente: 'bg-blue-100 text-blue-800',
      cita: 'bg-green-100 text-green-800',
      tratamiento: 'bg-purple-100 text-purple-800',
      presupuesto: 'bg-yellow-100 text-yellow-800',
      factura: 'bg-red-100 text-red-800',
      historia_clinica: 'bg-indigo-100 text-indigo-800'
    };
    return colores[entidad as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  const renderFormularioCampo = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Nuevo Campo Personalizado</h3>
        <button
          onClick={() => setMostrandoFormulario(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Campo</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="campo_personalizado"
            />
            <p className="text-xs text-gray-500 mt-1">Nombre técnico (sin espacios ni caracteres especiales)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Campo Personalizado"
            />
            <p className="text-xs text-gray-500 mt-1">Texto que verán los usuarios</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Campo</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {tiposCampo.map(tipo => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.etiqueta} - {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entidad</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              {entidades.map(entidad => (
                <option key={entidad.valor} value={entidad.valor}>
                  {entidad.icono} {entidad.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sección</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Información Adicional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              defaultValue="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción/Ayuda</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Texto de ayuda que aparecerá bajo el campo"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <input type="checkbox" id="requerido" className="mr-2" />
            <label htmlFor="requerido" className="text-sm text-gray-700">Campo requerido</label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="activo" className="mr-2" defaultChecked />
            <label htmlFor="activo" className="text-sm text-gray-700">Campo activo</label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="mostrar_listados" className="mr-2" />
            <label htmlFor="mostrar_listados" className="text-sm text-gray-700">Mostrar en listados</label>
          </div>
        </div>

        <div className="flex space-x-3 pt-6 border-t">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Campo</span>
          </button>
          <button
            type="button"
            onClick={() => setMostrandoFormulario(false)}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campos Personalizados</h1>
          <p className="text-gray-600">Campos custom por entidad y vistas guardadas personalizadas</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setMostrandoFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Campo</span>
          </button>
        </div>
      </div>

      {mostrandoFormulario && renderFormularioCampo()}

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('campos')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'campos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Campos Custom
        </button>
        <button
          onClick={() => setActiveTab('vistas')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'vistas'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Grid className="h-4 w-4 inline mr-2" />
          Vistas Guardadas
        </button>
      </div>

      {activeTab === 'campos' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar campo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select 
              value={entidadFiltro}
              onChange={(e) => setEntidadFiltro(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todas">Todas las entidades</option>
              {entidades.map(entidad => (
                <option key={entidad.valor} value={entidad.valor}>
                  {entidad.icono} {entidad.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campos
                    .filter(campo => entidadFiltro === 'todas' || campo.entidad === entidadFiltro)
                    .filter(campo => campo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    campo.etiqueta.toLowerCase().includes(busqueda.toLowerCase()))
                    .map((campo) => (
                    <tr key={campo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campo.etiqueta}</div>
                          <div className="text-sm text-gray-500 font-mono">{campo.nombre}</div>
                          {campo.descripcion && (
                            <div className="text-xs text-gray-400 mt-1">{campo.descripcion}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(campo.tipo)}`}>
                          {campo.tipo}
                        </span>
                        {campo.requerido && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                            Requerido
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEntidadColor(campo.entidad)}`}>
                          {entidades.find(e => e.valor === campo.entidad)?.icono} {campo.entidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{campo.seccion || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campo.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {campo.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{campo.orden}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
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

      {activeTab === 'vistas' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Vista</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vistas.map((vista) => (
              <div key={vista.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{vista.nombre}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEntidadColor(vista.entidad.slice(0, -1))}`}>
                        {vista.entidad}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vista.publica ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vista.publica ? 'Pública' : 'Privada'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Campos mostrados:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vista.campos.slice(0, 3).map((campo, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {campo}
                        </span>
                      ))}
                      {vista.campos.length > 3 && (
                        <span className="text-xs text-gray-500">+{vista.campos.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500">Filtros aplicados:</span>
                    <div className="text-sm text-gray-700 mt-1">
                      {vista.filtros.length} filtro(s) activo(s)
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Por: {vista.autor}</span>
                    <span>{vista.usos} usos</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Última vez: {vista.ultimoUso}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                    Usar Vista
                  </button>
                  <button className="border border-gray-300 py-2 px-3 rounded text-sm hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}