import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollHandler = () => {
  const pathname = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollHandler;
