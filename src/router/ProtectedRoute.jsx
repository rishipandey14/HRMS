import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, fallback }) => {
  const [isMd, setIsMd] = useState(null); 

  useEffect(() => {
    const checkWidth = () => {
      setIsMd(window.innerWidth >= 768);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Don't render anything until screen size is known
  if (isMd === null) return null;

  return isMd ? children : fallback;
};

export default ProtectedRoute;
