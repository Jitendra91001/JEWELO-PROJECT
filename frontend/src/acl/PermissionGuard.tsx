import React from 'react';
import { PermissionAction, UserRole } from '@/types/acl.types';
import { useAcl } from './useAcl';

interface PermissionGuardProps {
  permission?: PermissionAction;
  anyPermissions?: PermissionAction[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  anyPermissions,
  fallback = null,
  children,
}) => {
  const { can, canAny } = useAcl();

  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  if (anyPermissions && !canAny(anyPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  fallback = null,
  children,
}) => {
  const { isRole } = useAcl();

  if (!isRole(...allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
