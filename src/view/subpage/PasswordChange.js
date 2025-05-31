import React, {useState} from 'react';
import '../../resource/style/FormUpdater.css';
import '../../resource/style/PasswordUpdater.css';
import ValidationUtils from "../../util/ValidationUtils";
import ChangePasswordRequest from "../../api/pasword/ChangePasswordRequest";
import UserData from "../../data/UserData";

/**
 * PasswordChange is a React functional component responsible for rendering a password update form.
 * It provides fields for users to input their current password, new password,
 * and password confirmation, with functionality to toggle password visibility
 * and validate the input.
 *
 * Features:
 * - Allows toggling the visibility of entered passwords for the current, new, and confirmed passwords.
 * - Includes form validation to ensure password strength and matching confirmation passwords.
 * - Sends a password update request and provides feedback (success or error messages) to the user.
 * - Maintains state for password input values and their visibility toggle states using React useState hooks.
 * - Alerts the user with predefined messages based on the validation or request outcomes.
 */
const PasswordChange = () => {
    const SUCCESS_MESSAGE = 'Password updated';
    const ERROR_MESSAGE = 'Something is wrong...';
    const INVALID_DATA_MESSAGE = 'Incorrect form data. Ensure your password is strong and matches the confirmation.';

    const [password, setPassword] = useState({
        userId: UserData.getUserId(),
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const updatePasswordField = (field, value) => {
        setPassword(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const toggleShowPassword = (field, state) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: state
        }));
    };

    const handlePasswordChange = async () => {
        if (ValidationUtils.isUpdatePasswordValid(password)) {
            try {
                const result = await ChangePasswordRequest(password);
                alert(result ? SUCCESS_MESSAGE : ERROR_MESSAGE);
            } catch (e) {
                console.error('Password change request failed:', e);
                alert(ERROR_MESSAGE);
            }
        } else {
            alert(INVALID_DATA_MESSAGE);
        }
    }

    return (
        <div className="editor-container">
            <div className="form-section password-update-form-section">
                <div className="password-update-form">
                    <label htmlFor="current-password">Actual password:</label>
                    <input
                        id="current-password"
                        data-testid="current-password-input"
                        type={showPassword.currentPassword ? 'text' : 'password'}
                        value={password.currentPassword}
                        onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                    />
                    <button
                        onMouseDown={() => toggleShowPassword('currentPassword', true)}
                        onMouseUp={() => toggleShowPassword('currentPassword', false)}
                        onMouseLeave={() => toggleShowPassword('currentPassword', false)}
                        aria-label="Show current password">
                        &#x1F50D;
                    </button>
                </div>
                <div className="password-update-form">
                    <label htmlFor="new-password">New Password:</label>
                    <input
                        id="new-password"
                        data-testid="new-password-input"
                        type={showPassword.newPassword ? 'text' : 'password'}
                        value={password.newPassword}
                        onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                    />
                    <button
                        onMouseDown={() => toggleShowPassword('newPassword', true)}
                        onMouseUp={() => toggleShowPassword('newPassword', false)}
                        onMouseLeave={() => toggleShowPassword('newPassword', false)}
                        aria-label="Show new password">
                        &#x1F50D;
                    </button>
                </div>
                <div className="password-update-form">
                    <label htmlFor="confirm-password">Confirm password:</label>
                    <input
                        id="confirm-password"
                        data-testid="confirm-password-input"
                        type={showPassword.confirmPassword ? 'text' : 'password'}
                        value={password.confirmPassword}
                        onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                    />
                    <button
                        onMouseDown={() => toggleShowPassword('confirmPassword', true)}
                        onMouseUp={() => toggleShowPassword('confirmPassword', false)}
                        onMouseLeave={() => toggleShowPassword('confirmPassword', false)}
                        aria-label="Show confirm password">
                        &#x1F50D;
                    </button>
                </div>
                <button className="change-password-button" onClick={handlePasswordChange}>
                    Change password
                </button>
            </div>
        </div>
    );
};

export default PasswordChange;
