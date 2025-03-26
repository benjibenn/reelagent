
import { Film } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex justify-center items-center w-8 h-8 bg-black text-white rounded">
                <Film size={16} />
              </div>
              <span className="text-lg font-semibold">ReelAgent</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transform your content creation with AI-powered video generation and editing tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <h4 className="font-medium">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/self-host" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Self Host
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://x.com/rushabtated4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a 
                    href="https://x.com/rushabtated4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ReelAgent. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
