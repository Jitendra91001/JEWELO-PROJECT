import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Lock,
  LogOut,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Shield,
  ArrowRight,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { ShippingAddress } from "@/types/order.types";
import { toast } from "sonner";

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "addresses" | "payments" | "notifications" | "password"
  >("dashboard");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "Aarav Sharma",
    email: user?.email || "aarav.sharma@example.com",
    phone: "+91 9820011223",
  });

  // Addresses State
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      id: "addr-1",
      fullName: "Aarav Sharma",
      phone: "+91 9820011223",
      addressLine1: "B-402, Imperial Heights, Lokhandwala Complex",
      addressLine2: "Opposite Celebration Club, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400053",
      isDefault: true,
      type: "home",
    },
    {
      id: "addr-2",
      fullName: "Aarav Sharma (Office)",
      phone: "+91 9820011223",
      addressLine1: "Floor 14, Tower B, Peninsula Business Park, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400013",
      isDefault: false,
      type: "work",
    },
  ]);

  const [newAddressOpen, setNewAddressOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    type: "home",
  });

  // Password State
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile information updated successfully.");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.addressLine1 || !newAddr.pincode) {
      toast.error("Please fill in required address fields.");
      return;
    }
    const created: ShippingAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, created]);
    setNewAddressOpen(false);
    setNewAddr({ fullName: "", phone: "", addressLine1: "", city: "", state: "", country: "India", pincode: "", type: "home" });
    toast.success("New delivery destination saved.");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default delivery destination updated.");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Account password changed successfully.");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="w-full bg-background min-h-screen py-8 lg:py-12 font-body text-foreground">
      <SEOHead title="Patron Dashboard | JEWELO" description="Manage your fine jewellery profile, orders, and addresses." />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top Header Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1B17] via-[#2A251E] to-[#1E1B17] text-white border border-[#3E3529] shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#C5A880] text-white flex items-center justify-center font-display font-bold text-2xl shadow-lg ring-4 ring-[#C5A880]/20">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{profileData.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C5A880]/20 text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider">
                  Privé Tier
                </span>
              </div>
              <p className="text-xs text-white/70">{profileData.email} • {profileData.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
            >
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/20 hover:border-white text-xs font-semibold text-white rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Layout: Left Nav + Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 p-3 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
            {[
              { id: "dashboard", label: "Dashboard Overview", icon: Sparkles },
              { id: "profile", label: "Personal Information", icon: User },
              { id: "addresses", label: "Delivery Addresses", icon: MapPin },
              { id: "payments", label: "Payment Instruments", icon: CreditCard },
              { id: "notifications", label: "Privé Notifications", icon: Bell },
              { id: "password", label: "Change Password", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-[#C5A880] text-white shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-border mt-2">
              <Link
                to="/orders"
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Package size={16} />
                <span>Orders & Consignments</span>
              </Link>
              <Link
                to="/wishlist"
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Heart size={16} />
                <span>Saved Wishlist</span>
              </Link>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-9 rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-sm">
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold">Patron Overview</h3>

                {/* Stat Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-1">
                    <span className="text-xs text-muted-foreground">Total Acquisitions</span>
                    <span className="font-display font-bold text-2xl text-foreground block">2 Orders</span>
                    <Link to="/orders" className="text-[11px] font-semibold text-[#997D4D] hover:underline">
                      View tracking details →
                    </Link>
                  </div>

                  <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-1">
                    <span className="text-xs text-muted-foreground">Wishlist Pieces</span>
                    <span className="font-display font-bold text-2xl text-foreground block">4 Items</span>
                    <Link to="/wishlist" className="text-[11px] font-semibold text-[#997D4D] hover:underline">
                      Review saved pieces →
                    </Link>
                  </div>

                  <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-1">
                    <span className="text-xs text-muted-foreground">Saved Addresses</span>
                    <span className="font-display font-bold text-2xl text-foreground block">
                      {addresses.length} Locations
                    </span>
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className="text-[11px] font-semibold text-[#997D4D] hover:underline"
                    >
                      Manage addresses →
                    </button>
                  </div>
                </div>

                {/* Privileges card */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-[#C5A880]/30 space-y-2 text-xs">
                  <span className="font-bold text-[#997D4D] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Your Jewelo Privé Privileges</span>
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Complimentary ultrasonic jewellery cleaning at all flagship boutiques, zero shipping charges on armored consignments, and access to private festive trunk shows.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PERSONAL INFORMATION */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg text-xs">
                <h3 className="font-display text-xl font-bold text-foreground">Edit Patron Information</h3>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* 3. DELIVERY ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="space-y-6 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-display text-xl font-bold">Delivery Destinations</h3>
                  <button
                    onClick={() => setNewAddressOpen(!newAddressOpen)}
                    className="px-4 py-2 bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* New Address Form */}
                {newAddressOpen && (
                  <form onSubmit={handleAddAddress} className="p-5 rounded-xl bg-secondary/40 border border-border space-y-4">
                    <h4 className="font-bold text-sm text-foreground">New Address</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full py-2 px-3 rounded border bg-background"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full py-2 px-3 rounded border bg-background"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street / Flat / House"
                        value={newAddr.addressLine1}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                        className="col-span-2 w-full py-2 px-3 rounded border bg-background"
                        required
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full py-2 px-3 rounded border bg-background"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full py-2 px-3 rounded border bg-background"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full py-2 px-3 rounded border bg-background"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="px-5 py-2 bg-[#C5A880] text-white font-bold rounded">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setNewAddressOpen(false)} className="px-4 py-2 border rounded">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-xl border space-y-3 relative ${
                        addr.isDefault ? "border-[#C5A880] bg-[#C5A880]/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#997D4D] text-[10px] font-bold uppercase">
                            Default Address
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-muted-foreground font-semibold">📞 {addr.phone}</p>

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id!)}
                            className="text-[11px] font-semibold text-[#997D4D] hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id!)}
                          className="text-[11px] text-destructive hover:underline ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PAYMENT INSTRUMENTS */}
            {activeTab === "payments" && (
              <div className="space-y-4 text-xs">
                <h3 className="font-display text-xl font-bold">Saved Payment Instruments</h3>
                <p className="text-muted-foreground">Manage your pre-authorized cards and UPI handles for expedited checkouts.</p>

                <div className="p-5 rounded-xl border border-border bg-secondary/30 space-y-3 max-w-md">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono">•••• •••• •••• 8821</span>
                    <span className="font-bold text-[#C5A880]">HDFC Infinia</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[11px]">
                    <span>Cardholder: {profileData.name}</span>
                    <span>Expires: 09/29</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-4 text-xs">
                <h3 className="font-display text-xl font-bold">Privé Notifications</h3>
                <div className="space-y-3">
                  {[
                    { title: "Consignment Dispatched", desc: "Order #JWL-2026-9041 is on its way via BlueDart Armored Transit.", time: "3 hours ago" },
                    { title: "Exclusive Invitation", desc: "You are invited to the Mumbai High-Jewellery Solitaire Gala.", time: "1 day ago" },
                  ].map((n, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-1">
                      <div className="flex justify-between font-bold text-foreground">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="text-muted-foreground">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CHANGE PASSWORD */}
            {activeTab === "password" && (
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md text-xs">
                <h3 className="font-display text-xl font-bold">Update Password</h3>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-lg border border-border bg-background"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C5A880] text-white font-bold uppercase tracking-wider rounded-lg shadow"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
