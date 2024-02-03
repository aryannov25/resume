import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import PricingPage from "./components/PricingPage";
import Main from "./Main";
import About from "./components/About"
import { auth } from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Firebase auth loading error:", error);
    return <div>Error loading authentication state.</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" /> : <ForgotPasswordPage />}
        />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<About />} />

        <Route path="/" element={!user ? <Navigate to="/login" /> : <Main />} />
      </Routes>
    </Router>
  );
};

export default App;
