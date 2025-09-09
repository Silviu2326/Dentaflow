import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">Accede al sistema de gestión de la clínica</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@clinic.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">Cuentas de prueba disponibles:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
                { email: 'owner@clinic.com', role: 'Owner / HQ Admin' },
                { email: 'hq.analista@clinic.com', role: 'HQ Analista' },
                { email: 'admin.sede@clinic.com', role: 'Admin de Sede' },
                { email: 'recepcion@clinic.com', role: 'Recepción' },
                { email: 'doctor@clinic.com', role: 'Profesional Clínico' },
                { email: 'asistente@clinic.com', role: 'Asistente/Enfermería' },
                { email: 'finanzas@clinic.com', role: 'Finanzas / Caja' },
                { email: 'marketing@clinic.com', role: 'Marketing' },
                { email: 'operaciones@clinic.com', role: 'Operaciones / Inventario' },
                { email: 'auditor@clinic.com', role: 'Auditor Externo (RO)' }
              ].map((account, index) => (
                <div key={index} className="text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('password');
                    }}
                    className="w-full text-left p-2 rounded hover:bg-white hover:shadow-sm transition-colors"
                  >
                    <div className="font-medium text-gray-700">{account.role}</div>
                    <div className="text-gray-500">{account.email}</div>
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
              Contraseña para todas las cuentas: <span className="font-mono">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;