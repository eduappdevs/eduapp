import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/resources";
import Login from "./views/login/login";
import Home from "./views/home/Home";
import React from "react";
import requireAuth from "./components/auth/RequireAuth";
import Calendar from "./views/Calendar/calendar";

export default function App() {
	return (
		<>
			<BrowserRouter>
				{requireAuth() ? (
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route exact path="/resources" element={<Resources />} />
						<Route exact path="/calendar" element={<Calendar />} />

						<Route path="*" element={<Navigate to="/" />} />

					</Routes>
				) : (
					<Routes>
						<Route exact path="/login" element={<Login />} />
						<Route path="*" element={<Navigate to="/login" />} />
					</Routes>
				)}
			</BrowserRouter>
		</>
	);
}
