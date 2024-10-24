import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Upewnij si?, ?e masz poprawnie zaimportowane komponenty
import Login from './login/Login';
import Signup from './signup/Signup';
import NotFound from './common/NotFound';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login  onLogin={() => console.log("dsfsfs")}/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} /> {/* U?ywa wildcard do nieznanych tras */}
        </Routes>
    );
};

export default App;
