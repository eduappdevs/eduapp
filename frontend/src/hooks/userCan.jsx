import { useEffect, useState } from "react";


export const CHAT = 'perms_chat';

export const READ_ALL = 0;
export const QUERY = 1;
export const READ_SELF = 2;
export const WRITE = 3;
export const CREATE = 3;
export const UPDATE = 4;
export const DELETE = 5;


/**
 * Custom hook used to verify if a user has any of the
 * specified roles.
 *
 * @param {Object} user The user's information object.
 * @param {String | String[]} roles The role's names to test.
 * @returns {Boolean} hasRole
 */
export default function userCan(user, scope, permission) {
  if (Object.keys(user).length !== 0) {
    return user.user_role[scope][permission];
  }
  return null;
}
