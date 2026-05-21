import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Search, Ban, CheckCircle, Eye, RefreshCcw, Shield, Users, UserCheck } from "lucide-react";
import { Table, Tag, Modal, Select, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import SEOHead from "@/components/common/SEOHead";
import { getUsers, toggleUserStatus, updateUserRole } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import { toast } from "sonner";

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, userTotal, loading } = useAppSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getUsers({ search, page, limit }));
  }, [dispatch, search, page, limit]);

  const handleRefresh = () => {
    dispatch(getUsers({ search, page, limit }));
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
      toast.success(`User promoted to ${newRole}`);
      setRoleModalVisible(false);
      handleRefresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update role");
    } finally {
      setUpdating(false);
    }
  };

  const adminCount = users.filter((u: any) => u.role === "ADMIN").length;
  const userCount = users.filter((u: any) => u.role === "USER").length;
  const activeCount = users.filter((u: any) => u.isActive).length;

  const columns: ColumnsType<any> = [
    {
      title: "User",
      key: "user",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">{user.name?.charAt(0) || "U"}</span>
          </div>
          <div>
            <div className="font-medium text-foreground">{user.name || "N/A"}</div>
            <div className="text-xs text-muted-foreground">{user.email || ""}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          color={role === "ADMIN" ? "purple" : "blue"}
          icon={role === "ADMIN" ? <Shield size={14} /> : <UserCheck size={14} />}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "-",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Blocked"}
        </Tag>
      ),
    },
    {
      title: "Email Verified",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (verified: boolean) => (
        <Tag color={verified ? "green" : "orange"}>
          {verified ? "Verified" : "Pending"}
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
      width: 120,
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showRoleModal(user)}
            className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            title="Change role"
          >
            Change Role
          </button>
          <button
            onClick={() => handleToggleStatus(user.id)}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
            title="Toggle status"
          >
            {user.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <SEOHead title="Admin - Users Management" />
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <Users size={28} /> User Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage user accounts, roles, and access permissions</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Users</p>
                <p className="text-2xl font-bold text-foreground mt-1">{userTotal}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Admins</p>
                <p className="text-2xl font-bold text-foreground mt-1">{adminCount}</p>
              </div>
              <Shield className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Customers</p>
                <p className="text-2xl font-bold text-foreground mt-1">{userCount}</p>
              </div>
              <UserCheck className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active</p>
                <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-card border border-border rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search by name or email..."
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
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
        title="Change User Role"
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
          >
            Update Role
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">User</p>
              <p className="text-foreground font-medium">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Role</p>
              <Tag color={selectedUser.role === "ADMIN" ? "purple" : "blue"}>
                {selectedUser.role}
              </Tag>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">New Role</p>
              <Select
                value={newRole}
                onChange={setNewRole}
                options={[
                  { label: "Customer (USER)", value: "USER" },
                  { label: "Administrator (ADMIN)", value: "ADMIN" },
                ]}
                className="w-full"
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ This action will {newRole === "ADMIN" ? "promote" : "demote"} the user. They will gain access to the admin panel on their next login.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminUsers;
