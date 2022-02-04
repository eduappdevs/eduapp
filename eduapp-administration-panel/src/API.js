import axios from "axios";
const API_URL = "http://localhost:3000";
const USERS = `${API_URL}/users`;
const INSTITUTIONS = `${API_URL}/institutions`;
const COURSES = `${API_URL}/courses`;
const USERS_INFO = `${API_URL}/user_infos`;
const TUITIONS = `${API_URL}/tuitions`;

const token =
	"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNjM5NTQyMTg4LCJleHAiOjE2NDA3NTE3ODgsImp0aSI6IjBiNDdlODc1LTA2YjQtNDhhMi05YjgxLTdkMTViMzAwYmM0OCJ9.XkhI1q6rJPuoqpdFcgC_c8U9UXtF1-ujhy0LBM4SnYg";

const saveInLocalStorage = (userDetails) => {
	console.log(userDetails);
	if (userDetails.data.message.id == null) {
		throw new Error("error");
	}

	localStorage.setItem("userId", userDetails.data.message.id);
	localStorage.setItem("userToken", userDetails.headers.authorization);
};

const apiSettings = {
	login: async (body) => {
		const endpoint = `${USERS}/sign_in`;
		return await await axios.post(endpoint, body).then((res) => {
			saveInLocalStorage(res);
		});
	},

	//User
	createUser: async (body) => {
		const endpoint = `${USERS}`;
		return await await axios.post(endpoint, body);
	},

	fetchUserInfos: async () => {
		const endpoint = `${USERS_INFO}`;
		return await await axios.get(endpoint);
	},

	createInfo: async (body) => {
		const endpoint = `${USERS_INFO}`;
		return await await axios.post(endpoint, body);
	},

	deleteUser: async (body) => {
		const endpoint = `${USERS}`;
		return await await axios.delete(endpoint, {
			headers: { Authorization: token },
		});
	},

	editUser: async (body) => {
		const endpoint = `${USERS}`;
		return await await axios.put(endpoint, body);
	},

	//Institutions
	fetchInstitutions: async () => {
		const endpoint = `${INSTITUTIONS}`;
		return await await axios.get(endpoint);
	},

	fetchInstitution: async (id) => {
		const endpoint = `${INSTITUTIONS}/${id}`;
		return await await axios.get(endpoint);
	},

	createInstitution: async (body) => {
		const endpoint = `${INSTITUTIONS}`;
		return await await axios.post(endpoint, body);
	},

	deleteInstitution: async (id) => {
		const endpoint = `${INSTITUTIONS}`;
		return await await axios.delete(endpoint + `/${id}`, {
			headers: { Authorization: token },
		});
	},

	editInstitution: async (body) => {
		const endpoint = `${INSTITUTIONS}`;
		return await await axios.put(endpoint, body);
	},

	//Courses
	fetchCourses: async () => {
		const endpoint = `${COURSES}`;
		return await await axios.get(endpoint);
	},

	createCourse: async (body) => {
		const endpoint = `${COURSES}`;
		return await await axios.post(endpoint, body);
	},

	deleteCourse: async (body) => {
		const endpoint = `${COURSES}`;
		return await await axios.delete(endpoint, {
			headers: { Authorization: token },
		});
	},

	editCourse: async (body) => {
		const endpoint = `${COURSES}`;
		return await await axios.put(endpoint, body);
	},

	//Users tuition
	enrollUser: async (body) => {
		const endpoint = `${TUITIONS}`;
		return await await axios.post(endpoint, body);
	},
};

export default apiSettings;
