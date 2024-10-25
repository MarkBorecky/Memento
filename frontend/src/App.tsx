import React, {useState} from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Courses } from "./pages/courses/Courses";
import { CourseDetails } from "./pages/courses/CourseDetails";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import NotFound from "./common/NotFound";


export const App = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const login = <Login onLogin={handleLogin} />;

    function goIfAuthenticated(target: React.JSX.Element) {
      return isAuthenticated ? target : login;
    }

    return (
    <Routes>
      <Route path="/home" element={<Home isAuthenticated={isAuthenticated} />} />
      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
      <Route path="/login" element={login}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/courses" element={<Courses isAuthenticated={isAuthenticated}/>} />
        <Route path="/courses/:id" element={<CourseDetails isAuthenticated={isAuthenticated}/>} />
      {/*<Route path="/stats" element={goIfAuthenticated(<Stats />)} />*/}
      {/*<Route path="/logout" element={<Logout onLogout={handleLogout}/>} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
