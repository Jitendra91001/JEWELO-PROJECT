import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/validations/auth.schema";
import { toast } from "sonner";

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Security OTP sent to your registered email address.");
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}&flow=reset`);
    }, 600);
  };

  return (
    <AuthLayout
      title="Recover Password"
      subtitle="Enter your registered email address to receive a secure 6-digit verification code."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-body">
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Registered Email Address</label>
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{loading ? "Sending Verification OTP..." : "Send Verification Code"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="pt-3 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            <ArrowLeft size={13} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
