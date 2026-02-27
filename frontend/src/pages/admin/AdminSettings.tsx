import { useState } from "react";
import { Save } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    gstPercentage: "3",
    makingCharges: "12",
    goldRate: "6200",
    silverRate: "78",
    contactEmail: "info@jewelo.com",
    contactPhone: "+91 98765 43210",
    address: "123 Jewellery Street, Mumbai, Maharashtra 400001",
    termsUrl: "#",
    privacyUrl: "#",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <>
      <SEOHead title="Admin - Settings" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <button onClick={handleSave}
            className="gold-gradient text-primary-foreground px-4 py-2 rounded-sm font-body text-sm font-semibold inline-flex items-center gap-2 shimmer">
            <Save size={16} /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing */}
          <div className="bg-card border border-border rounded-sm p-5">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Pricing Configuration</h2>
            <div className="space-y-4">
              {[
                { label: "GST Percentage (%)", key: "gstPercentage" },
                { label: "Making Charges (%)", key: "makingCharges" },
                { label: "Gold Rate (₹/gram)", key: "goldRate" },
                { label: "Silver Rate (₹/gram)", key: "silverRate" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-body font-medium text-foreground mb-1.5">{field.label}</label>
                  <input
                    type="number"
                    value={(settings as any)[field.key]}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full border border-border rounded-sm px-4 py-2.5 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-border rounded-sm p-5">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="space-y-4">
              {[
                { label: "Email", key: "contactEmail", type: "email" },
                { label: "Phone", key: "contactPhone", type: "tel" },
                { label: "Address", key: "address", type: "text" },
                { label: "Terms & Conditions URL", key: "termsUrl", type: "url" },
                { label: "Privacy Policy URL", key: "privacyUrl", type: "url" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-body font-medium text-foreground mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={(settings as any)[field.key]}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full border border-border rounded-sm px-4 py-2.5 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
