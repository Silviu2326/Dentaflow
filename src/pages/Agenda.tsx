import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  Clock,
  Users,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Settings,
  Eye,
  MoreVertical
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import NewAppointmentModal from '../components/NewAppointmentModal';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedSede, setSelectedSede] = useState('all');
  const [selectedProfessional, setSelectedProfessional] = useState('all');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  const sedes = [
    { id: 'all', name: 'Todas las sedes' },
    { id: 'sede1', name: 'Sede Centro' },
    { id: 'sede2', name: 'Sede Norte' }
  ];

  const professionals = [
    { id: 'all', name: 'Todos los profesionales' },
    { id: 'dr1', name: 'Dr. Rodriguez' },
    { id: 'dr2', name: 'Dra. Martinez' },
    { id: 'dr3', name: 'Dr. Lopez' }
  ];

  const appointments = [
    {
      id: 1,
      patient: 'Ana García',
      time: '09:00',
      duration: 60,
      treatment: 'Limpieza',
      professional: 'Dr. Rodriguez',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'Carlos López',
      time: '10:00',
      duration: 30,
      treatment: 'Revisión',
      professional: 'Dra. Martinez',
      status: 'pending'
    },
    {
      id: 3,
      patient: 'María Fernández',
      time: '11:00',
      duration: 90,
      treatment: 'Endodoncia',
      professional: 'Dr. Rodriguez',
      status: 'confirmed'
    }
  ];

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/60 text-green-800';
      case 'pending': return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200/60 text-yellow-800';
      case 'cancelled': return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200/60 text-red-800';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200/60 text-gray-800';
    }
  };

  const handleNewAppointment = (appointmentData: any) => {
    console.log('Nueva cita creada:', appointmentData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Professional Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
                  <p className="text-gray-600">Gestión profesional de citas y programación</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">24 citas hoy</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">3 pendientes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">85% capacidad</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowNewAppointmentModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nueva Cita
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Control Panel */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            
            {/* View Controls */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Vista:</span>
              </div>
              <div className="flex rounded-xl bg-gray-100/80 p-1 border border-gray-200/50">
                <button
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === 'day'
                      ? 'bg-white text-blue-700 shadow-md border border-blue-200/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                  onClick={() => setView('day')}
                >
                  Día
                </button>
                <button
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === 'week'
                      ? 'bg-white text-blue-700 shadow-md border border-blue-200/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                  onClick={() => setView('week')}
                >
                  Semana
                </button>
                <button
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === 'month'
                      ? 'bg-white text-blue-700 shadow-md border border-blue-200/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                  onClick={() => setView('month')}
                >
                  Mes
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                  className="rounded-xl border border-gray-200/50 bg-white/80 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200/50 focus:outline-none transition-all duration-200"
                >
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>{sede.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  className="rounded-xl border border-gray-200/50 bg-white/80 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200/50 focus:outline-none transition-all duration-200"
                >
                  {professionals.map((prof) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={prevWeek}
                className="p-2.5 rounded-xl border border-gray-200/50 bg-white/80 text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {format(weekStart, 'dd MMM', { locale: es })} - {format(weekEnd, 'dd MMM', { locale: es })}
                </div>
                <div className="text-sm text-gray-500">
                  {format(currentDate, 'yyyy', { locale: es })}
                </div>
              </div>
              
              <button
                onClick={nextWeek}
                className="p-2.5 rounded-xl border border-gray-200/50 bg-white/80 text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Calendar Grid */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200/50">
            <div className="grid grid-cols-8">
              <div className="p-4 text-center border-r border-gray-200/50">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">Hora</span>
                </div>
              </div>
              {weekDays.map((day, index) => {
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <div key={day.toString()} className="p-4 text-center border-r border-gray-200/50 last:border-r-0">
                    <div className={`${isToday ? 'text-blue-700 font-bold' : 'text-gray-600'} text-sm uppercase tracking-wide`}>
                      {format(day, 'EEE', { locale: es })}
                    </div>
                    <div className={`text-xl font-bold mt-1 ${
                      isToday 
                        ? 'text-blue-700 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto' 
                        : 'text-gray-800'
                    }`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Body */}
          <div className="max-h-[600px] overflow-y-auto">
            {hours.map((hour, hourIndex) => (
              <div key={hour} className={`grid grid-cols-8 border-b border-gray-100/50 hover:bg-blue-50/20 transition-colors duration-150 ${hourIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white/50'}`}>
                <div className="p-4 text-center border-r border-gray-200/50">
                  <div className="text-sm font-semibold text-gray-600">
                    {hour}:00
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {hour < 12 ? 'AM' : 'PM'}
                  </div>
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div key={`${hour}-${dayIndex}`} className="p-2 border-r border-gray-200/50 last:border-r-0 min-h-20 relative hover:bg-blue-50/30 transition-colors duration-150 cursor-pointer group">
                    {/* Sample appointments with professional styling */}
                    {hour === 9 && dayIndex === 1 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                        <div className="text-xs font-semibold text-green-900 mb-1">Ana García</div>
                        <div className="text-xs text-green-700">Limpieza • Dr. Rodriguez</div>
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmada
                        </div>
                      </div>
                    )}
                    {hour === 10 && dayIndex === 2 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/60 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                        <div className="text-xs font-semibold text-yellow-900 mb-1">Carlos López</div>
                        <div className="text-xs text-yellow-700">Revisión • Dra. Martinez</div>
                        <div className="text-xs text-yellow-600 mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pendiente
                        </div>
                      </div>
                    )}
                    {hour === 11 && dayIndex === 1 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                        <div className="text-xs font-semibold text-blue-900 mb-1">María Fernández</div>
                        <div className="text-xs text-blue-700">Endodoncia • Dr. Rodriguez</div>
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmada
                        </div>
                      </div>
                    )}
                    
                    {/* Add appointment hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-500/5 rounded-lg">
                      <Plus className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Side Panels */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lista de Espera */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Users className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Espera</h3>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  2 pacientes
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="group p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/60 rounded-xl hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">Pedro Santos</div>
                      <div className="text-sm text-gray-600 mb-2">Limpieza • Cualquier hora</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-yellow-700 font-medium">Esperando desde ayer</span>
                      </div>
                    </div>
                    <button className="bg-white/80 hover:bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200">
                      Programar
                    </button>
                  </div>
                </div>
                
                <div className="group p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200/60 rounded-xl hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">Elena Vega</div>
                      <div className="text-sm text-gray-600 mb-2">Revisión • Mañanas preferidas</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-orange-700 font-medium">Esperando 3 días</span>
                      </div>
                    </div>
                    <button className="bg-white/80 hover:bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200">
                      Programar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control de Overbooking */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Control de Capacidad</h3>
                </div>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-semibold">
                  Óptimo
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                
                {/* Capacity Indicator */}
                <div className="">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Capacidad Actual</span>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-bold text-green-700">85%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50/50 rounded-xl border border-green-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Estado Óptimo</span>
                    </div>
                    <p className="text-sm text-green-700">
                      15% de capacidad disponible para emergencias y nuevos pacientes
                    </p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50/50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-700">24</div>
                    <div className="text-xs text-blue-600 font-medium">Citas hoy</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50/50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-700">3</div>
                    <div className="text-xs text-purple-600 font-medium">Slots libres</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Cita */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSubmit={handleNewAppointment}
      />
    </div>
  );
};

export default Agenda;