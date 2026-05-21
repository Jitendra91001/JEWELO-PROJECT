import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ShieldCheck, RefreshCcw, Ban, CheckCircle, Search, Users, Lock, Unlock } from "lucide-react";
import { Table, Tag, Modal, Select, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import SEOHead from "@/components/common/SEOHead";
import { getUsers, getRoles, updateUserRole, toggleUserStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import { toast } from "sonner";

const AdminRoles = () => {
  const dispatch = useAppDispatch();
  const { users, userTotal, roles, loading } = useAppSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    const filterParams: any = { page, limit };
    if (search) filterParams.search = search;
    if (roleFilter) filterParams.role = roleFilter;
    dispatch(getUsers(filterParams));
  }, [dispatch, search, page, limit, roleFilter]);

  const handleRefresh = () => {
    const filterParams: any = { page, limit };
    if (search) filterParams.search = search;
    if (roleFilter) filterParams.role = roleFilter;
    dispatch(getUsers(filterParams));
  };

  const handleToggleStatus = async (userId: string) => {
    Modal.confirm({
      title: "Toggle User Status",
      content: "Are you sure you want to change this user's status?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(toggleUserStatus(userId)).unwrap();
          toast.success("User status updated successfully");
          handleRefresh();
        } catch (error) {
          toast.error("Failed to update user status");
        }
      },
    });
  };

  const showRoleModal = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleModalVisible(true);
  };

  const handleRoleChange = async () => {
    if (newRole === selectedUser.role) {
      toast.info("Please select a different role");
      return;
    }

    setUpdating(true);
    try {
      await dispatch(updateUserRole({ id: selectedUser.id, role: newRole })).unwrap();
      toast.success(`Role updated to ${newRole}`);
      setRoleModalVisible(false);
      handleRefresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update role");
    } finally {
      setUpdating(false);
    }
  };

  const adminUsers = users.filter((u: any) => u.role === "ADMIN");
  const regularUsers = users.filter((u: any) => u.role === "USER");

  const columns: ColumnsType<any> = [
    {
      title: "User",
      key: "user",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
            user.role === "ADMIN" ? "bg-purple-500 text-white" : "gold-gradient text-primary-foreground"
          }`}>
            {user.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-medium text-foreground">{user.name || "N/A"}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Current Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "purple" : "blue"} icon={role === "ADMIN" ? <Lock size={12} /> : <Unlock size={12} />}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Email Status",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (verified: boolean) => (
        <Tag color={verified ? "green" : "orange"}>
          {verified ? "Verified" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Blocked"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString("en-IN"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showRoleModal(user)}
            className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            {user.role === "ADMIN" ? "Demote" : "Promote"}
          </button>
          <button
            onClick={() => handleToggleStatus(user.id)}
            className={`p-1.5 rounded transition-colors ${
              user.isActive
                ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                : "text-green-600 hover:text-green-700 hover:bg-green-50"
            }`}
            title={user.isActive ? "Block user" : "Unblock user"}
          >
            {user.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <SEOHead title="Admin - Role Management" />
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={32} className="text-primary" /> Role & Access Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage user roles, permissions, and system access control
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {/* Role Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {roles.map((roleOption: any) => (
            <div
              key={roleOption.id}
              className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{roleOption.label}</h3>
                    <Tag color={roleOption.id === "ADMIN" ? "purple" : "blue"}>{roleOption.id}</Tag>
                  </div>
                  <p className="text-sm text-muted-foreground">{roleOption.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  roleOption.id === "ADMIN" ? "bg-purple-100 dark:bg-purple-900" : "bg-blue-100 dark:bg-blue-900"
                }`}>
                  {roleOption.id === "ADMIN" ? (
                    <Lock className={roleOption.id === "ADMIN" ? "text-purple-600 dark:text-purple-300" : "text-blue-600 dark:text-blue-300"} size={24} />
                  ) : (
                    <Unlock className={roleOption.id === "ADMIN" ? "text-purple-600 dark:text-purple-300" : "text-blue-600 dark:text-blue-300"} size={24} />
                  )}
                </div>
              </div>
              <div className="bg-background rounded p-3 text-xs">
                <p className="text-muted-foreground">
                  <strong>{roleOption.id === "ADMIN" ? adminUsers.length : regularUsers.length}</strong> {roleOption.id === "ADMIN" ? "Administrators" : "Regular Users"} assigned
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Users</p>
                <p className="text-2xl font-bold text-foreground mt-1">{userTotal}</p>
              </div>
              <Users className="text-primary" size={28} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Administrators</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{adminUsers.length}</p>
              </div>
              <Lock className="text-purple-600" size={28} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Customers</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{regularUsers.length}</p>
              </div>
              <Unlock className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">User Directory</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Search by name or email..."
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Administrators</option>
                  <option value="USER">Customers</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                current: page,
                pageSize: limit,
                total: userTotal,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setLimit(nextPageSize);
                },
              }}
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      <Modal
        title={`${selectedUser?.role === "ADMIN" ? "Demote" : "Promote"} User`}
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRoleModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={updating}
            onClick={handleRoleChange}
            danger={selectedUser?.role === "ADMIN"}
          >
            {selectedUser?.role === "ADMIN" ? "Demote User" : "Promote to Admin"}
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">User Profile</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  selectedUser.role === "ADMIN" ? "bg-purple-500 text-white" : "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                }`}>
                  {selectedUser.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Current Role</p>
              <Tag color={selectedUser.role === "ADMIN" ? "purple" : "blue"} className="w-full">
                {selectedUser.role === "ADMIN" ? "Administrator - Full System Access" : "Customer - Limited Access"}
              </Tag>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Assign New Role</p>
              <Select
                value={newRole}
                onChange={setNewRole}
                options={[
                  {
                    label: "Customer (USER) - Limited marketplace access",
                    value: "USER",
                  },
                  {
                    label: "Administrator (ADMIN) - Full admin panel access",
                    value: "ADMIN",
                  },
                ]}
                className="w-full"
              />
            </div>

            <div className={`rounded-lg p-4 border ${
              newRole === "ADMIN"
                ? "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
                : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
            }`}>
              <div className="flex gap-2">
                <div className={`flex-shrink-0 text-lg ${
                  newRole === "ADMIN" ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"
                }`}>
                  ⓘ
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    newRole === "ADMIN" ? "text-purple-900 dark:text-purple-100" : "text-blue-900 dark:text-blue-100"
                  }`}>
                    Role Change Information
                  </p>
                  <p className={`text-xs mt-1 ${
                    newRole === "ADMIN" ? "text-purple-700 dark:text-purple-200" : "text-blue-700 dark:text-blue-200"
                  }`}>
                    {newRole === "ADMIN"
                      ? "This user will gain full access to the admin panel, including user management, products, orders, and system settings. Changes take effect on next login."
                      : "This user will lose admin privileges and revert to customer status. They will no longer access the admin panel. Changes take effect immediately."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminRoles;
