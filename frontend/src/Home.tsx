import React from 'react';
import { NavBar } from './layout/NavBar';

interface HomeProps {
    isAuthenticated: boolean
}

export const Home = (props: HomeProps) => {
    return (
        <div>
            <NavBar isAuthenticated={props.isAuthenticated}/>
            <h1>Witaj na stronie głównej!</h1>

        </div>
    );
};

