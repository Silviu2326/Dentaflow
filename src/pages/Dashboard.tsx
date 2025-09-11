import React from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  BarChart3, 
  Building,
  Sparkles,
  Star,
  Activity,
  Eye,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
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
      case 'completed': return 'bg-green-50 border-green-200 text-green-800';
      case 'in-progress': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'scheduled': return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'no-show': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">{getRoleSpecificGreeting()}</h1>
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-blue-100 text-lg mb-3">{getRoleSpecificDescription()}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <Shield className="h-4 w-4 text-emerald-400 mr-2" />
                    <span className="text-sm text-white font-medium">{user?.roleDisplayName}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/80">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">Panel Principal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <p className="text-blue-100 text-sm">Último acceso</p>
                <p className="text-white font-semibold">Hace 2 minutos</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpis.map((kpi, index) => {
            const gradientClasses = {
              'bg-blue-500': 'from-blue-500 to-blue-600',
              'bg-red-500': 'from-red-500 to-red-600', 
              'bg-green-500': 'from-green-500 to-green-600',
              'bg-purple-500': 'from-purple-500 to-purple-600'
            };
            
            return (
              <div 
                key={kpi.name} 
                className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/90"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClasses[kpi.color as keyof typeof gradientClasses]} shadow-lg`}>
                        <kpi.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        kpi.trend === 'up' 
                          ? 'bg-green-100 text-green-700 group-hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 group-hover:bg-red-200'
                      }`}>
                        <div className="flex items-center space-x-1">
                          {kpi.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{kpi.change}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {kpi.name}
                      </h3>
                      <div className="text-3xl font-bold text-gray-900">
                        {kpi.value}
                      </div>
                    </div>
                  </div>
                  
                  <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100">
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Role-specific banners */}
        {isAnyRole(['owner', 'hq_analyst']) && (
          <div className="mb-8">
            <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl shadow-2xl p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <Building className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Vista Global HQ</h3>
                    <p className="text-purple-100">Acceso a datos consolidados de todas las sedes</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 opacity-70" />
              </div>
            </div>
          </div>
        )}

        {isRole('external_auditor') && (
          <div className="mb-8">
            <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-rose-800 rounded-2xl shadow-2xl p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Modo Auditoría</h3>
                    <p className="text-red-100">Vista de solo lectura para revisión externa</p>
                    <div className="flex items-center mt-2">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-sm text-red-200">Solo lectura</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 opacity-70" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Citas de Hoy - Visible para roles que manejan citas */}
          {hasPermission('appointments') && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Citas de Hoy</h2>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {recentAppointments.length} citas
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {recentAppointments.map((appointment, index) => {
                    const statusColors = {
                      'completed': 'bg-green-50 border-green-200 text-green-800',
                      'in-progress': 'bg-blue-50 border-blue-200 text-blue-800',
                      'scheduled': 'bg-gray-50 border-gray-200 text-gray-800',
                      'no-show': 'bg-red-50 border-red-200 text-red-800'
                    };
                    
                    return (
                      <div 
                        key={appointment.id} 
                        className="group p-4 rounded-xl border border-gray-200/50 hover:border-gray-300/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                              <Clock className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-gray-900 truncate mb-1">
                              {appointment.patient}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.time} • {appointment.treatment}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Resumen Financiero - Solo para roles con permisos financieros */}
          {(hasPermission('billing') || hasPermission('financial_reports') || user?.role === 'owner') && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Resumen Financiero</h2>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Hoy
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-green-50/50 rounded-xl border border-green-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Ingresos del día</span>
                    </div>
                    <span className="text-xl font-bold text-green-700">€4.850</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-yellow-50/50 rounded-xl border border-yellow-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Pendiente de cobro</span>
                    </div>
                    <span className="text-xl font-bold text-yellow-700">€1.200</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50/50 rounded-xl border border-red-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Gastos</span>
                    </div>
                    <span className="text-xl font-bold text-red-700">€350</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-1 bg-emerald-500 rounded-full">
                          <TrendingUp className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-900 font-bold">Balance neto</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700">€4.500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alertas y Notificaciones */}
        <div className="mt-12 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
          <div className="px-8 py-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Alertas y Notificaciones</h2>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                2 nuevas
              </span>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              <div className="relative group">
                <div className="flex items-start p-6 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border border-yellow-200/50 rounded-2xl hover:shadow-lg transition-all duration-200">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-yellow-400 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-base font-bold text-yellow-900 mb-2">
                      3 pacientes sin confirmar cita para mañana
                    </p>
                    <p className="text-sm text-yellow-700">
                      Recomendamos contactar para confirmar asistencia
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-yellow-200/50">
                    <ChevronRight className="h-5 w-5 text-yellow-600" />
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <div className="flex items-start p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-2xl hover:shadow-lg transition-all duration-200">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-base font-bold text-blue-900 mb-2">
                      5 presupuestos pendientes de seguimiento
                    </p>
                    <p className="text-sm text-blue-700">
                      Contactar con pacientes para seguimiento comercial
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-blue-200/50">
                    <ChevronRight className="h-5 w-5 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;