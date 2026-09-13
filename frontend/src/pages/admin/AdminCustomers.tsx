import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Eye,
  ShieldAlert,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Package,
  Heart,
  IndianRupee,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_ADMIN_CUSTOMERS } from "@/services/mockData";
import { AdminCustomer } from "@/types/admin.types";
import { PermissionGuard } from "@/acl/PermissionGuard";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { ColumnsType } from "antd/es/table";
import { CustomTable, LuxuryButton, LuxuryBadge, PriceDisplay } from "@/components/elements";

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_ADMIN_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [blockConfirmCustomer, setBlockConfirmCustomer] = useState<AdminCustomer | null>(null);

  useEffect(() => {
    adminService.getCustomers().then((data) => {
      if (data && data.length > 0) setCustomers(data);
    }).catch(() => {});
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleToggleBlock = (customer: AdminCustomer) => {
    const newStatus = customer.status === "active" ? "blocked" : "active";
    setCustomers(customers.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c)));
    toast.success(`Patron ${customer.name} status changed to ${newStatus}.`);
    setBlockConfirmCustomer(null);
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer({ ...selectedCustomer, status: newStatus });
    }
  };

  const customerColumns: ColumnsType<AdminCustomer> = [
    {
      title: "Patron Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-semibold text-foreground text-xs">{name}</span>,
    },
    {
      title: "Contact Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <span className="text-xs text-muted-foreground">{email}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => <span className="text-xs font-mono">{phone}</span>,
    },
    {
      title: "Acquisitions",
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
      render: (orders: number) => <span className="font-bold text-xs text-foreground">{orders}</span>,
    },
    {
      title: "Lifetime Portfolio",
      dataIndex: "totalSpent",
      key: "totalSpent",
      align: "right",
      render: (spent: number) => <PriceDisplay amount={spent} size="sm" />,
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, c) => (
        <LuxuryBadge variant={c.status === "active" ? "inStock" : "outOfStock"} dot>
          {c.status}
        </LuxuryBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, c) => (
        <div className="flex items-center justify-end gap-2">
          <LuxuryButton
            variant="ghost"
            size="xs"
            onClick={() => setSelectedCustomer(c)}
            leftIcon={<Eye size={12} />}
          >
            Profile
          </LuxuryButton>

          <PermissionGuard permission="customer.block">
            <LuxuryButton
              variant={c.status === "active" ? "destructive" : "primary-gold"}
              size="xs"
              onClick={() => setBlockConfirmCustomer(c)}
            >
              {c.status === "active" ? "Block" : "Unblock"}
            </LuxuryButton>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="Customer Relations | JEWELO Admin" description="Patron portfolio and spending profiles." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Patron Accounts & Customer Relations
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review customer spending portfolios, lifetime acquisitions, and status.
          </p>
        </div>
      </div>

      {/* Customer CustomTable */}
      <CustomTable
        kicker="VIP PATRON REGISTRY"
        title="Registered Patrons"
        subtitle="Manage client dossiers, luxury spending limits, and account status."
        columns={customerColumns}
        dataSource={filteredCustomers}
        rowKey="id"
        searchable
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder="Search patron by name, email, phone..."
        pagination={{ pageSize: 10, total: filteredCustomers.length }}
      />


      {/* CUSTOMER DETAILS MODAL / DRAWER */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedCustomer(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-2xl max-w-xl w-full z-50 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#C5A880] text-white font-bold flex items-center justify-center font-display text-lg">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">{selectedCustomer.name}</h3>
                    <span className="text-[11px] text-muted-foreground">Member since {selectedCustomer.createdAt}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-secondary/30 border border-border text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Lifetime Spend</span>
                  <span className="font-display font-bold text-base text-[#997D4D]">
                    ₹{selectedCustomer.totalSpent.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Acquisitions</span>
                  <span className="font-bold text-base text-foreground">{selectedCustomer.totalOrders} Orders</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Status</span>
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">{selectedCustomer.status}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Contact Channels</h4>
                <div className="p-3 rounded-lg border border-border space-y-1 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail size={13} className="text-[#C5A880]" />
                    <span>{selectedCustomer.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-[#C5A880]" />
                    <span>{selectedCustomer.phone}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <PermissionGuard permission="customer.block">
                  <button
                    onClick={() => handleToggleBlock(selectedCustomer)}
                    className="text-xs font-semibold text-destructive hover:underline"
                  >
                    {selectedCustomer.status === "active" ? "Block Customer Access" : "Unblock Customer"}
                  </button>
                </PermissionGuard>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM BLOCK MODAL */}
      <AnimatePresence>
        {blockConfirmCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setBlockConfirmCustomer(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-2xl max-w-md w-full z-50 p-6 space-y-4 shadow-2xl text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <ShieldAlert size={28} />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">
                Confirm Status Modification
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Are you certain you want to change access clearance for patron{" "}
                <strong className="text-foreground">{blockConfirmCustomer.name}</strong> to{" "}
                <strong className="uppercase">{blockConfirmCustomer.status === "active" ? "blocked" : "active"}</strong>?
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setBlockConfirmCustomer(null)}
                  className="px-4 py-2 border rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleToggleBlock(blockConfirmCustomer)}
                  className="px-5 py-2 bg-destructive text-white text-xs font-bold rounded-lg shadow"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;
