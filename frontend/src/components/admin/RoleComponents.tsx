import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";

interface RoleBadgeProps {
  role: "USER" | "ADMIN";
  size?: "sm" | "md" | "lg";
}

/**
 * Role Badge Component - Displays role with proper styling
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = "md" }) => {
  const isAdmin = role === "ADMIN";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]}
        ${
          isAdmin
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        }
      `}
    >
      {isAdmin ? <Shield size={14} /> : <Users size={14} />}
      <span>{role}</span>
    </div>
  );
};

interface UserAvatarProps {
  name: string;
  role: "USER" | "ADMIN";
  size?: "sm" | "md" | "lg";
}

/**
 * User Avatar Component - Displays user initials with role-based color
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ name, role, size = "md" }) => {
  const isAdmin = role === "ADMIN";

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white
        ${isAdmin ? "bg-purple-500" : "gold-gradient"}
      `}
    >
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

interface RoleInfoCardProps {
  role: "USER" | "ADMIN";
  count: number;
}

/**
 * Role Info Card - Shows role information with user count
 */
export const RoleInfoCard: React.FC<RoleInfoCardProps> = ({ role, count }) => {
  const isAdmin = role === "ADMIN";
  const roleLabel = isAdmin ? "Administrators" : "Customers";
  const roleDescription = isAdmin
    ? "Full access to admin panel, products, orders, and settings"
    : "Standard marketplace access with account features";

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{roleLabel}</h3>
        <div
          className={`
            p-2 rounded-lg
            ${isAdmin ? "bg-purple-100 dark:bg-purple-900" : "bg-blue-100 dark:bg-blue-900"}
          `}
        >
          {isAdmin ? (
            <Shield className="text-purple-600 dark:text-purple-300" size={24} />
          ) : (
            <Users className="text-blue-600 dark:text-blue-300" size={24} />
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{roleDescription}</p>

      <div className="bg-background rounded-lg p-3">
        <p className="text-2xl font-bold text-foreground">{count}</p>
        <p className="text-xs text-muted-foreground mt-1">{roleLabel} assigned</p>
      </div>
    </div>
  );
};

interface PermissionListProps {
  role: "USER" | "ADMIN";
}

/**
 * Permission List Component - Shows what a role can do
 */
export const PermissionList: React.FC<PermissionListProps> = ({ role }) => {
  const adminPermissions = [
    "Manage all users and roles",
    "Create, edit, delete products",
    "Manage product categories",
    "View and manage orders",
    "Create and manage coupons",
    "Access reports and analytics",
    "System settings and configuration",
    "User account administration",
  ];

  const userPermissions = [
    "Browse products",
    "Create orders",
    "Manage wishlist",
    "View order history",
    "Manage addresses",
    "View profile",
    "Leave product reviews",
    "Track orders",
  ];

  const permissions = role === "ADMIN" ? adminPermissions : userPermissions;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Permissions</h3>
      <ul className="space-y-3">
        {permissions.map((permission, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-foreground">
            <div className={`
              w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold
              ${role === "ADMIN" ? "bg-purple-500" : "bg-blue-500"}
            `}>
              ✓
            </div>
            {permission}
          </li>
        ))}
      </ul>
    </div>
  );
};
