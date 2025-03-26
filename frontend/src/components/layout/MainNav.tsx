
import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainNav = () => {
  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex justify-center items-center w-8 h-8 bg-black text-white rounded">
            <Film size={16} />
          </div>
          <span className="text-lg font-semibold">ReelAgent</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <a 
            href="https://x.com/rushabtated4" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Support
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default MainNav;
