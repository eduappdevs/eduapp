/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import * as SUBJECT_SERVICE from "../services/subject.service";
import { getOfflineUser } from "../utils/OfflineManager";

/**
 * Fetches the user's subjects dynamically.
 *
 * @param {String} id The user's UUID.
 * @returns {Object} subjects
 */
export const GetSubjects = (id) => {
  const [subject, setSubject] = useState([]);

  useEffect(() => {
    const getSubjects = async () => {
      if (navigator.onLine && getOfflineUser().user !== null) {
        try {
          const subject = (await SUBJECT_SERVICE.fetchUserVariantSubjects(id))
            .data;
          setSubject([...subject]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getSubjects();
  }, []);

  return subject;
};
