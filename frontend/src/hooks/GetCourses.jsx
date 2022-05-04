import { useState, useEffect } from "react";
import API from "../API";

export const GetCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      if (navigator.onLine) {
        try {
          const courses = await API.getCourses();
          setCourses([...courses]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getCourses();
  }, []);

  return courses;
};
