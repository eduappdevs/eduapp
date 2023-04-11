import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Used to change dynamically the web browser's tab name.
 */
export default function WebTitle() {
  let userLocation = useLocation();

  useEffect(() => {
    document.title = `Eduapp - ${userLocation.pathname
      .substring(1, 2)
      .toUpperCase()}${userLocation.pathname.substring(2)}`;
  }, [userLocation]);

  return <></>;
}
