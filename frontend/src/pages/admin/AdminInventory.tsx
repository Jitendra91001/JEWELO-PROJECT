import React, { useState, useEffect } from "react";
import {
  Archive,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  Search,
  History,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_INVENTORY, MOCK_STOCK_HISTORY } from "@/services/mockData";
import { InventoryItem, StockHistoryItem } from "@/types/admin.types";
import { PermissionGuard } from "@/acl/PermissionGuard";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { ColumnsType } from "antd/es/table";
import { CustomTable, LuxuryButton, LuxuryBadge } from "@/components/elements";

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [history, setHistory] = useState<StockHistoryItem[]>(MOCK_STOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    adminService.getInventory().then((data) => {
      if (data && data.length > 0) setInventory(data);
    }).catch(() => {});
  }, []);

  // Adjustment Modal State
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<"addition" | "reduction" | "adjustment">("addition");
  const [adjustReason, setAdjustReason] = useState("");

  const filteredInventory = inventory.filter(
    (i) =>
      i.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCurrentStock = inventory.reduce((sum, i) => sum + i.currentStock, 0);
  const totalReserved = inventory.reduce((sum, i) => sum + i.reservedStock, 0);
  const lowStockCount = inventory.filter((i) => i.status === "low_stock" || i.status === "out_of_stock").length;

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    let newCurrent = selectedItem.currentStock;
    if (adjustType === "addition") newCurrent += adjustQuantity;
    else if (adjustType === "reduction") newCurrent = Math.max(0, newCurrent - adjustQuantity);
    else newCurrent = adjustQuantity;

    const newAvailable = Math.max(0, newCurrent - selectedItem.reservedStock);
    const newStatus =
      newAvailable === 0 ? "out_of_stock" : newAvailable <= selectedItem.threshold ? "low_stock" : "in_stock";

    const updatedItem: InventoryItem = {
      ...selectedItem,
      currentStock: newCurrent,
      availableStock: newAvailable,
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setInventory(inventory.map((i) => (i.id === selectedItem.id ? updatedItem : i)));

    // Add to history
    const newHistoryItem: StockHistoryItem = {
      id: `sh-${Date.now()}`,
      date: new Date().toLocaleString("en-IN"),
      productId: selectedItem.productId,
      productName: selectedItem.productName,
      quantity: adjustType === "reduction" ? -adjustQuantity : adjustQuantity,
      type: adjustType,
      reason: adjustReason || "Manual Audit Adjustment",
      userName: "Administrator",
    };
    setHistory([newHistoryItem, ...history]);

    toast.success(`Inventory stock for ${selectedItem.productName} updated.`);
    setSelectedItem(null);
    setAdjustQuantity(1);
    setAdjustReason("");
  };

  const inventoryColumns: ColumnsType<InventoryItem> = [
    {
      title: "Product & SKU",
      key: "product",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0" />
          <div className="min-w-0">
            <span className="font-display font-semibold text-foreground block truncate max-w-xs text-xs">
              {item.productName}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{item.sku}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <span className="font-medium text-xs text-muted-foreground">{cat}</span>,
    },
    {
      title: "Total Vault",
      dataIndex: "currentStock",
      key: "currentStock",
      align: "center",
      render: (stock: number) => <span className="font-bold text-xs text-foreground">{stock}</span>,
    },
    {
      title: "Reserved",
      dataIndex: "reservedStock",
      key: "reservedStock",
      align: "center",
      render: (stock: number) => <span className="font-bold text-xs text-blue-600">{stock}</span>,
    },
    {
      title: "Available",
      dataIndex: "availableStock",
      key: "availableStock",
      align: "center",
      render: (stock: number) => <span className="font-bold text-xs text-foreground">{stock}</span>,
    },
    {
      title: "Threshold",
      dataIndex: "threshold",
      key: "threshold",
      align: "center",
      render: (th: number) => <span className="text-xs text-muted-foreground">{th}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, item) => (
        <LuxuryBadge
          variant={item.status === "in_stock" ? "inStock" : item.status === "low_stock" ? "lowStock" : "outOfStock"}
          dot
        >
          {item.status.replace("_", " ")}
        </LuxuryBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, item) => (
        <PermissionGuard
          permission="inventory.update"
          fallback={<span className="text-muted-foreground text-[10px]">Read-Only</span>}
        >
          <LuxuryButton
            variant="outline-gold"
            size="xs"
            onClick={() => setSelectedItem(item)}
          >
            Adjust Stock
          </LuxuryButton>
        </PermissionGuard>
      ),
    },
  ];

  const historyColumns: ColumnsType<StockHistoryItem> = [
    {
      title: "Timestamp",
      dataIndex: "date",
      key: "date",
      render: (d: string) => <span className="text-[11px] text-muted-foreground font-mono">{d}</span>,
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (p: string) => <span className="font-medium text-xs text-foreground">{p}</span>,
    },
    {
      title: "Qty Change",
      key: "change",
      render: (_, h) => (
        <span className={`font-mono text-xs font-bold ${h.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
          {h.quantity > 0 ? `+${h.quantity}` : h.quantity}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (t: string) => <span className="uppercase text-[10px] font-bold text-muted-foreground">{t}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (r: string) => <span className="text-xs text-muted-foreground">{r}</span>,
    },
    {
      title: "Author",
      dataIndex: "userName",
      key: "userName",
      align: "right",
      render: (u: string) => <span className="text-xs font-semibold text-foreground">{u}</span>,
    },
  ];

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="Inventory Management | JEWELO Admin" description="Live bullion and gemstone stock control." />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Vault Inventory & Bullion Stock
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time stock level monitoring, reserved allocations, and audit history.
          </p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Total Vault Units</span>
          <span className="font-display font-bold text-2xl text-foreground block">{totalCurrentStock}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Live in Mumbai Vault</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Available for Sale</span>
          <span className="font-display font-bold text-2xl text-foreground block">
            {totalCurrentStock - totalReserved}
          </span>
          <span className="text-[11px] text-muted-foreground">Uncommitted Stock</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Reserved in Active Orders</span>
          <span className="font-display font-bold text-2xl text-foreground block">{totalReserved}</span>
          <span className="text-[11px] text-blue-600 font-semibold">Allocated to consignments</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Low & Out of Stock</span>
          <span className="font-display font-bold text-2xl text-red-600 block">{lowStockCount}</span>
          <span className="text-[11px] text-red-500 font-semibold">Requires karigar casting</span>
        </div>
      </div>

      {/* Main Inventory CustomTable */}
      <CustomTable
        kicker="VAULT HOLDINGS"
        title="Stock Allocation Table"
        subtitle="Manage inventory thresholds, reserved pieces, and dispatch states."
        columns={inventoryColumns}
        dataSource={filteredInventory}
        rowKey="id"
        searchable
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder="Search product, SKU, category..."
        pagination={{ pageSize: 10, total: filteredInventory.length }}
      />

      {/* Stock History CustomTable */}
      <CustomTable
        kicker="AUDIT TRAIL"
        title="Stock Modification Audit Log"
        subtitle="Historical records of stock adjustments, karigar castings, and dispatches."
        columns={historyColumns}
        dataSource={history}
        rowKey="id"
        searchable={false}
        pagination={{ pageSize: 5, total: history.length }}
      />


      {/* STOCK ADJUSTMENT MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-2xl max-w-md w-full z-50 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display font-bold text-lg text-foreground">Adjust Vault Stock</h3>
                <button onClick={() => setSelectedItem(null)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs space-y-1">
                <span className="font-bold text-foreground block">{selectedItem.productName}</span>
                <span className="font-mono text-[10px] text-muted-foreground">SKU: {selectedItem.sku}</span>
                <p className="text-muted-foreground">Current Stock in Vault: <strong>{selectedItem.currentStock} Units</strong></p>
              </div>

              <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Adjustment Action</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "addition", label: "Add (+)" },
                      { id: "reduction", label: "Reduce (-)" },
                      { id: "adjustment", label: "Set Exact" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAdjustType(t.id as any)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          adjustType === t.id
                            ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D] font-bold"
                            : "border-border text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Quantity Units</label>
                  <input
                    type="number"
                    min={1}
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Reason / Audit Note</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g. New hallmarked batch received from karigar"
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C5A880] text-white font-bold uppercase tracking-wider rounded-lg shadow"
                  >
                    Update Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInventory;
