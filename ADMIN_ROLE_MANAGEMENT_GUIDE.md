# Admin Role Management - Complete Implementation Guide

## 📋 Overview
This is a comprehensive guide for the admin role management system in the jewelry e-commerce application. The system allows administrators to manage user roles (USER/ADMIN), permissions, and access control.

---

## 🎯 Key Features

### 1. **User Management** (`/admin/users`)
- **View all users** with pagination
- **Search users** by name or email
- **Change user roles** (USER ↔ ADMIN) with confirmation modal
- **Toggle user status** (Active/Blocked)
- **View user statistics** (total, admins, customers, active)
- **Email verification status** display
- **Join date** tracking

### 2. **Role Management** (`/admin/roles`)
- **View all available roles** with descriptions
- **Role information cards** showing permissions
- **User count per role** display
- **Advanced filtering** by role
- **Promote/Demote users** with detailed confirmation
- **Access control information** display
- **User directory** with role-based actions

### 3. **Role Types**
- **ADMIN**: Full access to admin panel, all management features
- **USER**: Regular customer access, limited to marketplace features

---

## 🛠️ Implementation

### Backend (`backend/src/routes/admin.routes.ts`)

All endpoints require authentication and admin authorization:

```typescript
// All routes protected with:
router.use(authenticate);
router.use(authorize('ADMIN'));
```

#### Endpoints:

```typescript
// Get all users (with pagination, search, role filter)
GET /api/v1/admin/users
Query params: page, limit, search, role

// Get user by ID
GET /api/v1/admin/users/:id

// Update user role
PATCH /api/v1/admin/users/:id/role
Body: { role: 'USER' | 'ADMIN' }

// Toggle user status (active/blocked)
PATCH /api/v1/admin/users/:id/status

// Delete user
DELETE /api/v1/admin/users/:id

// Get available roles
GET /api/v1/admin/roles
Response: {
  roles: [
    {
      id: 'ADMIN',
      label: 'Administrator',
      description: 'Full access to admin panel...'
    },
    {
      id: 'USER',
      label: 'Customer',
      description: 'Standard customer access...'
    }
  ]
}

// Get user statistics
GET /api/v1/admin/stats/users
Response: {
  totalUsers: number,
  activeUsers: number,
  adminCount: number
}
```

### Frontend Architecture

#### Redux Store (`frontend/src/store/admin/`)

**Thunks** (`adminThunk.ts`):
```typescript
getUsers(params)              // Fetch users with filters
updateUserRole(id, role)      // Change user role
getRoles()                    // Get available roles
toggleUserStatus(id)          // Toggle active/blocked status
```

**Slice** (`adminSlice.ts`):
```typescript
{
  users: User[],
  userTotal: number,
  userPage: number,
  userLimit: number,
  roles: Role[],
  loading: boolean,
  error: null | string
}
```

#### Components

**AdminUsers** (`frontend/src/pages/admin/AdminUsers.tsx`):
- User listing table with all details
- Search functionality
- Role change modal
- Status toggle with confirmation
- Statistics cards (total, admins, customers, active)
- Inline "Change Role" buttons

**AdminRoles** (`frontend/src/pages/admin/AdminRoles.tsx`):
- Role information cards
- User statistics per role
- Advanced user directory
- Role/status filter
- Promote/Demote buttons
- Detailed confirmation modals

**RoleComponents** (`frontend/src/components/admin/RoleComponents.tsx`):
- `RoleBadge`: Display role with proper styling
- `UserAvatar`: User initials with role-based color
- `RoleInfoCard`: Role information with user count
- `PermissionList`: Display role permissions

---

## 🎨 UI Components

### Ant Design Integration

The pages use Ant Design components for a professional look:

```typescript
// Tables
<Table
  columns={columns}
  dataSource={data}
  pagination={...}
/>

// Modals
<Modal
  title="Change User Role"
  open={visible}
  onOk={handleOk}
  onCancel={handleCancel}
/>

// Select Dropdown
<Select
  options={roleOptions}
  value={selectedRole}
  onChange={setSelectedRole}
/>

// Tags
<Tag color="purple">ADMIN</Tag>
<Tag color="blue">USER</Tag>
```

### Tailwind CSS Styling

All pages use Tailwind CSS for responsive design:

