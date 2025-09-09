import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  roleDisplayName: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const predefinedUsers: User[] = [
    {
      id: '1',
      email: 'owner@clinic.com',
      name: 'Director General',
      role: 'owner',
      roleDisplayName: 'Owner / HQ Admin (global)',
      permissions: ['all']
    },
    {
      id: '2',
      email: 'hq.analista@clinic.com',
      name: 'Ana García',
      role: 'hq_analyst',
      roleDisplayName: 'HQ Analista (solo informes globales)',
      permissions: ['reports_global', 'analytics', 'dashboard_hq']
    },
    {
      id: '3',
      email: 'admin.sede@clinic.com',
      name: 'Carlos Martín',
      role: 'admin_sede',
      roleDisplayName: 'Admin de Sede',
      permissions: ['sede_management', 'users_sede', 'reports_sede', 'appointments', 'patients']
    },
    {
      id: '4',
      email: 'recepcion@clinic.com',
      name: 'María López',
      role: 'reception',
      roleDisplayName: 'Recepción',
      permissions: ['appointments', 'patients', 'basic_billing', 'phone']
    },
    {
      id: '5',
      email: 'doctor@clinic.com',
      name: 'Dr. Juan Rodríguez',
      role: 'clinical_professional',
      roleDisplayName: 'Profesional Clínico (doctor/higienista)',
      permissions: ['patients', 'treatments', 'clinical_history', 'appointments', 'prescriptions']
    },
    {
      id: '6',
      email: 'asistente@clinic.com',
      name: 'Laura Sánchez',
      role: 'assistant_nurse',
      roleDisplayName: 'Asistente/Enfermería',
      permissions: ['patients', 'treatments', 'clinical_history', 'appointments', 'basic_reports']
    },
    {
      id: '7',
      email: 'finanzas@clinic.com',
      name: 'Pedro Morales',
      role: 'finance',
      roleDisplayName: 'Finanzas / Caja',
      permissions: ['billing', 'payments', 'financial_reports', 'cash_management', 'budgets']
    },
    {
      id: '8',
      email: 'marketing@clinic.com',
      name: 'Sofia Jiménez',
      role: 'marketing',
      roleDisplayName: 'Marketing',
      permissions: ['marketing_campaigns', 'communications', 'funnels', 'patient_portal', 'branding']
    },
    {
      id: '9',
      email: 'operaciones@clinic.com',
      name: 'Miguel Torres',
      role: 'operations',
      roleDisplayName: 'Operaciones / Inventario',
      permissions: ['inventory', 'operations', 'suppliers', 'costs', 'integrations']
    },
    {
      id: '10',
      email: 'auditor@clinic.com',
      name: 'Elena Vargas',
      role: 'external_auditor',
      roleDisplayName: 'Auditor Externo (RO)',
      permissions: ['audit_reports', 'compliance', 'read_only']
    }
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = predefinedUsers.find(user => user.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};