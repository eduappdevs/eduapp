// import ControlPanel from "./views/oldControlPanel";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ControlPanel from "./views/ControlPanel";
import OldControlPanel from './views/oldControlPanel'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
				<Routes>
					<Route exact path="/" element={<ControlPanel />} />
					<Route exact path="/old" element={<OldControlPanel />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
		</BrowserRouter>
    </div>
  );
}

export default App;
