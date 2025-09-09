import React, { useState } from 'react';
import { Calculator, CreditCard, FileText, AlertCircle, CheckCircle, Clock, Euro, Calendar, TrendingUp, Users, Filter, Search, Download } from 'lucide-react';

interface SolicitudFinanciacion {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  presupuestoId: string;
  importe: number;
  cuotas: number;
  entidadFinanciera: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'documentacion' | 'firmada';
  fechaSolicitud: string;
  fechaRespuesta?: string;
  tasaInteres: number;
  importeCuota: number;
  primeraCuota: string;
}

interface CuotaReconciliacion {
  id: string;
  solicitudId: string;
  numeroCuota: number;
  fechaVencimiento: string;
  importe: number;
  estado: 'pendiente' | 'cobrada' | 'vencida' | 'incidencia';
  fechaCobro?: string;
  referencia?: string;
}

interface SimulacionFinanciacion {
  importe: number;
  cuotas: number;
  tasaInteres: number;
  comisionApertura: number;
  importeTotal: number;
  importeCuota: number;
  entidad: string;
}

export default function Financiacion() {
  const [activeTab, setActiveTab] = useState<'simulador' | 'solicitudes' | 'conciliacion'>('simulador');
  const [simulacion, setSimulacion] = useState({
    importe: 2500,
    cuotas: 12,
    entrada: 0
  });

  const solicitudes: SolicitudFinanciacion[] = [
    {
      id: 'SOL001',
      pacienteId: 'PAC001',
      pacienteNombre: 'María González',
      presupuestoId: 'PRES001',
      importe: 3500,
      cuotas: 18,
      entidadFinanciera: 'Santander Consumer',
      estado: 'aprobada',
      fechaSolicitud: '2024-01-15',
      fechaRespuesta: '2024-01-16',
      tasaInteres: 7.95,
      importeCuota: 210.45,
      primeraCuota: '2024-02-15'
    },
    {
      id: 'SOL002',
      pacienteId: 'PAC002',
      pacienteNombre: 'Carlos Ruiz',
      presupuestoId: 'PRES002',
      importe: 1800,
      cuotas: 12,
      entidadFinanciera: 'Cofidis',
      estado: 'documentacion',
      fechaSolicitud: '2024-01-20',
      tasaInteres: 9.95,
      importeCuota: 162.30,
      primeraCuota: '2024-02-20'
    },
    {
      id: 'SOL003',
      pacienteId: 'PAC003',
      pacienteNombre: 'Ana Torres',
      presupuestoId: 'PRES003',
      importe: 5200,
      cuotas: 24,
      entidadFinanciera: 'Sabadell Consumer',
      estado: 'rechazada',
      fechaSolicitud: '2024-01-18',
      fechaRespuesta: '2024-01-19',
      tasaInteres: 8.50,
      importeCuota: 245.80,
      primeraCuota: '2024-02-18'
    }
  ];

  const cuotas: CuotaReconciliacion[] = [
    {
      id: 'CUO001',
      solicitudId: 'SOL001',
      numeroCuota: 1,
      fechaVencimiento: '2024-02-15',
      importe: 210.45,
      estado: 'cobrada',
      fechaCobro: '2024-02-15',
      referencia: 'REF001'
    },
    {
      id: 'CUO002',
      solicitudId: 'SOL001',
      numeroCuota: 2,
      fechaVencimiento: '2024-03-15',
      importe: 210.45,
      estado: 'cobrada',
      fechaCobro: '2024-03-15',
      referencia: 'REF002'
    },
    {
      id: 'CUO003',
      solicitudId: 'SOL001',
      numeroCuota: 3,
      fechaVencimiento: '2024-04-15',
      importe: 210.45,
      estado: 'pendiente'
    },
    {
      id: 'CUO004',
      solicitudId: 'SOL002',
      numeroCuota: 1,
      fechaVencimiento: '2024-02-20',
      importe: 162.30,
      estado: 'vencida'
    }
  ];

  const entidadesFinancieras = [
    { nombre: 'Santander Consumer', tasaInteres: 7.95, comisionApertura: 2.5 },
    { nombre: 'Cofidis', tasaInteres: 9.95, comisionApertura: 3.0 },
    { nombre: 'Sabadell Consumer', tasaInteres: 8.50, comisionApertura: 2.0 },
    { nombre: 'Cetelem', tasaInteres: 8.75, comisionApertura: 2.5 }
  ];

  const calcularSimulacion = (importe: number, cuotas: number, entrada: number): SimulacionFinanciacion[] => {
    const importeFinanciar = importe - entrada;
    
    return entidadesFinancieras.map(entidad => {
      const tasaInteresMensual = entidad.tasaInteres / 100 / 12;
      const comisionApertura = (importeFinanciar * entidad.comisionApertura) / 100;
      const importeTotal = importeFinanciar + comisionApertura;
      
      const importeCuota = importeTotal * (tasaInteresMensual * Math.pow(1 + tasaInteresMensual, cuotas)) / 
                          (Math.pow(1 + tasaInteresMensual, cuotas) - 1);
      
      return {
        importe: importeFinanciar,
        cuotas,
        tasaInteres: entidad.tasaInteres,
        comisionApertura,
        importeTotal: importeCuota * cuotas,
        importeCuota,
        entidad: entidad.nombre
      };
    });
  };

  const simulaciones = calcularSimulacion(simulacion.importe, simulacion.cuotas, simulacion.entrada);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobada':
      case 'cobrada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      case 'documentacion':
        return 'bg-blue-100 text-blue-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
      case 'incidencia':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobada':
      case 'cobrada':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendiente':
        return <Clock className="h-4 w-4" />;
      case 'rechazada':
      case 'vencida':
      case 'incidencia':
        return <AlertCircle className="h-4 w-4" />;
      case 'documentacion':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financiación</h1>
          <p className="text-gray-600">Simulador de presupuestos, solicitudes y conciliación de cuotas</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'simulador'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calculator className="h-4 w-4 inline mr-2" />
          Simulador
        </button>
        <button
          onClick={() => setActiveTab('solicitudes')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'solicitudes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Solicitudes
        </button>
        <button
          onClick={() => setActiveTab('conciliacion')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'conciliacion'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CreditCard className="h-4 w-4 inline mr-2" />
          Conciliación
        </button>
      </div>

      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parámetros de Simulación</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Importe del Tratamiento</label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={simulacion.importe}
                      onChange={(e) => setSimulacion({...simulacion, importe: Number(e.target.value)})}
                      className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Cuotas</label>
                  <select
                    value={simulacion.cuotas}
                    onChange={(e) => setSimulacion({...simulacion, cuotas: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={6}>6 meses</option>
                    <option value={12}>12 meses</option>
                    <option value={18}>18 meses</option>
                    <option value={24}>24 meses</option>
                    <option value={36}>36 meses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entrada</label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={simulacion.entrada}
                      onChange={(e) => setSimulacion({...simulacion, entrada: Number(e.target.value)})}
                      className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Comparativa de Entidades</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {simulaciones.map((sim, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{sim.entidad}</h4>
                        <span className="text-lg font-bold text-blue-600">
                          {sim.importeCuota.toFixed(2)}€/mes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">TIN</span>
                          <div className="font-medium">{sim.tasaInteres}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Comisión</span>
                          <div className="font-medium">{sim.comisionApertura.toFixed(2)}€</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Importe Total</span>
                          <div className="font-medium">{sim.importeTotal.toFixed(2)}€</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Intereses</span>
                          <div className="font-medium">
                            {(sim.importeTotal - sim.importe - sim.comisionApertura).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'solicitudes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar solicitud..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="documentacion">Documentación</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Nueva Solicitud</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{solicitud.id}</div>
                          <div className="text-sm text-gray-500">{solicitud.fechaSolicitud}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{solicitud.pacienteNombre}</div>
                        <div className="text-sm text-gray-500">{solicitud.presupuestoId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {solicitud.importe.toLocaleString()}€
                        </div>
                        <div className="text-sm text-gray-500">{solicitud.cuotas} cuotas</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{solicitud.entidadFinanciera}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(solicitud.estado)}`}>
                          {getEstadoIcon(solicitud.estado)}
                          <span className="ml-1">{solicitud.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {solicitud.importeCuota.toFixed(2)}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                        <button className="text-green-600 hover:text-green-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conciliacion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cuotas Pendientes</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {cuotas.filter(c => c.estado === 'pendiente').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cuotas Cobradas</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {cuotas.filter(c => c.estado === 'cobrada').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cuotas Vencidas</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {cuotas.filter(c => c.estado === 'vencida').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Importe Total Mes</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {cuotas.reduce((sum, c) => sum + c.importe, 0).toFixed(0)}€
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cuota..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="cobrada">Cobrada</option>
                <option value="vencida">Vencida</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cuotas.map((cuota) => (
                    <tr key={cuota.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Cuota {cuota.numeroCuota}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cuota.solicitudId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cuota.fechaVencimiento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {cuota.importe.toFixed(2)}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(cuota.estado)}`}>
                          {getEstadoIcon(cuota.estado)}
                          <span className="ml-1">{cuota.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cuota.fechaCobro && (
                          <div>
                            <div className="text-sm text-gray-900">{cuota.fechaCobro}</div>
                            {cuota.referencia && (
                              <div className="text-xs text-gray-500">{cuota.referencia}</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {cuota.estado === 'pendiente' && (
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            Marcar Cobrada
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">Ver Detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}