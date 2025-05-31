import React, {useEffect, useState} from 'react';

import './App.css';
import './resource/style/Main.css';

import {BrowserRouter} from 'react-router-dom';
import UserData from "./data/UserData";
import themeListenerSingletonInstance from "./singles/ThemeListenerSingleton";
import {AppRoutes} from "./AppRoutes";

export const AppContent = ({ theme }) => {
    document.title = "Nebula App";

    return (
        <main className="App theme-style" data-theme={theme}>
            <AppRoutes/>
        </main>
    );
};

const App = () => {

    const [theme, setTheme] = useState('Default');

    useEffect(() => {
        const initTheme = async () => {
            const themeName = await UserData.getThemeName();
            setTheme(themeName || 'Default');
        };

        initTheme().catch(error => {
            console.error('Failed to initialize theme:', error);
        });

        themeListenerSingletonInstance.addObserver(handleThemeUpdate);
        return () => {
            themeListenerSingletonInstance.removeObserver(handleThemeUpdate);
        };
    }, []);


    const handleThemeUpdate = async () => {
        const themeName = await UserData.getThemeName();
        setTheme(themeName || 'Default');
    };

    document.title = "Nebula App";

    return (
        <main className="App theme-style" data-theme={theme}>
            <BrowserRouter
                basename={'nebula/app'}
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <AppRoutes/>
            </BrowserRouter>
        </main>
    );
};

export default App;
