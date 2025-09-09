import React from 'react';
import { Calendar, Users, FileText, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle, Shield, BarChart3, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

const Dashboard = () => {
  const { user } = useAuth();
  const { hasPermission, isRole, isAnyRole } = usePermissions();

  const kpis = [
    {
      name: 'Citas del Día',
      value: '24',
      change: '+12%',
      icon: Calendar,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      name: 'No-Shows',
      value: '3',
      change: '-8%',
      icon: XCircle,
      color: 'bg-red-500',
      trend: 'down'
    },
    {
      name: 'Presupuestos Aceptados',
      value: '8',
      change: '+25%',
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      name: 'Caja del Día',
      value: '€4.850',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: 'up'
    }
  ];

  const recentAppointments = [
    { id: 1, patient: 'Ana García', time: '09:00', treatment: 'Limpieza', status: 'completed' },
    { id: 2, patient: 'Carlos López', time: '09:30', treatment: 'Revisión', status: 'in-progress' },
    { id: 3, patient: 'María Fernández', time: '10:00', treatment: 'Endodoncia', status: 'scheduled' },
    { id: 4, patient: 'José Martín', time: '10:30', treatment: 'Extracción', status: 'scheduled' },
    { id: 5, patient: 'Laura Ruiz', time: '11:00', treatment: 'Implante', status: 'no-show' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En curso';
      case 'scheduled': return 'Programada';
      case 'no-show': return 'No se presentó';
      default: return status;
    }
  };

  const getRoleSpecificGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
    
    return `${timeGreeting}, ${user?.name || 'Usuario'}`;
  };

  const getRoleSpecificDescription = () => {
    switch (user?.role) {
      case 'owner':
        return 'Visión global de todas las sedes y operaciones';
      case 'hq_analyst':
        return 'Análisis y reportes globales de la organización';
      case 'admin_sede':
        return 'Gestión completa de su sede';
      case 'reception':
        return 'Gestión de citas y atención al paciente';
      case 'clinical_professional':
        return 'Panel clínico - Sus pacientes y tratamientos';
      case 'assistant_nurse':
        return 'Soporte clínico y asistencia';
      case 'finance':
        return 'Control financiero y facturación';
      case 'marketing':
        return 'Campañas y comunicación con pacientes';
      case 'operations':
        return 'Inventario y operaciones';
      case 'external_auditor':
        return 'Vista de solo lectura para auditoría';
      default:
        return 'Resumen de la actividad de hoy';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-lg font-medium text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getRoleSpecificGreeting()}</h1>
            <p className="text-gray-600">{getRoleSpecificDescription()}</p>
            <div className="flex items-center mt-2">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{user?.roleDisplayName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${kpi.color} p-3 rounded-md`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {kpi.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {kpi.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      )}
                      <span className="ml-1">{kpi.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role-specific sections */}
      {isAnyRole(['owner', 'hq_analyst']) && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <Building className="h-8 w-8 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Vista Global HQ</h3>
                <p className="text-purple-100">Acceso a datos consolidados de todas las sedes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRole('external_auditor') && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Modo Auditoría</h3>
                <p className="text-red-100">Vista de solo lectura para revisión externa</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Citas de Hoy - Visible para roles que manejan citas */}
        {hasPermission('appointments') && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Citas de Hoy</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.patient}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.time} - {appointment.treatment}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        )}

        {/* Resumen Financiero - Solo para roles con permisos financieros */}
        {(hasPermission('billing') || hasPermission('financial_reports') || user?.role === 'owner') && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Resumen Financiero</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Ingresos del día</span>
                <span className="text-lg font-semibold text-green-600">€4.850</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Pendiente de cobro</span>
                <span className="text-lg font-semibold text-yellow-600">€1.200</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Gastos</span>
                <span className="text-lg font-semibold text-red-600">€350</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-medium text-gray-900">Balance neto</span>
                <span className="text-xl font-bold text-green-600">€4.500</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Alertas y Notificaciones */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Alertas y Notificaciones</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  3 pacientes sin confirmar cita para mañana
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Recomendamos contactar para confirmar asistencia
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  5 presupuestos pendientes de seguimiento
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Contactar con pacientes para seguimiento comercial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;