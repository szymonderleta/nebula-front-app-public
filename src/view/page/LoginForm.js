import React, {useState} from 'react';

import '../../resource/style/FormDefault.css';
import logo from '../../resource/icon/logo/logo.png';

import {
    MESSAGE_RECOVERY_PROMPT,
    MESSAGE_REGISTER_PROMPT,
    NAVIGATE_RECOVERY,
    NAVIGATE_REGISTER,
    RenderLink
} from '../../util/NavigationUtils';
import ValidationUtils from "../../util/ValidationUtils";

/**
 * A functional component that renders a login form UI. It handles user login
 * functionality by accepting username and password inputs, and provides visual
 * error feedback for login errors.
 *
 * The component allows navigation to registration and recovery pages through
 * clickable links.
 *
 * @param {Object} props - The props passed to the LoginForm component.
 * @param {Function} props.onLogin - Function to handle successful login submission. Receives
 *                                    an object containing the email and password entered by the user.
 * @param {boolean} props.loginError - Boolean flag indicating if there was a login error.
 * @param {Function} props.onNavigate - Function to handle navigation between different pages
 *                                       like registration or recovery.
 */
const LoginForm = ({onLogin, loginError, onNavigate}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (ValidationUtils.isLoginDataValid(username, password)) {
            const loginData = {
                email: username,
                password: password,
            };
            onLogin(loginData);
        } else {
            console.log("Invalid login data criteria.")
        }
    };

    return (
        <div className={'div-major'} data-testid="login-form">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1>Login</h1>
            <form className={'form-major'}>
                <label className={'label-default'}>
                    Username or email:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={'input-default'}
                    />
                </label>
                <label className={'label-default'}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={'input-default'}
                    />
                </label>
                {loginError && (
                    <p style={{ color: 'red', marginTop: '10px' }}>
                        Wrong username or password
                    </p>
                )}
                <button type="button" onClick={handleLogin} className={'button-registration'}>
                    Login
                </button>
            </form>
            <p>
                {MESSAGE_REGISTER_PROMPT} <RenderLink text="Create account" page={NAVIGATE_REGISTER} onNavigate={onNavigate}/>.
            </p>
            <p>
                {MESSAGE_RECOVERY_PROMPT} <RenderLink text="Restore it" page={NAVIGATE_RECOVERY} onNavigate={onNavigate}/>.
            </p>
        </div>
    );
};

export default LoginForm;
