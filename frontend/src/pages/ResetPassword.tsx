import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { resetPasswordSchema, ResetPasswordFormData } from "@/validations/auth.schema";
import { toast } from "sonner";

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Your password has been reset successfully! Please sign in.");
      navigate("/login");
    }, 600);
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your identity has been verified. Enter a secure new password for your patron account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-body">
        {/* New Password */}
        <div className="space-y-1">
          <label className="font-semibold text-foreground">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Minimum 8 characters"
              className="w-full py-2.5 pl-9 pr-10 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
            />
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Confirm New Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Re-enter your password"
            className="w-full py-2.5 px-3 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-[#C5A880]"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="p-3 bg-secondary/40 rounded-lg border border-border/60 text-[11px] text-muted-foreground space-y-1">
          <span className="font-semibold text-foreground block">Password Requirements:</span>
          <p>✓ At least 8 characters in length</p>
          <p>✓ At least one uppercase letter (A-Z)</p>
          <p>✓ At least one numeric digit (0-9)</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{loading ? "Updating Security Credentials..." : "Update Password & Sign In"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
