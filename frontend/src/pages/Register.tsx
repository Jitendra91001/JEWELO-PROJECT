import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { registerSchema, RegisterFormData } from "@/validations/auth.schema";
import { toast } from "sonner";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully! Please verify your phone/email with the OTP sent.");
      // Pass email & phone forward to OTP screen
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}&phone=${encodeURIComponent(data.mobile)}`);
    }, 600);
  };

  return (
    <AuthLayout
      title="Create Patron Account"
      subtitle="Register to enjoy bespoke jewellery consultations, order tracking, and private privileges."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-body">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              placeholder="e.g. Aarav"
              className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
            />
            {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              placeholder="e.g. Sharma"
              className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
            />
            {errors.lastName && <p className="text-[11px] text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Email Address</label>
          <div className="relative">
            <input
              type="email"
              {...register("email")}
              placeholder="patron@example.com"
              className="w-full py-2.5 pl-9 pr-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
            />
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
        </div>

        {/* Mobile */}
        <div className="space-y-1">
          <label className="font-semibold text-foreground">10-Digit Indian Mobile Number</label>
          <div className="relative">
            <input
              type="tel"
              {...register("mobile")}
              placeholder="9820011223"
              className="w-full py-2.5 pl-9 pr-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
            />
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.mobile && <p className="text-[11px] text-destructive">{errors.mobile.message}</p>}
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Create Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Min 8 chars, 1 capital, 1 number"
                className="w-full py-2.5 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
              />
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Retype password"
              className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("terms")}
              className="mt-0.5 rounded border-border accent-[#C5A880]"
            />
            <span className="text-muted-foreground text-xs leading-relaxed">
              I agree to the{" "}
              <Link to="/terms" className="text-[#997D4D] hover:underline">
                Terms of Sale
              </Link>{" "}
              and acknowledge the{" "}
              <Link to="/privacy-policy" className="text-[#997D4D] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && <p className="text-[11px] text-destructive mt-1">{errors.terms.message}</p>}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{loading ? "Creating Patron Profile..." : "Register Account"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Login Link */}
        <div className="pt-3 text-center text-xs text-muted-foreground">
          Already registered with Jewelo?{" "}
          <Link to="/login" className="font-bold text-[#997D4D] hover:underline">
            Sign In Here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
