import React from 'react';
import { X, BarChart3, PieChart, TrendingUp, TrendingDown, Calculator, DollarSign, Clock, Target } from 'lucide-react';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    tratamientos: Array<{
      id: string;
      tratamiento: string;
      categoria: string;
      margenPorcentaje: number;
      precioVenta: number;
      costeTotal: number;
      duracionMinutos: number;
    }>;
    profesionales: Array<{
      id: string;
      profesional: string;
      margenPorcentaje: number;
      ingresosBrutos: number;
      eficiencia: number;
      tratamientosRealizados: number;
    }>;
  };
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const treatmentStats = data.tratamientos.reduce((acc, t) => {
    acc.totalRevenue += t.precioVenta;
    acc.totalCost += t.costeTotal;
    acc.totalTime += t.duracionMinutos;
    acc.avgMargin += t.margenPorcentaje;
    return acc;
  }, { totalRevenue: 0, totalCost: 0, totalTime: 0, avgMargin: 0 });

  treatmentStats.avgMargin = treatmentStats.avgMargin / data.tratamientos.length;
  const totalProfit = treatmentStats.totalRevenue - treatmentStats.totalCost;
  const profitMargin = (totalProfit / treatmentStats.totalRevenue) * 100;

  const categoryStats = data.tratamientos.reduce((acc, t) => {
    if (!acc[t.categoria]) {
      acc[t.categoria] = { count: 0, revenue: 0, margin: 0 };
    }
    acc[t.categoria].count++;
    acc[t.categoria].revenue += t.precioVenta;
    acc[t.categoria].margin += t.margenPorcentaje;
    return acc;
  }, {} as Record<string, { count: number; revenue: number; margin: number }>);

  Object.keys(categoryStats).forEach(cat => {
    categoryStats[cat].margin = categoryStats[cat].margin / categoryStats[cat].count;
  });

  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1].revenue - a[1].revenue)[0];
  const bestMarginCategory = Object.entries(categoryStats).sort((a, b) => b[1].margin - a[1].margin)[0];

  const professionalStats = data.profesionales.reduce((acc, p) => {
    acc.totalRevenue += p.ingresosBrutos;
    acc.totalTreatments += p.tratamientosRealizados;
    acc.avgEfficiency += p.eficiencia;
    acc.avgMargin += p.margenPorcentaje;
    return acc;
  }, { totalRevenue: 0, totalTreatments: 0, avgEfficiency: 0, avgMargin: 0 });

  professionalStats.avgEfficiency = professionalStats.avgEfficiency / data.profesionales.length;
  professionalStats.avgMargin = professionalStats.avgMargin / data.profesionales.length;

  const topProfessional = data.profesionales.sort((a, b) => b.ingresosBrutos - a.ingresosBrutos)[0];
  const mostEfficientProfessional = data.profesionales.sort((a, b) => b.eficiencia - a.eficiencia)[0];

  const getColorByValue = (value: number, threshold1: number, threshold2: number) => {
    if (value >= threshold2) return 'text-green-600 bg-green-100 border-green-200';
    if (value >= threshold1) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Estadísticas y Análisis Comparativo
              </h2>
              <p className="text-gray-600 mt-1">Resumen completo de rendimiento y métricas clave</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Métricas Generales */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calculator className="h-6 w-6 mr-3 text-purple-600" />
              Métricas Generales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      €{treatmentStats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-blue-100 text-xs mt-1">Facturación total</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-100" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Beneficio Neto</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      €{totalProfit.toLocaleString()}
                    </p>
                    <p className="text-green-100 text-xs mt-1">{profitMargin.toFixed(1)}% margen</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-100" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Tiempo Total</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {Math.round(treatmentStats.totalTime / 60)}h
                    </p>
                    <p className="text-yellow-100 text-xs mt-1">{treatmentStats.totalTime} minutos</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-100" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Margen Promedio</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {treatmentStats.avgMargin.toFixed(1)}%
                    </p>
                    <p className="text-purple-100 text-xs mt-1">Rentabilidad media</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Análisis por Categorías */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-3 text-blue-600" />
              Análisis por Categorías de Tratamiento
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Categoría</h4>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, stats]) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{category}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColorByValue(stats.margin, 40, 60)}`}>
                            {stats.margin.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{stats.count} tratamientos</span>
                          <span>€{stats.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(stats.revenue / treatmentStats.totalRevenue) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Categorías</h4>
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Categoría con Mayor Facturación</span>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-xl font-bold text-green-900">{topCategory?.[0]}</div>
                    <div className="text-sm text-green-700">€{topCategory?.[1].revenue.toLocaleString()} • {topCategory?.[1].count} tratamientos</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Mejor Margen de Rentabilidad</span>
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-blue-900">{bestMarginCategory?.[0]}</div>
                    <div className="text-sm text-blue-700">{bestMarginCategory?.[1].margin.toFixed(1)}% margen promedio</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">Oportunidades de Mejora</span>
                      <TrendingDown className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="text-sm text-yellow-700">
                      {Object.entries(categoryStats)
                        .filter(([, stats]) => stats.margin < 40)
                        .map(([cat]) => cat)
                        .join(', ') || 'Todas las categorías tienen buen rendimiento'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Análisis de Profesionales */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-green-600" />
              Análisis de Rendimiento por Profesional
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Profesionales</h4>
                <div className="space-y-4">
                  {data.profesionales
                    .sort((a, b) => b.ingresosBrutos - a.ingresosBrutos)
                    .map((prof, index) => (
                    <div key={prof.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-300 text-orange-700' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{prof.profesional}</span>
                          <span className="text-lg font-bold text-green-600">€{prof.ingresosBrutos.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{prof.tratamientosRealizados} tratamientos</span>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getColorByValue(prof.margenPorcentaje, 40, 60)}`}>
                              {prof.margenPorcentaje.toFixed(1)}% margen
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getColorByValue(prof.eficiencia, 85, 95)}`}>
                              {prof.eficiencia.toFixed(1)}% eficiencia
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Destacados del Equipo</h4>
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Mayor Facturación</span>
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-blue-900">{topProfessional?.profesional}</div>
                    <div className="text-sm text-blue-700">
                      €{topProfessional?.ingresosBrutos.toLocaleString()} • {topProfessional?.tratamientosRealizados} tratamientos
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Mayor Eficiencia</span>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-xl font-bold text-green-900">{mostEfficientProfessional?.profesional}</div>
                    <div className="text-sm text-green-700">{mostEfficientProfessional?.eficiencia.toFixed(1)}% de eficiencia</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-800">Métricas del Equipo</span>
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-purple-900 font-semibold">{professionalStats.avgMargin.toFixed(1)}%</div>
                        <div className="text-purple-700">Margen promedio</div>
                      </div>
                      <div>
                        <div className="text-purple-900 font-semibold">{professionalStats.avgEfficiency.toFixed(1)}%</div>
                        <div className="text-purple-700">Eficiencia promedio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparativas y Tendencias */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-red-600" />
              Análisis Comparativo y Recomendaciones
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Fortalezas
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Margen promedio saludable ({treatmentStats.avgMargin.toFixed(1)}%)</li>
                  <li>• {topCategory?.[0]} es la categoría líder en facturación</li>
                  <li>• {mostEfficientProfessional?.profesional} destaca en eficiencia</li>
                  <li>• Rentabilidad total del {profitMargin.toFixed(1)}%</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Oportunidades
                </h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• Optimizar costes en tratamientos de menor margen</li>
                  <li>• Incrementar la eficiencia promedio del equipo</li>
                  <li>• Evaluar precios de categorías menos rentables</li>
                  <li>• Potenciar las especialidades más exitosas</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Acciones Recomendadas
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Analizar costes de materiales mensuales</li>
                  <li>• Capacitar al equipo en eficiencia operativa</li>
                  <li>• Revisar precios de tratamientos menos rentables</li>
                  <li>• Implementar objetivos de margen por categoría</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;