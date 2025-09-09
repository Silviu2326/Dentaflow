import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  AlertTriangle,
  Calendar,
  MapPin,
  Truck,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface ProductoInventario {
  id: string;
  nombre: string;
  categoria: string;
  codigo: string;
  unidadMedida: string;
  stockMinimo: number;
  stockActual: number;
  stockMaximo: number;
  ubicacion: string;
  proveedor: string;
  precioUnitario: number;
  ultimaCompra: string;
  estado: 'normal' | 'bajo' | 'critico' | 'agotado';
}

interface LoteInventario {
  id: string;
  productoId: string;
  productoNombre: string;
  numeroLote: string;
  fechaVencimiento: string;
  cantidad: number;
  fechaIngreso: string;
  proveedor: string;
  ubicacion: string;
  estado: 'activo' | 'proximo_vencer' | 'vencido' | 'retirado';
}

interface AlertaInventario {
  id: string;
  tipo: 'stock_bajo' | 'stock_critico' | 'vencimiento_proximo' | 'vencido';
  titulo: string;
  descripcion: string;
  productoId: string;
  productoNombre: string;
  fechaAlerta: string;
  prioridad: 'alta' | 'media' | 'baja';
  leida: boolean;
}

const Inventario: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'productos' | 'lotes' | 'alertas'>('productos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [selectedUbicacion, setSelectedUbicacion] = useState('todas');

  const [productos] = useState<ProductoInventario[]>([
    {
      id: '1',
      nombre: 'Amalgama Dental',
      categoria: 'Materiales de Obturación',
      codigo: 'MAT001',
      unidadMedida: 'Cápsulas',
      stockMinimo: 50,
      stockActual: 25,
      stockMaximo: 200,
      ubicacion: 'Sede Central - Almacén A',
      proveedor: 'DentalSupply',
      precioUnitario: 2.5,
      ultimaCompra: '2024-01-10',
      estado: 'bajo'
    },
    {
      id: '2',
      nombre: 'Anestesia Lidocaína 2%',
      categoria: 'Anestésicos',
      codigo: 'ANE001',
      unidadMedida: 'Carpules',
      stockMinimo: 100,
      stockActual: 5,
      stockMaximo: 500,
      ubicacion: 'Sede Norte - Consulta 1',
      proveedor: 'PharmaDental',
      precioUnitario: 1.8,
      ultimaCompra: '2024-01-05',
      estado: 'critico'
    },
    {
      id: '3',
      nombre: 'Resina Compuesta A2',
      categoria: 'Materiales de Obturación',
      codigo: 'RES001',
      unidadMedida: 'Jeringas',
      stockMinimo: 30,
      stockActual: 85,
      stockMaximo: 150,
      ubicacion: 'Sede Sur - Almacén B',
      proveedor: 'ComposiDent',
      precioUnitario: 15.5,
      ultimaCompra: '2024-01-12',
      estado: 'normal'
    },
    {
      id: '4',
      nombre: 'Guantes Nitrilo Talla M',
      categoria: 'Protección Personal',
      codigo: 'PPE001',
      unidadMedida: 'Cajas',
      stockMinimo: 20,
      stockActual: 0,
      stockMaximo: 100,
      ubicacion: 'Sede Central - Almacén General',
      proveedor: 'SafetyDental',
      precioUnitario: 12.0,
      ultimaCompra: '2023-12-28',
      estado: 'agotado'
    }
  ]);

  const [lotes] = useState<LoteInventario[]>([
    {
      id: '1',
      productoId: '1',
      productoNombre: 'Amalgama Dental',
      numeroLote: 'LOT-2024-001',
      fechaVencimiento: '2024-03-15',
      cantidad: 25,
      fechaIngreso: '2024-01-10',
      proveedor: 'DentalSupply',
      ubicacion: 'Sede Central - Almacén A',
      estado: 'proximo_vencer'
    },
    {
      id: '2',
      productoId: '2',
      productoNombre: 'Anestesia Lidocaína 2%',
      numeroLote: 'LOT-2024-002',
      fechaVencimiento: '2024-12-20',
      cantidad: 5,
      fechaIngreso: '2024-01-05',
      proveedor: 'PharmaDental',
      ubicacion: 'Sede Norte - Consulta 1',
      estado: 'activo'
    },
    {
      id: '3',
      productoId: '3',
      productoNombre: 'Resina Compuesta A2',
      numeroLote: 'LOT-2023-098',
      fechaVencimiento: '2024-01-05',
      cantidad: 10,
      fechaIngreso: '2023-11-15',
      proveedor: 'ComposiDent',
      ubicacion: 'Sede Sur - Almacén B',
      estado: 'vencido'
    },
    {
      id: '4',
      productoId: '3',
      productoNombre: 'Resina Compuesta A2',
      numeroLote: 'LOT-2024-015',
      fechaVencimiento: '2025-06-30',
      cantidad: 75,
      fechaIngreso: '2024-01-12',
      proveedor: 'ComposiDent',
      ubicacion: 'Sede Sur - Almacén B',
      estado: 'activo'
    }
  ]);

  const [alertas] = useState<AlertaInventario[]>([
    {
      id: '1',
      tipo: 'stock_critico',
      titulo: 'Stock Crítico - Anestesia Lidocaína 2%',
      descripcion: 'Solo quedan 5 unidades en stock. Mínimo requerido: 100',
      productoId: '2',
      productoNombre: 'Anestesia Lidocaína 2%',
      fechaAlerta: '2024-01-16T08:00:00',
      prioridad: 'alta',
      leida: false
    },
    {
      id: '2',
      tipo: 'vencimiento_proximo',
      titulo: 'Próximo a Vencer - Amalgama Dental',
      descripcion: 'Lote LOT-2024-001 vence el 15/03/2024 (en 2 meses)',
      productoId: '1',
      productoNombre: 'Amalgama Dental',
      fechaAlerta: '2024-01-15T10:30:00',
      prioridad: 'media',
      leida: false
    },
    {
      id: '3',
      tipo: 'vencido',
      titulo: 'Producto Vencido - Resina Compuesta A2',
      descripcion: 'Lote LOT-2023-098 venció el 05/01/2024. Retirar inmediatamente.',
      productoId: '3',
      productoNombre: 'Resina Compuesta A2',
      fechaAlerta: '2024-01-06T09:00:00',
      prioridad: 'alta',
      leida: false
    },
    {
      id: '4',
      tipo: 'stock_bajo',
      titulo: 'Stock Bajo - Amalgama Dental',
      descripcion: 'Stock actual: 25 unidades. Por debajo del mínimo de 50',
      productoId: '1',
      productoNombre: 'Amalgama Dental',
      fechaAlerta: '2024-01-14T16:45:00',
      prioridad: 'media',
      leida: true
    }
  ]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'bajo': return 'text-yellow-600 bg-yellow-100';
      case 'critico': return 'text-orange-600 bg-orange-100';
      case 'agotado': return 'text-red-600 bg-red-100';
      case 'activo': return 'text-green-600 bg-green-100';
      case 'proximo_vencer': return 'text-yellow-600 bg-yellow-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      case 'retirado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTipoAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case 'stock_critico': return <XCircle className="h-4 w-4" />;
      case 'stock_bajo': return <TrendingDown className="h-4 w-4" />;
      case 'vencimiento_proximo': return <Clock className="h-4 w-4" />;
      case 'vencido': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'todas' || producto.categoria === selectedCategoria;
    const matchesUbicacion = selectedUbicacion === 'todas' || producto.ubicacion.includes(selectedUbicacion);
    return matchesSearch && matchesCategoria && matchesUbicacion;
  });

  const filteredLotes = lotes.filter(lote =>
    lote.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lote.numeroLote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlertas = alertas.filter(alerta =>
    alerta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alerta.productoNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProductos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Productos en Inventario</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Productos</p>
              <p className="text-2xl font-semibold text-gray-900">{productos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Stock Bajo</p>
              <p className="text-2xl font-semibold text-gray-900">
                {productos.filter(p => p.estado === 'bajo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Stock Crítico</p>
              <p className="text-2xl font-semibold text-gray-900">
                {productos.filter(p => p.estado === 'critico' || p.estado === 'agotado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Stock Normal</p>
              <p className="text-2xl font-semibold text-gray-900">
                {productos.filter(p => p.estado === 'normal').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProductos.map((producto) => (
            <li key={producto.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{producto.nombre}</h4>
                    <span className="text-sm text-gray-500">({producto.codigo})</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(producto.estado)}`}>
                      {producto.estado === 'normal' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {producto.estado === 'bajo' && <TrendingDown className="h-3 w-3 mr-1" />}
                      {producto.estado === 'critico' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {producto.estado === 'agotado' && <XCircle className="h-3 w-3 mr-1" />}
                      <span className="capitalize">{producto.estado}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Categoría:</span> {producto.categoria}
                    </div>
                    <div>
                      <span className="font-medium">Stock:</span> {producto.stockActual} {producto.unidadMedida}
                    </div>
                    <div>
                      <span className="font-medium">Ubicación:</span> {producto.ubicacion}
                    </div>
                    <div>
                      <span className="font-medium">Precio:</span> €{producto.precioUnitario}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Mín: {producto.stockMinimo}</span>
                      <span>Máx: {producto.stockMaximo}</span>
                      <span>Proveedor: {producto.proveedor}</span>
                      <span>Última compra: {new Date(producto.ultimaCompra).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          producto.stockActual <= producto.stockMinimo ? 'bg-red-600' :
                          producto.stockActual <= producto.stockMinimo * 1.5 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{
                          width: `${Math.min((producto.stockActual / producto.stockMaximo) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderLotes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Lotes y Caducidades</h3>
        <div className="flex space-x-3">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Reporte Vencimientos
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Lote
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredLotes.map((lote) => (
            <li key={lote.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{lote.productoNombre}</h4>
                    <span className="text-sm text-gray-500">Lote: {lote.numeroLote}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(lote.estado)}`}>
                      {lote.estado === 'activo' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {lote.estado === 'proximo_vencer' && <Clock className="h-3 w-3 mr-1" />}
                      {lote.estado === 'vencido' && <XCircle className="h-3 w-3 mr-1" />}
                      <span className="capitalize">{lote.estado.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="font-medium">Vence:</span>
                      <span className={`ml-1 ${
                        new Date(lote.fechaVencimiento) < new Date() ? 'text-red-600 font-semibold' :
                        new Date(lote.fechaVencimiento) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'text-yellow-600 font-semibold' :
                        'text-gray-600'
                      }`}>
                        {new Date(lote.fechaVencimiento).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Cantidad:</span> {lote.cantidad}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {lote.ubicacion}
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      {lote.proveedor}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Ingreso: {new Date(lote.fechaIngreso).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  {lote.estado === 'vencido' && (
                    <button className="text-red-400 hover:text-red-500">
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderAlertas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Alertas de Inventario</h3>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Todas Como Leídas
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Configurar Alertas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Alertas Críticas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alertas.filter(a => a.prioridad === 'alta' && !a.leida).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Próximos a Vencer</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alertas.filter(a => a.tipo === 'vencimiento_proximo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Stock Bajo</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alertas.filter(a => a.tipo === 'stock_bajo' || a.tipo === 'stock_critico').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Alertas</p>
              <p className="text-2xl font-semibold text-gray-900">{alertas.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`p-4 border rounded-lg ${
              alerta.leida ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(alerta.prioridad)}`}>
                    {getTipoAlertaIcon(alerta.tipo)}
                    <span className="ml-1 capitalize">{alerta.prioridad}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(alerta.fechaAlerta).toLocaleString()}
                  </span>
                  {!alerta.leida && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      Nueva
                    </span>
                  )}
                </div>
                <h4 className={`text-sm font-medium mb-1 ${alerta.leida ? 'text-gray-600' : 'text-gray-900'}`}>
                  {alerta.titulo}
                </h4>
                <p className={`text-sm ${alerta.leida ? 'text-gray-500' : 'text-gray-600'}`}>
                  {alerta.descripcion}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Producto: {alerta.productoNombre}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                {!alerta.leida && (
                  <button className="text-blue-400 hover:text-blue-500">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventario</h1>
        <p className="text-gray-600">Gestión de stock, lotes, caducidades y alertas de inventario</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('productos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'productos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('lotes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lotes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Lotes y Caducidades
          </button>
          <button
            onClick={() => setActiveTab('alertas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alertas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Alertas
            {alertas.filter(a => !a.leida).length > 0 && (
              <span className="ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                {alertas.filter(a => !a.leida).length}
              </span>
            )}
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
                activeTab === 'productos' ? 'Buscar productos...' :
                activeTab === 'lotes' ? 'Buscar lotes...' :
                'Buscar alertas...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {activeTab === 'productos' && (
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              <option value="Materiales de Obturación">Materiales de Obturación</option>
              <option value="Anestésicos">Anestésicos</option>
              <option value="Protección Personal">Protección Personal</option>
            </select>
            <select
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedUbicacion}
              onChange={(e) => setSelectedUbicacion(e.target.value)}
            >
              <option value="todas">Todas las ubicaciones</option>
              <option value="Sede Central">Sede Central</option>
              <option value="Sede Norte">Sede Norte</option>
              <option value="Sede Sur">Sede Sur</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'productos' && renderProductos()}
      {activeTab === 'lotes' && renderLotes()}
      {activeTab === 'alertas' && renderAlertas()}
    </div>
  );
};

export default Inventario;