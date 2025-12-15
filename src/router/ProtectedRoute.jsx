import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, fallback }) => {
  const [isMd, setIsMd] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWidth = () => {
      setIsMd(window.innerWidth >= 768);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  // Don't render anything until screen size is known
  if (isMd === null) return null;

  // Only render children if token exists
  const token = localStorage.getItem("token");
  if (!token) return null;

  return isMd ? children : fallback;
};

export default ProtectedRoute;
