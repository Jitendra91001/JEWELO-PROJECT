import { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/common/SEOHead";
import { authAPI } from "@/api/auth.api";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Forgot Password" description="Reset your JEWELO account password" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">{sent ? "Check Your Email" : "Forgot Password?"}</h1>
            <p className="text-muted-foreground font-body text-sm">
              {sent ? `We've sent a reset link to ${email}` : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full gold-gradient text-primary-foreground py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 shimmer">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <button onClick={() => setSent(false)}
              className="w-full border border-border text-foreground py-3 rounded-sm font-body text-sm font-medium hover:border-primary/50 transition-colors">
              Didn't receive? Send again
            </button>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-body text-primary hover:underline mt-6">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
