import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/authSlice";
import SEOHead from "@/components/common/SEOHead";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );


  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password })).unwrap();
    if (result?.success) {
      toast.success(result?.message || "Welcome back!");
      navigate("/");
    } else {
      toast.error(result?.message);
    }
  };

  return (
    <>
      <SEOHead title="Login" description="Sign in to your JEWELO account" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              Sign in to access your account
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
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    dispatch(clearError());
                  }}
                  className="w-full border border-border rounded-sm px-4 py-3 pr-10 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="••••••••"
                  required
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary"
                />
                <span className="text-xs font-body text-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-body text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 shimmer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm font-body text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
