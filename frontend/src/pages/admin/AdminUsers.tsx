import { useState, useEffect } from "react";
import { useAppDispatch, useSelector } from "@/store/hooks";
import { Search, Ban, CheckCircle, Eye, RefreshCcw } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { getUsers, toggleUserStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";

const mockUsers = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", orders: 12, status: true, joined: "2025-08-15" },
  { id: "2", name: "Rahul Verma", email: "rahul@email.com", phone: "+91 87654 32109", orders: 5, status: true, joined: "2025-10-22" },
  { id: "3", name: "Ananya Patel", email: "ananya@email.com", phone: "+91 76543 21098", orders: 8, status: false, joined: "2025-12-01" },
  { id: "4", name: "Meera Gupta", email: "meera@email.com", phone: "+91 65432 10987", orders: 3, status: true, joined: "2026-01-10" },
  { id: "5", name: "Vikash Singh", email: "vikash@email.com", phone: "+91 54321 09876", orders: 15, status: true, joined: "2025-06-05" },
];

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, userTotal, userPage, userLimit, loading } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getUsers({ search }));
  }, [dispatch, search]);

  const handleRefresh = () => {
    dispatch(getUsers({ search }));
  };

  const handleToggleStatus = (userId: string) => {
    dispatch(toggleUserStatus(userId));
  };

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
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-sm text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search users..." />
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">User</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Phone</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Orders</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Joined</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-bold">{user.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-foreground">{user.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground font-body">{user.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm font-body text-foreground p-3">{user.phone || 'N/A'}</td>
                    <td className="text-sm font-body font-medium text-foreground p-3">{user._count?.orders || 0}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="text-sm font-body text-muted-foreground p-3">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="View"><Eye size={14} /></button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          title="Toggle status"
                        >
                          {user.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">No users found.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">Loading users...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
