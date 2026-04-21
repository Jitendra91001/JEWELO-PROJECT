import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Search, Ban, CheckCircle, Eye, RefreshCcw } from "lucide-react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import SEOHead from "@/components/common/SEOHead";
import { getUsers, toggleUserStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import { toast } from "sonner";

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, userTotal, loading } = useAppSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getUsers({ search, page, limit }));
  }, [dispatch, search, page, limit]);

  const handleRefresh = () => {
    dispatch(getUsers({ search, page, limit }));
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await dispatch(toggleUserStatus(userId)).unwrap();
      toast.success("User status updated successfully");
      handleRefresh();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "N/A",
    },
    {
      title: "Orders",
      key: "orders",
      render: (_, user) => user._count?.orders || 0,
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
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString("en-IN"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="View">
            <Eye size={14} />
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
      <SEOHead title="Admin - Users" />
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Users</h1>

        <div className="bg-card border border-border rounded-sm">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-sm text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search users..."
                />
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-muted-foreground hover:border-foreground hover:text-foreground transition"
                title="Refresh users"
              >
                <RefreshCcw size={16} />
              </button>
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
                pageSizeOptions: ["5", "10", "20"],
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setLimit(nextPageSize);
                },
              }}
              className="rounded-b-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
