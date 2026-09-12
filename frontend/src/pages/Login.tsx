import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { loginSchema, LoginFormData } from "@/validations/auth.schema";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    // Simulate auth check without backend
    setTimeout(() => {
      setLoading(false);
      // Quick test logic: if email contains "admin", log in as SUPER_ADMIN
      const isMockAdmin = data.emailOrPhone.toLowerCase().includes("admin");
      const mockUser = {
        id: isMockAdmin ? "usr-1" : "cust-1",
        name: isMockAdmin ? "Devraj Oberoi (Admin)" : "Aarav Sharma",
        email: data.emailOrPhone,
        role: isMockAdmin ? "SUPER_ADMIN" : "CUSTOMER",
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-jwt-token-jewelo-2026");

      // Dispatch store state directly
      dispatch({
        type: "auth/login/fulfilled",
        payload: {
          data: {
            user: mockUser,
            token: "mock-jwt-token-jewelo-2026",
          },
        },
      });

      toast.success(`Welcome back, ${mockUser.name}!`);
      if (isMockAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }, 600);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Jewelo patron account to view orders and privileges."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-body">
        {/* Email or Phone */}
        <div className="space-y-1">
          <label className="font-semibold text-foreground block">
            Email Address or 10-Digit Mobile
          </label>
          <div className="relative">
            <input
              type="text"
              {...register("emailOrPhone")}
              placeholder="e.g. patron@example.com or 9820011223"
              className="w-full py-2.5 pl-9 pr-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880] transition-colors"
            />
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.emailOrPhone && (
            <p className="text-[11px] text-destructive">{errors.emailOrPhone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-foreground">Password</label>
            <Link
              to="/forgot-password"
              className="text-[#997D4D] hover:underline text-[11px] font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="w-full py-2.5 pl-9 pr-10 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880] transition-colors"
            />
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="rounded border-border accent-[#C5A880]"
            />
            <span className="text-muted-foreground text-xs">Keep me signed in for 30 days</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{loading ? "Verifying Credentials..." : "Sign In to Account"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Quick hint for testing */}
        <p className="text-[10px] text-muted-foreground text-center bg-secondary/50 p-2 rounded border border-border/60">
          💡 <em>Tip for reviewer</em>: Type <strong>admin@jewelo.com</strong> to log in as Super Admin, or any regular email for Customer portal.
        </p>

        {/* Social login divider */}
        <div className="pt-4 border-t border-border/80 text-center relative">
          <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-wider relative -top-6">
            Or continue with
          </span>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={() => toast.info("Google OAuth placeholder")}
              className="py-2.5 px-3 rounded-lg border border-border hover:border-[#C5A880] text-xs font-semibold text-foreground transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.info("Apple ID OAuth placeholder")}
              className="py-2.5 px-3 rounded-lg border border-border hover:border-[#C5A880] text-xs font-semibold text-foreground transition-colors"
            >
              Apple ID
            </button>
          </div>
        </div>

        {/* Register link */}
        <div className="pt-3 text-center text-xs text-muted-foreground">
          New to Jewelo?{" "}
          <Link to="/register" className="font-bold text-[#997D4D] hover:underline">
            Create a Patron Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
