import { BarChart3, Download, TrendingUp } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";

const monthlySales = [
  { month: "Sep", amount: 820000 },
  { month: "Oct", amount: 950000 },
  { month: "Nov", amount: 1100000 },
  { month: "Dec", amount: 1450000 },
  { month: "Jan", amount: 1280000 },
  { month: "Feb", amount: 980000 },
];

const maxAmount = Math.max(...monthlySales.map((s) => s.amount));

const AdminReports = () => {
  return (
    <>
      <SEOHead title="Admin - Reports" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
          <button className="border border-border text-foreground px-4 py-2 rounded-sm font-body text-sm inline-flex items-center gap-2 hover:border-primary/50 transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Monthly Sales</h2>
            </div>
            <div className="flex items-end gap-3 h-48">
              {monthlySales.map((s) => (
                <div key={s.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-body text-muted-foreground">{CURRENCY}{(s.amount / 100000).toFixed(1)}L</span>
                  <div className="w-full gold-gradient rounded-t-sm transition-all"
                    style={{ height: `${(s.amount / maxAmount) * 100}%` }} />
                  <span className="text-xs font-body font-medium text-foreground">{s.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Summary</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Total Sales (6 months)", value: `${CURRENCY}65,80,000` },
                { label: "Average Order Value", value: `${CURRENCY}28,500` },
                { label: "Total Orders", value: "2,310" },
                { label: "Return Rate", value: "2.4%" },
                { label: "Top Category", value: "Rings" },
                { label: "Best Month", value: "December 2025" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm font-body text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-body font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReports;
