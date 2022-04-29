import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ControlPanel from "./views/ControlPanel";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
				<Routes>
					<Route exact path="/" element={<ControlPanel />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
		</BrowserRouter>
    </div>
  );
}

export default App;