```typescript
// Cards
className="bg-card border border-border rounded-lg p-6 shadow-sm"

// Buttons
className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"

// Grid layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

---

## 📊 Data Flow

### Changing a User's Role

1. **Admin clicks "Change Role"** → Modal opens with user details
2. **Admin selects new role** → Shows warning/info message
3. **Admin confirms** → Dispatches `updateUserRole` thunk
4. **Thunk calls API** → `PATCH /api/v1/admin/users/:id/role`
5. **Backend validates** → Updates database, returns user
6. **Redux updates** → User's role changed in state
7. **UI refreshes** → Toast notification, table updates
8. **User logs in next time** → Gets new role in JWT token

### Getting All Users

1. **Page loads** → Calls `getUsers` thunk with params
2. **Thunk calls API** → `GET /api/v1/admin/users?page=1&limit=10`
3. **Backend queries** → Filters, sorts, paginates
4. **API returns** → { data: User[], pagination: {...} }
5. **Redux stores** → Updates users, userTotal, etc.
6. **UI renders** → Table with data, pagination controls

---

## 🔐 Security Features

### Authentication
- JWT token required for all requests
- Token includes user role
- Verified on every admin request

### Authorization
- Admin role checked on every route
- Non-admins redirected to homepage
- Role cannot be changed via frontend manipulation

### Validation
- Schema validation on all inputs
- Enum validation for role values
- User existence verified before updates

### Error Handling
- Proper error messages displayed
- Failed requests handled gracefully
- Database errors don't expose sensitive info

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout for stats
- Full-width table
- Dropdown filters stack vertically

### Tablet (768px - 1024px)
- 2-column layout for stats
- Adjusted table columns
- Horizontal filters

### Desktop (> 1024px)
- 4-column stats grid
- Full-featured table
- Side-by-side modals

---

## 🎯 User Workflows

### Workflow 1: Promote Customer to Admin

```
1. Navigate to /admin/roles
2. Search for customer in user directory
3. Click "Promote" button
4. Review user details in modal
5. Select "Administrator (ADMIN)" role
6. Read confirmation message
7. Click "Promote to Admin"
8. See success toast
9. Customer appears in admin count next time they login
```

### Workflow 2: Demote Admin to Customer

```
1. Navigate to /admin/users
2. Find admin in table (purple badge)
3. Click "Change Role"
4. Modal shows current ADMIN role
5. Select "Customer (USER)" role
6. Review demotion warning
7. Click "Update Role"
8. Admin loses access immediately
```

### Workflow 3: Block/Unblock User

```
1. Navigate to /admin/users
2. Find user to block
3. Click ban/checkmark icon
4. Confirm action in modal
5. User status toggles (Active ↔ Blocked)
6. Blocked users see error on login
```

---

## 🐛 Troubleshooting

### Issue: Role change doesn't work
**Solution**: Check that API returns proper response format with `data` wrapper

### Issue: Modal not showing
**Solution**: Ensure `roleModalVisible` state is properly managed

### Issue: Users not loading
**Solution**: Verify Redux thunk is dispatched with correct parameters

### Issue: Style not applying
**Solution**: Clear Tailwind CSS cache and rebuild

---

## 📝 Code Examples

### Dispatching Role Change

```typescript
const dispatch = useAppDispatch();

const handleRoleChange = async (userId: string, newRole: string) => {
  try {
    await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
    toast.success("Role updated successfully");
    // Refresh data
    dispatch(getUsers({ page, limit }));
  } catch (error) {
    toast.error("Failed to update role");
  }
};
```

### Filtering Users by Role

```typescript
const [roleFilter, setRoleFilter] = useState("");

useEffect(() => {
  const params: any = { page, limit };
  if (roleFilter) params.role = roleFilter;
  dispatch(getUsers(params));
}, [roleFilter, page, limit, dispatch]);
```

### Displaying Role Badge

```typescript
import { RoleBadge } from "@/components/admin/RoleComponents";

<RoleBadge role={user.role} size="md" />
```

---

## ✅ Testing Checklist

- [ ] Can view all users with pagination
- [ ] Search filters work correctly
- [ ] Role change modal displays properly
- [ ] Cannot promote/demote to same role
- [ ] Confirmation modal shows warnings
- [ ] Role updates persist in database
- [ ] User gets new permissions on next login
- [ ] Status toggle works for active/blocked
- [ ] Admin can only be changed by other admins
- [ ] Non-admins cannot access admin routes
- [ ] All API calls return correct data format
- [ ] Error messages display appropriately
- [ ] UI is responsive on all devices
- [ ] Toast notifications appear correctly
- [ ] Loading states display properly

---

## 🚀 Future Enhancements

1. **Role Permissions Matrix**
   - Create granular permissions per role
   - Custom permission sets
   - Module-based access control

2. **Role History**
   - Log all role changes
   - View who changed what and when
   - Audit trail

3. **Bulk Operations**
   - Promote multiple users to admin
   - Block/unblock multiple users
   - Batch role assignments

4. **Permission Groups**
   - Create custom role groups
   - Predefined permission sets
   - Easy role management

5. **Activity Logs**
   - Track admin actions
   - User login history
   - Role change timeline

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Verify backend is running
3. Check API response in Network tab
4. Review authentication token
5. Verify user has admin role

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `backend/src/routes/admin.routes.ts` | API endpoints |
| `backend/src/services/user.service.ts` | Business logic |
| `frontend/src/pages/admin/AdminUsers.tsx` | User management UI |
| `frontend/src/pages/admin/AdminRoles.tsx` | Role management UI |
| `frontend/src/store/admin/adminThunk.ts` | Redux thunks |
| `frontend/src/store/admin/adminSlice.ts` | Redux slice |
| `frontend/src/components/admin/RoleComponents.tsx` | UI components |
| `frontend/src/utils/roleCheck.ts` | Role utilities |

---

**Last Updated**: May 21, 2026
**Version**: 1.0
