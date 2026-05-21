# 🎯 Admin Role Management - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- You must be logged in as an administrator
- Access to the admin panel at `/admin`

---

## 📍 Where to Find Role Management

### Option 1: Users Page (`/admin/users`)
- Full user list with all details
- Quick role change buttons
- Direct role management

### Option 2: Roles Page (`/admin/roles`)
- Comprehensive role overview
- Role information and permissions
- Advanced user filtering

---

## 🔄 How to Change a User's Role

### Step-by-Step Guide

#### 1️⃣ Navigate to Admin Panel
```
1. Click "Admin" in the menu
2. Choose either:
   - Users: /admin/users
   - Roles: /admin/roles
```

#### 2️⃣ Find the User
```
Option A - Users Page:
- Scroll through the table
- Or search by name/email in the search box
- Look for the user's row

Option B - Roles Page:
- Use the role filter to find by ADMIN/USER
- Or search by name/email
- Look for the user's row
```

#### 3️⃣ Open Role Change Modal
```
Click the "Change Role" button (Users page)
or "Promote"/"Demote" button (Roles page)

A modal will open showing:
- User's name and email
- Current role (with tag)
- New role dropdown
- Warning message
```

#### 4️⃣ Select New Role
```
FROM → TO
USER → ADMIN (Promote to admin)
ADMIN → USER (Demote to regular user)

Select from dropdown:
- "Customer (USER)" - Limited marketplace access
- "Administrator (ADMIN)" - Full admin access
```

#### 5️⃣ Confirm Action
```
Read the warning message
Click "Promote to Admin" or "Update Role"
Wait for success toast notification
```

#### 6️⃣ Role Updated ✅
```
User appears in updated statistics
User gets new role on next login
You can see the change in the table
```

---

## 📊 Understanding the UI

### Users Page (`/admin/users`)

**Statistics Cards:**
```
┌─────────────────────────────────────────────┐
│ Total Users │ Admins │ Customers │ Active  │
│    500      │   10   │    490    │   480   │
└─────────────────────────────────────────────┘
```

**Table Columns:**
```
User (name, email) | Role | Phone | Status | Email Verified | Joined | Actions
```

**Role Badge Colors:**
```
Purple tag = ADMIN (Full access)
Blue tag = USER (Limited access)
```

**Status Badge Colors:**
```
Green tag = Active (Can login)
Red tag = Blocked (Cannot login)
```

---

### Roles Page (`/admin/roles`)

**Role Information Cards:**
```
┌──────────────────────────────────────────┐
│ Role Name: Administrator                 │
│ Description: Full access to...           │
│ Tag: ADMIN (purple)                      │
│ Count: 10 Administrators assigned        │
└──────────────────────────────────────────┘
```

**User Directory:**
```
Find users by:
- Name/Email search
- Role filter (All/Admin/Customer)
- Pagination (5, 10, 20, 50 per page)
```

---

## ⚠️ Important Notes

### Role Change Effects

**Promoting to ADMIN:**
- ✅ Gains access to admin panel
- ✅ Can manage users and roles
- ✅ Can manage products and categories
- ✅ Can view reports
- ✅ Takes effect on next login
- ⚠️ Cannot be undone except by another admin

**Demoting to USER:**
- ✅ Loses admin access immediately
- ✅ Cannot manage system
- ✅ Limited to marketplace features only
- ✅ Can still view orders and profile
- ⚠️ Make sure not to demote all admins!

### Best Practices

```
DO:
✓ Always confirm role changes carefully
✓ Keep at least 1-2 admins at all times
✓ Review user before promoting
✓ Document who promoted whom
✓ Use the blocking feature if unsure

DON'T:
✗ Accidentally demote yourself as only admin
✗ Promote unverified users to admin
✗ Make bulk changes without backup
✗ Share admin credentials
✗ Change roles without reason
```

---

## 🎛️ Managing User Status

### Blocking a User

```
1. Navigate to /admin/users or /admin/roles
2. Find the user in the table
3. Click the BAN icon (🚫)
4. Confirm the action
5. User status changes to "Blocked" (red tag)
6. User cannot login anymore
```

### Unblocking a User

```
1. Navigate to /admin/users or /admin/roles
2. Find the user with "Blocked" status
3. Click the CHECKMARK icon (✓)
4. Confirm the action
5. User status changes to "Active" (green tag)
6. User can login again
```

---

## 🔍 Searching & Filtering

### Search by Name or Email

