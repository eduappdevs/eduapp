import React /*, {useEffect} */ from "react";
import { GetCourses } from "../../hooks/GetCourses";
import { useState } from "react/cjs/react.development";
import "./courseSelector.css";

export default function CourseSelector(props) {
	let courses = GetCourses();
	const [courseSelected, setCourseSelected] = useState();

	const handleChangeCourse = (id) => {
		props.handleChangeCourse(id);
		setCourseSelected(id);
	};

	return (
		courses && (
			<>
				<div className="courseSelector-container">
					<ul>
						{courses.map((course) => {
							return (
								<li
									className={
										courseSelected === course.course_id
											? "activeCourse"
											: "inactiveCourse"
									}
									onClick={() => {
										handleChangeCourse(course.course_id);
									}}
									id={course.course_id}
								>
									{course.course_name}
								</li>
							);
						})}
					</ul>
				</div>
			</>
		)
	);
}
