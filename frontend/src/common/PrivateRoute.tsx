import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../login/Login';

const App: React.FC = () => {
    const isAuthenticated = true; // Replace with your actual authentication logic

    const handleLogin = () => {
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login  onLogin={handleLogin}/>} />
                {/*<Route path="/dashboard" element={<PrivateRoute component={Dashboard} authenticated={isAuthenticated} />} />*/}
                {/* Add other routes here */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
