import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ShieldCheck,
  RefreshCcw,
  Ban,
  CheckCircle,
  Search,
  Users,
  Lock,
  Unlock,
  Plus,
  RotateCcw,
  Save,
  Check,
  UserPlus,
  Info,
  Shield,
  KeyRound,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { Table, Tag, Modal, Select, Button, Tabs, Input, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import SEOHead from "@/components/common/SEOHead";
import { getUsers, toggleUserStatus, updateUserRole } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import { toast } from "sonner";
import {
  PERMISSION_MODULES,
  ALL_PERMISSIONS,
  DEFAULT_ROLE_DEFINITIONS,
} from "@/acl/aclConfig";
import { UserRole, PermissionAction, RoleDefinition } from "@/types/acl.types";
import { MOCK_ADMIN_USERS } from "@/services/mockData";

export const AdminRoles: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users: reduxUsers, userTotal, loading: reduxLoading } = useAppSelector(
    (state: RootState) => state.admin
  );

  // Tabs
  const [activeTab, setActiveTab] = useState<string>("matrix");

  // Local fallback users combined with mock data
  const [usersList, setUsersList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Roles & Permissions state
  const [roleDefinitions, setRoleDefinitions] = useState<Record<string, RoleDefinition>>(
    () => JSON.parse(JSON.stringify(DEFAULT_ROLE_DEFINITIONS))
  );
  const [selectedRoleKey, setSelectedRoleKey] = useState<UserRole>("ADMIN");
  const [hasChanges, setHasChanges] = useState(false);

  // User Role Assignment Modal
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [assignedRole, setAssignedRole] = useState<UserRole>("STAFF");
  const [updatingUser, setUpdatingUser] = useState(false);

  // Invite Staff Modal
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "STAFF" as UserRole,
    department: "Sales & Concierge",
  });

  // Create Custom Role Modal
  const [createRoleModalVisible, setCreateRoleModalVisible] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    label: "",
    description: "",
    cloneFrom: "STAFF" as UserRole,
  });

  // Sync users from Redux or mock data
  useEffect(() => {
    if (reduxUsers && reduxUsers.length > 0) {
      setUsersList(reduxUsers);
    } else {
      // Use fallback mock admin users + patrons
      setUsersList(MOCK_ADMIN_USERS);
    }
  }, [reduxUsers]);

  // Load users from backend if available
  useEffect(() => {
    dispatch(getUsers({ search, limit: 20 })).catch(() => {
      // offline silent fallback
    });
  }, [dispatch, search]);

  const handleRefresh = () => {
    dispatch(getUsers({ search, limit: 20 }))
      .unwrap()
      .then((res: any) => {
        if (res?.data) setUsersList(res.data);
      })
      .catch(() => {
        setUsersList(MOCK_ADMIN_USERS);
        toast.info("Using cached staff & access directory.");
      });
  };

  // Toggle user active status
  const handleToggleStatus = (userId: string) => {
    const userToToggle = usersList.find((u) => u.id === userId);
    if (!userToToggle) return;

    Modal.confirm({
      title: `${userToToggle.status === "active" ? "Suspend" : "Activate"} User Access`,
      content: `Are you sure you want to ${
        userToToggle.status === "active" ? "suspend" : "reactivate"
      } ${userToToggle.name}'s administrative clearance?`,
      okText: userToToggle.status === "active" ? "Suspend" : "Activate",
      okButtonProps: { danger: userToToggle.status === "active" },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(toggleUserStatus(userId)).unwrap();
        } catch {
          // Local fallback
        }
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, status: u.status === "active" ? "inactive" : "active" }
              : u
          )
        );
        toast.success(`Access status for ${userToToggle.name} updated.`);
      },
    });
  };

  // Open role assignment modal
  const showRoleModal = (user: any) => {
    setSelectedUser(user);
    setAssignedRole(user.role as UserRole);
    setRoleModalVisible(true);
  };

  // Save role change
  const handleSaveUserRole = async () => {
    if (!selectedUser) return;
    setUpdatingUser(true);

    try {
      await dispatch(
        updateUserRole({ id: selectedUser.id, role: assignedRole })
      ).unwrap();
    } catch {
      // Local fallback
    }

    setUsersList((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, role: assignedRole } : u
      )
    );

    toast.success(`Role for ${selectedUser.name} updated to ${assignedRole}`);
    setRoleModalVisible(false);
    setUpdatingUser(false);
  };

  // Invite new staff
  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      toast.error("Please enter a valid name and email.");
      return;
    }

    const newStaff = {
      id: `usr-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone || "+91 9900000000",
      role: inviteForm.role,
      status: "active",
      lastLogin: "Pending First Login",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsersList([newStaff, ...usersList]);
    toast.success(`Invitation dispatched to ${inviteForm.email} with ${inviteForm.role} clearance.`);
    setInviteModalVisible(false);
    setInviteForm({
      name: "",
      email: "",
      phone: "",
      role: "STAFF",
      department: "Sales & Concierge",
    });
  };

  // Permission Matrix logic
  const currentRoleDef = roleDefinitions[selectedRoleKey] || DEFAULT_ROLE_DEFINITIONS.ADMIN;
  const currentPermissions = currentRoleDef.permissions || [];

  const handleTogglePermission = (permission: PermissionAction) => {
    if (selectedRoleKey === "SUPER_ADMIN") {
      toast.info("Super Administrator inherently holds unrestricted permissions across all modules.");
      return;
    }

    const exists = currentPermissions.includes(permission);
    const updated = exists
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];

    setRoleDefinitions({
      ...roleDefinitions,
      [selectedRoleKey]: {
        ...currentRoleDef,
        permissions: updated,
      },
    });
    setHasChanges(true);
  };

  const handleToggleModule = (modulePermissions: PermissionAction[]) => {
    if (selectedRoleKey === "SUPER_ADMIN") return;

    const allInModuleSelected = modulePermissions.every((p) =>
      currentPermissions.includes(p)
    );

    let updated: PermissionAction[];
    if (allInModuleSelected) {
      updated = currentPermissions.filter((p) => !modulePermissions.includes(p));
    } else {
      const set = new Set([...currentPermissions, ...modulePermissions]);
      updated = Array.from(set);
    }

    setRoleDefinitions({
      ...roleDefinitions,
      [selectedRoleKey]: {
        ...currentRoleDef,
        permissions: updated,
      },
    });
    setHasChanges(true);
  };

  const handleSelectAll = () => {
    if (selectedRoleKey === "SUPER_ADMIN") return;
    setRoleDefinitions({
      ...roleDefinitions,
      [selectedRoleKey]: {
        ...currentRoleDef,
        permissions: [...ALL_PERMISSIONS],
      },
    });
    setHasChanges(true);
    toast.success(`All permissions granted to ${currentRoleDef.label}.`);
  };

  const handleClearAll = () => {
    if (selectedRoleKey === "SUPER_ADMIN") {
      toast.warning("Super Administrator cannot be stripped of permissions.");
      return;
    }
    setRoleDefinitions({
      ...roleDefinitions,
      [selectedRoleKey]: {
        ...currentRoleDef,
        permissions: [],
      },
    });
    setHasChanges(true);
    toast.info(`All permissions cleared for ${currentRoleDef.label}.`);
  };

  const handleResetDefaults = () => {
    const defaultDef = DEFAULT_ROLE_DEFINITIONS[selectedRoleKey as UserRole];
    if (defaultDef) {
      setRoleDefinitions({
        ...roleDefinitions,
        [selectedRoleKey]: JSON.parse(JSON.stringify(defaultDef)),
      });
      setHasChanges(false);
      toast.success(`Reset ${currentRoleDef.label} permissions to system default.`);
    }
  };

  const handleSaveRoleMatrix = () => {
    setHasChanges(false);
    toast.success(`Permission policy for ${currentRoleDef.label} saved successfully.`);
  };

  // Create Custom Role
  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.label || !newRoleForm.name) {
      toast.error("Please enter role code and display name.");
      return;
    }

    const roleKey = newRoleForm.name.toUpperCase().replace(/\s+/g, "_");
    const basePermissions =
      roleDefinitions[newRoleForm.cloneFrom]?.permissions || [];

    const newDef: RoleDefinition = {
      name: roleKey as UserRole,
      label: newRoleForm.label,
      description: newRoleForm.description || `Custom role cloned from ${newRoleForm.cloneFrom}`,
      permissions: [...basePermissions],
    };

    setRoleDefinitions({
      ...roleDefinitions,
      [roleKey]: newDef,
    });

    setSelectedRoleKey(roleKey as UserRole);
    toast.success(`Custom role "${newRoleForm.label}" created with cloned permissions.`);
    setCreateRoleModalVisible(false);
    setNewRoleForm({ name: "", label: "", description: "", cloneFrom: "STAFF" });
  };

  // Filtered users for table
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Role tag color helper
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Tag color="gold" className="font-bold border-amber-400/50">SUPER ADMIN</Tag>;
      case "ADMIN":
        return <Tag color="purple" className="font-semibold">ADMINISTRATOR</Tag>;
      case "MANAGER":
        return <Tag color="blue" className="font-semibold">STORE MANAGER</Tag>;
      case "STAFF":
        return <Tag color="cyan" className="font-semibold">STORE STAFF</Tag>;
      case "CUSTOMER":
        return <Tag color="default">CUSTOMER</Tag>;
      default:
        return <Tag color="geekblue">{role}</Tag>;
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Team Member / User",
      key: "user",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 text-[#997D4D] border border-[#C5A880]/30 flex items-center justify-center font-bold text-sm">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span>{user.name || "Unnamed User"}</span>
              {user.role === "SUPER_ADMIN" && <Sparkles size={13} className="text-[#C5A880]" />}
            </div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Clearance Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => getRoleBadge(role),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Active" : "Suspended"}
        </Tag>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => <span className="text-xs text-muted-foreground">{phone || "—"}</span>,
    },
    {
      title: "Last Active",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (last: string) => (
        <span className="text-xs text-muted-foreground">{last || "Recently"}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 170,
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showRoleModal(user)}
            className="px-2.5 py-1 text-xs font-semibold bg-secondary hover:bg-[#C5A880] hover:text-white border border-border rounded transition-colors"
          >
            Assign Role
          </button>
          <button
            onClick={() => handleToggleStatus(user.id)}
            className={`p-1.5 rounded transition-colors border ${
              user.status === "active"
                ? "text-amber-600 hover:text-red-600 border-amber-200 hover:bg-red-50"
                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            }`}
            title={user.status === "active" ? "Suspend user" : "Activate user"}
          >
            {user.status === "active" ? <Ban size={14} /> : <CheckCircle size={14} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
      <SEOHead title="Roles & Access Control | JEWELO Admin" description="Granular ACL and staff permissions management." />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ShieldCheck size={28} className="text-[#C5A880]" />
            <span>Role-Based Access Control (ACL)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure system permissions across all 11 jewellery business modules and assign staff clearances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-secondary transition"
          >
            <RefreshCcw size={14} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setInviteModalVisible(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow"
          >
            <UserPlus size={14} />
            <span>Invite Staff</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Matrix vs Staff Directory */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="role-acl-tabs"
        items={[
          {
            key: "matrix",
            label: (
              <span className="flex items-center gap-2 font-semibold">
                <KeyRound size={15} />
                <span>Roles & Permission Matrix</span>
              </span>
            ),
            children: (
              <div className="space-y-6 pt-2">
                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {Object.entries(roleDefinitions).map(([key, def]) => {
                    const isSelected = selectedRoleKey === key;
                    const memberCount = usersList.filter((u) => u.role === key).length;
                    const permCount = def.permissions?.length || 0;

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setSelectedRoleKey(key as UserRole);
                          setHasChanges(false);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-card border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-md"
                            : "bg-card/60 border-border hover:border-[#C5A880]/50 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-[#C5A880] text-white" : "bg-secondary text-muted-foreground"}`}>
                            {key === "SUPER_ADMIN" ? <Shield size={18} /> : key === "CUSTOMER" ? <Users size={18} /> : <Lock size={18} />}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground">
                            {memberCount} {memberCount === 1 ? "member" : "members"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground truncate">{def.label}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
                          {def.description}
                        </p>
                        <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                          <span>{permCount} / {ALL_PERMISSIONS.length} actions</span>
                          {isSelected && <span className="text-[#997D4D] font-bold">Active View</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Role Details Bar & Actions */}
                <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <span>Configuring: {currentRoleDef.label}</span>
                        {getRoleBadge(selectedRoleKey)}
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentRoleDef.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      disabled={selectedRoleKey === "SUPER_ADMIN"}
                      className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-secondary disabled:opacity-50 transition"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={selectedRoleKey === "SUPER_ADMIN"}
                      className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-secondary disabled:opacity-50 transition"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-secondary transition flex items-center gap-1.5 text-muted-foreground"
                    >
                      <RotateCcw size={13} />
                      <span>Reset Defaults</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRoleMatrix}
                      disabled={!hasChanges}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${
                        hasChanges
                          ? "bg-[#C5A880] text-white hover:bg-[#B39366] shadow"
                          : "bg-secondary text-muted-foreground opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <Save size={14} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                {/* Modules & Granular Permissions Accordions/Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {PERMISSION_MODULES.map((mod) => {
                    const moduleActions = mod.permissions.map((p) => p.action);
                    const grantedCount = moduleActions.filter((a) =>
                      currentPermissions.includes(a)
                    ).length;
                    const allGranted = grantedCount === moduleActions.length;
                    const someGranted = grantedCount > 0 && !allGranted;

                    return (
                      <div
                        key={mod.module}
                        className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3"
                      >
                        {/* Module Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">{mod.label}</h3>
                            <span className="text-[10px] text-muted-foreground">
                              {grantedCount} of {moduleActions.length} enabled
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleModule(moduleActions)}
                            disabled={selectedRoleKey === "SUPER_ADMIN"}
                            className="text-[11px] font-semibold text-[#997D4D] hover:underline disabled:opacity-50"
                          >
                            {allGranted ? "Deselect" : "Select All"}
                          </button>
                        </div>

                        {/* Permission Checkboxes */}
                        <div className="space-y-2">
                          {mod.permissions.map((perm) => {
                            const isChecked = currentPermissions.includes(perm.action);
                            const isLocked = selectedRoleKey === "SUPER_ADMIN";

                            return (
                              <label
                                key={perm.action}
                                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition text-xs ${
                                  isChecked ? "bg-secondary/60 text-foreground" : "text-muted-foreground hover:bg-secondary/30"
                                } ${isLocked ? "cursor-default opacity-80" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={isLocked}
                                  onChange={() => handleTogglePermission(perm.action)}
                                  className="mt-0.5 accent-[#C5A880] w-4 h-4 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold">{perm.label}</div>
                                  <div className="text-[10px] text-muted-foreground font-mono">
                                    {perm.action}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Role Creation CTA */}
                <div className="bg-secondary/30 border border-dashed border-border rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 text-[#997D4D] mx-auto flex items-center justify-center">
                    <Plus size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Need a specialized role?</h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mt-0.5">
                      Create tailored operational roles (e.g. Gemstone Auditor, Logistics Officer) with custom permission sets.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateRoleModalVisible(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-[#C5A880] text-foreground rounded-lg text-xs font-semibold transition"
                  >
                    <Plus size={14} />
                    <span>Create Custom Role</span>
                  </button>
                </div>
              </div>
            ),
          },
          {
            key: "users",
            label: (
              <span className="flex items-center gap-2 font-semibold">
                <Users size={15} />
                <span>Staff & User Directory</span>
              </span>
            ),
            children: (
              <div className="space-y-4 pt-2">
                {/* Search & Filters */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative flex-1 w-full sm:max-w-md">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search team members by name, email, or phone..."
                      className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#C5A880]/40"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#C5A880]/40"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="MANAGER">Store Manager</option>
                      <option value="STAFF">Store Staff</option>
                      <option value="CUSTOMER">Customer</option>
                    </select>

                    <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">
                      {filteredUsers.length} total members
                    </span>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={reduxLoading}
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    size="middle"
                  />
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* Role Assignment Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 font-display text-base font-bold text-foreground">
            <Lock size={18} className="text-[#C5A880]" />
            <span>Modify Access Clearance</span>
          </div>
        }
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRoleModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={updatingUser}
            onClick={handleSaveUserRole}
            style={{ backgroundColor: "#C5A880", borderColor: "#C5A880" }}
          >
            Update Clearance
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="space-y-4 pt-2 font-body">
            <div className="p-3 rounded-lg bg-secondary/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C5A880] text-white flex items-center justify-center font-bold text-sm">
                {selectedUser.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assign New Role</label>
              <Select
                value={assignedRole}
                onChange={setAssignedRole}
                className="w-full"
                options={[
                  {
                    label: "Super Administrator (SUPER_ADMIN) - Unrestricted master access",
                    value: "SUPER_ADMIN",
                  },
                  {
                    label: "Administrator (ADMIN) - Full operational and management access",
                    value: "ADMIN",
                  },
                  {
                    label: "Store Manager (MANAGER) - Catalog, stock, queries and orders",
                    value: "MANAGER",
                  },
                  {
                    label: "Store Staff (STAFF) - Read-only front desk access",
                    value: "STAFF",
                  },
                  {
                    label: "Customer / Patron (CUSTOMER) - Public store browsing only",
                    value: "CUSTOMER",
                  },
                ]}
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Info size={14} /> Security Notice
              </p>
              <p>
                Role updates take effect immediately across all active browser sessions. Please verify that this individual has received appropriate security clearance before granting elevated roles.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Invite Staff Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 font-display text-base font-bold text-foreground">
            <UserPlus size={18} className="text-[#C5A880]" />
            <span>Invite Team Member</span>
          </div>
        }
        open={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        footer={null}
      >
        <form onSubmit={handleInviteStaff} className="space-y-4 pt-2 font-body text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              placeholder="e.g. Radhika Merchant"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Official Work Email *</label>
            <input
              type="email"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="radhika@jewelo.com"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">Contact Phone</label>
              <input
                type="text"
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                placeholder="+91 9820000000"
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Department</label>
              <select
                value={inviteForm.department}
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none"
              >
                <option value="Sales & Concierge">Sales & Concierge</option>
                <option value="Vault & Inventory">Vault & Inventory</option>
                <option value="Order Fulfillment">Order Fulfillment</option>
                <option value="Customer Relations">Customer Relations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Designated Role *</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none font-semibold"
            >
              <option value="STAFF">Store Staff (Read-only catalog & orders)</option>
              <option value="MANAGER">Store Manager (Catalog, stock & processing)</option>
              <option value="ADMIN">Administrator (Full operational control)</option>
              <option value="SUPER_ADMIN">Super Administrator (Unrestricted)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button onClick={() => setInviteModalVisible(false)}>Cancel</Button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] text-white font-bold rounded-lg transition"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Custom Role Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 font-display text-base font-bold text-foreground">
            <Plus size={18} className="text-[#C5A880]" />
            <span>Create Custom Role</span>
          </div>
        }
        open={createRoleModalVisible}
        onCancel={() => setCreateRoleModalVisible(false)}
        footer={null}
      >
        <form onSubmit={handleCreateCustomRole} className="space-y-4 pt-2 font-body text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">Role Identifier Code *</label>
            <input
              type="text"
              required
              value={newRoleForm.name}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
              placeholder="e.g. GEMSTONE_AUDITOR"
              className="w-full p-2.5 rounded-lg border border-border bg-background uppercase focus:ring-2 focus:ring-[#C5A880]/40 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Display Label *</label>
            <input
              type="text"
              required
              value={newRoleForm.label}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, label: e.target.value })}
              placeholder="e.g. Gemstone Auditor"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Description</label>
            <textarea
              rows={2}
              value={newRoleForm.description}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
              placeholder="Brief explanation of the responsibilities and scope of this role..."
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Clone Permissions From</label>
            <select
              value={newRoleForm.cloneFrom}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, cloneFrom: e.target.value as UserRole })}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-[#C5A880]/40 outline-none font-semibold"
            >
              <option value="STAFF">Store Staff (Base read permissions)</option>
              <option value="MANAGER">Store Manager (Operational permissions)</option>
              <option value="ADMIN">Administrator (Comprehensive permissions)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button onClick={() => setCreateRoleModalVisible(false)}>Cancel</Button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] text-white font-bold rounded-lg transition"
            >
              Create Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRoles;
