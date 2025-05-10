import React, {useEffect, useState} from 'react';

import './App.css';
import './resource/style/Main.css';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import ConfirmationAccount from './view/route/ConfirmationAccount';
import Home from './view/route/Home';
import UserData from "./data/UserData";
import themeListenerSingletonInstance from "./singles/ThemeListenerSingleton";
import Redirect from "./view/route/Redirect";

const App = () => {

    const [theme, setTheme] = useState(UserData.getThemeName() || 'Default');

    useEffect(() => {
        themeListenerSingletonInstance.addObserver(handleThemeUpdate);
        return () => {
            themeListenerSingletonInstance.removeObserver(handleThemeUpdate);
        };
    }, []);

    const handleThemeUpdate = async () => {
        setTheme(await UserData.getThemeName() || 'Default');
    };

    document.title = "Nebula App";

    return (
        <div className="App theme-style" data-theme={theme}>
            <BrowserRouter
                basename={'nebula/app'}
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/confirm/:id/:token" element={<ConfirmationAccount/>}/>
                    <Route path="/confirm" element={<ConfirmationAccount/>}/>
                    <Route path="/redirect" element={<Redirect/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
