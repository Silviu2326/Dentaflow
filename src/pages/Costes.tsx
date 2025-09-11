import React, { useState } from 'react';
import {
  Calculator,
  Search,
  Filter,
  Plus,
  Edit,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  User,
  Package,
  BarChart3,
  PieChart,
  Download,
  Target,
  Award,
  Activity
} from 'lucide-react';
import NewAnalysisModal from '../components/NewAnalysisModal';
import StatisticsModal from '../components/StatisticsModal';

interface CosteTratamiento {
  id: string;
  tratamiento: string;
  categoria: string;
  duracionMinutos: number;
  costeMaterial: number;
  costeManoObra: number;
  costeTotal: number;
  precioVenta: number;
  margen: number;
  margenPorcentaje: number;
  profesionalPrincipal: string;
  ultimaActualizacion: string;
}

interface MargenProfesional {
  id: string;
  profesional: string;
  especialidad: string;
  costePorHora: number;
  tratamientosRealizados: number;
  horasTrabajadas: number;
  ingresosBrutos: number;
  costesTotales: number;
  margenNeto: number;
  margenPorcentaje: number;
  eficiencia: number;
  periodo: string;
}

interface CosteMaterial {
  id: string;
  material: string;
  categoria: string;
  precioUnitario: number;
  cantidadUsada: number;
  costeTotal: number;
  proveedor: string;
  tratamiento: string;
  fecha: string;
}

