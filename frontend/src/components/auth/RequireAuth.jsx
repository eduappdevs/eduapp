import * as AUTH_SERVICE from "../../services/auth.service";
import { TOKEN } from "../../API";
import { getOfflineUser } from "../../utils/OfflineManager";

export default function RequireAuth() {
  if (TOKEN !== "Bearer undefined" && getOfflineUser().user !== null) {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };

    let decodedJwt = parseJwt(TOKEN);
    if (decodedJwt.exp * 1000 < Date.now()) {
      AUTH_SERVICE.logout();
    } else {
      return true;
    }
  } else {
    if (
      !window.location.href.includes("/login") &&
      !window.location.href.includes("/password/reset")
    ) {
      AUTH_SERVICE.logout();
    }
    return false;
  }
}
