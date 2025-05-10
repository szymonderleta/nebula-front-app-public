import React, {useState} from 'react';
import '../../App.css';
import '../../resource/style/Main.css';

import UserData from '../../data/UserData';

import LoginForm from '../page/LoginForm';
import RegistrationForm from '../page/RegistrationForm';
import ConfirmationInfo from '../page/ConfirmationInfo';
import PasswordRecovery from '../page/PasswordRecovery';

import RegistrationRequest from '../../api/account/RegistrationRequest';
import LoginUserRequest from "../../api/account/LoginUserRequest";
import UserDataRequest from "../../api/user/UserDataRequest";

import Menu from '../component/Menu';
import Achievements from '../subpage/Achievements';
import Games from '../subpage/Games';
import ProfileEditor from '../subpage/ProfileEditor';
import ProfileSettings from '../subpage/ProfileSettings';
import PasswordChange from "../subpage/PasswordChange";
import UserAvatar from "../../data/UserAvatar";

/**
 * The `Home` component serves as the main entry point to the application's interface, dynamically managing and rendering
 * various pages and subpages based on user state (e.g., login status) and navigation events. It handles user authentication,
 * navigation between pages, fetching user data, and cleaning up resources (e.g., user session data upon logout).
 *
 * This component utilizes React state management for tracking login status, current page, and subpage, and performs asynchronous
 * tasks such as data fetching or saving user information. It ensures seamless navigation between different parts of the application.
 *
 * Features:
 * - Authentication functionality for logging in, registering, and handling session data.
 * - Navigation controls for switching between main pages (`currentPage`) and subpages (`currentSubPage`).
 * - Fetching and saving user data and resources, such as avatars, after authentication.
 * - Dynamic rendering of components based on the current page or subpage.
 *
 * State Variables:
 * - `isLoggedIn`: Tracks the user's login status.
 * - `loginError`: Indicates if there was an error during the login process.
 * - `currentPage`: Tracks the current main page being displayed.
 * - `currentSubPage`: Tracks the current subpage within the main page being displayed.
 *
 * Functions:
 * - `fetchUserData`: Asynchronously retrieves user-specific data after authentication.
 * - `fetchUserAvatar`: Fetches and stores the user's avatar using their ID.
 * - `handleLogin`: Processes user login, storing session data and navigating to the home page upon success.
 * - `handleRegister`: Handles new user registration, transitions to the confirmation page upon success.
 * - `handleNavigate`: Handles navigation between main pages.
 * - `handleSubNavigate`: Handles navigation between subpages within the home page.
 * - `handleLogout`: Clears session data and navigates to the login page.
 *
 * Component Hierarchy:
 * - Renders a combination of `Menu`, `LoginForm`, `Achievements`, `ProfileEditor`, `ProfileSettings`, `PasswordChange`,
 *   `Games`, `PasswordRecovery`, `RegistrationForm`, and `ConfirmationInfo` components based on the application's state.
 */
const Home = () => {

    const saveUserData = async (data) => {
        await UserData.saveUserData(data);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const [currentPage, setCurrentPage] = useState('home');
    const [currentSubPage, setCurrentSubPage] = useState('games');

    async function fetchUserData() {
        try {
            const userData = await UserDataRequest();
            await saveUserData(userData);
            await fetchUserAvatar(userData.id);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function fetchUserAvatar(userId) {
        try {
            return await UserAvatar.fetchAndSaveUserAvatar(userId);
        } catch (error) {
            return null;
        }
    }

    const handleLogin = async (userLoginData) => {
        try {
            const accountTokenResponse = await LoginUserRequest(userLoginData);
            if (accountTokenResponse.success === true) {
                await fetchUserData();
                setIsLoggedIn(true);
                setCurrentPage("home");
            } else {
                setLoginError(true);
            }
        } catch (error) {
            console.error("Error retrieving JSON data for JWT:", error);
            setLoginError(true);

        }
    };

    const handleRegister = (userObject) => {
        RegistrationRequest(userObject)
            .then((response) => {
                console.log(`User: ${userObject.login} successfully registered.`);
                handleNavigate('confirmation-info');
            })
            .catch(error => console.log(error));
    };

    const handleNavigate = (page) => {
        if (page === 'logout') {
            handleLogout().then();
        } else setCurrentPage(page);
    };

    const handleSubNavigate = (subpage) => {
        setCurrentSubPage(subpage);
    };

    const handleLogout = async () => {
        await localStorage.clear();
        await sessionStorage.clear();
        await setIsLoggedIn(false);
        await setCurrentPage("login");
    }

    return (
        <div className='theme-style'>
            <div className="content">
                {currentPage === 'home' && (
                    <div>
                        {isLoggedIn ? (
                            <div>
                                <Menu isLoggedIn={isLoggedIn} onNavigate={handleNavigate}
                                      onSubNavigate={handleSubNavigate}/>
                                <div>
                                    {currentSubPage === 'achievements' && (
                                        <Achievements/>
                                    )}
                                    {currentSubPage === 'profileEditor' && (
                                        <ProfileEditor/>
                                    )}
                                    {currentSubPage === 'profileSettings' && (
                                        <ProfileSettings/>
                                    )}
                                    {currentSubPage === 'passwordChange' && (
                                        <PasswordChange/>
                                    )}
                                    {currentSubPage === 'games' && (
                                        <Games/>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <LoginForm onLogin={handleLogin} loginError={loginError} onNavigate={handleNavigate}/>
                        )}
                    </div>
                )}
                {currentPage === 'login' && (
                    <LoginForm onLogin={handleLogin} loginError={loginError} onNavigate={handleNavigate}/>
                )}
                {currentPage === 'recovery' && (
                    <PasswordRecovery onNavigate={handleNavigate}/>
                )}
                {currentPage === 'register' && (
                    <RegistrationForm onRegister={handleRegister} onNavigate={handleNavigate}/>
                )}
                {currentPage === 'confirmation-info' && (
                    <ConfirmationInfo onNavigate={handleNavigate}/>
                )}
            </div>
        </div>
    );
};

export default Home;
