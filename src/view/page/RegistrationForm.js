import React, {useState} from 'react';

import '../../resource/style/FormDefault.css';

import {
    MESSAGE_LOGIN_PROMPT, MESSAGE_RECOVERY_PROMPT,
    NAVIGATE_LOGIN, NAVIGATE_RECOVERY, RenderLink
} from '../../util/NavigationUtils';
import ValidationUtils from '../../util/ValidationUtils';
import NationalityFetchData from '../../api/components/geters/NationalityFetchData';
import GenderFetchData from '../../api/components/geters/GenderFetchData';
import logo from "../../resource/icon/logo/logo.png";

/**
 * RegistrationForm component.
 *
 * A React functional component used to render a user registration form. This form allows users
 * to input their credentials, personal information, and register for an account.
 *
 * Props:
 * - onRegister (function): Callback function triggered when the user submits the registration form with valid data. Receives a user object containing registration details as an argument.
 * - onNavigate (function): Callback function used for navigation actions, allowing the user to navigate to login or password recovery pages.
 *
 * State:
 * - login (string): Stores the user's login name.
 * - email (string): Stores the user's email address.
 * - password (string): Stores the user's password.
 * - confirmPassword (string): Stores the confirmation password entered by the user.
 * - birthdate (string): Stores the user's birthdate in YYYY-MM-DD format.
 * - nationality (string): Stores the user's selected nationality.
 * - gender (string): Stores the user's selected gender.
 *
 * Functions:
 * - handleNationality(nationality): Updates the nationality state when the user selects a nationality.
 * - handleGender(gender): Updates the gender state when the user selects a gender.
 * - handleRegister(): Validates the user input fields and triggers `onRegister` prop with user details if all fields are correctly filled and valid. Displays an alert if validation fails.
 *
 * Form Fields:
 * - Login: Input field for entering the login name. Allows letters, numbers, and the dash (-) character.
 * - Email: Input field for entering an email address. Must be in the format user@domain.net.
 * - Password: Input field for entering a secure password of at least 8 characters.
 * - Confirm Password: Input field for re-entering the password for confirmation.
 * - Birthdate: Input field for selecting the user's birthdate.
 * - Nationality: Dropdown component for selecting nationality via `NationalityFetchData`.
 * - Gender: Dropdown component for selecting gender via `GenderFetchData`.
 *
 * Displayed Alerts:
 * - Validation errors are displayed below relevant fields if the input is invalid, such as incorrect login format, invalid email format, weak password, passwords not matching, invalid birthdate, or missing selections for nationality and gender.
 *
 * Includes navigation links for login and password recovery, triggering redirection through the `onNavigate` callback.
 */
const RegistrationForm = ({onRegister, onNavigate}) => {

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthdate, setBirthdate] = useState('2000-01-01');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');

    const handleNationality = (nationality) => {
        setNationality(nationality);
    };
    const handleGender = (gender) => {
        setGender(gender);
    };

    const handleRegister = () => {
        if (ValidationUtils.isRegistrationDataValid(login, email, password, confirmPassword, birthdate, nationality, gender)) {
            const userObject = {
                login: login,
                email: email,
                password: password,
                birthdate: birthdate,
                nationality: nationality,
                gender: gender,
            };
            onRegister(userObject);
        } else {
            alert("Fields wasn't correct filled!");
        }
    };

    return (
        <div className={'div-major'}>
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Registration form</h2>
            <form className={'form-major'}>
                <label className={'label-default'}>
                    Your login:
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        pattern="[a-zA-Z0-9-]+"
                        required
                        className={'input-default'}
                    />
                </label>
                {!ValidationUtils.isLoginValid(login) && (
                    <span className={'span-alert'}>
                    Login can only contain letters, numbers and the '-' sign.
                    <br/>Length between 3 to 45 sings.
                </span>)}
                <label className={'label-default'}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={'input-default'}
                    />
                </label>
                {!ValidationUtils.isEmailValid(email) && (
                    <span className={'span-alert'}>
                    Email can only contain letters, numbers and the '-' sign.
                    <br/>and must be in format user@domain.net.
                </span>)}
                <label className={'label-default'}>
                    Your Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={'input-default'}
                    />
                </label>
                {!ValidationUtils.isStrongPassword(password) && (
                    <span className={'span-alert'}>
                    The password must contain at least 8 characters, numbers or letters.
                </span>)}
                <label className={'label-default'}>
                    Repeat password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={'input-default'}
                    />
                    {!ValidationUtils.isPasswordMatches(password, confirmPassword) && (
                        <span className={'span-alert'}>
                        Passwords must meets.
                    </span>)}
                </label>
                <label className={'label-default'}>
                    Birthdate:
                    <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className={'input-default'}
                    />
                </label>
                {!ValidationUtils.isBirthDateValid(birthdate) && (
                    <span className={'span-alert'}> Enter valid birthdate value. </span>)}
                <NationalityFetchData onChange={handleNationality}/>
                {!ValidationUtils.isNationalityValid(nationality) && (
                    <span className={'span-alert'}> Select your nationality from list. </span>)}
                {/*<div className={'combo-box-fix-size-registration-form'}>*/}
                <GenderFetchData onChange={handleGender}/>
                {!ValidationUtils.isGenderValid(gender) && (
                    <span className={'span-alert'}> Select your gender. </span>)}
                {/*</div>*/}
                <button type="button" onClick={handleRegister} className={'button-registration'}>
                    Register Account
                </button>
            </form>
            <p>
                {MESSAGE_LOGIN_PROMPT} <RenderLink text="Login" page={NAVIGATE_LOGIN} onNavigate={onNavigate}/>.
            </p>
            <p>
                {MESSAGE_RECOVERY_PROMPT} <RenderLink text="Restore it" page={NAVIGATE_RECOVERY}
                                                      onNavigate={onNavigate}/>.
            </p>
        </div>
    );
};

export default RegistrationForm;
