import * as AUTH_SERVICE from "../../services/auth.service";
import { TOKEN } from "../../API";

export default function RequireAuth() {
  if (TOKEN !== "Bearer undefined") {
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
    return false;
  }
}
