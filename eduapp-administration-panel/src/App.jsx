import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ControlPanel from "./views/ControlPanel";
import * as AUTH_SERVICE from "./services/auth.service";

function App() {
  useEffect(() => {
    if (!localStorage.userToken) {
      let form = new FormData();

      form.append("user[email]", process.env.REACT_APP_TEMP_USER);
      form.append("user[password]", process.env.REACT_APP_TEMP_PSWD);

      AUTH_SERVICE.login(form).then(() => {
				window.location.reload();
			});
    }
  }, []);
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
