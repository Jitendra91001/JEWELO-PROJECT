import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h2 className="font-display text-2xl font-bold gold-text mb-4">JEWELO</h2>
            <p className="text-sm font-body leading-relaxed text-background/60 mb-6">
              Crafting timeless pieces of elegance since 1990. Each piece tells a story of beauty, tradition and modern sophistication.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-background/40 hover:text-primary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-background">Quick Links</h3>
            <ul className="space-y-2.5">
              {["New Arrivals", "Best Sellers", "Gold Collection", "Diamond Collection", "Offers"].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm font-body text-background/60 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-background">Customer Service</h3>
            <ul className="space-y-2.5">
              {["Track Order", "Returns & Exchange", "Shipping Info", "FAQs", "Size Guide"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm font-body text-background/60 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-background">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>123 Jewellery Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Phone size={16} className="flex-shrink-0 text-primary" />
                <span>+91 8928519020</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Mail size={16} className="flex-shrink-0 text-primary" />
                <span>info@jewelo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40 font-body">© 2026 JEWELO. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-background/40 font-body">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
