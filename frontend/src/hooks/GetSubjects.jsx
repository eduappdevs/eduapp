import { useState, useEffect } from "react";
import API from "../API";

export const GetSubjects = (id) => {
  const [subject, setSubject] = useState([]);

  useEffect(() => {
    const getSubjects = async () => {
      if (navigator.onLine) {
        try {
          const subject = await API.getSubjects(id);
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
