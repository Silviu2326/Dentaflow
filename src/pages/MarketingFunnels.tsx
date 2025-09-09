import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, TrendingDown, Users, Calendar, Phone, FileText, CheckCircle, User } from 'lucide-react';

interface FunnelLead {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  origen: string;
  fechaLead: string;
  estado: 'lead' | 'contactado' | 'primera_visita' | 'presupuesto_enviado' | 'aceptado' | 'perdido';
  responsable: string;
  sede: string;
  notas: string[];
  proximaAccion?: {
    fecha: string;
    accion: string;
  };
  valorEstimado?: number;
}

interface FunnelStats {
  leads: number;
  contactados: number;
  primerasVisitas: number;
  presupuestosEnviados: number;
  aceptados: number;
  perdidos: number;
  tasaConversion: {
    leadAVisita: number;
    visitaAPresupuesto: number;
    presupuestoAAceptado: number;
    leadAAceptado: number;
  };
}

const MarketingFunnels: React.FC = () => {
  const [selectedFunnel, setSelectedFunnel] = useState('todos');
  const [selectedResponsable, setSelectedResponsable] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const [leads] = useState<FunnelLead[]>([
    {
      id: '1',
      nombre: 'María González',
      telefono: '+34 666 111 222',
      email: 'maria@email.com',
      origen: 'Google Ads',
      fechaLead: '2024-01-15T10:00:00',
      estado: 'aceptado',
      responsable: 'Ana Rodríguez',
      sede: 'Centro',
      notas: ['Primera llamada realizada', 'Interesada en implantes', 'Presupuesto aceptado'],
      valorEstimado: 1200
    },
    {
      id: '2',
      nombre: 'Carlos Martín',
      telefono: '+34 666 333 444',
      email: 'carlos@email.com',
      origen: 'Facebook',
      fechaLead: '2024-01-16T14:30:00',
      estado: 'presupuesto_enviado',
      responsable: 'Ana Rodríguez',
      sede: 'Centro',
      notas: ['Contactado vía WhatsApp', 'Cita programada para mañana', 'Presupuesto ortodoncia enviado'],
      proximaAccion: {
        fecha: '2024-01-20',
        accion: 'Seguimiento presupuesto'
      },
      valorEstimado: 2800
    },
    {
      id: '3',
      nombre: 'Ana López',
      telefono: '+34 666 555 666',
      email: 'ana.lopez@email.com',
      origen: 'Referido',
      fechaLead: '2024-01-17T09:15:00',
      estado: 'primera_visita',
      responsable: 'Carlos López',
      sede: 'Norte',
      notas: ['Referido por paciente actual', 'Primera visita completada', 'Interesada en blanqueamiento'],
      proximaAccion: {
        fecha: '2024-01-19',
        accion: 'Preparar presupuesto'
      },
      valorEstimado: 400
    },
    {
      id: '4',
      nombre: 'David Ruiz',
      telefono: '+34 666 777 888',
      email: 'david@email.com',
      origen: 'Web Directa',
      fechaLead: '2024-01-18T16:45:00',
      estado: 'contactado',
      responsable: 'Ana Rodríguez',
      sede: 'Centro',
      notas: ['Formulario web completado', 'Primera llamada realizada', 'Interesado en limpieza'],
      proximaAccion: {
        fecha: '2024-01-19',
        accion: 'Agendar primera cita'
      },
      valorEstimado: 150
    },
    {
      id: '5',
      nombre: 'Laura Sánchez',
      telefono: '+34 666 999 000',
      email: 'laura@email.com',
      origen: 'Instagram',
      fechaLead: '2024-01-18T11:20:00',
      estado: 'lead',
      responsable: 'Carlos López',
      sede: 'Sur',
      notas: ['Lead generado por Instagram', 'Pendiente primera llamada'],
      proximaAccion: {
        fecha: '2024-01-19',
        accion: 'Primera llamada'
      },
      valorEstimado: 800
    },
    {
      id: '6',
      nombre: 'Pedro García',
      telefono: '+34 666 222 333',
      email: 'pedro@email.com',
      origen: 'Google Ads',
      fechaLead: '2024-01-14T13:10:00',
      estado: 'perdido',
      responsable: 'Ana Rodríguez',
      sede: 'Centro',
      notas: ['No contestó llamadas', 'Email rebotado', 'Lead perdido tras 3 intentos'],
      valorEstimado: 600
    }
  ]);

  const responsables = ['todos', ...Array.from(new Set(leads.map(l => l.responsable)))];
  const estadosFunnel = ['lead', 'contactado', 'primera_visita', 'presupuesto_enviado', 'aceptado', 'perdido'];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.telefono.includes(searchTerm);
    const matchesFunnel = selectedFunnel === 'todos' || lead.estado === selectedFunnel;
    const matchesResponsable = selectedResponsable === 'todos' || lead.responsable === selectedResponsable;
    return matchesSearch && matchesFunnel && matchesResponsable;
  });

  const stats: FunnelStats = {
    leads: leads.length,
    contactados: leads.filter(l => ['contactado', 'primera_visita', 'presupuesto_enviado', 'aceptado'].includes(l.estado)).length,
    primerasVisitas: leads.filter(l => ['primera_visita', 'presupuesto_enviado', 'aceptado'].includes(l.estado)).length,
    presupuestosEnviados: leads.filter(l => ['presupuesto_enviado', 'aceptado'].includes(l.estado)).length,
    aceptados: leads.filter(l => l.estado === 'aceptado').length,
    perdidos: leads.filter(l => l.estado === 'perdido').length,
    tasaConversion: {
      leadAVisita: Math.round((leads.filter(l => ['primera_visita', 'presupuesto_enviado', 'aceptado'].includes(l.estado)).length / leads.length) * 100),
      visitaAPresupuesto: Math.round((leads.filter(l => ['presupuesto_enviado', 'aceptado'].includes(l.estado)).length / Math.max(leads.filter(l => ['primera_visita', 'presupuesto_enviado', 'aceptado'].includes(l.estado)).length, 1)) * 100),
      presupuestoAAceptado: Math.round((leads.filter(l => l.estado === 'aceptado').length / Math.max(leads.filter(l => ['presupuesto_enviado', 'aceptado'].includes(l.estado)).length, 1)) * 100),
      leadAAceptado: Math.round((leads.filter(l => l.estado === 'aceptado').length / leads.length) * 100)
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'lead': return 'bg-gray-100 text-gray-800';
      case 'contactado': return 'bg-blue-100 text-blue-800';
      case 'primera_visita': return 'bg-yellow-100 text-yellow-800';
      case 'presupuesto_enviado': return 'bg-purple-100 text-purple-800';
      case 'aceptado': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'lead': return <User className="h-4 w-4" />;
      case 'contactado': return <Phone className="h-4 w-4" />;
      case 'primera_visita': return <Calendar className="h-4 w-4" />;
      case 'presupuesto_enviado': return <FileText className="h-4 w-4" />;
      case 'aceptado': return <CheckCircle className="h-4 w-4" />;
      case 'perdido': return <TrendingDown className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getEstadoLabel = (estado: string) => {
    const labels: { [key: string]: string } = {
      'lead': 'Lead',
      'contactado': 'Contactado',
      'primera_visita': '1ª Visita',
      'presupuesto_enviado': 'Presupuesto Enviado',
      'aceptado': 'Aceptado',
      'perdido': 'Perdido'
    };
    return labels[estado] || estado;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
              <span className="text-orange-800 font-medium text-sm">MARKETING</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Embudos de Conversión</h1>
            <p className="text-gray-600">Lead → 1ª Visita → Presupuesto → Aceptado - Estado y responsables</p>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Lead
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-orange-300 rounded-lg w-full focus:ring-orange-500 focus:border-orange-500 bg-white"
            />
          </div>
          <select
            value={selectedFunnel}
            onChange={(e) => setSelectedFunnel(e.target.value)}
            className="px-4 py-2 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="todos">Todos los estados</option>
            {estadosFunnel.map(estado => (
              <option key={estado} value={estado}>{getEstadoLabel(estado)}</option>
            ))}
          </select>
          <select
            value={selectedResponsable}
            onChange={(e) => setSelectedResponsable(e.target.value)}
            className="px-4 py-2 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            {responsables.map(resp => (
              <option key={resp} value={resp}>
                {resp === 'todos' ? 'Todos los responsables' : resp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Embudo de Conversión</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Lead */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-4 mb-2">
              <User className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.leads}</div>
              <div className="text-sm text-gray-600">Leads</div>
            </div>
            <div className="text-xs text-gray-500">100%</div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-orange-400">→</div>
          </div>

          {/* Primera Visita */}
          <div className="text-center">
            <div className="bg-yellow-100 rounded-lg p-4 mb-2">
              <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.primerasVisitas}</div>
              <div className="text-sm text-gray-600">1ª Visita</div>
            </div>
            <div className="text-xs text-gray-500">{stats.tasaConversion.leadAVisita}%</div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-orange-400">→</div>
          </div>

          {/* Presupuesto */}
          <div className="text-center">
            <div className="bg-purple-100 rounded-lg p-4 mb-2">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.presupuestosEnviados}</div>
              <div className="text-sm text-gray-600">Presupuesto</div>
            </div>
            <div className="text-xs text-gray-500">{stats.tasaConversion.visitaAPresupuesto}%</div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-orange-400">→</div>
          </div>

          {/* Aceptado */}
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-4 mb-2">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.aceptados}</div>
              <div className="text-sm text-gray-600">Aceptado</div>
            </div>
            <div className="text-xs text-gray-500">{stats.tasaConversion.presupuestoAAceptado}%</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-orange-600">{stats.tasaConversion.leadAAceptado}%</div>
              <div className="text-sm text-gray-600">Conversión Global</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{stats.perdidos}</div>
              <div className="text-sm text-gray-600">Leads Perdidos</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                €{leads.filter(l => l.valorEstimado).reduce((acc, l) => acc + (l.valorEstimado || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Valor Pipeline</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                €{leads.filter(l => l.estado === 'aceptado' && l.valorEstimado).reduce((acc, l) => acc + (l.valorEstimado || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Valor Cerrado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Acción
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Estimado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.nombre}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.telefono}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.origen}</div>
                    <div className="text-sm text-gray-500">{new Date(lead.fechaLead).toLocaleDateString('es-ES')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(lead.estado)}`}>
                      {getEstadoIcon(lead.estado)}
                      <span className="ml-1">{getEstadoLabel(lead.estado)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white mr-2">
                        {lead.responsable.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm text-gray-900">{lead.responsable}</div>
                    </div>
                    <div className="text-sm text-gray-500">{lead.sede}</div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.proximaAccion ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.proximaAccion.accion}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(lead.proximaAccion.fecha).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin acciones pendientes</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {lead.valorEstimado ? `€${lead.valorEstimado}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay leads</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron leads que coincidan con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketingFunnels;