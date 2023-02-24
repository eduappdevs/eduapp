import { useEffect, useState } from "react";

/**
 * Custom hook used to verify if a user has any of the
 * specified roles.
 *
 * @param {Object} user The user's information object.
 * @param {String | String[]} roles The role's names to test.
 * @returns {Boolean} hasRole
 */
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
