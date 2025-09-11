import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
  Menu,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  MessageCircle,
  Filter,
  Sun,
  Moon
} from 'lucide-react';
import Sidebar from './Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-slate-100'
    }`}>
      {/* Sidebar components */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={true} isDarkMode={isDarkMode} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={false} isDarkMode={isDarkMode} />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Modern Top bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b shadow-sm transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/20' 
            : 'bg-white/80 border-white/20'
        }`}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className={`lg:hidden p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="hidden lg:block">
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Bienvenido de nuevo, <span className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{user?.name || 'Usuario'}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Search */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className={`block w-full pl-10 pr-12 py-2.5 border rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-400 hover:bg-gray-700/70' 
                      : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 hover:bg-white/70'
                  }`}
                  placeholder="Buscar pacientes, citas, tratamientos..."
                  type="search"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button className={`p-1 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/50' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                  }`}>
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
                title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button className={`p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </button>
              </div>
              
              {/* Messages */}
              <button className={`p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}>
                <MessageCircle className="h-5 w-5" />
              </button>
              
              {/* Settings */}
              <button className={`p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}>
                <Settings className="h-5 w-5" />
              </button>

              {/* User profile */}
              <div className={`flex items-center space-x-3 ml-4 pl-4 border-l ${
                isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
              }`}>
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{user?.name || 'Usuario'}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{user?.roleDisplayName || user?.role || 'Usuario'}</div>
                </div>
                <button
                  onClick={logout}
                  className={`p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/30' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Modern Page content */}
        <main className="flex-1 relative">
          <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/50 via-slate-800/20 to-gray-900/30' 
              : 'bg-gradient-to-br from-white/50 via-blue-50/20 to-purple-50/30'
          }`}></div>
          <div className="relative z-10 p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;