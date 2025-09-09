import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  FolderOpen,
  Stethoscope,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Settings,
  LogOut,
  Package,
  Activity,
  Shield,
  DollarSign,
  BarChart3,
  UserCheck,
  Globe,
  Upload,
  Target,
  Coins,
  TrendingUp,
  Mail,
  Calculator,
  Zap,
  MessageSquare,
  ExternalLink,
  Images,
  Phone,
  PieChart,
  Key,
  Server,
  Palette,
  Sliders
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'main' },
    { name: 'Agenda', href: '/agenda', icon: Calendar, section: 'main' },
    { name: 'Pacientes', href: '/pacientes', icon: Users, section: 'main' },
    { name: 'Citas', href: '/citas', icon: Stethoscope, section: 'main' },
    { name: 'Tratamientos', href: '/tratamientos', icon: Package, section: 'main' },
    { name: 'Historia Clínica', href: '/historia-clinica', icon: Activity, section: 'main' },
    { name: 'Consentimientos', href: '/consentimientos', icon: Shield, section: 'main' },
    { name: 'Presupuestos', href: '/presupuestos', icon: FileText, section: 'main' },
    { name: 'Facturación', href: '/facturacion', icon: CreditCard, section: 'main' },
    { name: 'Caja', href: '/caja', icon: DollarSign, section: 'main' },
    { name: 'Reportes', href: '/reportes', icon: BarChart3, section: 'main' },
    { name: 'Usuarios', href: '/usuarios', icon: UserCheck, section: 'main' },
    { name: 'Cita Online', href: '/cita-online', icon: Globe, section: 'main' },
    { name: 'Importador', href: '/importador', icon: Upload, section: 'main' },
    { name: 'Documentos', href: '/documentos', icon: FolderOpen, section: 'main' },
    
    // Operations Section
    { name: 'Inventario', href: '/inventario', icon: Package, section: 'operations' },
    { name: 'Costes', href: '/costes', icon: Calculator, section: 'operations' },
    { name: 'Pagos', href: '/pagos', icon: CreditCard, section: 'operations' },
    { name: 'Integraciones', href: '/integraciones', icon: Zap, section: 'operations' },
    
    // External Section
    { name: 'Portal Paciente', href: '/portal-paciente', icon: ExternalLink, section: 'external' },
    { name: 'Portal Empleado', href: '/portal-empleado', icon: MessageSquare, section: 'external' },
    
    // HQ Section
    { name: 'HQ Overview', href: '/hq/overview', icon: Target, section: 'hq' },
    { name: 'HQ Comisiones', href: '/hq/comisiones', icon: Coins, section: 'hq' },
    
    // Marketing Section
    { name: 'Marketing Funnels', href: '/marketing/funnels', icon: TrendingUp, section: 'marketing' },
    { name: 'Marketing Comunicaciones', href: '/marketing/comunicaciones', icon: Mail, section: 'marketing' },
    
    // Digital Assets Section  
    { name: 'DAM (Antes/Después)', href: '/dam', icon: Images, section: 'digital' },
    { name: 'Telefonía', href: '/telefonia', icon: Phone, section: 'digital' },
    { name: 'Financiación', href: '/financiacion', icon: Calculator, section: 'digital' },
    { name: 'Analytics Cohortes', href: '/analytics/cohortes', icon: PieChart, section: 'digital' },
    { name: 'Analytics Forecast', href: '/analytics/forecast', icon: TrendingUp, section: 'digital' },
    
    // System & API Section
    { name: 'Webhooks', href: '/webhooks', icon: Key, section: 'system' },
    { name: 'API', href: '/api', icon: Zap, section: 'system' },
    { name: 'Status', href: '/status', icon: Server, section: 'system' },
    { name: 'Auditoría', href: '/auditoria', icon: Activity, section: 'system' },
    
    // Settings Section
    { name: 'Privacidad', href: '/ajustes/privacidad', icon: Shield, section: 'settings' },
    { name: 'Branding', href: '/branding', icon: Palette, section: 'settings' },
    { name: 'Campos Personalizados', href: '/campos-personalizados', icon: Sliders, section: 'settings' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'hq': return 'text-purple-600 bg-purple-100 hover:bg-purple-200';
      case 'marketing': return 'text-orange-600 bg-orange-100 hover:bg-orange-200';
      case 'operations': return 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200';
      case 'external': return 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200';
      case 'digital': return 'text-cyan-600 bg-cyan-100 hover:bg-cyan-200';
      case 'system': return 'text-red-600 bg-red-100 hover:bg-red-200';
      case 'settings': return 'text-gray-600 bg-gray-100 hover:bg-gray-200';
      default: return 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    }
  };

  const getSectionActiveColor = (section: string) => {
    switch (section) {
      case 'hq': return 'bg-purple-100 text-purple-900 border-purple-500';
      case 'marketing': return 'bg-orange-100 text-orange-900 border-orange-500';
      case 'operations': return 'bg-emerald-100 text-emerald-900 border-emerald-500';
      case 'external': return 'bg-indigo-100 text-indigo-900 border-indigo-500';
      case 'digital': return 'bg-cyan-100 text-cyan-900 border-cyan-500';
      case 'system': return 'bg-red-100 text-red-900 border-red-500';
      case 'settings': return 'bg-gray-100 text-gray-900 border-gray-500';
      default: return 'bg-blue-100 text-blue-900 border-blue-500';
    }
  };

  const groupedNavigation = navigation.reduce((acc: any, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ClinicApp</span>
            </div>
            <nav className="mt-5 space-y-1 px-2">
              {/* Main Section */}
              {groupedNavigation.main?.map((item: any) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? getSectionActiveColor(item.section)
                      : getSectionColor(item.section)
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}

              {/* Operations Section */}
              {groupedNavigation.operations && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Operaciones
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.operations.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* External Section */}
              {groupedNavigation.external && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                        Portales
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.external.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* HQ Section */}
              {groupedNavigation.hq && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                        Headquarters
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.hq.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Marketing Section */}
              {groupedNavigation.marketing && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-orange-800 uppercase tracking-wider">
                        Marketing
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.marketing.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Digital Section */}
              {groupedNavigation.digital && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
                        Digital & Analytics
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.digital.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* System Section */}
              {groupedNavigation.system && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">
                        Sistema & API
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.system.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Settings Section */}
              {groupedNavigation.settings && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Configuración
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.settings.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ClinicApp</span>
            </div>
            <nav className="mt-8 flex-1 space-y-1 bg-white px-2">
              {/* Main Section */}
              {groupedNavigation.main?.map((item: any) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? getSectionActiveColor(item.section)
                      : getSectionColor(item.section)
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {isActive(item.href) && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}

              {/* Operations Section */}
              {groupedNavigation.operations && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Operaciones
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.operations.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}

              {/* External Section */}
              {groupedNavigation.external && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                        Portales
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.external.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}

              {/* HQ Section */}
              {groupedNavigation.hq && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                        Headquarters
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.hq.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}

              {/* Marketing Section */}
              {groupedNavigation.marketing && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-orange-800 uppercase tracking-wider">
                        Marketing
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.marketing.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}

              {/* Digital Section */}
              {groupedNavigation.digital && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
                        Digital & Analytics
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.digital.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}

              {/* System Section */}
              {groupedNavigation.system && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">
                        Sistema & API
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.system.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}

              {/* Settings Section */}
              {groupedNavigation.settings && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="flex items-center px-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Configuración
                      </span>
                    </div>
                  </div>
                  {groupedNavigation.settings.map((item: any) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? getSectionActiveColor(item.section)
                          : getSectionColor(item.section)
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="w-full max-w-lg lg:max-w-xs">
                <div className="relative">
                  <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
                  <input
                    className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-gray-50 rounded-md"
                    placeholder="Buscar pacientes, citas..."
                    type="search"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">DR</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">Dr. Rodriguez</div>
                  <div className="text-xs text-gray-500">Administrador</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;