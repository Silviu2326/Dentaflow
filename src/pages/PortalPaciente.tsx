import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  CreditCard,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Upload,
  Bell,
  Shield,
  DollarSign,
  Plus,
  RefreshCw,
  ExternalLink,
  Lock
} from 'lucide-react';

interface CitaPaciente {
  id: string;
  fecha: string;
  hora: string;
  profesional: string;
  especialidad: string;
  tratamiento: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada' | 'completada';
  ubicacion: string;
  notas?: string;
  puedeReschedular: boolean;
  puedeCancelar: boolean;
}

interface DocumentoPaciente {
  id: string;
  nombre: string;
  tipo: 'consentimiento' | 'presupuesto' | 'factura' | 'resultado' | 'receta';
  fechaCreacion: string;
  fechaVencimiento?: string;
  estado: 'pendiente_firma' | 'firmado' | 'vencido' | 'completado';
  url: string;
  requiereFirma: boolean;
  descripcion: string;
}

interface PagoPaciente {
  id: string;
  concepto: string;
  importe: number;
  fechaVencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido' | 'financiado';
  metodoPago?: string;
  cuotas?: number;
  cuotaActual?: number;
  linkPago?: string;
  factura?: string;
}

interface FacturaPaciente {
  id: string;
  numero: string;
  fecha: string;
  concepto: string;
  importe: number;
  estado: 'emitida' | 'pagada' | 'vencida';
  metodoPago?: string;
  url: string;
  detalles: string[];
}

interface PerfilPaciente {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  seguroMedico?: string;
  alergias: string[];
  medicamentos: string[];
  contactoEmergencia: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
}

const PortalPaciente: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'citas' | 'documentos' | 'pagos' | 'facturas' | 'perfil'>('citas');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para el paciente logueado
  const paciente: PerfilPaciente = {
    id: 'P001',
    nombre: 'María',
    apellidos: 'García López',
    dni: '12345678X',
    telefono: '+34 612 345 678',
    email: 'maria.garcia@email.com',
    fechaNacimiento: '1985-03-15',
    direccion: 'Calle Mayor 123, 28001 Madrid',
    seguroMedico: 'Sanitas Plus',
    alergias: ['Penicilina', 'Látex'],
    medicamentos: ['Ibuprofeno 600mg'],
    contactoEmergencia: {
      nombre: 'Carlos García',
      telefono: '+34 623 456 789',
      relacion: 'Esposo'
    }
  };

  const [citas] = useState<CitaPaciente[]>([
    {
      id: '1',
      fecha: '2024-01-20',
      hora: '10:00',
      profesional: 'Dr. Martín García',
      especialidad: 'Endodoncia',
      tratamiento: 'Revisión de endodoncia',
      estado: 'confirmada',
      ubicacion: 'Consulta 2 - Sede Central',
      notas: 'Traer radiografías anteriores si las tiene',
      puedeReschedular: true,
      puedeCancelar: true
    },
    {
      id: '2',
      fecha: '2024-01-25',
      hora: '16:30',
      profesional: 'Dr. Ana López',
      especialidad: 'Implantología',
      tratamiento: 'Colocación de implante',
      estado: 'pendiente',
      ubicacion: 'Quirófano - Sede Norte',
      notas: 'Venir en ayunas de 8 horas',
      puedeReschedular: false,
      puedeCancelar: true
    },
    {
      id: '3',
      fecha: '2024-01-12',
      hora: '11:15',
      profesional: 'Higienista María',
      especialidad: 'Higiene Dental',
      tratamiento: 'Limpieza dental',
      estado: 'completada',
      ubicacion: 'Consulta 1 - Sede Central',
      puedeReschedular: false,
      puedeCancelar: false
    }
  ]);

  const [documentos] = useState<DocumentoPaciente[]>([
    {
      id: '1',
      nombre: 'Consentimiento Implante Dental',
      tipo: 'consentimiento',
      fechaCreacion: '2024-01-15',
      fechaVencimiento: '2024-01-22',
      estado: 'pendiente_firma',
      url: '/docs/consentimiento_implante_001.pdf',
      requiereFirma: true,
      descripcion: 'Consentimiento informado para el procedimiento de implante dental'
    },
    {
      id: '2',
      nombre: 'Presupuesto Tratamiento Completo',
      tipo: 'presupuesto',
      fechaCreacion: '2024-01-10',
      estado: 'firmado',
      url: '/docs/presupuesto_2024_001.pdf',
      requiereFirma: false,
      descripcion: 'Presupuesto detallado para el plan de tratamiento'
    },
    {
      id: '3',
      nombre: 'Radiografía Panorámica',
      tipo: 'resultado',
      fechaCreacion: '2024-01-08',
      estado: 'completado',
      url: '/docs/radiografia_panoramica_001.jpg',
      requiereFirma: false,
      descripcion: 'Resultado de radiografía panorámica para diagnóstico'
    },
    {
      id: '4',
      nombre: 'Receta Antibiótico',
      tipo: 'receta',
      fechaCreacion: '2024-01-05',
      fechaVencimiento: '2024-02-05',
      estado: 'completado',
      url: '/docs/receta_001.pdf',
      requiereFirma: false,
      descripcion: 'Prescripción de antibiótico post-tratamiento'
    }
  ]);

  const [pagos] = useState<PagoPaciente[]>([
    {
      id: '1',
      concepto: 'Implante Dental - Primera fase',
      importe: 800.00,
      fechaVencimiento: '2024-01-20',
      estado: 'pendiente',
      linkPago: 'https://pay.clinicapp.com/lnk_abc123'
    },
    {
      id: '2',
      concepto: 'Limpieza dental',
      importe: 80.00,
      fechaVencimiento: '2024-01-15',
      estado: 'pagado',
      metodoPago: 'Tarjeta de crédito',
      factura: 'FAC-2024-001'
    },
    {
      id: '3',
      concepto: 'Ortodoncia - Cuota mensual',
      importe: 120.00,
      fechaVencimiento: '2024-02-01',
      estado: 'financiado',
      cuotas: 24,
      cuotaActual: 8
    }
  ]);

  const [facturas] = useState<FacturaPaciente[]>([
    {
      id: '1',
      numero: 'FAC-2024-001',
      fecha: '2024-01-12',
      concepto: 'Limpieza dental',
      importe: 80.00,
      estado: 'pagada',
      metodoPago: 'Tarjeta de crédito',
      url: '/facturas/FAC-2024-001.pdf',
      detalles: ['Limpieza dental profesional', 'Aplicación de flúor']
    },
    {
      id: '2',
      numero: 'FAC-2024-015',
      fecha: '2024-01-08',
      concepto: 'Radiografía panorámica',
      importe: 45.00,
      estado: 'pagada',
      metodoPago: 'Efectivo',
      url: '/facturas/FAC-2024-015.pdf',
      detalles: ['Radiografía panorámica digital', 'Análisis radiográfico']
    }
  ]);

  const getEstadoCitaColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'text-green-600 bg-green-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      case 'completada': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoDocumentoColor = (estado: string) => {
    switch (estado) {
      case 'firmado':
      case 'completado': return 'text-green-600 bg-green-100';
      case 'pendiente_firma': return 'text-yellow-600 bg-yellow-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'text-green-600 bg-green-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      case 'financiado': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTipoDocumentoIcon = (tipo: string) => {
    switch (tipo) {
      case 'consentimiento': return <Shield className="h-4 w-4" />;
      case 'presupuesto': return <DollarSign className="h-4 w-4" />;
      case 'factura': return <FileText className="h-4 w-4" />;
      case 'resultado': return <Eye className="h-4 w-4" />;
      case 'receta': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderCitas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Mis Citas</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Cita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Próximas Citas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {citas.filter(c => c.estado === 'confirmada' || c.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Este Mes</p>
              <p className="text-2xl font-semibold text-gray-900">{citas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Completadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {citas.filter(c => c.estado === 'completada').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {citas.map((cita) => (
          <div key={cita.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoCitaColor(cita.estado)}`}>
                    {cita.estado === 'confirmada' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {cita.estado === 'pendiente' && <Clock className="h-3 w-3 mr-1" />}
                    {cita.estado === 'cancelada' && <XCircle className="h-3 w-3 mr-1" />}
                    {cita.estado === 'completada' && <CheckCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{cita.estado}</span>
                  </span>
                  <span className="text-sm text-gray-500">{cita.especialidad}</span>
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">{cita.tratamiento}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(cita.fecha).toLocaleDateString()} a las {cita.hora}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{cita.profesional}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{cita.ubicacion}</span>
                  </div>
                </div>
                
                {cita.notas && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <Bell className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-sm text-blue-700">{cita.notas}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                {cita.puedeReschedular && (
                  <button className="text-blue-400 hover:text-blue-500">
                    <Calendar className="h-5 w-5" />
                  </button>
                )}
                {cita.puedeCancelar && (
                  <button className="text-red-400 hover:text-red-500">
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

  const renderDocumentos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Mis Documentos</h3>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Subir Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pendientes Firma</p>
              <p className="text-2xl font-semibold text-gray-900">
                {documentos.filter(d => d.estado === 'pendiente_firma').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Firmados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {documentos.filter(d => d.estado === 'firmado' || d.estado === 'completado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Documentos</p>
              <p className="text-2xl font-semibold text-gray-900">{documentos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Vencidos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {documentos.filter(d => d.estado === 'vencido').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {documentos.map((documento) => (
          <div key={documento.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    {getTipoDocumentoIcon(documento.tipo)}
                    <span className="ml-2 capitalize">{documento.tipo}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoDocumentoColor(documento.estado)}`}>
                    {documento.estado === 'firmado' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {documento.estado === 'pendiente_firma' && <Clock className="h-3 w-3 mr-1" />}
                    {documento.estado === 'vencido' && <XCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{documento.estado.replace('_', ' ')}</span>
                  </span>
                  {documento.requiereFirma && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Firma requerida
                    </span>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">{documento.nombre}</h4>
                <p className="text-sm text-gray-600 mb-3">{documento.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Fecha creación:</span> {new Date(documento.fechaCreacion).toLocaleDateString()}
                  </div>
                  {documento.fechaVencimiento && (
                    <div className={`${new Date(documento.fechaVencimiento) < new Date() ? 'text-red-600' : ''}`}>
                      <span className="font-medium">Vencimiento:</span> {new Date(documento.fechaVencimiento).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="text-gray-400 hover:text-gray-500">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-500">
                  <Download className="h-5 w-5" />
                </button>
                {documento.estado === 'pendiente_firma' && documento.requiereFirma && (
                  <button className="text-green-400 hover:text-green-500">
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPagos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pagos y Financiación</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          Solicitar Financiación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{pagos.filter(p => p.estado === 'pendiente').reduce((acc, p) => acc + p.importe, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Pagados</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{pagos.filter(p => p.estado === 'pagado').reduce((acc, p) => acc + p.importe, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Financiados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagos.filter(p => p.estado === 'financiado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{pagos.reduce((acc, p) => acc + p.importe, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {pagos.map((pago) => (
          <div key={pago.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoPagoColor(pago.estado)}`}>
                    {pago.estado === 'pagado' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {pago.estado === 'pendiente' && <Clock className="h-3 w-3 mr-1" />}
                    {pago.estado === 'vencido' && <XCircle className="h-3 w-3 mr-1" />}
                    {pago.estado === 'financiado' && <CreditCard className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{pago.estado}</span>
                  </span>
                  {pago.cuotas && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      Cuota {pago.cuotaActual}/{pago.cuotas}
                    </span>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">{pago.concepto}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Importe:</span> €{pago.importe.toFixed(2)}
                  </div>
                  <div className={`${new Date(pago.fechaVencimiento) < new Date() && pago.estado === 'pendiente' ? 'text-red-600' : ''}`}>
                    <span className="font-medium">Vencimiento:</span> {new Date(pago.fechaVencimiento).toLocaleDateString()}
                  </div>
                  {pago.metodoPago && (
                    <div>
                      <span className="font-medium">Método:</span> {pago.metodoPago}
                    </div>
                  )}
                </div>
                
                {pago.factura && (
                  <div className="mt-2 text-xs text-gray-500">
                    Factura: {pago.factura}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                {pago.linkPago && pago.estado === 'pendiente' && (
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Pagar
                  </button>
                )}
                {pago.estado === 'pagado' && (
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFacturas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Mis Facturas</h3>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Descargar Todas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Facturas Pagadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {facturas.filter(f => f.estado === 'pagada').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Facturas</p>
              <p className="text-2xl font-semibold text-gray-900">{facturas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Importe Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{facturas.reduce((acc, f) => acc + f.importe, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {facturas.map((factura) => (
          <div key={factura.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {factura.numero}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${factura.estado === 'pagada' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {factura.estado === 'pagada' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{factura.estado}</span>
                  </span>
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">{factura.concepto}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Fecha:</span> {new Date(factura.fecha).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Importe:</span> €{factura.importe.toFixed(2)}
                  </div>
                  {factura.metodoPago && (
                    <div>
                      <span className="font-medium">Método pago:</span> {factura.metodoPago}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Detalles:</span>
                  <ul className="mt-1 list-disc list-inside">
                    {factura.detalles.map((detalle, index) => (
                      <li key={index}>{detalle}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="text-gray-400 hover:text-gray-500">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-500">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerfil = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Mi Perfil</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{paciente.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                <p className="mt-1 text-sm text-gray-900">{paciente.apellidos}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">DNI</label>
                <p className="mt-1 text-sm text-gray-900">{paciente.dni}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(paciente.fechaNacimiento).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <p className="mt-1 text-sm text-gray-900">{paciente.direccion}</p>
            </div>
            {paciente.seguroMedico && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Seguro Médico</label>
                <p className="mt-1 text-sm text-gray-900">{paciente.seguroMedico}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-sm text-gray-900">{paciente.telefono}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{paciente.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">Contacto de Emergencia</h5>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Nombre:</span> {paciente.contactoEmergencia.nombre}</p>
                <p><span className="font-medium">Teléfono:</span> {paciente.contactoEmergencia.telefono}</p>
                <p><span className="font-medium">Relación:</span> {paciente.contactoEmergencia.relacion}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alergias</label>
              <div className="flex flex-wrap gap-2">
                {paciente.alergias.length > 0 ? (
                  paciente.alergias.map((alergia, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {alergia}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Sin alergias conocidas</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicamentos Actuales</label>
              <div className="flex flex-wrap gap-2">
                {paciente.medicamentos.length > 0 ? (
                  paciente.medicamentos.map((medicamento, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      {medicamento}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Sin medicamentos actuales</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Configuración de Cuenta</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Notificaciones por Email</p>
                  <p className="text-xs text-gray-500">Recibir recordatorios de citas</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Activado</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Notificaciones por SMS</p>
                  <p className="text-xs text-gray-500">Confirmaciones y recordatorios</p>
                </div>
              </div>
              <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">Desactivado</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Cambiar Contraseña</p>
                  <p className="text-xs text-gray-500">Actualizar credenciales de acceso</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm">Cambiar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del portal */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Portal del Paciente</h1>
                <p className="text-sm text-gray-500">Bienvenido/a, {paciente.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{paciente.nombre} {paciente.apellidos}</div>
                  <div className="text-xs text-gray-500">ID: {paciente.id}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {paciente.nombre.charAt(0)}{paciente.apellidos.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navegación */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('citas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'citas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Mis Citas
            </button>
            <button
              onClick={() => setActiveTab('documentos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documentos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Documentos
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pagos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Pagos
            </button>
            <button
              onClick={() => setActiveTab('facturas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'facturas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Download className="h-4 w-4 inline mr-2" />
              Facturas
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'perfil'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Mi Perfil
            </button>
          </nav>
        </div>

        {/* Contenido */}
        {activeTab === 'citas' && renderCitas()}
        {activeTab === 'documentos' && renderDocumentos()}
        {activeTab === 'pagos' && renderPagos()}
        {activeTab === 'facturas' && renderFacturas()}
        {activeTab === 'perfil' && renderPerfil()}
      </div>
    </div>
  );
};

export default PortalPaciente;