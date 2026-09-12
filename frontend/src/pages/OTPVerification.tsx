import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, RotateCw } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { toast } from "sonner";

export const OTPVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "your registered email";
  const flow = searchParams.get("flow") || "verification";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[index] = val.slice(-1);
    setOtp(updated);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
    toast.success("A fresh 6-digit OTP has been dispatched to your email.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits of your verification code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Identity verified successfully!");
      if (flow === "reset") {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&token=mock-otp-verified`);
      } else {
        navigate("/email-verification?status=success");
      }
    }, 600);
  };

  return (
    <AuthLayout
      title="Verify 6-Digit OTP"
      subtitle={`We have dispatched a one-time verification passcode to ${email}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-body">
        {/* OTP Boxes */}
        <div className="flex justify-between gap-2 max-w-sm mx-auto">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-14 text-center font-display font-bold text-xl rounded-xl border-2 border-border bg-background text-foreground focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Resend Timer */}
        <div className="text-center text-xs text-muted-foreground">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#997D4D] hover:underline inline-flex items-center gap-1"
            >
              <RotateCw size={12} />
              <span>Resend One-Time Code</span>
            </button>
          ) : (
            <span>
              Resend code in <strong className="text-foreground">{timer}s</strong>
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <span>{loading ? "Verifying Code..." : "Verify & Continue"}</span>
          <ArrowRight size={14} />
        </button>

        <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-[#C5A880]" />
          <span>Bank-Grade 256-Bit Encrypted Security Token</span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;
