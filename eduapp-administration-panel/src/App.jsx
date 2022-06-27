import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ControlPanel from "./views/ControlPanel";
import RequireAuth from "./components/auth/RequireAuth";
import Login from "./views/login/Login";
import { SearchBarContextProvider } from "./hooks/SearchBarContext";
import "./index.css";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {RequireAuth() ? (
          <SearchBarContextProvider>
            <Routes>
              <Route exact path="/" element={<ControlPanel />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </SearchBarContextProvider>
        ) : (
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}
