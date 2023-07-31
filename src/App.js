import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from "react-router-dom"
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import { ThemeContext, THEME_DARK, THEME_LIGHT } from './components/ThemeContext';

import ToggleDark from './img/toggle-dark.png';
import ToggleLight from './img/toggle-light.png';

import './App.css';

function App() {
    const [countries, setCountries] = useState();
    const location = useLocation();
    const [theme, setTheme] = useState(THEME_LIGHT);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3004/countries');
                if (!response.ok) {
                    throw new Error(`Error:${response.status}`);
                }
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.log(error, 'Error');
            }
        };
        fetchData();
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK));
    };

    useEffect(() => {
        localStorage.setItem('themeColor', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={theme}>
            <div className={`app-bg ${theme}`}>
                <div className={`app ${theme}`}>
                    <nav className="nav-menu">
                        <Link to="/">
                            <button
                                type="button"
                                className={`page-btn ${location.pathname === '/' ? 'active' : ''}`}>
                                Login
                            </button>
                        </Link>

                        <Link to="/registration">
                            <button
                                type="button"
                                className={`page-btn ${location.pathname === '/registration' ? 'active' : ''}`}>
                                Registration
                            </button>
                        </Link>
                        {<button
                            type="button"
                            onClick={toggleTheme}
                            className={`toggle-btn ${theme}`}>
                            {theme === THEME_DARK
                                ? <img src={ToggleDark} alt="ToggleDark" />
                                : <img src={ToggleLight} alt="ToggleLight" />}
                        </button>}
                    </nav>
                    <Routes>
                        <Route path="/" element={<LoginPage countries={countries} />} />
                        <Route path="/registration" element={<RegistrationPage countries={countries} />} />
                    </Routes>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