const Costes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tratamientos' | 'profesionales' | 'materiales'>('tratamientos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [selectedPeriodo, setSelectedPeriodo] = useState('mes_actual');
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);

  const [costesTratamientos] = useState<CosteTratamiento[]>([
    {
      id: '1',
      tratamiento: 'Endodoncia Molar',
      categoria: 'Endodoncia',
      duracionMinutos: 90,
      costeMaterial: 45.50,
      costeManoObra: 135.00,
      costeTotal: 180.50,
      precioVenta: 350.00,
      margen: 169.50,
      margenPorcentaje: 48.43,
      profesionalPrincipal: 'Dr. Martín García',
      ultimaActualizacion: '2024-01-15'
    },
    {
      id: '2',
      tratamiento: 'Implante Dental',
      categoria: 'Implantología',
      duracionMinutos: 120,
      costeMaterial: 280.00,
      costeManoObra: 200.00,
      costeTotal: 480.00,
      precioVenta: 1200.00,
      margen: 720.00,
      margenPorcentaje: 60.00,
      profesionalPrincipal: 'Dr. Ana López',
      ultimaActualizacion: '2024-01-12'
    },
    {
      id: '3',
      tratamiento: 'Limpieza Dental',
      categoria: 'Preventiva',
      duracionMinutos: 45,
      costeMaterial: 8.50,
      costeManoObra: 45.00,
      costeTotal: 53.50,
      precioVenta: 80.00,
      margen: 26.50,
      margenPorcentaje: 33.13,
      profesionalPrincipal: 'Higienista María',
      ultimaActualizacion: '2024-01-10'
    },
    {
      id: '4',
      tratamiento: 'Corona de Porcelana',
      categoria: 'Prótesis',
      duracionMinutos: 60,
      costeMaterial: 120.00,
      costeManoObra: 90.00,
      costeTotal: 210.00,
      precioVenta: 450.00,
      margen: 240.00,
      margenPorcentaje: 53.33,
      profesionalPrincipal: 'Dr. Carlos Ruiz',
      ultimaActualizacion: '2024-01-08'
    }
  ]);

  const [margenesProfesionales] = useState<MargenProfesional[]>([
    {
      id: '1',
      profesional: 'Dr. Martín García',
      especialidad: 'Endodoncia',
      costePorHora: 90.00,
      tratamientosRealizados: 85,
      horasTrabajadas: 128,
      ingresosBrutos: 18500.00,
      costesTotales: 11520.00,
      margenNeto: 6980.00,
      margenPorcentaje: 37.73,
      eficiencia: 92.5,
      periodo: 'Enero 2024'
    },
    {
      id: '2',
      profesional: 'Dr. Ana López',
      especialidad: 'Implantología',
      costePorHora: 100.00,
      tratamientosRealizados: 45,
      horasTrabajadas: 90,
      ingresosBrutos: 32400.00,
      costesTotales: 9000.00,
      margenNeto: 23400.00,
      margenPorcentaje: 72.22,
      eficiencia: 88.9,
      periodo: 'Enero 2024'
    },
    {
      id: '3',
      profesional: 'Dr. Carlos Ruiz',
      especialidad: 'Prótesis',
      costePorHora: 85.00,
      tratamientosRealizados: 65,
      horasTrabajadas: 98,
      ingresosBrutos: 15600.00,
      costesTotales: 8330.00,
      margenNeto: 7270.00,
      margenPorcentaje: 46.60,
      eficiencia: 94.2,
      periodo: 'Enero 2024'
    },
    {
      id: '4',
      profesional: 'Higienista María',
      especialidad: 'Higiene Dental',
      costePorHora: 35.00,
      tratamientosRealizados: 120,
      horasTrabajadas: 90,
      ingresosBrutos: 9600.00,
      costesTotales: 3150.00,
      margenNeto: 6450.00,
      margenPorcentaje: 67.19,
      eficiencia: 96.7,
      periodo: 'Enero 2024'
    }
  ]);

  const [costesMateriales] = useState<CosteMaterial[]>([
    {
      id: '1',
      material: 'Implante Titanio 4.1x10mm',
      categoria: 'Implantes',
      precioUnitario: 180.00,
      cantidadUsada: 15,
      costeTotal: 2700.00,
      proveedor: 'Straumann',
      tratamiento: 'Implante Dental',
      fecha: '2024-01-15'
    },
    {
      id: '2',
      material: 'Lima Endodóntica',
      categoria: 'Endodoncia',
      precioUnitario: 12.50,
      cantidadUsada: 85,
      costeTotal: 1062.50,
      proveedor: 'Dentsply Sirona',
      tratamiento: 'Endodoncia Molar',
      fecha: '2024-01-14'
    },
    {
      id: '3',
      material: 'Porcelana Dental',
      categoria: 'Prótesis',
      precioUnitario: 95.00,
      cantidadUsada: 28,
      costeTotal: 2660.00,
      proveedor: 'Vita Zahnfabrik',
      tratamiento: 'Corona de Porcelana',
      fecha: '2024-01-12'
    },
    {
      id: '4',
      material: 'Pasta Profiláctica',
      categoria: 'Preventiva',
      precioUnitario: 3.50,
      cantidadUsada: 120,
      costeTotal: 420.00,
      proveedor: 'Kerr',
      tratamiento: 'Limpieza Dental',
      fecha: '2024-01-10'
    }
  ]);

  const getMargenColor = (porcentaje: number) => {
    if (porcentaje >= 60) return 'text-green-600 bg-green-100';
    if (porcentaje >= 40) return 'text-yellow-600 bg-yellow-100';
    if (porcentaje >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getEficienciaColor = (eficiencia: number) => {
    if (eficiencia >= 95) return 'text-green-600 bg-green-100';
    if (eficiencia >= 90) return 'text-blue-600 bg-blue-100';
    if (eficiencia >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredTratamientos = costesTratamientos.filter(tratamiento => {
    const matchesSearch = tratamiento.tratamiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tratamiento.profesionalPrincipal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'todas' || tratamiento.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const filteredProfesionales = margenesProfesionales.filter(profesional =>
    profesional.profesional.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesional.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMateriales = costesMateriales.filter(material =>
    material.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tratamiento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnalysis = (analysisData: any) => {
    console.log('Creating analysis:', analysisData);
    alert('Nuevo análisis creado exitosamente');
    setShowNewAnalysisModal(false);
  };

  const handleExportAnalysis = () => {
    // Crear datos para exportar
    const exportData = {
      fecha: new Date().toLocaleDateString('es-ES'),
      tratamientos: filteredTratamientos.map(t => ({
        tratamiento: t.tratamiento,
        categoria: t.categoria,
        costeMaterial: t.costeMaterial,
        costeManoObra: t.costeManoObra,
        costeTotal: t.costeTotal,
        precioVenta: t.precioVenta,
        margen: t.margen,
        margenPorcentaje: t.margenPorcentaje,
        profesional: t.profesionalPrincipal
      })),
      resumen: {
        margenPromedio: (costesTratamientos.reduce((acc, t) => acc + t.margenPorcentaje, 0) / costesTratamientos.length).toFixed(1),
        ingresosTotales: costesTratamientos.reduce((acc, t) => acc + t.precioVenta, 0),
        tiempoPromedio: Math.round(costesTratamientos.reduce((acc, t) => acc + t.duracionMinutos, 0) / costesTratamientos.length),
        mejorMargen: Math.max(...costesTratamientos.map(t => t.margenPorcentaje)).toFixed(1)
      }
    };
    
    // Crear archivo CSV
    const csvContent = [
      'Tratamiento,Categoría,Coste Material,Coste Mano Obra,Coste Total,Precio Venta,Margen,Margen %,Profesional',
      ...exportData.tratamientos.map(t => 
        `"${t.tratamiento}","${t.categoria}",${t.costeMaterial},${t.costeManoObra},${t.costeTotal},${t.precioVenta},${t.margen},${t.margenPorcentaje},"${t.profesional}"`
      )
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analisis_costes_tratamientos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Análisis exportado exitosamente');
  };

  const handleEditTreatment = (tratamiento: CosteTratamiento) => {
    alert(`Editando tratamiento: ${tratamiento.tratamiento}`);
    // Aquí podrías abrir un modal de edición
  };

  const handleViewCharts = (tratamiento: CosteTratamiento) => {
    setShowStatisticsModal(true);
  };

  const handleOpenStatistics = () => {
    setShowStatisticsModal(true);
  };

  const renderTratamientos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Costes por Tratamiento</h3>
        <div className="flex space-x-3">
          <button 
            onClick={handleOpenStatistics}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Estadísticas
          </button>
          <button 
            onClick={handleExportAnalysis}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar Análisis
          </button>
          <button 
            onClick={() => setShowNewAnalysisModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Análisis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Margen Promedio</p>
              <p className="text-3xl font-bold text-white mt-1">
                {(costesTratamientos.reduce((acc, t) => acc + t.margenPorcentaje, 0) / costesTratamientos.length).toFixed(1)}%
              </p>
              <p className="text-blue-100 text-xs mt-1">En todos los tratamientos</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-white mt-1">
                €{costesTratamientos.reduce((acc, t) => acc + t.precioVenta, 0).toLocaleString()}
              </p>
              <p className="text-green-100 text-xs mt-1">Facturado en el periodo</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-white mt-1">
                {Math.round(costesTratamientos.reduce((acc, t) => acc + t.duracionMinutos, 0) / costesTratamientos.length)} min
              </p>
              <p className="text-yellow-100 text-xs mt-1">Por tratamiento</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Mejor Margen</p>
              <p className="text-3xl font-bold text-white mt-1">
                {Math.max(...costesTratamientos.map(t => t.margenPorcentaje)).toFixed(1)}%
              </p>
              <p className="text-purple-100 text-xs mt-1">Máximo alcanzado</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTratamientos.map((tratamiento) => (
          <div key={tratamiento.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{tratamiento.tratamiento}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                        {tratamiento.categoria}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getMargenColor(tratamiento.margenPorcentaje)} ${getMargenColor(tratamiento.margenPorcentaje).includes('green') ? 'border-green-200' : getMargenColor(tratamiento.margenPorcentaje).includes('yellow') ? 'border-yellow-200' : getMargenColor(tratamiento.margenPorcentaje).includes('orange') ? 'border-orange-200' : 'border-red-200'}`}>
                        {tratamiento.margenPorcentaje >= 50 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {tratamiento.margenPorcentaje.toFixed(1)}% margen
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-200">
                    <div className="text-xs font-semibold text-blue-600 mb-1">Duración</div>
                    <div className="text-sm font-bold text-gray-900">{tratamiento.duracionMinutos} min</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
                    <div className="text-xs font-semibold text-yellow-600 mb-1">Material</div>
                    <div className="text-sm font-bold text-gray-900">€{tratamiento.costeMaterial.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <div className="text-xs font-semibold text-purple-600 mb-1">Mano de obra</div>
                    <div className="text-sm font-bold text-gray-900">€{tratamiento.costeManoObra.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-xl border border-red-200">
                    <div className="text-xs font-semibold text-red-600 mb-1">Coste total</div>
                    <div className="text-sm font-bold text-gray-900">€{tratamiento.costeTotal.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                    <div className="text-xs font-semibold text-green-600 mb-1">Precio venta</div>
                    <div className="text-sm font-bold text-gray-900">€{tratamiento.precioVenta.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-xl border border-teal-200">
                    <div className="text-xs font-semibold text-teal-600 mb-1">Margen</div>
                    <div className="text-sm font-bold text-gray-900">€{tratamiento.margen.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span className="font-medium">{tratamiento.profesionalPrincipal}</span>
                  </span>
                  <span>•</span>
                  <span>Actualizado: {new Date(tratamiento.ultimaActualizacion).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
              <div className="flex space-x-2 ml-6">
                <button 
                  onClick={() => handleEditTreatment(tratamiento)}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 group" 
                  title="Editar"
                >
                  <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => handleViewCharts(tratamiento)}
                  className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-lg transition-colors duration-200 group" 
                  title="Ver gráficos"
                >
                  <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfesionales = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Márgenes por Profesional</h3>
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Download className="h-5 w-5 mr-2" />
            Reporte Productividad
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Award className="h-5 w-5 mr-2" />
            Configurar Objetivos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-white mt-1">
                €{margenesProfesionales.reduce((acc, p) => acc + p.ingresosBrutos, 0).toLocaleString()}
              </p>
              <p className="text-green-100 text-xs mt-1">De todos los profesionales</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Margen Promedio</p>
              <p className="text-3xl font-bold text-white mt-1">
                {(margenesProfesionales.reduce((acc, p) => acc + p.margenPorcentaje, 0) / margenesProfesionales.length).toFixed(1)}%
              </p>
              <p className="text-blue-100 text-xs mt-1">Rentabilidad general</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Eficiencia Promedio</p>
              <p className="text-3xl font-bold text-white mt-1">
                {(margenesProfesionales.reduce((acc, p) => acc + p.eficiencia, 0) / margenesProfesionales.length).toFixed(1)}%
              </p>
              <p className="text-purple-100 text-xs mt-1">Productividad del equipo</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Horas Trabajadas</p>
              <p className="text-3xl font-bold text-white mt-1">
                {margenesProfesionales.reduce((acc, p) => acc + p.horasTrabajadas, 0)}h
              </p>
              <p className="text-yellow-100 text-xs mt-1">Tiempo total dedicado</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredProfesionales.map((profesional) => (
          <div key={profesional.id} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {profesional.profesional.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">{profesional.profesional}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                        {profesional.especialidad}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getMargenColor(profesional.margenPorcentaje)} ${getMargenColor(profesional.margenPorcentaje).includes('green') ? 'border-green-200' : getMargenColor(profesional.margenPorcentaje).includes('yellow') ? 'border-yellow-200' : getMargenColor(profesional.margenPorcentaje).includes('orange') ? 'border-orange-200' : 'border-red-200'}`}>
                        {profesional.margenPorcentaje >= 50 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {profesional.margenPorcentaje.toFixed(1)}% margen
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getEficienciaColor(profesional.eficiencia)} ${getEficienciaColor(profesional.eficiencia).includes('green') ? 'border-green-200' : getEficienciaColor(profesional.eficiencia).includes('blue') ? 'border-blue-200' : getEficienciaColor(profesional.eficiencia).includes('yellow') ? 'border-yellow-200' : 'border-red-200'}`}>
                        <Activity className="h-3 w-3 mr-1" />
                        {profesional.eficiencia.toFixed(1)}% eficiencia
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{profesional.tratamientosRealizados}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-1">Tratamientos</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">{profesional.horasTrabajadas}h</div>
                    <div className="text-xs font-semibold text-purple-600 mt-1">Horas</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600">€{profesional.ingresosBrutos.toLocaleString()}</div>
                    <div className="text-xs font-semibold text-green-600 mt-1">Ingresos Brutos</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200 text-center">
                    <div className="text-2xl font-bold text-red-600">€{profesional.costesTotales.toLocaleString()}</div>
                    <div className="text-xs font-semibold text-red-600 mt-1">Costes Totales</div>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 text-center">
                    <div className="text-2xl font-bold text-teal-600">€{profesional.margenNeto.toLocaleString()}</div>
                    <div className="text-xs font-semibold text-teal-600 mt-1">Margen Neto</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200 text-center">
                    <div className="text-2xl font-bold text-orange-600">€{profesional.costePorHora}/h</div>
                    <div className="text-xs font-semibold text-orange-600 mt-1">Coste/Hora</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-6">
                <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 group" title="Editar">
                  <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-lg transition-colors duration-200 group" title="Ver gráficos">
                  <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="font-medium">Periodo:</span> {profesional.periodo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMateriales = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Análisis de Costes de Materiales</h3>
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Download className="h-5 w-5 mr-2" />
            Reporte Materiales
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <PieChart className="h-5 w-5 mr-2" />
            Análisis por Categoría
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Coste Total Materiales</p>
              <p className="text-3xl font-bold text-white mt-1">
                €{costesMateriales.reduce((acc, m) => acc + m.costeTotal, 0).toLocaleString()}
              </p>
              <p className="text-blue-100 text-xs mt-1">Inversión en suministros</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Precio Medio</p>
              <p className="text-3xl font-bold text-white mt-1">
                €{(costesMateriales.reduce((acc, m) => acc + m.precioUnitario, 0) / costesMateriales.length).toFixed(2)}
              </p>
              <p className="text-green-100 text-xs mt-1">Por unidad de material</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Materiales Únicos</p>
              <p className="text-3xl font-bold text-white mt-1">{costesMateriales.length}</p>
              <p className="text-purple-100 text-xs mt-1">Tipos diferentes</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Uso Total</p>
              <p className="text-3xl font-bold text-white mt-1">
                {costesMateriales.reduce((acc, m) => acc + m.cantidadUsada, 0)}
              </p>
              <p className="text-yellow-100 text-xs mt-1">Unidades consumidas</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMateriales.map((material) => (
          <div key={material.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{material.material}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                        {material.categoria}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600 border border-blue-200">
                        <Package className="h-3 w-3 mr-1" />
                        {material.cantidadUsada} unidades
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-200">
                    <div className="text-xs font-semibold text-blue-600 mb-1">Precio unitario</div>
                    <div className="text-sm font-bold text-gray-900">€{material.precioUnitario.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                    <div className="text-xs font-semibold text-green-600 mb-1">Coste total</div>
                    <div className="text-sm font-bold text-gray-900">€{material.costeTotal.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <div className="text-xs font-semibold text-purple-600 mb-1">Proveedor</div>
                    <div className="text-sm font-bold text-gray-900">{material.proveedor}</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
                    <div className="text-xs font-semibold text-yellow-600 mb-1">Tratamiento</div>
                    <div className="text-sm font-bold text-gray-900">{material.tratamiento}</div>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-xl border border-teal-200">
                    <div className="text-xs font-semibold text-teal-600 mb-1">Fecha</div>
                    <div className="text-sm font-bold text-gray-900">{new Date(material.fecha).toLocaleDateString('es-ES')}</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-6">
                <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 group" title="Editar">
                  <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
                <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-lg transition-colors duration-200 group" title="Ver gráficos">
                  <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Análisis de Costes
          </h1>
          <p className="text-gray-600 text-lg">
            Coste por tratamiento (material + tiempo) y margen por profesional
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('tratamientos')}
              className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'tratamientos'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'tratamientos' 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-purple-100'
              }`}>
                <Calculator className={`h-5 w-5 ${
                  activeTab === 'tratamientos' ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Costes Tratamientos</div>
                <div className={`text-xs ${
                  activeTab === 'tratamientos' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  Análisis por procedimiento
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('profesionales')}
              className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'profesionales'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'profesionales' 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-blue-100'
              }`}>
                <User className={`h-5 w-5 ${
                  activeTab === 'profesionales' ? 'text-white' : 'text-blue-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Márgenes Profesionales</div>
                <div className={`text-xs ${
                  activeTab === 'profesionales' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  Rentabilidad por profesional
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('materiales')}
              className={`flex items-center px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'materiales'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === 'materiales' 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-green-100'
              }`}>
                <Package className={`h-5 w-5 ${
                  activeTab === 'materiales' ? 'text-white' : 'text-green-600'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Análisis Materiales</div>
                <div className={`text-xs ${
                  activeTab === 'materiales' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  Costes de suministros
                </div>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  placeholder={
                    activeTab === 'tratamientos' ? 'Buscar tratamientos...' :
                    activeTab === 'profesionales' ? 'Buscar profesionales...' :
                    'Buscar materiales...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              {activeTab === 'tratamientos' && (
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                >
                  <option value="todas">Todas las categorías</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Implantología">Implantología</option>
                  <option value="Preventiva">Preventiva</option>
                  <option value="Prótesis">Prótesis</option>
                </select>
              )}
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
              >
                <option value="mes_actual">Mes actual</option>
                <option value="trimestre">Último trimestre</option>
                <option value="semestre">Último semestre</option>
                <option value="año">Último año</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'tratamientos' && renderTratamientos()}
      {activeTab === 'profesionales' && renderProfesionales()}
      {activeTab === 'materiales' && renderMateriales()}

      {/* New Analysis Modal */}
      <NewAnalysisModal
        isOpen={showNewAnalysisModal}
        onClose={() => setShowNewAnalysisModal(false)}
        onSubmit={handleCreateAnalysis}
      />

      {/* Statistics Modal */}
      <StatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        data={{
          tratamientos: costesTratamientos,
          profesionales: margenesProfesionales
        }}
      />
    </div>
  );
};

export default Costes;