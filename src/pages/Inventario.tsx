import React, { useState, useContext } from 'react';
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
import { DarkModeContext } from '../contexts/DarkModeContext';
import NewProductModal from '../components/NewProductModal';
import EditProductModal from '../components/EditProductModal';

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
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState<'productos' | 'lotes' | 'alertas'>('productos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [selectedUbicacion, setSelectedUbicacion] = useState('todas');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoInventario | null>(null);

  const [productos, setProductos] = useState<ProductoInventario[]>([
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
    const baseClasses = isDarkMode ? {
      normal: 'text-green-300 bg-green-900/50',
      bajo: 'text-yellow-300 bg-yellow-900/50',
      critico: 'text-orange-300 bg-orange-900/50',
      agotado: 'text-red-300 bg-red-900/50',
      activo: 'text-green-300 bg-green-900/50',
      proximo_vencer: 'text-yellow-300 bg-yellow-900/50',
      vencido: 'text-red-300 bg-red-900/50',
      retirado: 'text-gray-300 bg-gray-800/50'
    } : {
      normal: 'text-green-600 bg-green-100',
      bajo: 'text-yellow-600 bg-yellow-100',
      critico: 'text-orange-600 bg-orange-100',
      agotado: 'text-red-600 bg-red-100',
      activo: 'text-green-600 bg-green-100',
      proximo_vencer: 'text-yellow-600 bg-yellow-100',
      vencido: 'text-red-600 bg-red-100',
      retirado: 'text-gray-600 bg-gray-100'
    };
    
    return baseClasses[estado as keyof typeof baseClasses] || (isDarkMode ? 'text-gray-300 bg-gray-800/50' : 'text-gray-600 bg-gray-100');
  };

  const getPrioridadColor = (prioridad: string) => {
    const baseClasses = isDarkMode ? {
      alta: 'text-red-300 bg-red-900/50',
      media: 'text-yellow-300 bg-yellow-900/50',
      baja: 'text-green-300 bg-green-900/50'
    } : {
      alta: 'text-red-600 bg-red-100',
      media: 'text-yellow-600 bg-yellow-100',
      baja: 'text-green-600 bg-green-100'
    };
    
    return baseClasses[prioridad as keyof typeof baseClasses] || (isDarkMode ? 'text-gray-300 bg-gray-800/50' : 'text-gray-600 bg-gray-100');
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

  const handleCreateProduct = (productData: any) => {
    console.log('Creating product:', productData);
  };

  const handleEditProduct = (product: ProductoInventario) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = (updatedProduct: ProductoInventario) => {
    setProductos(prev => prev.map(p => p.id === updatedProduct.id ? {
      ...updatedProduct,
      estado: getProductStatus(updatedProduct)
    } : p));
    console.log('Product updated:', updatedProduct);
  };

  const getProductStatus = (product: ProductoInventario): 'normal' | 'bajo' | 'critico' | 'agotado' => {
    if (product.stockActual === 0) return 'agotado';
    if (product.stockActual <= product.stockMinimo * 0.5) return 'critico';
    if (product.stockActual <= product.stockMinimo) return 'bajo';
    return 'normal';
  };

  const handleEditLote = (lote: LoteInventario) => {
    console.log('Editing lote:', lote);
    // TODO: Implement lote editing modal
  };

  const handleEditAlerta = (alerta: AlertaInventario) => {
    console.log('Editing alerta:', alerta);
    // TODO: Implement alerta editing modal
  };

  const renderProductos = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Productos en Inventario
        </h3>
        <div className="flex space-x-4">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30' 
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-200/30'
          }`}>
            <Upload className="h-5 w-5 mr-2" />
            Importar
          </button>
          <button 
            onClick={() => setShowNewProductModal(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
            }`}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/40 to-indigo-800/40 border-blue-700/50 shadow-blue-900/20' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-100/50 border-blue-200/50 shadow-blue-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100'
            }`}>
              <Package className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Total Productos
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                {productos.length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-900/40 to-orange-800/40 border-yellow-700/50 shadow-yellow-900/20' 
            : 'bg-gradient-to-br from-yellow-50 to-orange-100/50 border-yellow-200/50 shadow-yellow-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100'
            }`}>
              <TrendingDown className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Stock Bajo
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-yellow-900'}`}>
                {productos.filter(p => p.estado === 'bajo').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/40 to-pink-800/40 border-red-700/50 shadow-red-900/20' 
            : 'bg-gradient-to-br from-red-50 to-pink-100/50 border-red-200/50 shadow-red-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-red-800/50' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Stock Crítico
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-red-900'}`}>
                {productos.filter(p => p.estado === 'critico' || p.estado === 'agotado').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-green-700/50 shadow-green-900/20' 
            : 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-200/50 shadow-green-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-green-800/50' : 'bg-green-100'
            }`}>
              <CheckCircle className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Stock Normal
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                {productos.filter(p => p.estado === 'normal').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProductos.map((producto) => (
          <div key={producto.id} className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-gray-900/20' 
              : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 shadow-gray-200/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {producto.nombre}
                  </h4>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({producto.codigo})
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(producto.estado)}`}>
                    {producto.estado === 'normal' && <CheckCircle className="h-4 w-4 mr-1" />}
                    {producto.estado === 'bajo' && <TrendingDown className="h-4 w-4 mr-1" />}
                    {producto.estado === 'critico' && <AlertTriangle className="h-4 w-4 mr-1" />}
                    {producto.estado === 'agotado' && <XCircle className="h-4 w-4 mr-1" />}
                    <span className="capitalize">{producto.estado}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Categoría:
                    </span>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {producto.categoria}
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Stock:
                    </span>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {producto.stockActual} {producto.unidadMedida}
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Ubicación:
                    </span>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {producto.ubicacion}
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Precio:
                    </span>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      €{producto.precioUnitario}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className={`flex items-center space-x-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>Mín: {producto.stockMinimo}</span>
                    <span>Máx: {producto.stockMaximo}</span>
                    <span>Proveedor: {producto.proveedor}</span>
                    <span>Última compra: {new Date(producto.ultimaCompra).toLocaleDateString()}</span>
                  </div>
                  <div className={`mt-3 w-full rounded-full h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        producto.stockActual <= producto.stockMinimo ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        producto.stockActual <= producto.stockMinimo * 1.5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{
                        width: `${Math.min((producto.stockActual / producto.stockMaximo) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 ml-6">
                <button 
                  onClick={() => handleEditProduct(producto)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/30' 
                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}>
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLotes = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Lotes y Caducidades
        </h3>
        <div className="flex space-x-4">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-yellow-900/30' 
              : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-yellow-200/30'
          }`}>
            <Download className="h-5 w-5 mr-2" />
            Reporte Vencimientos
          </button>
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
          }`}>
            <Plus className="h-5 w-5 mr-2" />
            Registrar Lote
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLotes.map((lote) => (
          <div key={lote.id} className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-gray-900/20' 
              : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 shadow-gray-200/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {lote.productoNombre}
                  </h4>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Lote: {lote.numeroLote}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(lote.estado)}`}>
                    {lote.estado === 'activo' && <CheckCircle className="h-4 w-4 mr-1" />}
                    {lote.estado === 'proximo_vencer' && <Clock className="h-4 w-4 mr-1" />}
                    {lote.estado === 'vencido' && <XCircle className="h-4 w-4 mr-1" />}
                    <span className="capitalize">{lote.estado.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        Vence:
                      </span>
                      <p className={`${
                        new Date(lote.fechaVencimiento) < new Date() 
                          ? isDarkMode ? 'text-red-400 font-semibold' : 'text-red-600 font-semibold'
                          : new Date(lote.fechaVencimiento) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) 
                            ? isDarkMode ? 'text-yellow-400 font-semibold' : 'text-yellow-600 font-semibold'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {new Date(lote.fechaVencimiento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      Cantidad:
                    </span>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lote.cantidad}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        Ubicación:
                      </span>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lote.ubicacion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        Proveedor:
                      </span>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lote.proveedor}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Ingreso: {new Date(lote.fechaIngreso).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-3 ml-6">
                <button 
                  onClick={() => handleEditLote(lote)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Edit className="h-5 w-5" />
                </button>
                {lote.estado === 'vencido' && (
                  <button className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                      : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                  }`}>
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlertas = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Alertas de Inventario
        </h3>
        <div className="flex space-x-4">
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg shadow-gray-900/30' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg shadow-gray-200/30'
          }`}>
            <CheckCircle className="h-5 w-5 mr-2" />
            Marcar Todas Como Leídas
          </button>
          <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/30'
          }`}>
            <BarChart3 className="h-5 w-5 mr-2" />
            Configurar Alertas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/40 to-pink-800/40 border-red-700/50 shadow-red-900/20' 
            : 'bg-gradient-to-br from-red-50 to-pink-100/50 border-red-200/50 shadow-red-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-red-800/50' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Alertas Críticas
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-red-900'}`}>
                {alertas.filter(a => a.prioridad === 'alta' && !a.leida).length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-900/40 to-orange-800/40 border-yellow-700/50 shadow-yellow-900/20' 
            : 'bg-gradient-to-br from-yellow-50 to-orange-100/50 border-yellow-200/50 shadow-yellow-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100'
            }`}>
              <Clock className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Próximos a Vencer
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-yellow-900'}`}>
                {alertas.filter(a => a.tipo === 'vencimiento_proximo').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-orange-900/40 to-red-800/40 border-orange-700/50 shadow-orange-900/20' 
            : 'bg-gradient-to-br from-orange-50 to-red-100/50 border-orange-200/50 shadow-orange-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-orange-800/50' : 'bg-orange-100'
            }`}>
              <TrendingDown className={`h-8 w-8 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                Stock Bajo
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-orange-900'}`}>
                {alertas.filter(a => a.tipo === 'stock_bajo' || a.tipo === 'stock_critico').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-gray-900/20' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-200/50 shadow-gray-200/20'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <CheckCircle className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Alertas
              </p>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {alertas.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              alerta.leida 
                ? isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800/20 to-gray-900/20 border-gray-700/30 opacity-75' 
                  : 'bg-gradient-to-br from-gray-50/80 to-white/50 border-gray-200/50 opacity-75'
                : isDarkMode
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-gray-900/20'
                  : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 shadow-gray-200/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPrioridadColor(alerta.prioridad)}`}>
                    {getTipoAlertaIcon(alerta.tipo)}
                    <span className="ml-1 capitalize">{alerta.prioridad}</span>
                  </span>
                  <span className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(alerta.fechaAlerta).toLocaleString()}
                  </span>
                  {!alerta.leida && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'
                    }`}>
                      Nueva
                    </span>
                  )}
                </div>
                <h4 className={`text-lg font-bold mb-3 ${
                  alerta.leida 
                    ? isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    : isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {alerta.titulo}
                </h4>
                <p className={`text-sm mb-3 ${
                  alerta.leida 
                    ? isDarkMode ? 'text-gray-600' : 'text-gray-500'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {alerta.descripcion}
                </p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Producto: {alerta.productoNombre}
                </p>
              </div>
              <div className="flex space-x-3 ml-6">
                {!alerta.leida && (
                  <button className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                      : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                <button 
                  onClick={() => handleEditAlerta(alerta)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="mb-8">
        <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-700/50 shadow-xl shadow-blue-900/20' 
            : 'bg-gradient-to-r from-white/80 to-blue-50/80 border-blue-200/50 shadow-xl shadow-blue-200/20'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Inventario
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            Gestión de stock, lotes, caducidades y alertas de inventario
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-xl shadow-gray-900/20' 
            : 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/50 shadow-xl shadow-gray-200/20'
        }`}>
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('productos')}
              className={`py-4 px-6 border-b-2 font-semibold text-sm rounded-t-xl transition-all duration-300 hover:scale-105 ${
                activeTab === 'productos'
                  ? isDarkMode 
                    ? 'border-blue-400 text-blue-400 bg-blue-900/30' 
                    : 'border-blue-500 text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="h-5 w-5 inline mr-2" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('lotes')}
              className={`py-4 px-6 border-b-2 font-semibold text-sm rounded-t-xl transition-all duration-300 hover:scale-105 ${
                activeTab === 'lotes'
                  ? isDarkMode 
                    ? 'border-blue-400 text-blue-400 bg-blue-900/30' 
                    : 'border-blue-500 text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-5 w-5 inline mr-2" />
              Lotes y Caducidades
            </button>
            <button
              onClick={() => setActiveTab('alertas')}
              className={`py-4 px-6 border-b-2 font-semibold text-sm rounded-t-xl transition-all duration-300 hover:scale-105 ${
                activeTab === 'alertas'
                  ? isDarkMode 
                    ? 'border-blue-400 text-blue-400 bg-blue-900/30' 
                    : 'border-blue-500 text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <AlertTriangle className="h-5 w-5 inline mr-2" />
              Alertas
              {alertas.filter(a => !a.leida).length > 0 && (
                <span className={`ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600'
                }`}>
                  {alertas.filter(a => !a.leida).length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-xl shadow-gray-900/20' 
          : 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/50 shadow-xl shadow-gray-200/20'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0 mr-4">
            <div className="relative">
              <Search className={`pointer-events-none absolute inset-y-0 left-0 h-full w-5 ml-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                className={`block w-full rounded-xl pl-12 pr-4 py-3 text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800/50 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <select
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800/50 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                >
                  <option value="todas">Todas las categorías</option>
                  <option value="Materiales de Obturación">Materiales de Obturación</option>
                  <option value="Anestésicos">Anestésicos</option>
                  <option value="Protección Personal">Protección Personal</option>
                </select>
              </div>
              <select
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800/50 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
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
      </div>

      {activeTab === 'productos' && renderProductos()}
      {activeTab === 'lotes' && renderLotes()}
      {activeTab === 'alertas' && renderAlertas()}

      {/* New Product Modal */}
      <NewProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        onSubmit={handleCreateProduct}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        onSubmit={handleUpdateProduct}
        product={selectedProduct}
      />
    </div>
  );
};

export default Inventario;