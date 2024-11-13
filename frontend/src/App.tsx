import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Courses } from "./pages/courses/Courses";
import { CourseDetails } from "./pages/courses/CourseDetails";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import NotFound from "./common/NotFound";
import { User } from "./user/profile/Profile";
import { LearningView } from "./pages/learning/LearningView";
import { DashboardView } from "./pages/dashboard/DashboardView";
import { ACCESS_TOKEN, SESSION_PATH } from "./config";

async function getSession(): Promise<User> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const options = {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    method: "GET",
  };
  const response = await fetch(SESSION_PATH, options);
  return await response.json();
}

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
    getSession().then((user) => setUser(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const login = <Login onLogin={handleLogin} />;

  function goIfAuthenticated(target: React.JSX.Element) {
    if (!isAuthenticated) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        getSession().then((user) => {
          setUser(user);
          setIsAuthenticated(true);
        });
      }
    }

    return isAuthenticated ? target : login;
  }

  return (
    <Routes>
      <Route
        path="/home"
        element={<Home isAuthenticated={isAuthenticated} />}
      />
      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
      <Route path="/login" element={login} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/courses"
        element={<Courses isAuthenticated={isAuthenticated} />}
      />
      <Route
        path="/courses/:courseId"
        element={<CourseDetails user={user} />}
      />
      <Route
        path="/courses/:courseId/learning"
        element={goIfAuthenticated(
          <LearningView isAuthenticated={isAuthenticated} userId={user?.id} />,
        )}
      />
      <Route
        path="/dashboard"
        element={goIfAuthenticated(
          <DashboardView isAuthenticated={isAuthenticated} userId={user?.id} />,
        )}
      />
      {/*<Route path="/stats" element={goIfAuthenticated(<Stats />)} />*/}
      {/*<Route path="/logout" element={<Logout onLogout={handleLogout}/>} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
