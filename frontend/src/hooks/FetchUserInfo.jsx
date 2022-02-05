import { useState, useEffect } from "react";
import API from "../API";

export const FetchUserInfo = (userId) => {
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const userInfo = await API.fetchInfo(userId);
				setUserInfo({ ...userInfo });
			} catch (error) {
				console.log(error);
				console.log("token", localStorage.userToken);
			}
		};

		fetchUserInfo();
	}, [userId]);

	return userInfo;
};
