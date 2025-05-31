import React, {useEffect, useState} from 'react';
import '../../resource/style/FormUpdater.css';
import '../../resource/style/FormDefault.css';

import UserData from '../../data/UserData';

import ImageUploader from '../component/ImageUploader';
import ProfileNamesForm from "../component/ProfileNamesForm";
import NationalityUpdaterFetchData from "../../api/components/updaters/NationalityUpdaterFetchData";
import GenderUpdaterFetchData from "../../api/components/updaters/GenderUpdaterFetchData";
import ValidationUtils from "../../util/ValidationUtils";
import UserProfileDataUpdate from "../../api/user/UserProfileDataUpdate";

export const PROFILE_UPDATE_ERROR_MESSAGE = 'Incorrect form data, this usually happens if the name fields contain illegal characters or are empty.';
export const PROFILE_UPDATE_SUCCESS_MESSAGE = 'Profile data updated';
export const PROFILE_UPDATE_PARTIAL_SUCCESS_MESSAGE = 'Profile data updated but not downloaded';
export const PROFILE_UPDATE_FAILED_MESSAGE = 'Failed to update profile. Please try again.';

/**
 * ProfileEditor is a React functional component that provides an interface
 * for editing user profile data. This component handles fetching, displaying,
 * updating, and saving user profile information such as login, email, name,
 * birthdate, nationality, and gender.
 *
 * Key Features:
 * - Initializes with default profile data.
 * - Fetches user data asynchronously on component mount using `useEffect`.
 * - Includes handlers to update specific fields like name, birthdate, nationality, and gender.
 * - Performs validation for profile updates using `ValidationUtils`.
 * - Saves the updated data asynchronously and provides feedback on success or error.
 *
 * State Management:
 * - `profileData`: Stores the current state of the user's profile.
 * - Methods like `handleChange`, `handleNameChange`, `handleNationalityChange`, and
 *   `handleGenderChange` update corresponding parts of the profile.
 *
 * Dependencies:
 * - `useState` and `useEffect` from React for state and lifecycle management.
 * - `UserData` and `UserProfileDataUpdate` for fetching and updating user data.
 * - `ValidationUtils` for validating profile data updates.
 *
 * Rendering:
 * - Displays a form with fields for first name, last name, birthdate, nationality, and gender.
 * - Includes components like `ImageUploader`, `ProfileNamesForm`,
 *   `NationalityUpdaterFetchData`, and `GenderUpdaterFetchData` for specific UI functionality.
 * - Provides validation feedback if incorrect or invalid data is entered.
 *
 * Save Behavior:
 * - Validates data before saving.
 * - Attempts to update user profile via `UserProfileDataUpdate`.
 * - Fetches updated data post-save and provides appropriate success/error messaging.
 */
const ProfileEditor = () => {
    const [profileData, setProfileData] = useState({
        login: '',
        email: '',
        firstName: '',
        lastName: '',
        birthDate: '2000-01-01',
        nationality: {id: 180, name: "Poland", code: "POL"},
        gender: {id: 3, name: "Unknown"}
    });

    useEffect(() => {
        const fetchData = async () => {
            const userData = await UserData.loadUserData();
            if (userData) {
                setProfileData({
                    id: userData.id,
                    login: userData.login,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    birthDate: userData.birthDate,
                    nationality: userData.nationality,
                    gender: userData.gender,
                });
            }
        };

        fetchData();
    }, []);

    const handleChange = (field, value) => {
        setProfileData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleNationalityChange = (nationality) => {
        setProfileData(prevData => ({
            ...prevData,
            nationality,
        }));
    };

    const handleGenderChange = (gender) => {
        setProfileData(prevData => ({
            ...prevData,
            gender,
        }));
    };

    /**
     * Function to handle changes to a name field in profile data.
     *
     * This function validates the input name to ensure it conforms to the specified constraints:
     * - Only includes letters from all alphabets (Unicode),
     *   modifying/combining marks (e.g., accents), white spaces, and hyphens.
     *   (RegExp: `/^[\p{L}\p{M}\s-]+$/u`)
     * - The name must not exceed a maximum length of 50 characters.
     *
     * Explanation of the regular expression:
     * - \p{L} — all letters from all alphabets (Unicode)
     * - \p{M} — modifier and combining marks (e.g., accents)
     * - \s — whitespace characters (spaces, tabs, etc.)
     * - - — hyphen, for compound first or last names
     *
     * If the validation passes, it updates the relevant field in the profile data.
     *
     * @param {string} field - The key of the field in the profile data object that needs to be updated.
     * @param {string} newName - The new name value to be validated and potentially applied to the profile data.
     */
    const handleNameChange = (field, newName) => {
        const nameRegex = /^[\p{L}\p{M}\s-]*$/u;
        const MAX_LENGTH = 50;

        if (newName &&
            newName.length <= MAX_LENGTH &&
            nameRegex.test(newName)) {
            setProfileData(prevData => ({
                ...prevData,
                [field]: newName,
            }));
        }

    };

    const saveChanges = async () => {
        try {
            if (ValidationUtils.isProfileUpdateDataValid(profileData)) {
                const isUpdateSuccessful = await UserProfileDataUpdate(profileData);
                if (isUpdateSuccessful) {
                    const isDataFetched = await UserData.fetchUserData();
                    alert(isDataFetched ? PROFILE_UPDATE_SUCCESS_MESSAGE : PROFILE_UPDATE_PARTIAL_SUCCESS_MESSAGE);
                } else {
                    alert(PROFILE_UPDATE_FAILED_MESSAGE);
                }
            } else {
                alert(PROFILE_UPDATE_ERROR_MESSAGE);
            }
        } catch (error) {
            alert(`${PROFILE_UPDATE_ERROR_MESSAGE}: ${error.message}`);
        }
    };

    return (
        <div className="editor-container">
            <div className="avatar-and-info-container">
                <ImageUploader/>
            </div>
            <div className="form-section" align="center">
                {profileData && (
                    <ProfileNamesForm
                        profileData={profileData}
                        onUpdateFirstName={(newName) => handleNameChange('firstName', newName)}
                        onUpdateLastName={(newName) => handleNameChange('lastName', newName)}
                    />
                )}
                <label htmlFor="birthdate">Birthdate:</label>
                <input id="birthdate"
                       className='input-default'
                       align="right"
                       type="date"
                       value={profileData.birthDate}
                       onChange={(e) => handleChange('birthDate', e.target.value)}
                />
                <NationalityUpdaterFetchData
                    value={profileData.nationality}
                    onChange={handleNationalityChange}/>
                {!ValidationUtils.isNationalityValid(profileData.nationality.id) && (
                    <span className={'span-alert'}>
                        Select Nationality from list.
                    </span>
                )}
                <GenderUpdaterFetchData
                    value={profileData.gender}
                    onChange={handleGenderChange}/>
                {!ValidationUtils.isGenderValid(profileData.gender.id) && (
                    <span className={'span-alert'}>
                            Select Gender from list.
                    </span>
                )}
                <button onClick={saveChanges}>Save Changes</button>
            </div>
        </div>
    );
};

export default ProfileEditor;
