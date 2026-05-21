# Complete Code Reference - Admin Role Management

## 📁 File Structure

```
project/
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── admin/
│       │       ├── AdminUsers.tsx          ← User management page
│       │       └── AdminRoles.tsx          ← Role management page
│       ├── store/
│       │   └── admin/
│       │       ├── adminThunk.ts           ← API thunks
│       │       └── adminSlice.ts           ← Redux slice
│       ├── api/
│       │   └── admin.api.ts                ← API endpoints
│       ├── components/
│       │   ├── admin/
│       │   │   └── RoleComponents.tsx      ← Role UI components
│       │   └── authRoute/
│       │       └── ProtectedRoute.tsx      ← Route protection
│       └── utils/
│           └── roleCheck.ts                ← Role utility functions
│
└── backend/
    └── src/
        ├── routes/
        │   └── admin.routes.ts             ← Admin endpoints
        ├── services/
        │   └── user.service.ts             ← User business logic
        ├── middleware/
        │   └── auth.middleware.ts          ← Auth & authorization
        └── types/
            └── index.ts                    ← TypeScript types
```

---

## 💻 Complete Code Files

### 1. Frontend - Pages

#### AdminUsers.tsx
Path: `frontend/src/pages/admin/AdminUsers.tsx`

**Features:**
- User listing with pagination
- Search functionality
- Role change modal
- Status toggle
- Statistics display
- Responsive design

**Key Functions:**
- `handleRefresh()` - Reload user data
- `showRoleModal()` - Open role change dialog
- `handleRoleChange()` - Update user role
- `handleToggleStatus()` - Block/unblock user

---

#### AdminRoles.tsx
Path: `frontend/src/pages/admin/AdminRoles.tsx`

**Features:**
- Comprehensive role information
- Role-based user filtering
- Advanced search
- Role assignment interface
- Permission display
- User statistics

**Key Functions:**
- `handleRefresh()` - Reload data
- `showRoleModal()` - Open assignment dialog
- `handleRoleChange()` - Assign role
- `handleToggleStatus()` - Change user status

---

### 2. Frontend - Redux

#### adminThunk.ts
Path: `frontend/src/store/admin/adminThunk.ts`

**Async Thunks:**
```typescript
// User Management
getUsers(params)                    // Fetch users with filters
updateUserRole({id, role})          // Update user role
getRoles()                          // Get available roles
toggleUserStatus(id)                // Toggle user status

// Error Handling
All thunks include try-catch with:
- Success: return res.data
- Error: rejectWithValue(message)
```

**Type Interfaces:**
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

