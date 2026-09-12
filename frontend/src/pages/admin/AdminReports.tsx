import React, { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Layers,
  Package,
  Users,
  RotateCcw,
  Truck,
  ShieldCheck,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  CheckCircle2,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { toast } from "sonner";
import { Table, Tag, Tabs, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";

export const AdminReports: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const handleExport = (type: "csv" | "excel" | "pdf") => {
    if (type === "csv") {
      toast.success("Sales and performance CSV export generated and downloaded.");
    } else if (type === "excel") {
      toast.success("Executive Excel workbook (.xlsx) with formulas generated.");
    } else {
      window.print();
    }
  };

  // 1. Monthly Sales Data
  const monthlySales = [
    { month: "Sep", amount: 820000, orders: 142 },
    { month: "Oct", amount: 950000, orders: 168 },
    { month: "Nov", amount: 1100000, orders: 195 },
    { month: "Dec", amount: 1450000, orders: 248 },
    { month: "Jan", amount: 1280000, orders: 215 },
    { month: "Feb", amount: 980000, orders: 174 },
  ];
  const maxAmount = Math.max(...monthlySales.map((s) => s.amount));

  // 2. Category Performance Data
  const categoryData = [
    { name: "Rings", share: 34, revenue: 2237200, units: 112, avgPrice: 19975, growth: "+14.2%" },
    { name: "Necklaces", share: 30, revenue: 1974000, units: 48, avgPrice: 41125, growth: "+18.6%" },
    { name: "Earrings", share: 18, revenue: 1184400, units: 82, avgPrice: 14440, growth: "+8.4%" },
    { name: "Bracelets", share: 11, revenue: 723800, units: 29, avgPrice: 24950, growth: "+5.1%" },
    { name: "Bangles", share: 7, revenue: 460600, units: 14, avgPrice: 32900, growth: "-2.3%" },
  ];

  // 3. Top Products Data
  const topProducts = [
    {
      id: "prod-1",
      name: "Celeste 1.50 ct Solitaire Diamond Ring",
      sku: "JWL-RNG-001",
      category: "Rings",
      metal: "950 Platinum",
      unitsSold: 28,
      revenue: 5180000,
      margin: "42%",
      rating: 4.9,
    },
    {
      id: "prod-2",
      name: "The Royal Nizam 22K Kundan Choker",
      sku: "JWL-NCK-002",
      category: "Necklaces",
      metal: "22K Gold",
      unitsSold: 12,
      revenue: 4140000,
      margin: "38%",
      rating: 5.0,
    },
    {
      id: "prod-3",
      name: "Imperial Cascading Diamond Jhumkas",
      sku: "JWL-ERR-003",
      category: "Earrings",
      metal: "18K Gold",
      unitsSold: 24,
      revenue: 3408000,
      margin: "44%",
      rating: 4.8,
    },
    {
      id: "prod-4",
      name: "Luminescence 18K Rose Gold Tennis Bracelet",
      sku: "JWL-BRC-004",
      category: "Bracelets",
      metal: "18K Rose Gold",
      unitsSold: 18,
      revenue: 2304000,
      margin: "40%",
      rating: 4.9,
    },
  ];

  // 4. VIP Patrons Leaderboard
  const topPatrons = [
    { name: "Priyanka Singhania", city: "New Delhi", tier: "Crown Heirloom", orders: 7, totalSpend: 920000, pref: "Necklaces" },
    { name: "Aarav Sharma", city: "Mumbai", tier: "Gold Sovereign", orders: 4, totalSpend: 485000, pref: "Solitaires" },
    { name: "Vikramaditya Roy", city: "Kolkata", tier: "Gold Sovereign", orders: 3, totalSpend: 315000, pref: "Bracelets" },
    { name: "Natasha Kapoor", city: "Bengaluru", tier: "Gold Sovereign", orders: 2, totalSpend: 240000, pref: "Earrings" },
  ];

  return (
    <div className="space-y-6 font-body">
      <SEOHead title="Business Intelligence & Reports | JEWELO Admin" description="Executive analytics, bullion accounting, and sales intelligence." />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BarChart3 size={28} className="text-[#C5A880]" />
            <span>Executive Business Intelligence</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time bullion valuation, revenue accounting, and multi-channel sales analytics.
          </p>
        </div>

        {/* Global Action Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-secondary transition"
            title="Download Comma Separated Values"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleExport("excel")}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg text-xs font-semibold transition"
            title="Download Microsoft Excel Sheet"
          >
            <FileSpreadsheet size={14} />
            <span>Excel</span>
          </button>

          <button
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#C5A880] hover:bg-[#B39366] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow"
            title="Print or Export PDF dossier"
          >
            <Printer size={14} />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Calendar size={14} />
            <span>Range:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-lg text-xs bg-background text-foreground focus:ring-2 focus:ring-[#C5A880]/40 outline-none font-semibold"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days (Current Cycle)</option>
            <option value="quarter">This Quarter (Q4 FY26)</option>
            <option value="year">Current Financial Year (FY25-26)</option>
            <option value="all">Lifetime Archive</option>
          </select>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground ml-2">
            <Filter size={14} />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-lg text-xs bg-background text-foreground focus:ring-2 focus:ring-[#C5A880]/40 outline-none font-semibold"
          >
            <option value="ALL">All Categories</option>
            <option value="Rings">Rings & Solitaires</option>
            <option value="Necklaces">Chokers & Necklaces</option>
            <option value="Earrings">Jhumkas & Earrings</option>
            <option value="Bracelets">Tennis Bracelets</option>
            <option value="Bangles">Bangles & Kadas</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
          <CheckCircle2 size={13} />
          <span>GST & Hallmarking Books Balanced</span>
        </div>
      </div>

      {/* 8 Report Tabs */}
      <Tabs
        activeKey={activeReportTab}
        onChange={setActiveReportTab}
        type="line"
        className="jewelo-reports-tabs"
        items={[
          // TAB 1: SALES REPORT
          {
            key: "sales",
            label: "1. Sales Analysis",
            children: (
              <div className="space-y-6 pt-2">
                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Gross Realized Sales</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">
                      {CURRENCY}65,80,000
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <ArrowUpRight size={13} /> +14.8% vs previous cycle
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Net Orders Completed</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">
                      2,310
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <ArrowUpRight size={13} /> +8.2% volume growth
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Average Order Value (AOV)</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">
                      {CURRENCY}28,485
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <ArrowUpRight size={13} /> High-ticket solitaire lift
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Prepaid Settlement Rate</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">
                      95.2%
                    </p>
                    <span className="text-[11px] text-muted-foreground font-semibold mt-1 block">
                      UPI & Cards dominant
                    </span>
                  </div>
                </div>

                {/* Sales Chart & Payment Gateway Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Monthly Histogram Chart */}
                  <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <h3 className="text-sm font-bold text-foreground">Monthly Invoiced Turnover</h3>
                      <span className="text-xs text-muted-foreground">In Lakhs (INR)</span>
                    </div>

                    <div className="flex items-end gap-4 h-56 pt-4 px-2">
                      {monthlySales.map((s) => (
                        <div key={s.month} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[11px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition">
                            {CURRENCY}{(s.amount / 100000).toFixed(2)}L
                          </span>
                          <div
                            className="w-full bg-[#C5A880] rounded-t-lg transition-all duration-300 group-hover:bg-[#B39366]"
                            style={{ height: `${(s.amount / maxAmount) * 100}%` }}
                          />
                          <span className="text-xs font-semibold text-foreground">{s.month}</span>
                          <span className="text-[10px] text-muted-foreground">{s.orders} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods Split */}
                  <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                      Settlement Rails Split
                    </h3>

                    <div className="space-y-3 pt-2">
                      {[
                        { method: "UPI & QR Pay", share: 52, amount: "₹34.2L", color: "bg-[#C5A880]" },
                        { method: "Credit / Debit Cards", share: 31, amount: "₹20.4L", color: "bg-blue-500" },
                        { method: "Net Banking & RTGS", share: 12, amount: "₹7.9L", color: "bg-purple-500" },
                        { method: "Insured COD (≤ ₹50k)", share: 5, amount: "₹3.3L", color: "bg-amber-500" },
                      ].map((item) => (
                        <div key={item.method} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-foreground">{item.method}</span>
                            <span className="text-muted-foreground">{item.amount} ({item.share}%)</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.share}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ),
          },

          // TAB 2: REVENUE & TAX REPORT
          {
            key: "revenue",
            label: "2. Revenue & 3% GST",
            children: (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Net Bullion Revenue</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">₹55,60,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Metal value + certified stones</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Making Charges Realized</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">₹8,22,500</p>
                    <p className="text-xs text-muted-foreground mt-1">Craftsmanship & setting markup</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Statutory 3% GST Remitted</p>
                    <p className="text-2xl font-bold font-display text-[#C5A880] mt-1">₹1,97,400</p>
                    <p className="text-xs text-muted-foreground mt-1">CGST (1.5%) + SGST (1.5%)</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                    Margin & Expense Architecture
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                      <span className="text-muted-foreground font-semibold">Gross Product Margin</span>
                      <p className="text-base font-bold text-foreground">38.4%</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">+2.1% higher YoY</span>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                      <span className="text-muted-foreground font-semibold">Promotional Discounts</span>
                      <p className="text-base font-bold text-foreground">₹2,84,000</p>
                      <span className="text-[10px] text-muted-foreground">Coupons & festival codes</span>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                      <span className="text-muted-foreground font-semibold">Armored Logistics & Insurance</span>
                      <p className="text-base font-bold text-foreground">₹1,15,500</p>
                      <span className="text-[10px] text-muted-foreground">0.17% of shipment values</span>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                      <span className="text-muted-foreground font-semibold">Net Operating Profit</span>
                      <p className="text-base font-bold text-emerald-600">₹21,80,000</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">33.1% Net EBITDA</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },

          // TAB 3: PRODUCT PERFORMANCE
          {
            key: "products",
            label: "3. Product Ranking",
            children: (
              <div className="space-y-4 pt-2">
                <div className="bg-card border border-border rounded-xl p-5 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Top Performing Jewellery Masterpieces</h3>
                    <span className="text-xs text-muted-foreground">Ranked by revenue contribution</span>
                  </div>

                  <Table
                    dataSource={topProducts}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    columns={[
                      {
                        title: "Jewellery Creation",
                        key: "piece",
                        render: (_, record) => (
                          <div>
                            <p className="font-semibold text-foreground text-xs">{record.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{record.sku}</p>
                          </div>
                        ),
                      },
                      {
                        title: "Category",
                        dataIndex: "category",
                        key: "category",
                        render: (c: string) => <Tag color="gold">{c}</Tag>,
                      },
                      {
                        title: "Metal & Spec",
                        dataIndex: "metal",
                        key: "metal",
                        render: (m: string) => <span className="text-xs font-semibold">{m}</span>,
                      },
                      {
                        title: "Units Sold",
                        dataIndex: "unitsSold",
                        key: "unitsSold",
                        render: (u: number) => <span className="text-xs font-bold">{u} units</span>,
                      },
                      {
                        title: "Turnover",
                        dataIndex: "revenue",
                        key: "revenue",
                        render: (r: number) => (
                          <span className="text-xs font-bold text-foreground">
                            {CURRENCY}{r.toLocaleString("en-IN")}
                          </span>
                        ),
                      },
                      {
                        title: "Gross Margin",
                        dataIndex: "margin",
                        key: "margin",
                        render: (m: string) => (
                          <span className="text-xs font-semibold text-emerald-600">{m}</span>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            ),
          },

          // TAB 4: CATEGORY BREAKDOWN
          {
            key: "categories",
            label: "4. Category Share",
            children: (
              <div className="space-y-6 pt-2">
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                    Category Revenue Distribution
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground text-sm">{cat.name}</span>
                          <span className="text-xs font-bold text-[#997D4D]">{cat.share}%</span>
                        </div>
                        <p className="text-lg font-bold font-display text-foreground">
                          {CURRENCY}{(cat.revenue / 100000).toFixed(1)}L
                        </p>
                        <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex justify-between">
                          <span>{cat.units} orders</span>
                          <span className={cat.growth.startsWith("+") ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                            {cat.growth}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          },

          // TAB 5: CUSTOMER ANALYTICS
          {
            key: "customers",
            label: "5. Patron Analytics",
            children: (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Registered Patrons</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">1,420</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">+12.5% this quarter</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Repeat Purchase Rate</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">36.8%</p>
                    <span className="text-[11px] text-muted-foreground">High luxury brand loyalty</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Customer Lifetime Value (LTV)</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">₹1,45,000</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">+18% high-value cohort</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">VIP Heirloom Tier</p>
                    <p className="text-2xl font-bold font-display text-[#C5A880] mt-1">84 Patrons</p>
                    <span className="text-[11px] text-muted-foreground"> ₹5,00,000 spend each</span>
                  </div>
                </div>

                {/* VIP Leaderboard */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                    Top VIP Clientele Leaderboard
                  </h3>
                  <Table
                    dataSource={topPatrons}
                    rowKey="name"
                    pagination={false}
                    size="middle"
                    columns={[
                      {
                        title: "Patron Name",
                        dataIndex: "name",
                        key: "name",
                        render: (name: string, r) => (
                          <div>
                            <span className="font-semibold text-foreground text-xs">{name}</span>
                            <span className="text-[10px] text-muted-foreground block">{r.city}</span>
                          </div>
                        ),
                      },
                      {
                        title: "Membership Tier",
                        dataIndex: "tier",
                        key: "tier",
                        render: (t: string) => <Tag color="gold">{t}</Tag>,
                      },
                      {
                        title: "Orders Count",
                        dataIndex: "orders",
                        key: "orders",
                        render: (o: number) => <span className="text-xs font-semibold">{o} acquisitions</span>,
                      },
                      {
                        title: "Total Spend",
                        dataIndex: "totalSpend",
                        key: "totalSpend",
                        render: (s: number) => (
                          <span className="text-xs font-bold text-foreground">
                            {CURRENCY}{s.toLocaleString("en-IN")}
                          </span>
                        ),
                      },
                      {
                        title: "Preferred Suite",
                        dataIndex: "pref",
                        key: "pref",
                        render: (p: string) => <span className="text-xs text-muted-foreground">{p}</span>,
                      },
                    ]}
                  />
                </div>
              </div>
            ),
          },

          // TAB 6: INVENTORY VALUATION
          {
            key: "inventory",
            label: "6. Vault Valuation",
            children: (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Total Vault Assets (Retail)</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">₹2,45,80,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Bullion, solitaires and gemstones</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Cost of Vault Goods</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">₹1,51,40,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Raw material purchase index</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Bullion Weight on Books</p>
                    <p className="text-2xl font-bold font-display text-[#C5A880] mt-1">8.420 kg Gold</p>
                    <p className="text-xs text-muted-foreground mt-1">+ 1.250 kg 950 Platinum</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                    Precious Metals & Purity Allocation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <span className="font-bold text-foreground">22K Heritage Gold</span>
                      <p className="text-base font-bold mt-1">5.150 kg</p>
                      <span className="text-[10px] text-muted-foreground">Kundan, Bridal & Temple Sets</span>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <span className="font-bold text-foreground">18K Contemporary Gold</span>
                      <p className="text-base font-bold mt-1">2.420 kg</p>
                      <span className="text-[10px] text-muted-foreground">Diamond studded suites</span>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <span className="font-bold text-foreground">950 Pure Platinum</span>
                      <p className="text-base font-bold mt-1">1.250 kg</p>
                      <span className="text-[10px] text-muted-foreground">Solitaire bands & mountings</span>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <span className="font-bold text-foreground">18K Rose Gold</span>
                      <p className="text-base font-bold mt-1">0.850 kg</p>
                      <span className="text-[10px] text-muted-foreground">Tennis bracelets & daily wear</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },

          // TAB 7: ORDER FULFILLMENT
          {
            key: "fulfillment",
            label: "7. Fulfillment & Armored Logistics",
            children: (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">On-Time Delivery Rate</p>
                    <p className="text-2xl font-bold font-display text-emerald-600 mt-1">98.6%</p>
                    <span className="text-[11px] text-muted-foreground">Armored courier SLA</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Average Transit Time</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">2.8 Days</p>
                    <span className="text-[11px] text-muted-foreground">Pan-India insured air cargo</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Return To Origin (RTO)</p>
                    <p className="text-2xl font-bold font-display text-emerald-600 mt-1">0.4%</p>
                    <span className="text-[11px] text-muted-foreground">Zero in-transit losses recorded</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-semibold">Active In-Transit Now</p>
                    <p className="text-2xl font-bold font-display text-blue-600 mt-1">42 Shipments</p>
                    <span className="text-[11px] text-muted-foreground">Tracked in live GPS secure vaults</span>
                  </div>
                </div>
              </div>
            ),
          },

          // TAB 8: RETURN & REFUND REPORT
          {
            key: "returns",
            label: "8. Returns & Guarantees",
            children: (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Overall Return Rate</p>
                    <p className="text-2xl font-bold font-display text-emerald-600 mt-1">2.4%</p>
                    <p className="text-xs text-muted-foreground mt-1">Significantly below industry 8% avg</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Refund Volume Processed</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">₹1,58,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Re-credited to original payment mode</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground font-semibold">Verification & Inspection SLA</p>
                    <p className="text-2xl font-bold font-display text-foreground mt-1">24 Hours</p>
                    <p className="text-xs text-muted-foreground mt-1">XRF metal & diamond tester verified</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                    Primary Return Reasons Breakdown
                  </h3>
                  <div className="space-y-2.5 pt-1 text-xs">
                    {[
                      { reason: "Ring / Bangle Sizing Adjustment", percentage: 54, count: "13 cases" },
                      { reason: "Gift Aesthetic Preference", percentage: 22, count: "5 cases" },
                      { reason: "Occasion Postponed / Cancelled", percentage: 16, count: "4 cases" },
                      { reason: "Hallmark / Certificate Inquiry", percentage: 8, count: "2 cases" },
                    ].map((r) => (
                      <div key={r.reason} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">{r.reason}</span>
                          <span className="text-muted-foreground">{r.count} ({r.percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="bg-[#C5A880] h-full rounded-full" style={{ width: `${r.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AdminReports;
