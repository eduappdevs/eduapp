import React from 'react'
import './courseSelector.css'
import { GetCourses } from '../../hooks/GetCourses';

export default function CourseSelector(props) {
    let courses;
    courses = GetCourses();
    return courses &&(
        <div className='courseSelector-container'>
            <ul>
                {
                courses.map((course)=>{
                    
                    return <li onClick={()=>{
                        props.handleChangeCourse(course.course_id)
                    }} id={course.course_id}>{course.course_name}</li>
                })
                }
            </ul>
            
        </div>
    )
}
