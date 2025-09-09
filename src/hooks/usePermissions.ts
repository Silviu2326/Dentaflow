import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  const isRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAnyRole = (roles: string[]): boolean => {
    return roles.includes(user?.role || '');
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAnyRole,
    user,
    permissions: user?.permissions || []
  };
};