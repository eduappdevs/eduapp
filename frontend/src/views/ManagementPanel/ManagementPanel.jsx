import React, { useEffect, useState } from 'react'
import './ManagementPanel.css'
import DarkModeChanger from '../../components/DarkModeChanger';
import Navbar from '../../components/navbar/navbar';
import BottomButtons from '../../components/bottomButtons/bottomButtons';
import API from '../../API_MANAGEMENT'
let institutions;
let courses;
let users;

export default function ManagementPanel() {
    const [ItsMobileDevice, setItsMobileDevice] = useState(false);
    const [institutionsLoading, setInstitutionsLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    

    const fetchInstitutions = async () => {
        try {
            await API.fetchInstitutions().then((res) => {
                institutions = res.data;
                setInstitutionsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };
    const getInstitution = (id) => {
        let res;
        institutions.map((i) => {
            if (i.id === id) {
                res = i.name;
            }
        });
        return res;
    };
    const fetchUsers = async () => {
        try {
            await API.fetchUserInfos().then((res) => {
                users = res.data;
                setUsersLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };
    const fetchCourses = async () => {
        try {
            await API.fetchCourses().then((res) => {
                courses = res.data;
                setCoursesLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };
    const postInstitution = (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append("name", e.target.institution_name.value);
        API.createInstitution(payload);
        window.location.reload();
    };
    const postCourse = (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append("name", e.target.name.value);
        payload.append("institution_id", e.target.institution_id.value);

        API.createCourse(payload);
        window.location.reload();
    };
    const deleteInstitution = (event) => {
        event.preventDefault();
        API.deleteInstitution(event.target.institutions.value);
        window.location.reload();
    };
    const deleteCourse = (id) => {
        API.deleteCourse(id);
    };
    const createUser = (event) => {
        event.preventDefault();
        let isAdmin = event.target.isAdmin.checked
        const payload = new FormData();
        payload.append("user[email]", event.target.email.value);
        payload.append("user[password]", event.target.password.value);
        API.createUser(payload)
            .then((res) => {
                const payload = new FormData();
                API.createInfo(payload);
                payload.delete("user[email]");
                payload.delete("user[password]");
                payload.append("user_id", res.data.message.id);
                payload.append("user_name", res.data.message.email.split("@")[0]);
                payload.append("isAdmin", isAdmin);

                API.createInfo(payload).then((res) => {
                    window.location.reload();
                });
            })
            .catch((err) => console.log);
    };
    const userEnroll = (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append(
            "course_id",
            e.target.tuition_course.value.split(":")[1].split("/")[0]
        );
        payload.append(
            "institution_id",
            e.target.tuition_course.value.split(":")[1].split("/")[1]
        );
        payload.append("user_id", e.target.tuition_user.value);
        payload.append("course_name", e.target.tuition_course.value.split(":")[0]);
        payload.append(
            "institution_name",
            getInstitution(e.target.tuition_course.value.split(":")[1].split("/")[1])
        );
        payload.append("isTeacher", e.target.isTeacher.checked);

        API.enrollUser(payload).then((res) => {
            console.log("User tuition has been completed successfully!");
        });
    };
    const checkMediaQueries = () => {
        setInterval(() => {
            if (window.matchMedia("(max-width: 1100px)").matches) {
                setItsMobileDevice(true);
            } else {
                setItsMobileDevice(false);
            }
        }, 4000);
    };
    useEffect(() => {

        fetchInstitutions();
        fetchCourses();
        fetchUsers();
        checkMediaQueries();
        // DarkModeChanger(localStorage.getItem('darkMode'))

        //First check
        if (window.matchMedia("(max-width: 1100px)").matches) {
            setItsMobileDevice(true);
        } else {
            setItsMobileDevice(false);
        }
    }, []);
    return !institutionsLoading &&
        institutions !== undefined &&
        !coursesLoading &&
        courses !== undefined &&
        !usersLoading &&
        users !== undefined && (
            <div className='managementpanel__main'>
                <Navbar mobile={ItsMobileDevice} location={"management"} />
                <div className="managementpanel__container">
                    <div className="managementpanel__institutions managementpanel__item">
                        <div className="managementpanel__item__header">
                            <h1>Institutions</h1>
                            <div id="cp-institutions" className="institutions">
                                <div className="institutions__post management__form-container">
                                    <h3>CREATE AN INSTITUTION</h3>
                                    <form action="submit" onSubmit={postInstitution}>
                                        <label htmlFor="institution_name">Institution name</label>
                                        <input autoComplete='off' type="text" name="institution_name" required />
                                        <button type="submit">SUBMIT</button>
                                    </form>
                                </div>
                                <div className="institutions__delete management__form-container">
                                    <h3>DELETE AN INSTITUTION</h3>
                                    <form action="submit" onSubmit={deleteInstitution}>
                                        <select name="institutions" id="institutions_delete">
                                            {institutions.map((i) => {
                                                return <option value={i.id}>{i.name}</option>;
                                            })}
                                        </select>
                                        <button type="submit">DELETE</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="managementpanel__courses managementpanel__item">
                        <div className="managementpanel__item__header">
                            <h1>Courses</h1>
                            <div id="cp-courses" className="courses">
                                <div className="courses__post management__form-container">
                                    <h3>CREATE A COURSE</h3>
                                    <form action="submit" onSubmit={postCourse}>
                                        <input type="text" name="name" />
                                        <select name="institution_id" id="institution_id">
                                            {institutions.map((i) => {
                                                return <option value={i.id}>{i.name}</option>;
                                            })}
                                        </select>
                                        <button type="submit">SUBMIT</button>
                                    </form>
                                </div>
                                <div className="courses__delete management__form-container">
                                    <h3>DELETE A COURSE</h3>
                                    <form action="submit" onSubmit={deleteCourse}>
                                        <select name="courses" id="courses_delete">
                                            {courses.map((i) => {
                                                return <option value={i.id}>{i.name}</option>;
                                            })}
                                        </select>
                                        <button type="submit">DELETE</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="managementpanel__users managementpanel__item">
                        <div className="managementpanel__item__header">
                            <h1>Users</h1>
                            <div id="cp-users" className="users">
                                <div className="users__post management__form-container">
                                    <h3>CREATE AN USER</h3>
                                    <form action="submit" onSubmit={createUser}>
                                        <label htmlFor="email">Email </label>
                                        <input  autoComplete='off' type="text" name="email" />
                                        <label htmlFor="password">Password</label>
                                        <input autoComplete='off' type="password" name="password" />
                                        <label htmlFor="isAdmin">Admin</label>
                                        <input autoComplete='off' type="checkbox" name="isAdmin" id="isAdmin" value='isAdmin' />
                                        <button type="submit">SIGN UP</button>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="managementpanel__enrollments managementpanel__item">
                        <div className="managementpanel__item__header">
                            <h1>Enrollments</h1>
                            <div className="user_tuition management__form-container">
                                <form action="submit" onSubmit={userEnroll}>
                                    <p>Course</p>
                                    <select name="tuition_course" id="tuition_course">
                                        {courses.map((i) => {
                                            return (
                                                <option
                                                    value={i.name + ":" + i.id + "/" + i.institution_id}
                                                >
                                                    {i.name} of {getInstitution(i.institution_id)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <p>User</p>

                                    <select name="tuition_user" id="tuition_user">
                                        {users.map((i) => {
                                            return (
                                                <option value={i.id}>
                                                    {i.user_name},{i.id}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <label htmlFor="isTeacher">Teacher</label>
                                    <input type="checkbox" name="isTeacher" id="isTeacher" value='isTeacher' />
                                    <button type="submit">ENROLL</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <BottomButtons mobile={ItsMobileDevice} location={"management"} />
            </div>
        )
}
