import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

export default Loader;
