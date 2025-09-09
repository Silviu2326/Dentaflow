import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  CreditCard,
  Camera,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PacienteDetalle = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('datos');

  // Mock patient data
  const paciente = {
    id: 1,
    name: 'Ana García López',
    email: 'ana.garcia@email.com',
    phone: '+34 600 123 456',
    address: 'Calle Mayor 123, 28001 Madrid',
    birthDate: '1985-03-15',
    dni: '12345678A',
    profession: 'Profesora',
    insuranceCompany: 'Sanitas',
    insuranceNumber: 'SAN123456',
    emergencyContact: 'Pedro García - +34 600 654 321',
    allergies: ['Penicilina', 'Látex'],
    medicalHistory: ['Hipertensión', 'Diabetes tipo 2'],
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-25',
    status: 'active',
    registrationDate: '2020-05-12'
  };

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      title: 'Cita completada',
      description: 'Limpieza dental - Dr. Rodriguez',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pago recibido',
      description: '€85.00 - Limpieza dental',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 3,
      type: 'document',
      title: 'Consentimiento firmado',
      description: 'Tratamiento de endodoncia',
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 4,
      type: 'appointment',
      title: 'Próxima cita programada',
      description: 'Endodoncia - Dr. Rodriguez',
      date: '2024-01-25',
      status: 'scheduled'
    }
  ];

  const tabs = [
    { id: 'datos', name: 'Datos Personales', icon: FileText },
    { id: 'comunicaciones', name: 'Comunicaciones', icon: Mail },
    { id: 'actividad', name: 'Actividad Reciente', icon: Clock }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'payment': return CreditCard;
      case 'document': return FileText;
      default: return Clock;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'scheduled': return 'text-blue-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link
            to="/pacientes"
            className="mr-4 p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{paciente.name}</h1>
            <p className="text-gray-600">Ficha del paciente</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Editar
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            to={`/pacientes/${id}/historia`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300 group"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Historia Clínica</p>
                <p className="text-xs text-gray-500">Ver expediente médico</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/pacientes/${id}/presupuestos`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-green-300 group"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500 group-hover:text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Presupuestos</p>
                <p className="text-xs text-gray-500">Gestionar presupuestos</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/pacientes/${id}/facturacion`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300 group"
          >
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-500 group-hover:text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Facturación</p>
                <p className="text-xs text-gray-500">Pagos y facturas</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/pacientes/${id}/imagenes`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-300 group"
          >
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-orange-500 group-hover:text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Imágenes</p>
                <p className="text-xs text-gray-500">Antes/Después</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'datos' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                      <p className="mt-1 text-sm text-gray-900">{paciente.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">DNI</label>
                      <p className="mt-1 text-sm text-gray-900">{paciente.dni}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(paciente.birthDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profesión</label>
                      <p className="mt-1 text-sm text-gray-900">{paciente.profession}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{paciente.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{paciente.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{paciente.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contacto de emergencia</label>
                    <p className="mt-1 text-sm text-gray-900">{paciente.emergencyContact}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Seguro médico</label>
                    <p className="mt-1 text-sm text-gray-900">{paciente.insuranceCompany}</p>
                    <p className="text-xs text-gray-500">Número: {paciente.insuranceNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alergias</label>
                    <div className="flex flex-wrap gap-2">
                      {paciente.allergies.map((allergy, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Historial médico</label>
                    <div className="space-y-2">
                      {paciente.medicalHistory.map((condition, index) => (
                        <div key={index} className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-sm text-gray-900">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Última visita</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(paciente.lastVisit).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Próxima cita</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(paciente.nextAppointment).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comunicaciones' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Comunicaciones</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-blue-900">Email enviado</h4>
                      <p className="text-sm text-blue-700 mt-1">Recordatorio de cita para mañana</p>
                      <p className="text-xs text-blue-600 mt-1">15 de enero, 2024 - 10:30</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-green-900">SMS enviado</h4>
                      <p className="text-sm text-green-700 mt-1">Confirmación de cita programada</p>
                      <p className="text-xs text-green-600 mt-1">10 de enero, 2024 - 14:20</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actividad' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivities.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center ring-8 ring-white">
                                <Icon className={`h-4 w-4 ${getActivityColor(activity.status)}`} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.description}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(activity.date).toLocaleDateString('es-ES')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacienteDetalle;