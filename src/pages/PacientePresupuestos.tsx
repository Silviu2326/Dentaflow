import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Euro, Calendar, Send, Download, Edit } from 'lucide-react';

const PacientePresupuestos = () => {
  const { id } = useParams();

  const paciente = {
    name: 'Ana García López',
    id: 1
  };

  const presupuestos = [
    {
      id: 'P-2024-001',
      title: 'Tratamiento de Ortodoncia',
      date: '2024-01-20',
      amount: 2500.00,
      status: 'accepted',
      professional: 'Dra. Martinez',
      validUntil: '2024-03-20',
      treatments: [
        { name: 'Estudio ortodóncico', price: 150.00 },
        { name: 'Brackets metálicos', price: 1200.00 },
        { name: 'Revisiones mensuales (24 meses)', price: 1150.00 }
      ]
    },
    {
      id: 'P-2024-002',
      title: 'Endodoncia + Corona',
      date: '2024-01-15',
      amount: 650.00,
      status: 'pending',
      professional: 'Dr. Rodriguez',
      validUntil: '2024-02-15',
      treatments: [
        { name: 'Endodoncia pieza 16', price: 350.00 },
        { name: 'Corona zirconio', price: 300.00 }
      ]
    },
    {
      id: 'P-2024-003',
      title: 'Blanqueamiento Dental',
      date: '2024-01-10',
      amount: 280.00,
      status: 'rejected',
      professional: 'Dr. Lopez',
      validUntil: '2024-02-10',
      treatments: [
        { name: 'Blanqueamiento en consulta', price: 280.00 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceptado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      case 'expired': return 'Vencido';
      default: return status;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link
            to={`/pacientes/${id}`}
            className="mr-4 p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
            <p className="text-gray-600">{paciente.name}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Presupuesto
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-md">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Presupuestos</p>
                <p className="text-2xl font-semibold text-gray-900">{presupuestos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-md">
                <Euro className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Valor Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  €{presupuestos.reduce((total, p) => total + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-md">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aceptados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {presupuestos.filter(p => p.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-md">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {presupuestos.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Presupuestos List */}
      <div className="space-y-6">
        {presupuestos.map((presupuesto) => (
          <div key={presupuesto.id} className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{presupuesto.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{presupuesto.id}</span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(presupuesto.date).toLocaleDateString('es-ES')}
                      </span>
                      <span>{presupuesto.professional}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">€{presupuesto.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">
                      Válido hasta: {new Date(presupuesto.validUntil).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(presupuesto.status)}`}>
                    {getStatusText(presupuesto.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <h4 className="font-medium text-gray-900 mb-3">Desglose de Tratamientos</h4>
              <div className="space-y-2">
                {presupuesto.treatments.map((treatment, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{treatment.name}</span>
                    <span className="font-semibold text-gray-900">€{treatment.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar PDF
                  </button>
                  {presupuesto.status === 'pending' && (
                    <button className="text-green-600 hover:text-green-800 flex items-center text-sm">
                      <Send className="h-4 w-4 mr-1" />
                      Enviar por Email
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button className="text-gray-600 hover:text-gray-800 flex items-center text-sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  {presupuesto.status === 'pending' && (
                    <>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Aceptar
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {presupuestos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay presupuestos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando el primer presupuesto para este paciente.
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mx-auto">
              <Plus className="h-5 w-5 mr-2" />
              Crear Presupuesto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacientePresupuestos;