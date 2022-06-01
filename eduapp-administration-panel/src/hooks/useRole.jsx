import { useEffect, useState } from "react";

export default function useRole(user, roles) {
  const [hasRole, setHasRole] = useState(null);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      if (typeof roles === "string") setHasRole(user.user_role.name === roles);
      else if (typeof roles === "object")
        setHasRole(roles.includes(user.user_role.name));
      else setHasRole(false);
    }
  }, [user, roles]);

  return hasRole;
}
