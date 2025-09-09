import React, { useState } from 'react';
import { Search, Plus, Download, Filter, CreditCard, Euro, Calendar, FileText } from 'lucide-react';

const Facturacion = () => {
  const [activeTab, setActiveTab] = useState('facturas');
  const [searchTerm, setSearchTerm] = useState('');

  const facturas = [
    {
      id: 'F-2024-001',
      patient: 'Ana García López',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 450.00,
      status: 'paid',
      treatment: 'Limpieza + Endodoncia',
      paymentMethod: 'card'
    },
    {
      id: 'F-2024-002',
      patient: 'Carlos López Martín',
      date: '2024-01-18',
      dueDate: '2024-02-18',
      amount: 1200.00,
      status: 'pending',
      treatment: 'Implante dental',
      paymentMethod: 'transfer'
    },
    {
      id: 'F-2024-003',
      patient: 'María Fernández',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      amount: 800.00,
      status: 'overdue',
      treatment: 'Ortodoncia',
      paymentMethod: 'cash'
    }
  ];

  const recibos = [
    {
      id: 'R-2024-015',
      patient: 'Ana García López',
      date: '2024-01-15',
      amount: 450.00,
      treatment: 'Limpieza + Endodoncia',
      paymentMethod: 'card'
    },
    {
      id: 'R-2024-016',
      patient: 'José Martín',
      date: '2024-01-16',
      amount: 150.00,
      treatment: 'Revisión',
      paymentMethod: 'cash'
    }
  ];

  const cajaDiaria = {
    date: '2024-01-25',
    opening: 200.00,
    income: 1450.00,
    expenses: 320.00,
    closing: 1330.00,
    payments: [
      { method: 'cash', amount: 580.00 },
      { method: 'card', amount: 620.00 },
      { method: 'transfer', amount: 250.00 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      default: return method;
    }
  };

  const tabs = [
    { id: 'facturas', name: 'Facturas', icon: FileText },
    { id: 'recibos', name: 'Recibos', icon: FileText },
    { id: 'caja', name: 'Caja Diaria', icon: CreditCard },
    { id: 'arqueos', name: 'Cierres y Arqueos', icon: Euro }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
            <p className="text-gray-600">Gestión de facturas, recibos y caja</p>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-md">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Mes</p>
              <p className="text-2xl font-semibold text-gray-900">€12.450</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-md">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pendiente Cobro</p>
              <p className="text-2xl font-semibold text-gray-900">€2.800</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-md">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Facturas Vencidas</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-md">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Caja Actual</p>
              <p className="text-2xl font-semibold text-gray-900">€{cajaDiaria.closing}</p>
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
              {/* Search */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Buscar facturas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-200">
                    <Filter className="h-5 w-5 mr-2" />
                    Filtros
                  </button>
                </div>
              </div>

              {/* Facturas Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
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
                          {factura.patient}
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
                          <button className="text-green-600 hover:text-green-900">Cobrar</button>
                          <button className="text-gray-600 hover:text-gray-900">PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'recibos' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recibos Emitidos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
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
                        Método Pago
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recibos.map((recibo) => (
                      <tr key={recibo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {recibo.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {recibo.patient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {recibo.treatment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(recibo.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          €{recibo.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getPaymentMethodText(recibo.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Ver</button>
                          <button className="text-gray-600 hover:text-gray-900">PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'caja' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Caja Diaria - {new Date(cajaDiaria.date).toLocaleDateString('es-ES')}</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resumen */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Resumen del Día</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Apertura</span>
                        <span className="font-medium">€{cajaDiaria.opening.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ingresos</span>
                        <span className="font-medium text-green-600">+€{cajaDiaria.income.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gastos</span>
                        <span className="font-medium text-red-600">-€{cajaDiaria.expenses.toFixed(2)}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-semibold">Cierre</span>
                        <span className="font-bold text-lg">€{cajaDiaria.closing.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Realizar Cierre de Caja
                  </button>
                </div>

                {/* Métodos de Pago */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Desglose por Método de Pago</h4>
                  <div className="space-y-4">
                    {cajaDiaria.payments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="font-medium">{getPaymentMethodText(payment.method)}</span>
                        </div>
                        <span className="font-semibold">€{payment.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arqueos' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cierres y Arqueos</h3>
              <div className="text-center py-12 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>Funcionalidad de arqueos en desarrollo</p>
                <p className="text-sm mt-2">Aquí se mostrarán los cierres de caja históricos</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Facturacion;