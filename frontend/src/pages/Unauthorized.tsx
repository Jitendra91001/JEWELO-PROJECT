import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAcl } from '@/acl/useAcl';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { role, isAdmin } = useAcl();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center ring-8 ring-destructive/5">
          <ShieldAlert size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            Error 403 • Access Restricted
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Permission Required
          </h2>
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            Your current assigned role (<span className="font-bold text-[#997D4D]">{role}</span>) does not possess the requisite clearance to access this management area.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-border hover:border-[#C5A880] text-xs font-semibold text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          <Link
            to={isAdmin ? '/admin' : '/'}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow"
          >
            <Home size={14} />
            <span>{isAdmin ? 'Admin Dashboard' : 'Storefront Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
