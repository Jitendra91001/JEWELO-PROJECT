import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/authSlice";
import SEOHead from "@/components/common/SEOHead";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      registerUser({ name, email, password, phone }),
    ).unwrap();
    if (result?.success) {
      toast.success(result?.message);
      navigate("/login");
    } else {
      toast.error(result?.message);
    }
  };

  return (
    <>
      <SEOHead
        title="Create Account"
        description="Join JEWELO for exclusive offers on fine jewellery"
      />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              Join us for exclusive offers & collections
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border rounded-sm px-4 py-3 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  dispatch(clearError());
                }}
                className="w-full border border-border rounded-sm px-4 py-3 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border rounded-sm px-4 py-3 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-sm px-4 py-3 pr-10 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 shimmer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm font-body text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
