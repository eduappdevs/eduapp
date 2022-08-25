import { useEffect, useState } from "react";

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 925);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth < 925)
    );
  }, []);

  return isMobile;
}
