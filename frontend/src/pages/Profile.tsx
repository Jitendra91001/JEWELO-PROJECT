import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  Camera,
  Edit2,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { authAPI } from "@/api/auth.api";
import { addressAPI, AddressPayload } from "@/api/address.api";
import { orderAPI } from "@/api/order.api";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { fetchPincodeInfo } from "@/lib/utils";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { product: { name: string }; quantity: number }[];
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [newAddress, setNewAddress] = useState<Partial<AddressPayload>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, addressesRes, ordersRes] = await Promise.all([
          authAPI.getProfile(),
          addressAPI.getAll(),
          orderAPI.getMyOrders(),
        ]);

        setProfile(profileRes.data.data);
        setAddresses(addressesRes.data.data || []);
        setOrders(ordersRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const startEditing = (section: string) => {
    setEditingSection(section);
    if (section === "personal" && profile) {
      setEditData({ name: profile.name, phone: profile.phone });
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);    
    setEditData({});
    setNewAddress({});
  };

  const fillAddressFromPincode = useCallback(
    async (pincode: string) => {
      if (!/^[0-9]{6}$/.test(pincode)) {
        return;
      }

      setPincodeLoading(true);
      const info = await fetchPincodeInfo(pincode);
      setPincodeLoading(false);

      if (!info) {
        toast.error("Unable to fetch address details for this PIN code.");
        return;
      }

      setNewAddress((prev) => ({
        ...prev,
        city: info.city || prev.city,
        state: info.state || prev.state,
        line2: prev.line2 || info.block || prev.line2,
      }));
    },
    [],
  );

  const savePersonalInfo = async () => {
    if (!profile) return;
    try {
      await authAPI.updateProfile({
        name: editData.name || profile.name,
        email: profile.email,
        phone: editData.phone || profile.phone,
        avatarUrl: profile.avatarUrl || "",
      });
      setProfile({
        ...profile,
        name: editData.name || profile.name,
        phone: editData.phone || profile.phone,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setEditingSection(null);
    setEditData({});
  };

  const addAddress = async () => {
    try {
      await addressAPI.add(newAddress as AddressPayload);
      const res = await addressAPI.getAll();
      setAddresses(res.data.data || []);
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error("Failed to add address");
    }
    setNewAddress({});
    setEditingSection(null);
  };

  const deleteAddress = async (id: string) => {
    try {
      await addressAPI.delete(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const inputClass =
    "w-full border border-border rounded-sm px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 text-center">
        <SEOHead title="Profile" />
        <p className="text-sm text-muted-foreground">Unable to load profile.</p>
        <Link to="/" className="mt-4 gold-gradient text-primary-foreground px-6 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Profile" description="Manage your account information, addresses, and orders." />

      <div className="min-h-screen bg-background px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-primary hover:underline mb-8"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-semibold text-primary border-2 border-primary/20 overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <Camera size={14} />
              </button>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setProfile({ ...profile, avatarUrl: imageUrl });
                  }
                }}
              />
            </div>
            <h1 className="text-xl font-semibold text-foreground mt-4 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="px-4 py-3.5 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Personal Information
                  </span>
                </div>
              </div>
              <div className="p-4">
                {editingSection === "personal" ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, name: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editData.phone || ""}
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, phone: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={savePersonalInfo}
                        className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-sm text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity shimmer flex items-center justify-center gap-2"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 border border-border text-foreground py-2.5 rounded-sm text-sm font-medium hover:border-primary/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2">
                      <User size={15} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="text-sm text-foreground">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-t border-border">
                      <Mail size={15} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm text-foreground">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-t border-border">
                      <Phone size={15} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm text-foreground">{profile.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startEditing("personal")}
                      className="w-full border border-border text-foreground py-2.5 rounded-sm text-sm font-medium hover:border-primary/50 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Edit2 size={14} /> Edit Information
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Addresses */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="px-4 py-3.5 bg-muted/50 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Saved Addresses
                  </span>
                </div>
                <button
                  onClick={() => setEditingSection("add-address")}
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>
              <div className="p-4">
                {editingSection === "add-address" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newAddress.name || ""}
                          onChange={(e) =>
                            setNewAddress((d) => ({ ...d, name: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newAddress.phone || ""}
                          onChange={(e) =>
                            setNewAddress((d) => ({ ...d, phone: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={newAddress.line1 || ""}
                        onChange={(e) =>
                          setNewAddress((d) => ({ ...d, line1: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="Street Address"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={newAddress.line2 || ""}
                        onChange={(e) =>
                          setNewAddress((d) => ({ ...d, line2: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          City
                        </label>
                        <input
                          type="text"
                          value={newAddress.city || ""}
                          onChange={(e) =>
                            setNewAddress((d) => ({ ...d, city: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          State
                        </label>
                        <input
                          type="text"
                          value={newAddress.state || ""}
                          onChange={(e) =>
                            setNewAddress((d) => ({ ...d, state: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={newAddress.pincode || ""}
                          onChange={async (e) => {
                            const value = e.target.value;
                            setNewAddress((d) => ({ ...d, pincode: value }));

                            if (/^[0-9]{6}$/.test(value)) {
                              await fillAddressFromPincode(value);
                            }
                          }}
                          onBlur={async (e) => {
                            const value = e.target.value;
                            if (/^[0-9]{6}$/.test(value)) {
                              await fillAddressFromPincode(value);
                            }
                          }}
                          className={inputClass}
                          placeholder="PIN Code"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Country
                        </label>
                        <input
                          type="text"
                          value={newAddress.country || "India"}
                          onChange={(e) =>
                            setNewAddress((d) => ({ ...d, country: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={addAddress}
                        disabled={pincodeLoading}
                        className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-sm text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity shimmer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <Save size={14} /> Add Address
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 border border-border text-foreground py-2.5 rounded-sm text-sm font-medium hover:border-primary/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
                    ) : (
                      addresses.map((address) => (
                        <div key={address.id} className="border border-border rounded-sm p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{address.name}</p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              <p className="text-sm text-foreground mt-1">
                                {address.line1}
                                {address.line2 && `, ${address.line2}`}
                                <br />
                                {address.city}, {address.state} {address.pincode}
                                <br />
                                {address.country}
                              </p>
                              {address.isDefault && (
                                <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm">
                                  Default
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => deleteAddress(address.id)}
                              className="text-destructive hover:text-destructive/80 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* My Orders */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="px-4 py-3.5 bg-muted/50 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      My Orders
                    </span>
                  </div>
                  <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <Eye size={14} /> View All Orders
                  </Link>
                </div>
              </div>
              <div className="p-4">
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders found.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border rounded-sm p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-foreground mt-1">
                              {order.items.length} item{order.items.length > 1 ? "s" : ""} • {CURRENCY}{order.total.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-sm ${
                              order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                              order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                              order.status === "PROCESSING" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {order.status}
                            </span>
                            <Link
                              to="/orders"
                              className="inline-flex mt-2 text-primary hover:underline text-sm items-center gap-1"
                            >
                              <Eye size={12} /> View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Logout */}
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="w-full border border-destructive text-destructive py-2.5 rounded-sm text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
