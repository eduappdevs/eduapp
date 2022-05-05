import { useState, useEffect } from "react";
import * as COURSE_SERVICE from "../services/course.service";

export const GetCourses = (userId) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      if (navigator.onLine) {
        if (userId) {
          try {
            const courses = (await COURSE_SERVICE.fetchUserCourses(userId))
              .data;
            setCourses([...courses]);
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const courses = (await COURSE_SERVICE.fetchCourses()).data;
            console.log(courses);
            setCourses([...courses]);
          } catch (error) {
            console.log(error);
          }
        }
      }
    };

    getCourses();
  }, []);

  return courses;
};
