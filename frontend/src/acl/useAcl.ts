import { useAppSelector } from '@/store/hooks';
import { UserRole, PermissionAction } from '@/types/acl.types';
import { hasPermission, hasAnyPermission, hasRole } from './aclConfig';

export const useAcl = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = (user?.role as UserRole) || 'CUSTOMER';

  return {
    role,
    user,
    can: (permission: PermissionAction) => hasPermission(role, permission),
    canAny: (permissions: PermissionAction[]) => hasAnyPermission(role, permissions),
    isRole: (...roles: UserRole[]) => hasRole(role, ...roles),
    isAdmin: hasRole(role, 'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'),
    isSuperAdmin: role === 'SUPER_ADMIN',
  };
};

export default useAcl;
