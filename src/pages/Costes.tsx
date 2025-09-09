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

  const renderTratamientos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Costes por Tratamiento</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Análisis
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Análisis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Margen Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(costesTratamientos.reduce((acc, t) => acc + t.margenPorcentaje, 0) / costesTratamientos.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Ingresos Totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{costesTratamientos.reduce((acc, t) => acc + t.precioVenta, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Tiempo Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(costesTratamientos.reduce((acc, t) => acc + t.duracionMinutos, 0) / costesTratamientos.length)} min
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Mejor Margen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.max(...costesTratamientos.map(t => t.margenPorcentaje)).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTratamientos.map((tratamiento) => (
            <li key={tratamiento.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{tratamiento.tratamiento}</h4>
                    <span className="text-sm text-gray-500">({tratamiento.categoria})</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMargenColor(tratamiento.margenPorcentaje)}`}>
                      {tratamiento.margenPorcentaje >= 50 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {tratamiento.margenPorcentaje.toFixed(1)}% margen
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Duración:</span> {tratamiento.duracionMinutos} min
                    </div>
                    <div>
                      <span className="font-medium">Material:</span> €{tratamiento.costeMaterial.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Mano de obra:</span> €{tratamiento.costeManoObra.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Coste total:</span> €{tratamiento.costeTotal.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Precio venta:</span> €{tratamiento.precioVenta.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Margen:</span> €{tratamiento.margen.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {tratamiento.profesionalPrincipal}
                    </span>
                    <span>Actualizado: {new Date(tratamiento.ultimaActualizacion).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderProfesionales = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Márgenes por Profesional</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Reporte Productividad
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Configurar Objetivos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Ingresos Totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{margenesProfesionales.reduce((acc, p) => acc + p.ingresosBrutos, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Margen Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(margenesProfesionales.reduce((acc, p) => acc + p.margenPorcentaje, 0) / margenesProfesionales.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Eficiencia Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(margenesProfesionales.reduce((acc, p) => acc + p.eficiencia, 0) / margenesProfesionales.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Horas Trabajadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {margenesProfesionales.reduce((acc, p) => acc + p.horasTrabajadas, 0)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProfesionales.map((profesional) => (
          <div key={profesional.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{profesional.profesional}</h4>
                  <span className="text-sm text-gray-500">({profesional.especialidad})</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMargenColor(profesional.margenPorcentaje)}`}>
                    {profesional.margenPorcentaje >= 50 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {profesional.margenPorcentaje.toFixed(1)}% margen
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEficienciaColor(profesional.eficiencia)}`}>
                    <Activity className="h-3 w-3 mr-1" />
                    {profesional.eficiencia.toFixed(1)}% eficiencia
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{profesional.tratamientosRealizados}</div>
                    <div className="text-xs text-gray-500">Tratamientos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{profesional.horasTrabajadas}h</div>
                    <div className="text-xs text-gray-500">Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">€{profesional.ingresosBrutos.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Ingresos Brutos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">€{profesional.costesTotales.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Costes Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">€{profesional.margenNeto.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Margen Neto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">€{profesional.costePorHora}/h</div>
                    <div className="text-xs text-gray-500">Coste/Hora</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-blue-500">
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Periodo: {profesional.periodo}
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
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Reporte Materiales
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Análisis por Categoría
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Coste Total Materiales</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{costesMateriales.reduce((acc, m) => acc + m.costeTotal, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Precio Medio</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{(costesMateriales.reduce((acc, m) => acc + m.precioUnitario, 0) / costesMateriales.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Materiales Únicos</p>
              <p className="text-2xl font-semibold text-gray-900">{costesMateriales.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Uso Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {costesMateriales.reduce((acc, m) => acc + m.cantidadUsada, 0)} unidades
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMateriales.map((material) => (
            <li key={material.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{material.material}</h4>
                    <span className="text-sm text-gray-500">({material.categoria})</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      <Package className="h-3 w-3 mr-1" />
                      {material.cantidadUsada} unidades
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Precio unitario:</span> €{material.precioUnitario.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Coste total:</span> €{material.costeTotal.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Proveedor:</span> {material.proveedor}
                    </div>
                    <div>
                      <span className="font-medium">Tratamiento:</span> {material.tratamiento}
                    </div>
                    <div>
                      <span className="font-medium">Fecha:</span> {new Date(material.fecha).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Análisis de Costes</h1>
        <p className="text-gray-600">Coste por tratamiento (material + tiempo) y margen por profesional</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tratamientos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tratamientos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calculator className="h-4 w-4 inline mr-2" />
            Costes Tratamientos
          </button>
          <button
            onClick={() => setActiveTab('profesionales')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profesionales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Márgenes Profesionales
          </button>
          <button
            onClick={() => setActiveTab('materiales')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'materiales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Análisis Materiales
          </button>
        </nav>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
            <input
              type="text"
              className="block w-full border-gray-300 rounded-md pl-10 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-gray-400" />
          {activeTab === 'tratamientos' && (
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

      {activeTab === 'tratamientos' && renderTratamientos()}
      {activeTab === 'profesionales' && renderProfesionales()}
      {activeTab === 'materiales' && renderMateriales()}
    </div>
  );
};

export default Costes;