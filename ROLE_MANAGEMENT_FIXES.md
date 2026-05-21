# Role Management Fixes - API & UI

## Overview
Fixed role management for USER, ADMIN, and other roles across both backend API and frontend UI. All components now properly handle role-based access control.

## Backend (Already Configured ✓)

### Database Schema
- **Location**: `backend/prisma/schema.prisma`
- **Enum**: `UserRole` with values: `USER`, `ADMIN`
- **User Model**: Has `role` field with default value `USER`
- **Index**: Role field is indexed for efficient queries

### Services
- **Location**: `backend/src/services/user.service.ts`
- **Functions**:
  - `getAllUsers()` - Get users with pagination, search, and role filtering
  - `getUserById()` - Get user details with stats
  - `updateUserRole()` - Update user role (USER or ADMIN)
  - `toggleUserStatus()` - Activate/deactivate users
  - `deleteUser()` - Remove users
  - `getUserStats()` - Get user statistics

### Routes
- **Location**: `backend/src/routes/admin.routes.ts`
- **Protection**: All routes require `authenticate` and `authorize('ADMIN')` middleware
- **Endpoints**:
  - `GET /api/v1/admin/users` - List all users with filters
  - `GET /api/v1/admin/users/:id` - Get user details
  - `PATCH /api/v1/admin/users/:id/role` - Update user role
  - `PATCH /api/v1/admin/users/:id/status` - Toggle user status
  - `DELETE /api/v1/admin/users/:id` - Delete user
  - `GET /api/v1/admin/roles` - Get available roles metadata
  - `GET /api/v1/admin/stats/users` - Get user statistics

## Frontend Fixes

### 1. API Endpoints (Fixed ✓)
- **Location**: `frontend/src/api/admin.api.ts`
- **Changes**:
  - ✅ Changed `toggleUserStatus` from PUT to PATCH
  - ✅ Changed endpoint from `/toggle` to `/status`
  - ✅ Ensured all user-related endpoints use PATCH method

**Before:**
```typescript
toggleUserStatus: (id: string) => axiosInstance.put(`/api/v1/admin/users/${id}/toggle`)
```

**After:**
```typescript
toggleUserStatus: (id: string) => axiosInstance.patch(`/api/v1/admin/users/${id}/status`)
```

### 2. Async Thunks (Enhanced ✓)
- **Location**: `frontend/src/store/admin/adminThunk.ts`
- **Changes**:
  - ✅ Added proper TypeScript types for User interface
  - ✅ Added Role interface for role definitions
  - ✅ Added PaginatedUsersResponse interface
  - ✅ Improved type safety for all user-related thunks
  - ✅ Fixed error handling in all thunks

**Types Added:**
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Role {
  id: string;
  label: string;
  description: string;
}
```

### 3. Auth Slice (Fixed ✓)
- **Location**: `frontend/src/store/authSlice.ts`
- **Changes**:
  - ✅ Updated User interface to use proper role typing: `'USER' | 'ADMIN'`
  - ✅ Fixed AuthState roles field typing
  - ✅ Improved type safety throughout auth flow

**Before:**
```typescript
role?: string;
roles: string;
```

**After:**
```typescript
role?: 'USER' | 'ADMIN';
roles?: 'USER' | 'ADMIN';
```

### 4. Role Check Utilities (New ✓)
- **Location**: `frontend/src/utils/roleCheck.ts`
- **Functions**:
  - `isAdmin(role)` - Check if user is admin
  - `isUser(role)` - Check if user is regular user
  - `hasRole(role, ...allowedRoles)` - Check multiple roles
  - `getRoleLabel(role)` - Get human-readable role label
  - `getRoleDescription(role)` - Get role description

**Usage:**
```typescript
import { isAdmin, getRoleLabel } from '@/utils/roleCheck';

if (isAdmin(user?.role)) {
  // Show admin features
}

