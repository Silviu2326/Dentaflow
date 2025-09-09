import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Download, Euro, Calendar, Receipt, FileText } from 'lucide-react';

const PacienteFacturacion = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('facturas');

  const paciente = {
    name: 'Ana García López',
    id: 1
  };

  const facturas = [
    {
      id: 'F-2024-001',
      date: '2024-01-15',
      amount: 450.00,
      status: 'paid',
      treatment: 'Limpieza + Endodoncia',
      dueDate: '2024-02-15',
      paymentDate: '2024-01-15',
      paymentMethod: 'card'
    },
    {
      id: 'F-2024-002',
      date: '2024-01-20',
      amount: 800.00,
      status: 'pending',
      treatment: 'Consulta Ortodoncia',
      dueDate: '2024-02-20',
      paymentDate: null,
      paymentMethod: null
    }
  ];

  const bonos = [
    {
      id: 'B-2024-001',
      name: 'Bono Limpieza x5',
      purchaseDate: '2024-01-10',
      amount: 300.00,
      remaining: 3,
      total: 5,
      expiryDate: '2025-01-10'
    }
  ];

  const financiacion = [
    {
      id: 'FIN-2024-001',
      treatment: 'Ortodoncia',
      totalAmount: 2500.00,
      monthlyPayment: 104.17,
      totalMonths: 24,
      paidMonths: 2,
      nextPayment: '2024-02-01',
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      case 'active': return 'Activo';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string | null) => {
    if (!method) return 'N/A';
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      default: return method;
    }
  };

  const tabs = [
    { id: 'facturas', name: 'Facturas', icon: FileText },
    { id: 'cobros', name: 'Cobros', icon: CreditCard },
    { id: 'bonos', name: 'Bonos', icon: Receipt },
    { id: 'financiacion', name: 'Financiación', icon: Euro }
  ];

  const totalPendiente = facturas.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPagado = facturas.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
            <p className="text-gray-600">{paciente.name}</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
              <Download className="h-5 w-5 mr-2" />
              Exportar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Factura
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-md">
                <Euro className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Pagado</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalPagado.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-md">
                <Euro className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendiente</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalPendiente.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-md">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bonos Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{bonos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-md">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Financiaciones</p>
                <p className="text-2xl font-semibold text-gray-900">{financiacion.length}</p>
              </div>
            </div>
          </div>
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
          {activeTab === 'facturas' && (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tratamiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Importe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facturas.map((factura) => (
                      <tr key={factura.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {factura.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {factura.treatment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{new Date(factura.date).toLocaleDateString('es-ES')}</div>
                            <div className="text-xs text-gray-500">
                              Vence: {new Date(factura.dueDate).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          €{factura.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(factura.status)}`}>
                            {getStatusText(factura.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Ver</button>
                          {factura.status === 'pending' && (
                            <button className="text-green-600 hover:text-green-900">Cobrar</button>
                          )}
                          <button className="text-gray-600 hover:text-gray-900">PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cobros' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Cobros</h3>
              <div className="space-y-4">
                {facturas.filter(f => f.status === 'paid').map((factura) => (
                  <div key={factura.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-900">{factura.treatment}</h4>
                        <p className="text-sm text-green-700">{factura.id}</p>
                        <p className="text-xs text-green-600">
                          Pagado el {factura.paymentDate ? new Date(factura.paymentDate).toLocaleDateString('es-ES') : 'N/A'} 
                          {factura.paymentMethod && ` - ${getPaymentMethodText(factura.paymentMethod)}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-900">€{factura.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bonos' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bonos y Tarjetas Regalo</h3>
              <div className="space-y-4">
                {bonos.map((bono) => (
                  <div key={bono.id} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-blue-900">{bono.name}</h4>
                        <p className="text-sm text-blue-700">
                          Comprado el {new Date(bono.purchaseDate).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs text-blue-600">
                          Vence el {new Date(bono.expiryDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-900">€{bono.amount.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-blue-700">Sesiones restantes:</span>
                        <span className="ml-2 text-lg font-semibold text-blue-900">{bono.remaining}/{bono.total}</span>
                      </div>
                      <div className="w-32 bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${((bono.total - bono.remaining) / bono.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {bonos.length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No hay bonos activos</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'financiacion' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Planes de Financiación</h3>
              <div className="space-y-4">
                {financiacion.map((plan) => (
                  <div key={plan.id} className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-purple-900">{plan.treatment}</h4>
                        <p className="text-sm text-purple-700">
                          {plan.id} - {plan.totalMonths} cuotas de €{plan.monthlyPayment.toFixed(2)}
                        </p>
                        <p className="text-xs text-purple-600">
                          Próximo pago: {new Date(plan.nextPayment).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-900">€{plan.totalAmount.toFixed(2)}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                          {getStatusText(plan.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-700">Progreso</span>
                        <span className="text-purple-700">{plan.paidMonths}/{plan.totalMonths} cuotas</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(plan.paidMonths / plan.totalMonths) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-600">
                          Pagado: €{(plan.paidMonths * plan.monthlyPayment).toFixed(2)}
                        </span>
                        <span className="text-purple-600">
                          Pendiente: €{((plan.totalMonths - plan.paidMonths) * plan.monthlyPayment).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {financiacion.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No hay planes de financiación activos</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacienteFacturacion;