import React, { useState } from 'react';
import {
  Image,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Lock,
  Unlock,
  Camera,
  Calendar,
  User,
  Tag,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Maximize2,
  Copy,
  Share2,
  GitCompare,
  Award
} from 'lucide-react';

interface ImagenClinica {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: 'antes' | 'despues' | 'progreso' | 'radiografia' | 'intraoral';
  categoria: string;
  tratamiento: string;
  fechaCaptura: string;
  profesional: string;
  descripcion: string;
  url: string;
  thumbnailUrl: string;
  tags: string[];
  permisos: {
    usoInterno: boolean;
    usoMarketing: boolean;
    usoRedes: boolean;
    consentimientoFirmado: boolean;
    fechaConsentimiento?: string;
  };
  metadata: {
    resolucion: string;
    tamano: string;
    formato: string;
    dispositivo: string;
  };
}

interface ComparacionAntesDespues {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tratamiento: string;
  imagenAntes: ImagenClinica;
  imagenDespues: ImagenClinica;
  fechaTratamiento: string;
  duracionTratamiento: string;
  profesional: string;
  descripcionCaso: string;
  resultados: string[];
  publicado: boolean;
  vistas: number;
  valoracion?: number;
}

interface CategoriaImagen {
  id: string;
  nombre: string;
  descripcion: string;
  totalImagenes: number;
  imagenesPublicas: number;
  ultimaActualizacion: string;
  icono: string;
}

const DAM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'biblioteca' | 'comparador' | 'permisos' | 'categorias'>('biblioteca');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [vistaGaleria, setVistaGaleria] = useState<'grid' | 'list'>('grid');
  const [mostrarSoloPublicas, setMostrarSoloPublicas] = useState(false);

  const [imagenes] = useState<ImagenClinica[]>([
    {
      id: '1',
      pacienteId: 'P001',
      pacienteNombre: 'María García',
      tipo: 'antes',
      categoria: 'Estética Dental',
      tratamiento: 'Blanqueamiento Dental',
      fechaCaptura: '2024-01-05',
      profesional: 'Dr. Martín García',
      descripcion: 'Estado inicial antes del tratamiento de blanqueamiento',
      url: '/images/dam/caso1_antes.jpg',
      thumbnailUrl: '/images/dam/thumb_caso1_antes.jpg',
      tags: ['blanqueamiento', 'estetica', 'caso-completo'],
      permisos: {
        usoInterno: true,
        usoMarketing: true,
        usoRedes: true,
        consentimientoFirmado: true,
        fechaConsentimiento: '2024-01-05'
      },
      metadata: {
        resolucion: '4096x3072',
        tamano: '2.5 MB',
        formato: 'JPEG',
        dispositivo: 'Canon EOS R5'
      }
    },
    {
      id: '2',
      pacienteId: 'P001',
      pacienteNombre: 'María García',
      tipo: 'despues',
      categoria: 'Estética Dental',
      tratamiento: 'Blanqueamiento Dental',
      fechaCaptura: '2024-01-20',
      profesional: 'Dr. Martín García',
      descripcion: 'Resultado final después del tratamiento de blanqueamiento',
      url: '/images/dam/caso1_despues.jpg',
      thumbnailUrl: '/images/dam/thumb_caso1_despues.jpg',
      tags: ['blanqueamiento', 'estetica', 'caso-completo', 'resultado-excelente'],
      permisos: {
        usoInterno: true,
        usoMarketing: true,
        usoRedes: true,
        consentimientoFirmado: true,
        fechaConsentimiento: '2024-01-05'
      },
      metadata: {
        resolucion: '4096x3072',
        tamano: '2.6 MB',
        formato: 'JPEG',
        dispositivo: 'Canon EOS R5'
      }
    },
    {
      id: '3',
      pacienteId: 'P002',
      pacienteNombre: 'Carlos López',
      tipo: 'antes',
      categoria: 'Implantología',
      tratamiento: 'Implante Dental Unitario',
      fechaCaptura: '2023-12-10',
      profesional: 'Dr. Ana López',
      descripcion: 'Ausencia de pieza dental #36',
      url: '/images/dam/caso2_antes.jpg',
      thumbnailUrl: '/images/dam/thumb_caso2_antes.jpg',
      tags: ['implante', 'unitario', 'molar'],
      permisos: {
        usoInterno: true,
        usoMarketing: false,
        usoRedes: false,
        consentimientoFirmado: true,
        fechaConsentimiento: '2023-12-10'
      },
      metadata: {
        resolucion: '3840x2160',
        tamano: '1.8 MB',
        formato: 'JPEG',
        dispositivo: 'Nikon D850'
      }
    },
    {
      id: '4',
      pacienteId: 'P003',
      pacienteNombre: 'Ana Martín',
      tipo: 'radiografia',
      categoria: 'Diagnóstico',
      tratamiento: 'Evaluación Periodontal',
      fechaCaptura: '2024-01-15',
      profesional: 'Dr. Carlos Ruiz',
      descripcion: 'Radiografía panorámica para evaluación periodontal',
      url: '/images/dam/rx_panoramica_001.jpg',
      thumbnailUrl: '/images/dam/thumb_rx_panoramica_001.jpg',
      tags: ['radiografia', 'panoramica', 'periodontal'],
      permisos: {
        usoInterno: true,
        usoMarketing: false,
        usoRedes: false,
        consentimientoFirmado: false
      },
      metadata: {
        resolucion: '2400x1200',
        tamano: '450 KB',
        formato: 'DICOM',
        dispositivo: 'Planmeca ProMax 3D'
      }
    },
    {
      id: '5',
      pacienteId: 'P004',
      pacienteNombre: 'José Ruiz',
      tipo: 'intraoral',
      categoria: 'Ortodoncia',
      tratamiento: 'Ortodoncia Invisible',
      fechaCaptura: '2024-01-18',
      profesional: 'Dr. Laura Sánchez',
      descripcion: 'Vista oclusal superior - Inicio tratamiento',
      url: '/images/dam/intraoral_001.jpg',
      thumbnailUrl: '/images/dam/thumb_intraoral_001.jpg',
      tags: ['ortodoncia', 'invisible', 'oclusal'],
      permisos: {
        usoInterno: true,
        usoMarketing: true,
        usoRedes: false,
        consentimientoFirmado: true,
        fechaConsentimiento: '2024-01-18'
      },
      metadata: {
        resolucion: '3000x2000',
        tamano: '1.2 MB',
        formato: 'JPEG',
        dispositivo: 'Cámara Intraoral HD'
      }
    }
  ]);

  const [comparaciones] = useState<ComparacionAntesDespues[]>([
    {
      id: '1',
      pacienteId: 'P001',
      pacienteNombre: 'María García',
      tratamiento: 'Blanqueamiento Dental Completo',
      imagenAntes: imagenes[0],
      imagenDespues: imagenes[1],
      fechaTratamiento: '2024-01-20',
      duracionTratamiento: '15 días',
      profesional: 'Dr. Martín García',
      descripcionCaso: 'Blanqueamiento dental profesional con sistema LED. Paciente con manchas por café y tabaco.',
      resultados: [
        'Mejora de 6 tonos en escala VITA',
        'Eliminación completa de manchas superficiales',
        'Sin sensibilidad post-tratamiento',
        'Satisfacción del paciente: 10/10'
      ],
      publicado: true,
      vistas: 245,
      valoracion: 4.8
    },
    {
      id: '2',
      pacienteId: 'P002',
      pacienteNombre: 'Carlos López',
      tratamiento: 'Implante Dental con Corona',
      imagenAntes: imagenes[2],
      imagenDespues: imagenes[2], // En realidad sería otra imagen
      fechaTratamiento: '2024-01-10',
      duracionTratamiento: '3 meses',
      profesional: 'Dr. Ana López',
      descripcionCaso: 'Reemplazo de molar inferior con implante de titanio y corona de porcelana.',
      resultados: [
        'Integración ósea exitosa',
        'Función masticatoria restaurada al 100%',
        'Estética natural',
        'Sin complicaciones post-operatorias'
      ],
      publicado: false,
      vistas: 0
    }
  ]);

  const [categorias] = useState<CategoriaImagen[]>([
    {
      id: '1',
      nombre: 'Estética Dental',
      descripcion: 'Casos de blanqueamiento, carillas, y mejoras estéticas',
      totalImagenes: 156,
      imagenesPublicas: 89,
      ultimaActualizacion: '2024-01-20',
      icono: 'sparkles'
    },
    {
      id: '2',
      nombre: 'Implantología',
      descripcion: 'Casos de implantes dentales y rehabilitaciones',
      totalImagenes: 234,
      imagenesPublicas: 45,
      ultimaActualizacion: '2024-01-19',
      icono: 'anchor'
    },
    {
      id: '3',
      nombre: 'Ortodoncia',
      descripcion: 'Casos de ortodoncia tradicional e invisible',
      totalImagenes: 189,
      imagenesPublicas: 102,
      ultimaActualizacion: '2024-01-18',
      icono: 'move'
    },
    {
      id: '4',
      nombre: 'Periodoncia',
      descripcion: 'Tratamientos de encías y tejidos de soporte',
      totalImagenes: 78,
      imagenesPublicas: 12,
      ultimaActualizacion: '2024-01-17',
      icono: 'heart'
    },
    {
      id: '5',
      nombre: 'Diagnóstico',
      descripcion: 'Radiografías y estudios diagnósticos',
      totalImagenes: 456,
      imagenesPublicas: 0,
      ultimaActualizacion: '2024-01-20',
      icono: 'scan'
    }
  ]);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'antes': return 'text-red-600 bg-red-100';
      case 'despues': return 'text-green-600 bg-green-100';
      case 'progreso': return 'text-yellow-600 bg-yellow-100';
      case 'radiografia': return 'text-blue-600 bg-blue-100';
      case 'intraoral': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPermisoIcon = (permitido: boolean) => {
    return permitido ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const filteredImagenes = imagenes.filter(imagen => {
    const matchesSearch = imagen.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         imagen.tratamiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         imagen.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategoria = selectedCategoria === 'todas' || imagen.categoria === selectedCategoria;
    const matchesTipo = selectedTipo === 'todos' || imagen.tipo === selectedTipo;
    const matchesPublicas = !mostrarSoloPublicas || imagen.permisos.usoMarketing;
    return matchesSearch && matchesCategoria && matchesTipo && matchesPublicas;
  });

  const renderBiblioteca = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Biblioteca de Imágenes Clínicas</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setVistaGaleria(vistaGaleria === 'grid' ? 'list' : 'grid')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
          >
            {vistaGaleria === 'grid' ? 'Vista Lista' : 'Vista Grid'}
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Subir Imágenes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Imágenes</p>
              <p className="text-2xl font-semibold text-gray-900">{imagenes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Unlock className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Uso Marketing</p>
              <p className="text-2xl font-semibold text-gray-900">
                {imagenes.filter(i => i.permisos.usoMarketing).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <GitCompare className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Comparaciones</p>
              <p className="text-2xl font-semibold text-gray-900">{comparaciones.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Categorías</p>
              <p className="text-2xl font-semibold text-gray-900">{categorias.length}</p>
            </div>
          </div>
        </div>
      </div>

      {vistaGaleria === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImagenes.map((imagen) => (
            <div key={imagen.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-12 bg-gray-100 flex items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400" />
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(imagen.tipo)}`}>
                    {imagen.tipo}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{imagen.pacienteNombre}</h4>
                <p className="text-xs text-gray-600 mb-2">{imagen.tratamiento}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{imagen.categoria}</span>
                  <span className="text-xs text-gray-500">{new Date(imagen.fechaCaptura).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center" title="Uso Interno">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {getPermisoIcon(imagen.permisos.usoInterno)}
                  </div>
                  <div className="flex items-center" title="Uso Marketing">
                    <Camera className="h-3 w-3 mr-1 text-gray-400" />
                    {getPermisoIcon(imagen.permisos.usoMarketing)}
                  </div>
                  <div className="flex items-center" title="Uso Redes Sociales">
                    <Share2 className="h-3 w-3 mr-1 text-gray-400" />
                    {getPermisoIcon(imagen.permisos.usoRedes)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {imagen.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredImagenes.map((imagen) => (
              <li key={imagen.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{imagen.pacienteNombre}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(imagen.tipo)}`}>
                          {imagen.tipo}
                        </span>
                        <span className="text-xs text-gray-500">{imagen.categoria}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{imagen.tratamiento}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Fecha:</span> {new Date(imagen.fechaCaptura).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Profesional:</span> {imagen.profesional}
                        </div>
                        <div>
                          <span className="font-medium">Resolución:</span> {imagen.metadata.resolucion}
                        </div>
                        <div>
                          <span className="font-medium">Tamaño:</span> {imagen.metadata.tamano}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-700">Permisos:</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">Interno</span>
                            {getPermisoIcon(imagen.permisos.usoInterno)}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">Marketing</span>
                            {getPermisoIcon(imagen.permisos.usoMarketing)}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">Redes</span>
                            {getPermisoIcon(imagen.permisos.usoRedes)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button className="text-blue-400 hover:text-blue-500">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderComparador = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Comparador Antes/Después</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Comparación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Casos Publicados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comparaciones.filter(c => c.publicado).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Vistas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comparaciones.reduce((acc, c) => acc + c.vistas, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <GitCompare className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Total Comparaciones</p>
              <p className="text-2xl font-semibold text-gray-900">{comparaciones.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comparaciones.map((comparacion) => (
          <div key={comparacion.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{comparacion.tratamiento}</h4>
                  {comparacion.publicado ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      <Lock className="h-3 w-3 mr-1" />
                      Privado
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {comparacion.pacienteNombre}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(comparacion.fechaTratamiento).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {comparacion.duracionTratamiento}
                  </span>
                  {comparacion.publicado && (
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {comparacion.vistas} vistas
                    </span>
                  )}
                </div>
              </div>
              {comparacion.valoracion && (
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="text-lg font-medium text-gray-900">{comparacion.valoracion}</span>
                  <span className="text-sm text-gray-500">/5</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Antes</h5>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Antes</span>
                  </div>
                  <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
                    <Maximize2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Después</h5>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Después</span>
                  </div>
                  <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
                    <Maximize2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Descripción del Caso</h5>
              <p className="text-sm text-gray-600">{comparacion.descripcionCaso}</p>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Resultados</h5>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {comparacion.resultados.map((resultado, index) => (
                  <li key={index}>{resultado}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Profesional: {comparacion.profesional}
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-700 flex items-center">
                  <GitCompare className="h-4 w-4 mr-1" />
                  Ver Comparación
                </button>
                {comparacion.publicado && (
                  <button className="text-green-600 hover:text-green-700 flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Compartir
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

  const renderPermisos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Permisos de Uso</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Configurar Permisos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Con Consentimiento</p>
              <p className="text-2xl font-semibold text-gray-900">
                {imagenes.filter(i => i.permisos.consentimientoFirmado).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Camera className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Uso Marketing</p>
              <p className="text-2xl font-semibold text-gray-900">
                {imagenes.filter(i => i.permisos.usoMarketing).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Share2 className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Uso Redes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {imagenes.filter(i => i.permisos.usoRedes).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Sin Consentimiento</p>
              <p className="text-2xl font-semibold text-gray-900">
                {imagenes.filter(i => !i.permisos.consentimientoFirmado).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {imagenes.map((imagen) => (
            <li key={imagen.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{imagen.pacienteNombre}</h4>
                      <span className="text-xs text-gray-500">ID: {imagen.pacienteId}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(imagen.tipo)}`}>
                        {imagen.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{imagen.tratamiento} - {imagen.categoria}</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Uso Interno</p>
                          <div className="flex items-center">
                            {imagen.permisos.usoInterno ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">Permitido</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">No permitido</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Marketing</p>
                          <div className="flex items-center">
                            {imagen.permisos.usoMarketing ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">Permitido</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">No permitido</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Redes Sociales</p>
                          <div className="flex items-center">
                            {imagen.permisos.usoRedes ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">Permitido</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">No permitido</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Consentimiento</p>
                          <div className="flex items-center">
                            {imagen.permisos.consentimientoFirmado ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <span className="text-xs">Firmado</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-yellow-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span className="text-xs">Pendiente</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {imagen.permisos.fechaConsentimiento && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">Fecha Firma</p>
                            <p className="text-xs text-gray-600">
                              {new Date(imagen.permisos.fechaConsentimiento).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-blue-400 hover:text-blue-500">
                    <Shield className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCategorias = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Categorías de Imágenes</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">{categoria.nombre}</h4>
                  <p className="text-xs text-gray-500">ID: {categoria.id}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{categoria.descripcion}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">{categoria.totalImagenes}</div>
                <div className="text-xs text-gray-500">Total Imágenes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-semibold text-green-600">{categoria.imagenesPublicas}</div>
                <div className="text-xs text-gray-500">Públicas</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Actualizado: {new Date(categoria.ultimaActualizacion).toLocaleDateString()}</span>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-500">
                  <Eye className="h-4 w-4" />
                </button>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">DAM - Digital Asset Management</h1>
        <p className="text-gray-600">Librería de imágenes clínicas, comparador antes/después y permisos de uso</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('biblioteca')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'biblioteca'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Image className="h-4 w-4 inline mr-2" />
            Biblioteca
          </button>
          <button
            onClick={() => setActiveTab('comparador')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'comparador'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <GitCompare className="h-4 w-4 inline mr-2" />
            Comparador A/D
          </button>
          <button
            onClick={() => setActiveTab('permisos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permisos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Permisos
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categorias'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Categorías
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
              placeholder="Buscar imágenes, pacientes o tratamientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            <option value="Estética Dental">Estética Dental</option>
            <option value="Implantología">Implantología</option>
            <option value="Ortodoncia">Ortodoncia</option>
            <option value="Periodoncia">Periodoncia</option>
            <option value="Diagnóstico">Diagnóstico</option>
          </select>
          <select
            className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
          >
            <option value="todos">Todos los tipos</option>
            <option value="antes">Antes</option>
            <option value="despues">Después</option>
            <option value="progreso">Progreso</option>
            <option value="radiografia">Radiografía</option>
            <option value="intraoral">Intraoral</option>
          </select>
          {activeTab === 'biblioteca' && (
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={mostrarSoloPublicas}
                onChange={(e) => setMostrarSoloPublicas(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600">Solo públicas</span>
            </label>
          )}
        </div>
      </div>

      {activeTab === 'biblioteca' && renderBiblioteca()}
      {activeTab === 'comparador' && renderComparador()}
      {activeTab === 'permisos' && renderPermisos()}
      {activeTab === 'categorias' && renderCategorias()}
    </div>
  );
};

export default DAM;