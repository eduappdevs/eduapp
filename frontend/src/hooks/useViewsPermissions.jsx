import { useEffect } from "react";

export default function useViewsPermissions(userInfo, viewType) {
  const views = ["calendar", "resources", "chat"];

  useEffect(() => {
    if (userInfo.user_role !== undefined) {
      if (views.includes(viewType)) {
        if (!userInfo.user_role.perms_app_views[views.indexOf(viewType)]) {
          return (window.location.href = "/home");
        }
        return;
      }
      throw new Error("Page not found in views of useViewsPermissions");
    }
  }, [userInfo]);
}
