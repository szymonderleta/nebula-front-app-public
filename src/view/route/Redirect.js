import React, {useEffect, useState} from 'react';
import LoginForm from "../page/LoginForm";
import LoginUserRequest from "../../api/account/LoginUserRequest";
import {useNavigate} from "react-router-dom";
import GETRequestPublic from "../../api/method/GETRequestPublic";

const GAMES_ENABLED_ENDPOINT_URL = 'https://milkyway.local:8555/nebula-rest-api/api/v1/games/enabled';

const fetchEnabledGames = async (setGames) => {
    try {
        const response = await GETRequestPublic(GAMES_ENABLED_ENDPOINT_URL);
        console.log("Response:", response);
        setGames(response);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const handleUserLogin = async (userLoginData, games, destination, navigate, setLoginError) => {
    try {
        const accountTokenResponse = await LoginUserRequest(userLoginData);
        if (accountTokenResponse.success) {
            const gameToRedirect = games.find(game => game.name === destination);
            gameToRedirect ? window.location.href = gameToRedirect.pageUrl : navigate('/');
        } else {
            setLoginError(true);
        }
    } catch (error) {
        console.error("Error retrieving JSON data for JWT:", error);
        setLoginError(true);
    }
};


/**
 * Redirect is a functional component responsible for handling user login and navigation.
 *
 * This component retrieves a destination parameter from the URL query string, manages state for games, login errors,
 * and the currently active page, and fetches enabled games upon mounting. It provides a login functionality where
 * user login data is handled, and upon successful login, the application navigates to the appropriate destination.
 *
 * State:
 * - `games`: Array of enabled games, fetched on component mount.
 * - `loginError`: Boolean indicating whether a login error occurred.
 * - `currentPage`: String representing the name of the current page viewed by the user.
 *
 * Props passed to child components:
 * - Passes the `handleLogin` function to `LoginForm` for handling login attempts.
 * - Passes the `loginError` state to `LoginForm` for displaying login error messages, if any.
 * - Passes the `setCurrentPage` function to `LoginForm` to handle page navigation changes.
 */
const Redirect = () => {

    const destination = new URLSearchParams(window.location.search).get('destination');
    const [games, setGames] = useState([]);
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('home');

    useEffect(() => {
        fetchEnabledGames(setGames);
    }, []);

    const handleLogin = (userLoginData) => {
        handleUserLogin(userLoginData, games, destination, navigate, setLoginError);
    };

    return (
        <div>
            <LoginForm onLogin={handleLogin} loginError={loginError} onNavigate={setCurrentPage}/>
        </div>
    );

};

export default Redirect;
