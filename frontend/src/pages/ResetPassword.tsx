import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/common/SEOHead";
import { useAppDispatch } from "@/store/hooks";
import { resetPassword } from "@/store/authSlice";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setLoading(true);

    try {
      const result = await dispatch(resetPassword({ token, password,confirmPassword})).unwrap();
      if (result?.success) {
        setSuccess(true);
        toast.success(result?.message || "Password reset successfully!");
        navigate("/");
      } else {
        toast.error(result?.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Forgot Password"
        description="Reset your JEWELO account password"
      />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-5">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              {success ? (
                <CheckCircle size={24} className="text-primary-foreground" />
              ) : (
                <Lock size={24} className="text-primary-foreground" />
              )}
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-primary-foreground py-3.5 rounded-sm text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 shimmer"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-body text-primary hover:underline mt-6"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
