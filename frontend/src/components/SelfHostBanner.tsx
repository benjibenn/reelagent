
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const SelfHostBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bannerClosed = localStorage.getItem("selfHostBannerClosed");
    if (bannerClosed) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("selfHostBannerClosed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-9 bg-primary text-primary-foreground z-50 flex items-center justify-center">
      <a
        href="/self-host"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm hover:underline"
      >
        Self-host and use it for free
      </a>
      <button
        onClick={handleClose}
        className="absolute right-4 hover:opacity-80 transition-opacity"
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SelfHostBanner;
