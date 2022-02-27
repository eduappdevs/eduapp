import { useState, useEffect } from "react";
import API from "../API";

export const GetCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const courses = await API.getCourses();
        setCourses([...courses]);
      } catch (error) {
        console.log(error);
        console.log("token", localStorage.userToken);
      }
    };

    getCourses();
  }, []);

  return courses;
};