interface PaginatedUsersResponse {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

---

#### adminSlice.ts
Path: `frontend/src/store/admin/adminSlice.ts`

**State Structure:**
```typescript
{
  // User Management
  users: User[];
  userTotal: number;
  userPage: number;
  userLimit: number;

  // Roles
  roles: Role[];

  // UI State
  loading: boolean;
  error: string | null;
}
```

**Extra Reducers:**
- `getUsers.pending/fulfilled/rejected`
- `updateUserRole.fulfilled`
- `getRoles.fulfilled/rejected`
- `toggleUserStatus.fulfilled`

---

### 3. Frontend - API

#### admin.api.ts
Path: `frontend/src/api/admin.api.ts`

**User Management Endpoints:**
```typescript
// Users
getUsers: (params?) => GET /api/v1/admin/users
updateUserRole: (id, role) => PATCH /api/v1/admin/users/:id/role
toggleUserStatus: (id) => PATCH /api/v1/admin/users/:id/status

// Roles
getRoles: () => GET /api/v1/admin/roles
```

**Request Headers:**
```typescript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

### 4. Frontend - Components

#### RoleComponents.tsx
Path: `frontend/src/components/admin/RoleComponents.tsx`

**Exported Components:**

1. **RoleBadge**
   - Props: `role`, `size` (sm|md|lg)
   - Shows role with icon and color
   - Responsive sizing

2. **UserAvatar**
   - Props: `name`, `role`, `size`
   - Displays user initials
   - Role-based background color

3. **RoleInfoCard**
   - Props: `role`, `count`
   - Shows role info with user count
   - Hover effects

4. **PermissionList**
   - Props: `role`
   - Lists all permissions for role
   - Checkmark indicators

---

#### ProtectedRoute.tsx
Path: `frontend/src/authRoute/ProtectedRoute.tsx`

**Functionality:**
```typescript
1. Check isAuthenticated
   ├─ If false → Navigate to /login
   └─ If true → Continue

2. Check isAdmin(role)
   ├─ If false → Navigate to /
   └─ If true → Allow access
```

---

### 5. Frontend - Utilities

#### roleCheck.ts
Path: `frontend/src/utils/roleCheck.ts`

**Utility Functions:**

```typescript
isAdmin(role: UserRole): boolean
  → Returns true if role === 'ADMIN'

isUser(role: UserRole): boolean
  → Returns true if role === 'USER'

hasRole(role, ...allowedRoles): boolean
  → Check multiple roles

getRoleLabel(role): string
  → Returns human-readable label
  → 'Administrator', 'Customer'

getRoleDescription(role): string
  → Returns role description
```

---

### 6. Backend - Routes

#### admin.routes.ts
Path: `backend/src/routes/admin.routes.ts`

**Endpoint Structure:**
```
All routes require:
✓ authenticate middleware (JWT verification)
✓ authorize('ADMIN') middleware (role check)
```

**User Endpoints:**

```typescript
GET /api/v1/admin/users
├─ Query: page, limit, search, role
├─ Returns: PaginatedUsersResponse
└─ Auth: Required (ADMIN role)

GET /api/v1/admin/users/:id
├─ Returns: User with stats
└─ Auth: Required (ADMIN role)

PATCH /api/v1/admin/users/:id/role
├─ Body: { role: 'USER' | 'ADMIN' }
├─ Returns: Updated User
└─ Auth: Required (ADMIN role)

PATCH /api/v1/admin/users/:id/status
├─ Returns: User with updated isActive
└─ Auth: Required (ADMIN role)

DELETE /api/v1/admin/users/:id
├─ Returns: Success message
└─ Auth: Required (ADMIN role)

GET /api/v1/admin/roles
├─ Returns: Available roles metadata
└─ Auth: Required (ADMIN role)

GET /api/v1/admin/stats/users
├─ Returns: { totalUsers, activeUsers, adminCount }
└─ Auth: Required (ADMIN role)
```

---

### 7. Backend - Services

#### user.service.ts
Path: `backend/src/services/user.service.ts`

**Service Functions:**

```typescript
getAllUsers(page, limit, search?, role?)
├─ Implements: Pagination, search, role filter
├─ Returns: { users, total, page, limit }
└─ Database: Prisma query with sorting

getUserById(id)
├─ Includes: Address, orders, reviews, wishlist counts
├─ Returns: User object with stats
└─ Throws: NotFoundError if not found

updateUserRole(id, role)
├─ Validates: User exists
├─ Updates: user.role in database
├─ Returns: Updated user object
└─ Throws: NotFoundError

toggleUserStatus(id)
├─ Flips: isActive boolean
├─ Returns: Updated user
└─ Throws: NotFoundError

deleteUser(id)
├─ Removes: User from database
└─ Returns: Deleted user object

getUserStats()
├─ Counts: Total, active, admin users
└─ Returns: Statistics object
```

---

### 8. Backend - Middleware

#### auth.middleware.ts
Path: `backend/src/middleware/auth.middleware.ts`

**Middleware Functions:**

```typescript
authenticate(req, res, next)
├─ Extracts JWT token from Authorization header
├─ Verifies token signature
├─ Adds user info to req.user
└─ Error: AuthenticationError if no token/invalid

authorize(...roles)
├─ Returns middleware function
├─ Checks: req.user.role in allowed roles
├─ Error: AuthorizationError if not authorized
└─ Success: Calls next()
```

---

### 9. Backend - Types

#### index.ts
Path: `backend/src/types/index.ts`

**Interfaces:**

```typescript
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

---

### 10. Backend - Schema

#### schema.prisma
Path: `backend/prisma/schema.prisma`

**Enum Definition:**
```prisma
enum UserRole {
  USER
  ADMIN
}
```

**User Model:**
```prisma
model User {
  id                     String    @id @default(auto()) @map("_id") @db.ObjectId
  email                  String    @unique
  password               String
  name                   String?
  phone                  String?
  avatar                 String?
  role                   UserRole  @default(USER)
  isEmailVerified        Boolean   @default(false)
  passwordResetToken     String?
  passwordResetExpires   DateTime?
  isActive               Boolean   @default(true)
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt
  invoices               Invoice[]
  addresses              Address[]
  orders                 Order[]
  reviews                Review[]
  wishlist               WishlistItem[]
  cart                   CartItem[]

  @@index([role])
}
```

---

## 🔑 Key Concepts

### Role Types
```typescript
type UserRole = 'USER' | 'ADMIN';

ADMIN:
- Full access to admin panel
- Can manage users and roles
- Can manage products
- Can view reports
- Can modify settings

USER:
- Limited to marketplace
- Can browse products
- Can place orders
- Can manage wishlist
- Cannot access admin panel
```

### Request/Response Flow

```
Frontend Component
    ↓ (user action)
Redux Thunk (getUsers, updateUserRole, etc.)
    ↓ (dispatch action)
API Call (axiosInstance)
    ↓ (HTTP request)
Backend Route Handler
    ↓ (authenticate + authorize)
Service Function
    ↓ (business logic)
Database Operation (Prisma)
    ↓ (query database)
Response Object
    ↓ (HTTP response)
Redux Reducer
    ↓ (update state)
Component Re-render
    ↓ (display updated UI)
User sees changes
```

---

## 🧪 Common Usage Patterns

### Pattern 1: Get Users
```typescript
// In Component
const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(getUsers({ page: 1, limit: 10 }));
}, [dispatch]);

const { users, loading } = useAppSelector(state => state.admin);
```

### Pattern 2: Update Role
```typescript
const handleRoleChange = async () => {
  try {
    await dispatch(updateUserRole({
      id: userId,
      role: newRole
    })).unwrap();
    
    toast.success("Role updated");
    // Refresh data
    dispatch(getUsers({ page, limit }));
  } catch (error) {
    toast.error("Failed to update");
  }
};
```

### Pattern 3: Check Authorization
```typescript
// In Route/Component
import { isAdmin } from '@/utils/roleCheck';

if (!isAdmin(user?.role)) {
  return <Navigate to="/" />;
}
```

---

## 📊 API Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "role": "ADMIN"
  },
  "message": "Operation successful"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "data": [ /* array of items */ ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Unauthorized: Admin access required",
  "message": "User does not have required role"
}
```

---

## ⚙️ Configuration

### Environment Variables
```env
# Backend
DATABASE_URL=mongodb://...
JWT_SECRET=your_secret_key

# Frontend
VITE_API_URL=http://localhost:5000
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 🚀 Performance Optimizations

### Frontend
- Code splitting with lazy loading
- Memoization of components
- Pagination to limit data
- Debounced search
- Redux caching

### Backend
- Database indexes on role field
- Pagination for large datasets
- JWT caching with Redis (optional)
- Query optimization with Prisma
- Connection pooling

---

## 📞 Troubleshooting

### Common Issues & Solutions

**Issue: Role change not persisting**
- Check JWT token is valid
- Verify user has admin role
- Check database connection
- Review error logs

**Issue: Modal not showing**
- Check modalVisible state
- Verify button click works
- Check z-index layering
- Try different browser

**Issue: API 401 Unauthorized**
- Check token in localStorage
- Verify token not expired
- Check Authorization header
- Re-login if needed

**Issue: Users list empty**
- Check API returns data
- Verify pagination params
- Check search filtering
- Try clearing filters

---

**Last Updated**: May 21, 2026  
**Version**: 1.0  
**Status**: Complete ✅
