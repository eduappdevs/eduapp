import ControlPanel from "./views/ControlPanel";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Schedule from "./views/Schedule";
import Users from "./views/Users";
import Settings from "./views/Settings";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
				<Routes>
					<Route exact path="/" element={<Schedule />} />
					<Route exact path="/schedule" element={<Schedule />} />
					<Route exact path="/users" element={<Users />} />
					<Route exact path="/settings" element={<Settings />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
		</BrowserRouter>
    </div>
  );
}

export default App;
