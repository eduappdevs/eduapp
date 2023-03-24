/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

/**
 * Custom hook used to verify if a useer has the ability
 * to view a page.
 *
 * @param {Object} userInfo The user's information object.
 * @param {String} viewType The view to test against.
 */
export default function useViewsPermissions(userInfo, viewType) {
  const views = ["calendar", "resources", "chat"];

  useEffect(() => {
    if (userInfo.user_role !== undefined) {
      if (views.includes(viewType)) {
        if (!userInfo.user_role.perms_app_views[views.indexOf(viewType)])
          return (window.location.href = "/home");
        return;
      }
      throw new Error("Page not found in views of useViewsPermissions");
    }
  }, [userInfo?.user?.id]);
}
