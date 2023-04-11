import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ControlPanel from "./views/ControlPanel";
import RequireAuth from "./components/auth/RequireAuth";
import Login from "./views/login/Login";
import { LoaderContextProvider } from "./hooks/LoaderContext";
import { SearchBarContextProvider } from "./hooks/SearchBarContext";
import { LanguageContextProvider } from "./hooks/LanguageContext";
import "./index.css";

export default function App() {
  return (
    <LoaderContextProvider>
      <div className="App">
        <BrowserRouter>
          {RequireAuth() ? (
            <SearchBarContextProvider>
              <LanguageContextProvider>
                <Routes>
                  <Route exact path="/" element={<ControlPanel />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </LanguageContextProvider>
            </SearchBarContextProvider>
          ) : (
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </LoaderContextProvider>
  );
}