```
Users Page:
┌──────────────────────────┐
│ 🔍 Search users...       │
└──────────────────────────┘
Type name or email → Instant search

Roles Page:
┌──────────────────────────┐
│ 🔍 Search by name/email  │
│ [Select Role Filter ▼]   │
└──────────────────────────┘
```

### Filter by Role (Roles Page Only)

```
Select from dropdown:
- All Roles (show all users)
- Administrators (show only admins)
- Customers (show only regular users)
```

---

## 📱 Mobile Usage

### On Mobile Devices

```
The pages are fully responsive:

Tables scroll horizontally
Use one-column layout
Buttons stack vertically
Search works same as desktop
All features available

Recommended workflow:
1. Landscape mode for better table view
2. Use filters to reduce results
3. Same click/tap steps as desktop
```

---

## 🆘 Common Issues & Solutions

### Issue: "Can't find user"
```
Solution:
1. Try searching by email instead of name
2. Check spelling carefully
3. Increase items per page
4. Navigate through pagination
5. Try the other admin page (/admin/users vs /admin/roles)
```

### Issue: "Role change failed"
```
Solution:
1. Refresh the page (F5)
2. Check internet connection
3. Verify user still exists
4. Try again in a few seconds
5. Check browser console for errors
```

### Issue: "Can't see the modal"
```
Solution:
1. The modal might be behind (try clicking button again)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try different browser
4. Reload the page completely (Ctrl+F5)
5. Check if browser zoom is too high (Ctrl+0)
```

### Issue: "User blocked themselves"
```
Solution:
1. Another admin must unblock
2. Cannot self-unblock when blocked
3. Plan admin actions carefully
4. Always keep 2+ active admins
```

---

## 📊 Role Permissions Summary

### ADMIN Permissions
```
✓ Manage all users and assign roles
✓ Create, edit, delete products
✓ Manage product categories
✓ View and manage orders
✓ Create and manage coupons
✓ View reports and analytics
✓ Modify system settings
✓ Block/unblock users
✓ Delete user accounts
```

### USER Permissions
```
✓ Browse and search products
✓ Place orders
✓ Manage shopping cart
✓ View order history
✓ Manage wishlist
✓ Edit profile and addresses
✓ Leave product reviews
✓ Track order status
✗ Cannot access admin panel
✗ Cannot manage other users
✗ Cannot manage products
```

---

## 💡 Tips & Tricks

### Quick Navigation
```
Keyboard shortcut to admin:
Ctrl + K → type "admin" → Enter

Or:
Click menu → Admin → Users or Roles
```

### Efficient Workflow
```
1. Use search to narrow down results
2. Use role filter on /admin/roles
3. Batch similar actions together
4. Check stats first to plan actions
5. Document important changes
```

### Safety Checks
```
Before promoting to admin:
□ Verify email is confirmed
□ Check user is active
□ Confirm user account details
□ Make sure it's not a test account
□ Document reason for promotion

Before demoting from admin:
□ Have another admin logged in
□ Inform the user first
□ Backup important data
□ Make sure not last admin
□ Document reason for demotion
```

---

## 🎓 User Roles Explained

### What is a "Role"?

A role defines what a user can do in the system:

```
USER Role:
- Customer shopping experience
- Cannot see admin panel
- Limited to own data

ADMIN Role:
- Full system access
- Can manage everything
- Responsible for system health
```

### Why Roles Matter

```
Security:
- Prevents unauthorized access
- Protects sensitive operations
- Controls what users can see/do

Organization:
- Clear responsibilities
- Organized user groups
- Easy permission management

Scalability:
- Add more admin features later
- Add custom roles in future
- Prepare for growth
```

---

## 📞 Need Help?

### Check These Resources
1. Read error messages carefully
2. Check admin dashboard stats
3. Review the comprehensive guide
4. Check system logs
5. Contact system administrator

### Before Contacting Support
- Screenshot the issue
- Note exact steps taken
- Provide user details
- Include error messages
- Specify time of issue

---

## ✨ Key Features Summary

| Feature | Location | How to Use |
|---------|----------|-----------|
| View Users | /admin/users | See all users in table |
| Search Users | Both pages | Type name/email in search |
| Filter by Role | /admin/roles | Use role dropdown filter |
| Change Role | Both pages | Click "Change Role"/"Promote" button |
| Block User | Both pages | Click ban icon |
| Unblock User | Both pages | Click checkmark icon |
| View Stats | /admin/users | See 4 stat cards at top |
| View Permissions | /admin/roles | See role info cards |
| Pagination | Both pages | Select items per page |

---

**Version**: 1.0  
**Last Updated**: May 21, 2026  
**Status**: Ready for Production ✅
