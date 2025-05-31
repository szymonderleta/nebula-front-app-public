import React, {useState} from 'react';

import '../../resource/style/PasswordRecovery.css';
import '../../resource/style/FormDefault.css';

import {
    ERROR_INVALID_EMAIL,
    MESSAGE_LOGIN_PROMPT, MESSAGE_RECOVERY_SUCCESS,
    MESSAGE_REGISTER_PROMPT, NAVIGATE_LOGIN, NAVIGATE_REGISTER,
    RenderLink
} from '../../util/NavigationUtils';
import ResetPasswordRequest from "../../api/pasword/ResetPasswordRequest";
import ValidationUtils from '../../util/ValidationUtils';
import logo from "../../resource/icon/logo/logo.png";

/**
 * PasswordRecovery is a React functional component that provides a UI for users to recover their password.
 *
 * Users can input their email addresses to request a password reset. The component validates the email format
 * before sending a recovery request. Upon successful email submission, users are notified of the success.
 * Additionally, the component provides navigation options to login or register pages.
 *
 * Props:
 * - onNavigate (function): Callback function used to navigate to different pages (e.g., login, register).
 *
 * State:
 * - email (string): Stores the email input value entered by the user.
 * - isRecoveryRequested (boolean): Indicates whether a password recovery request has been successfully submitted.
 *
 * Methods:
 * - handleEmailChange: Updates the email state with the value entered in the input field.
 * - handleRecoveryRequest: Validates the email format and triggers a password reset request if valid.
 *
 * Returns:
 * - JSX containing the password recovery form or a success message upon a successful recovery request.
 */
const PasswordRecovery = ({onNavigate}) => {

    const [email, setEmail] = useState('');
    const [isRecoveryRequested, setRecoveryRequested] = useState(false);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        ValidationUtils.isEmailValid(newEmail);
    };

    const handleRecoveryRequest = () => {
        if (ValidationUtils.isEmailValid(email)) {
            ResetPasswordRequest(email)
                .then(result => {
                    if (result.success) {
                        setRecoveryRequested(true);
                    }
                })
                .catch(error => {
                    console.error("Password reset request failed:", error);
                    alert("Failed to send recovery link. Please try again.");
                });
        } else {
            alert(ERROR_INVALID_EMAIL + email);
        }
    };


    return (
        <div className="password-recovery-container div-major">
            <img src={logo} className="App-logo" alt="logo"/>
            {isRecoveryRequested ? (
                <div className="recovery-success">
                    <p>{MESSAGE_RECOVERY_SUCCESS}</p>
                </div>
            ) : (
                <div className="recovery-form">
                    <h2>Password recovery</h2>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <button onClick={handleRecoveryRequest}>Reset password</button>
                    <p>
                        {MESSAGE_LOGIN_PROMPT} <RenderLink text="Login" page={NAVIGATE_LOGIN} onNavigate={onNavigate}/>.
                    </p>
                    <p>
                        {MESSAGE_REGISTER_PROMPT} <RenderLink text="Create account" page={NAVIGATE_REGISTER} onNavigate={onNavigate}/>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PasswordRecovery;