console.log(getRoleLabel('ADMIN')); // "Administrator"
```

### 5. Protected Route (Enhanced ✓)
- **Location**: `frontend/src/authRoute/ProtectedRoute.tsx`
- **Changes**:
  - ✅ Refactored to use role check utility
  - ✅ Added `replace` prop to Navigate for better UX
  - ✅ Removed unused imports
  - ✅ More maintainable and testable

**Before:**
```typescript
if (user?.role !== "ADMIN") {
  return <Navigate to="/" />;
}
```

**After:**
```typescript
if (!isAdmin(user?.role)) {
  return <Navigate to="/" replace />;
}
```

## Admin Pages (Already Configured ✓)

### User Management Pages
1. **AdminUsers** (`frontend/src/pages/admin/AdminUsers.tsx`)
   - List all users with pagination
   - Search users by name/email
   - Change user role (USER ↔ ADMIN)
   - Toggle user status (Active ↔ Blocked)
   - Refresh data

2. **AdminRoles** (`frontend/src/pages/admin/AdminRoles.tsx`)
   - View all available roles with descriptions
   - List users by role
   - Update user roles
   - Toggle user status
   - View role metadata

### Admin Routes
```
/admin/users     - User management
/admin/roles     - Role management and assignment
/admin/products  - Product management
/admin/categories - Category management
/admin/orders    - Order management
/admin/coupons   - Coupon management
/admin/reports   - Reports and analytics
/admin/settings  - System settings
```

## Role-Based Access Control Flow

### User Registration
1. User registers → Default role is `USER`
2. Token issued with role information
3. Stored in localStorage and Redux store

### Admin Assignment
1. Admin navigates to `/admin/roles` or `/admin/users`
2. Selects user → Changes role to `ADMIN`
3. Backend updates user role in database
4. Frontend updates Redux state
5. User gains access to admin panel on next login

### Protected Routes
1. User tries to access `/admin/*`
2. ProtectedRoute checks:
   - Is user authenticated? → If no, redirect to `/login`
   - Is user admin? → If no, redirect to `/`
3. If both true → Access granted to admin panel

## API Response Examples

### Get Users
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "user123",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "USER",
        "isActive": true,
        "isEmailVerified": true,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### Update User Role
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  },
  "message": "User role updated successfully"
}
```

### Get Available Roles
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "ADMIN",
        "label": "Administrator",
        "description": "Full access to admin panel, orders, products, users, coupons, reports and settings."
      },
      {
        "id": "USER",
        "label": "Customer",
        "description": "Standard customer access to storefront, orders, wishlist and account features."
      }
    ]
  }
}
```

## Testing Checklist

- [ ] User can register with default USER role
- [ ] User cannot access `/admin` routes without ADMIN role
- [ ] Admin can view all users at `/admin/users`
- [ ] Admin can change user role from USER to ADMIN
- [ ] User becomes admin after role change (on next login)
- [ ] Admin can toggle user status (Active/Blocked)
- [ ] User cannot perform admin actions when blocked
- [ ] Role change is reflected in Redux state immediately
- [ ] Token contains correct role information
- [ ] Role metadata displays correctly on role management page

## Security Notes

1. **Token Verification**: Every admin request requires valid JWT with ADMIN role
2. **Database Constraints**: Role field has index for efficient filtering
3. **Frontend Validation**: UI components check role before rendering
4. **Backend Authorization**: All admin routes require ADMIN role in JWT
5. **Error Handling**: Proper error messages for authorization failures

## File Summary

| File | Status | Changes |
|------|--------|---------|
| `backend/prisma/schema.prisma` | ✓ | UserRole enum defined |
| `backend/src/services/user.service.ts` | ✓ | All functions implemented |
| `backend/src/routes/admin.routes.ts` | ✓ | All endpoints configured |
| `backend/src/middleware/auth.middleware.ts` | ✓ | authorize() supports roles |
| `frontend/src/api/admin.api.ts` | ✅ FIXED | Endpoints corrected |
| `frontend/src/store/admin/adminThunk.ts` | ✅ FIXED | Types enhanced |
| `frontend/src/store/authSlice.ts` | ✅ FIXED | Role typing improved |
| `frontend/src/utils/roleCheck.ts` | ✅ NEW | Created utility functions |
| `frontend/src/authRoute/ProtectedRoute.tsx` | ✅ FIXED | Enhanced with utilities |
| `frontend/src/pages/admin/AdminUsers.tsx` | ✓ | Already configured |
| `frontend/src/pages/admin/AdminRoles.tsx` | ✓ | Already configured |

## Next Steps

1. Test role management in development environment
2. Verify all API endpoints are working correctly
3. Test user promotion to admin and permission changes
4. Test role-based route protection
5. Consider adding role permissions matrix if needed in future
