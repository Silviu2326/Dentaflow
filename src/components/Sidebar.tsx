import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  FolderOpen,
  Stethoscope,
  X,
  ChevronRight,
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
  Sliders,
  Eye,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile?: boolean;
  isDarkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, isMobile = false, isDarkMode = false }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getAllNavigation = () => [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'main', permission: 'dashboard', readOnly: false },
    { name: 'Agenda', href: '/agenda', icon: Calendar, section: 'main', permission: 'agenda', readOnly: false },
    { name: 'Pacientes', href: '/pacientes', icon: Users, section: 'main', permission: 'patients', readOnly: false },
    { name: 'Citas', href: '/citas', icon: Stethoscope, section: 'main', permission: 'appointments', readOnly: false },
    { name: 'Tratamientos', href: '/tratamientos', icon: Package, section: 'main', permission: 'treatments', readOnly: false },
    { name: 'Historia Clínica', href: '/historia-clinica', icon: Activity, section: 'main', permission: 'clinical_history', readOnly: false },
    { name: 'Consentimientos', href: '/consentimientos', icon: Shield, section: 'main', permission: 'consents', readOnly: false },
    { name: 'Presupuestos', href: '/presupuestos', icon: FileText, section: 'main', permission: 'budgets', readOnly: false },
    { name: 'Facturación', href: '/facturacion', icon: CreditCard, section: 'main', permission: 'billing', readOnly: false },
    { name: 'Caja', href: '/caja', icon: DollarSign, section: 'main', permission: 'cash_management', readOnly: false },
    { name: 'Reportes', href: '/reportes', icon: BarChart3, section: 'main', permission: 'reports', readOnly: false },
    { name: 'Usuarios', href: '/usuarios', icon: UserCheck, section: 'main', permission: 'users_management', readOnly: false },
    { name: 'Cita Online', href: '/cita-online', icon: Globe, section: 'main', permission: 'online_booking', readOnly: false },
    { name: 'Importador', href: '/importador', icon: Upload, section: 'main', permission: 'data_import', readOnly: false },
    { name: 'Documentos', href: '/documentos', icon: FolderOpen, section: 'main', permission: 'documents', readOnly: false },
    
    { name: 'Inventario', href: '/inventario', icon: Package, section: 'operations', permission: 'inventory', readOnly: false },
    { name: 'Costes', href: '/costes', icon: Calculator, section: 'operations', permission: 'costs', readOnly: false },
    { name: 'Pagos', href: '/pagos', icon: CreditCard, section: 'operations', permission: 'payments', readOnly: false },
    { name: 'Integraciones', href: '/integraciones', icon: Zap, section: 'operations', permission: 'integrations', readOnly: false },
    
    { name: 'Portal Paciente', href: '/portal-paciente', icon: ExternalLink, section: 'external', permission: 'patient_portal', readOnly: false },
    { name: 'Portal Empleado', href: '/portal-empleado', icon: MessageSquare, section: 'external', permission: 'employee_portal', readOnly: false },
    
    { name: 'HQ Overview', href: '/hq/overview', icon: Target, section: 'hq', permission: 'hq_overview', readOnly: false },
    { name: 'HQ Comisiones', href: '/hq/comisiones', icon: Coins, section: 'hq', permission: 'hq_commissions', readOnly: false },
    
    { name: 'Marketing Funnels', href: '/marketing/funnels', icon: TrendingUp, section: 'marketing', permission: 'marketing_funnels', readOnly: false },
    { name: 'Marketing Comunicaciones', href: '/marketing/comunicaciones', icon: Mail, section: 'marketing', permission: 'marketing_communications', readOnly: false },
    
    { name: 'DAM (Antes/Después)', href: '/dam', icon: Images, section: 'digital', permission: 'dam', readOnly: false },
    { name: 'Telefonía', href: '/telefonia', icon: Phone, section: 'digital', permission: 'telephony', readOnly: false },
    { name: 'Financiación', href: '/financiacion', icon: Calculator, section: 'digital', permission: 'financing', readOnly: false },
    { name: 'Analytics Cohortes', href: '/analytics/cohortes', icon: PieChart, section: 'digital', permission: 'analytics_cohorts', readOnly: false },
    { name: 'Analytics Forecast', href: '/analytics/forecast', icon: TrendingUp, section: 'digital', permission: 'analytics_forecast', readOnly: false },
    
    { name: 'Webhooks', href: '/webhooks', icon: Key, section: 'system', permission: 'webhooks', readOnly: false },
    { name: 'API', href: '/api', icon: Zap, section: 'system', permission: 'api_management', readOnly: false },
    { name: 'Status', href: '/status', icon: Server, section: 'system', permission: 'system_status', readOnly: true },
    { name: 'Auditoría', href: '/auditoria', icon: Activity, section: 'system', permission: 'audit', readOnly: true },
    
    { name: 'Privacidad', href: '/ajustes/privacidad', icon: Shield, section: 'settings', permission: 'privacy_settings', readOnly: false },
    { name: 'Branding', href: '/branding', icon: Palette, section: 'settings', permission: 'branding', readOnly: false },
    { name: 'Campos Personalizados', href: '/campos-personalizados', icon: Sliders, section: 'settings', permission: 'custom_fields', readOnly: false },
  ];

  const getNavigationForRole = () => {
    const allNavigation = getAllNavigation();
    
    if (user?.role === 'owner') {
      return allNavigation;
    }
    
    if (user?.role === 'hq_analyst') {
      return allNavigation.filter(item => [
        'dashboard', 'hq_overview', 'reports', 'analytics_cohorts', 
        'analytics_forecast', 'costs', 'payments', 'audit'
      ].includes(item.permission)).map(item => ({
        ...item,
        readOnly: true
      }));
    }
    
    if (user?.role === 'admin_sede') {
      return allNavigation.filter(item => [
        'dashboard', 'agenda', 'patients', 'appointments', 'clinical_history',
        'consents', 'documents', 'budgets', 'billing', 'cash_management',
        'inventory', 'costs', 'payments', 'reports', 'hq_commissions',
        'telephony', 'dam', 'online_booking', 'users_management'
      ].includes(item.permission));
    }
    
    if (user?.role === 'reception') {
      return allNavigation.filter(item => [
        'agenda', 'patients', 'appointments', 'budgets', 'billing',
        'cash_management', 'documents', 'consents', 'reports'
      ].includes(item.permission));
    }
    
    if (user?.role === 'clinical_professional') {
      return allNavigation.filter(item => [
        'agenda', 'patients', 'clinical_history', 'consents', 'budgets',
        'documents', 'dam', 'reports'
      ].includes(item.permission)).map(item => {
        if (item.permission === 'patients') {
          return { ...item, readOnly: true };
        }
        return item;
      });
    }
    
    if (user?.role === 'assistant_nurse') {
      return allNavigation.filter(item => [
        'agenda', 'patients', 'clinical_history', 'appointments', 
        'documents', 'consents'
      ].includes(item.permission)).map(item => {
        if (['agenda', 'patients'].includes(item.permission)) {
          return { ...item, readOnly: true };
        }
        return item;
      });
    }
    
    if (user?.role === 'finance') {
      return allNavigation.filter(item => [
        'billing', 'payments', 'cash_management', 'reports', 'costs', 'audit'
      ].includes(item.permission)).map(item => {
        if (['costs', 'audit'].includes(item.permission)) {
          return { ...item, readOnly: true };
        }
        return item;
      });
    }
    
    if (user?.role === 'marketing') {
      return allNavigation.filter(item => [
        'marketing_funnels', 'marketing_communications', 'dam', 'online_booking', 'reports'
      ].includes(item.permission)).map(item => {
        if (['dam', 'reports'].includes(item.permission)) {
          return { ...item, readOnly: true };
        }
        return item;
      });
    }
    
    if (user?.role === 'operations') {
      return allNavigation.filter(item => [
        'inventory', 'costs', 'reports'
      ].includes(item.permission)).map(item => {
        if (item.permission === 'reports') {
          return { ...item, readOnly: true };
        }
        return item;
      });
    }
    
    if (user?.role === 'external_auditor') {
      return allNavigation.filter(item => [
        'reports', 'billing', 'cash_management', 'audit'
      ].includes(item.permission)).map(item => ({
        ...item,
        readOnly: true
      }));
    }
    
    return [];
  };

  const navigation = getNavigationForRole();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'hq': return 'text-purple-700 bg-purple-50/80 hover:bg-purple-100 border-purple-200/50';
      case 'marketing': return 'text-orange-700 bg-orange-50/80 hover:bg-orange-100 border-orange-200/50';
      case 'operations': return 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200/50';
      case 'external': return 'text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border-indigo-200/50';
      case 'digital': return 'text-cyan-700 bg-cyan-50/80 hover:bg-cyan-100 border-cyan-200/50';
      case 'system': return 'text-red-700 bg-red-50/80 hover:bg-red-100 border-red-200/50';
      case 'settings': return 'text-gray-700 bg-gray-50/80 hover:bg-gray-100 border-gray-200/50';
      default: return 'text-gray-700 bg-white/50 hover:bg-blue-50 border-transparent';
    }
  };

  const getSectionActiveColor = (section: string) => {
    switch (section) {
      case 'hq': return 'bg-purple-100 text-purple-900 border-purple-300 shadow-purple-200/50';
      case 'marketing': return 'bg-orange-100 text-orange-900 border-orange-300 shadow-orange-200/50';
      case 'operations': return 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-emerald-200/50';
      case 'external': return 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-indigo-200/50';
      case 'digital': return 'bg-cyan-100 text-cyan-900 border-cyan-300 shadow-cyan-200/50';
      case 'system': return 'bg-red-100 text-red-900 border-red-300 shadow-red-200/50';
      case 'settings': return 'bg-gray-100 text-gray-900 border-gray-300 shadow-gray-200/50';
      default: return 'bg-blue-100 text-blue-900 border-blue-300 shadow-blue-200/50';
    }
  };

  const getSectionGradient = (section: string) => {
    switch (section) {
      case 'hq': return 'from-purple-50 via-pink-50 to-rose-50 border-purple-200';
      case 'marketing': return 'from-orange-50 via-red-50 to-pink-50 border-orange-200';
      case 'operations': return 'from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200';
      case 'external': return 'from-indigo-50 via-purple-50 to-pink-50 border-indigo-200';
      case 'digital': return 'from-cyan-50 via-teal-50 to-blue-50 border-cyan-200';
      case 'system': return 'from-red-50 via-rose-50 to-pink-50 border-red-200';
      case 'settings': return 'from-gray-50 via-slate-50 to-zinc-50 border-gray-200';
      default: return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const groupedNavigation = navigation.reduce((acc: any, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  const renderSectionHeader = (sectionKey: string, title: string, dotColor: string) => (
    <div className="pt-8 pb-3 first:pt-6">
      <div className={`flex items-center px-4 py-2.5 mx-1 rounded-xl bg-gradient-to-r ${getSectionGradient(sectionKey)} border backdrop-blur-sm`}>
        <div className={`w-2 h-2 ${dotColor} rounded-full mr-3 animate-pulse shadow-sm`}></div>
        <span className="text-xs font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
    </div>
  );

  const renderNavItems = (items: any[], sectionKey: string) => items.map((item: any) => (
    <Link
      key={item.name}
      to={item.href}
      className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] border ${
        isActive(item.href)
          ? `${getSectionActiveColor(item.section)} shadow-lg transform scale-[1.02]`
          : `${getSectionColor(item.section)} hover:shadow-md`
      }`}
      onClick={() => isMobile && setSidebarOpen(false)}
    >
      <div className={`p-1.5 rounded-lg mr-3 transition-all duration-300 ${
        isActive(item.href) 
          ? 'bg-white/40 shadow-sm' 
          : 'bg-white/20 group-hover:bg-white/30'
      }`}>
        <item.icon className="h-4 w-4" />
      </div>
      <span className="flex-1 font-medium">{item.name}</span>
      {item.readOnly && (
        <Eye className="h-4 w-4 opacity-60" title="Solo lectura" />
      )}
      {!isMobile && isActive(item.href) && (
        <ChevronRight className="h-4 w-4 opacity-70" />
      )}
    </Link>
  ));

  const sidebarContent = (
    <div className={`flex min-h-0 flex-1 flex-col backdrop-blur-xl border-r shadow-xl transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 border-gray-700/20' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-white/20'
    }`}>
      {isMobile && (
        <div className="absolute top-0 right-0 -mr-12 pt-2 z-10">
          <button
            type="button"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/20 transition-all duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-6 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode 
                  ? 'from-white to-gray-300' 
                  : 'from-gray-900 to-gray-700'
              }`}>
                ClinicApp
              </span>
              <div className="flex items-center mt-1">
                <Sparkles className="h-3 w-3 text-blue-500 mr-1" />
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Pro</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="mt-2 flex-1 space-y-1 px-3">
          {groupedNavigation.main?.length > 0 && renderNavItems(groupedNavigation.main, 'main')}

          {groupedNavigation.operations && (
            <>
              {renderSectionHeader('operations', 'Operaciones', 'bg-gradient-to-r from-emerald-500 to-teal-500')}
              {renderNavItems(groupedNavigation.operations, 'operations')}
            </>
          )}

          {groupedNavigation.external && (
            <>
              {renderSectionHeader('external', 'Portales', 'bg-gradient-to-r from-indigo-500 to-purple-500')}
              {renderNavItems(groupedNavigation.external, 'external')}
            </>
          )}

          {groupedNavigation.hq && (
            <>
              {renderSectionHeader('hq', 'Headquarters', 'bg-gradient-to-r from-purple-500 to-pink-500')}
              {renderNavItems(groupedNavigation.hq, 'hq')}
            </>
          )}

          {groupedNavigation.marketing && (
            <>
              {renderSectionHeader('marketing', 'Marketing', 'bg-gradient-to-r from-orange-500 to-red-500')}
              {renderNavItems(groupedNavigation.marketing, 'marketing')}
            </>
          )}

          {groupedNavigation.digital && (
            <>
              {renderSectionHeader('digital', 'Digital & Analytics', 'bg-gradient-to-r from-cyan-500 to-teal-500')}
              {renderNavItems(groupedNavigation.digital, 'digital')}
            </>
          )}

          {groupedNavigation.system && (
            <>
              {renderSectionHeader('system', 'Sistema & API', 'bg-gradient-to-r from-red-500 to-rose-500')}
              {renderNavItems(groupedNavigation.system, 'system')}
            </>
          )}

          {groupedNavigation.settings && (
            <>
              {renderSectionHeader('settings', 'Configuración', 'bg-gradient-to-r from-gray-500 to-slate-500')}
              {renderNavItems(groupedNavigation.settings, 'settings')}
            </>
          )}
        </nav>
      </div>
      
      {user && (
        <div className={`flex-shrink-0 p-4 border-t backdrop-blur-sm transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-700/20 bg-gray-800/30' 
            : 'border-white/20 bg-white/30'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.name}
              </p>
              <p className={`text-xs truncate ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {navigation.length} páginas{!isMobile && ` • ${user.roleDisplayName || user.role}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      {sidebarContent}
    </div>
  );
};

export default Sidebar;