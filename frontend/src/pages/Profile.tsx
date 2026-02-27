import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAuth from "@/hooks/use-auth";
import { useDispatch } from "react-redux";
import { authAPI } from "@/api/auth.api";
import { updateProfile } from "@/store/authSlice";
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    avatarUrl: "",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
  });
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  const startEditing = (section: string) => {
    setEditingSection(section);
    if (section === "personal") {
      setEditData({ name: profile.name, phone: profile.phone });
    } else if (section === "address") {
      setEditData({ address: { ...profile.address } });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatarUrl: imageUrl,
      }));
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData({});
  };

  const saveSection = async (section: string) => {
    if (section === "personal") {
      setProfile((prev) => ({
        ...prev,
        name: (editData.name as string) || prev.name,
        phone: (editData.phone as string) || prev.phone,
      }));
      const personalProfile = {
        name: editData?.name,
        email: editData?.email,
        phone: editData?.phone,
        avatarUrl: image,
      };
      const response = await dispatch(updateProfile(personalProfile)).unwrap();
      console.log(response, "response");
    } else if (section === "address") {
      setProfile((prev) => ({
        ...prev,
        address: editData.address || prev.address,
      }));
    }
    setEditingSection(null);
    setEditData({});
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
  };

  const inputClass =
    "w-full border border-border rounded-sm px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-primary hover:underline mb-8"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-semibold text-primary border-2 border-primary/20 overflow-hidden">
              {profile.avatarUrl || image ? (
                <img
                  src={image || profile.avatarUrl}
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
              onChange={handleFileChange}
            />
          </div>
          <h1 className="text-xl font-semibold text-foreground mt-4 tracking-tight">
            {profile.name}
          </h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["personal"]}
          className="space-y-3"
        >
          <AccordionItem
            value="personal"
            className="border border-border rounded-sm overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Personal Information
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {editingSection === "personal" ? (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={(editData.name as string) || ""}
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
                      value={(editData.phone as string) || ""}
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, phone: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveSection("personal")}
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
                <div className="space-y-3 pt-2">
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="address"
            className="border border-border rounded-sm overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Saved Address
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {editingSection === "address" ? (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={editData.address?.street || ""}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          address: { ...d.address!, street: e.target.value },
                        }))
                      }
                      className={inputClass}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        City
                      </label>
                      <input
                        type="text"
                        value={editData.address?.city || ""}
                        onChange={(e) =>
                          setEditData((d) => ({
                            ...d,
                            address: { ...d.address!, city: e.target.value },
                          }))
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
                        value={editData.address?.state || ""}
                        onChange={(e) =>
                          setEditData((d) => ({
                            ...d,
                            address: { ...d.address!, state: e.target.value },
                          }))
                        }
                        className={inputClass}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={editData.address?.zip || ""}
                        onChange={(e) =>
                          setEditData((d) => ({
                            ...d,
                            address: { ...d.address!, zip: e.target.value },
                          }))
                        }
                        className={inputClass}
                        placeholder="10001"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Country
                      </label>
                      <input
                        type="text"
                        value={editData.address?.country || ""}
                        onChange={(e) =>
                          setEditData((d) => ({
                            ...d,
                            address: { ...d.address!, country: e.target.value },
                          }))
                        }
                        className={inputClass}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveSection("address")}
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
                <div className="pt-2">
                  <div className="flex items-start gap-3 py-2">
                    <MapPin
                      size={15}
                      className="text-muted-foreground mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-foreground">
                        {profile.address.street}
                      </p>
                      <p className="text-sm text-foreground">
                        {profile.address.city}, {profile.address.state}{" "}
                        {profile.address.zip}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile.address.country}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startEditing("address")}
                    className="w-full border border-border text-foreground py-2.5 rounded-sm text-sm font-medium hover:border-primary/50 transition-colors flex items-center justify-center gap-2 mt-3"
                  >
                    <Edit2 size={14} /> Edit Address
                  </button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="orders"
            className="border border-border rounded-sm overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  My Orders
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="py-6 text-center">
                <Package
                  size={32}
                  className="text-muted-foreground mx-auto mb-2"
                />
                <p className="text-sm text-muted-foreground">No orders yet</p>
                <Link
                  to="/"
                  className="inline-block mt-3 text-sm text-primary hover:underline"
                >
                  Start Shopping →
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <button
          onClick={handleLogout}
          className="w-full mt-6 border border-destructive/30 text-destructive py-3 rounded-sm text-sm font-medium hover:bg-destructive/5 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
