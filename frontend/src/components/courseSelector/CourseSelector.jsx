import { React, useState } from "react";
import { GetCourses } from "../../hooks/GetCourses";
import { getOfflineUser } from "../../utils/OfflineManager";
import "./CourseSelector.css";

/**
 * Used to change between given courses.
 */
export default function CourseSelector(props) {
  let courses = GetCourses(getOfflineUser().user.id);
  const [courseSelected, setCourseSelected] = useState();

  const handleChangeCourse = (e, id) => {
    if (e.target.classList.contains("inactiveCourse")) {
      props.handleChangeCourse(id);
      setCourseSelected(id);
    }
  };

  return (
    courses && (
      <>
        <div className="courseSelector-container">
          <ul>
            {courses.map((course) => {
              return (
                <li
                  key={course.id}
                  className={
                    courseSelected === course.id
                      ? "activeCourse"
                      : "inactiveCourse"
                  }
                  onClick={(e) => {
                    handleChangeCourse(e, course.id);
                  }}
                  id={course.id}
                >
                  {course.name}
                </li>
              );
            })}
          </ul>
        </div>
      </>
    )
  );
}
