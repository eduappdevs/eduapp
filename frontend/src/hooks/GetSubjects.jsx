import { useState, useEffect } from "react";
import API from "../API";

export const GetSubjects = (id) => {
  const [subject, setSubject] = useState([]);

  useEffect(() => {
    const getSubjects = async () => {
      if (navigator.onLine) {
        try {
          const subject = await API.getSubjects(id);
          console.log(subject);
          setSubject([...subject]);
        } catch (error) {
          console.log(error);
          console.log("token", localStorage.userToken);
        }
      }
    };

    getSubjects();
  }, []);

  return subject;
};
