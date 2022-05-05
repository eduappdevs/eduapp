import { getOfflineUser } from "../../utils/OfflineManager";
import * as AUTH_SERVICE from "../../services/auth.service";

export default function RequireAuth() {
  if (getOfflineUser().token) {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };

    let decodedJwt = parseJwt(getOfflineUser().token);
    if (decodedJwt.exp * 1000 < Date.now()) {
      AUTH_SERVICE.logout();
    } else {
      return true;
    }
  } else {
    return false;
  }
}
