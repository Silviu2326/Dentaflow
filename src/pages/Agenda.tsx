import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedSede, setSelectedSede] = useState('all');
  const [selectedProfessional, setSelectedProfessional] = useState('all');

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
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600">Gestión de citas y programación</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nueva Cita
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  view === 'day'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setView('day')}
              >
                Día
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  view === 'week'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setView('week')}
              >
                Semana
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                  view === 'month'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setView('month')}
              >
                Mes
              </button>
            </div>

            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>{sede.name}</option>
              ))}
            </select>

            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {professionals.map((prof) => (
                <option key={prof.id} value={prof.id}>{prof.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={prevWeek}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-semibold text-gray-900">
              {format(weekStart, 'dd MMM', { locale: es })} - {format(weekEnd, 'dd MMM yyyy', { locale: es })}
            </span>
            <button
              onClick={nextWeek}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 text-sm font-medium text-gray-500 text-center border-r border-gray-200">
            Hora
          </div>
          {weekDays.map((day) => (
            <div key={day.toString()} className="p-4 text-sm font-medium text-gray-900 text-center border-r border-gray-200 last:border-r-0">
              <div>{format(day, 'EEE', { locale: es })}</div>
              <div className="text-lg font-semibold mt-1">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8">
              <div className="p-4 text-sm text-gray-500 text-center border-r border-gray-200">
                {hour}:00
              </div>
              {weekDays.map((day, dayIndex) => (
                <div key={`${hour}-${dayIndex}`} className="p-2 border-r border-gray-200 last:border-r-0 min-h-16 relative">
                  {/* Sample appointments for demonstration */}
                  {hour === 9 && dayIndex === 1 && (
                    <div className={`text-xs p-2 rounded border-l-4 ${getStatusColor('confirmed')}`}>
                      <div className="font-medium">Ana García</div>
                      <div>Limpieza - Dr. Rodriguez</div>
                    </div>
                  )}
                  {hour === 10 && dayIndex === 2 && (
                    <div className={`text-xs p-2 rounded border-l-4 ${getStatusColor('pending')}`}>
                      <div className="font-medium">Carlos López</div>
                      <div>Revisión - Dra. Martinez</div>
                    </div>
                  )}
                  {hour === 11 && dayIndex === 1 && (
                    <div className={`text-xs p-2 rounded border-l-4 ${getStatusColor('confirmed')}`}>
                      <div className="font-medium">María Fernández</div>
                      <div>Endodoncia - Dr. Rodriguez</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Espera y Overbooking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lista de Espera</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div>
                  <div className="font-medium text-gray-900">Pedro Santos</div>
                  <div className="text-sm text-gray-500">Limpieza - Cualquier hora</div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-500">
                  Programar
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div>
                  <div className="font-medium text-gray-900">Elena Vega</div>
                  <div className="text-sm text-gray-500">Revisión - Mañanas</div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-500">
                  Programar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Control de Overbooking</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacidad actual</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gray-500">
                15% de capacidad disponible para emergencias
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;