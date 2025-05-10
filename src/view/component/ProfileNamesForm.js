import React, {useState, useEffect} from "react";
import '../../resource/style/FormUpdater.css';
import '../../resource/style/FormDefault.css';
import ValidationUtils from "../../util/ValidationUtils";

/**
 * ProfileNamesForm is a functional component used for displaying and updating user profile details.
 *
 * It renders input forms for the user's first and last names, which can be edited, and displays the
 * user's login and email in a read-only manner. Validation is performed for the first and last name fields.
 *
 * Props:
 * - profileData: An object containing the user's profile information including login, email, firstName, and lastName.
 * - onUpdateFirstName: A callback function that is triggered when the first name is updated.
 * - onUpdateLastName: A callback function that is triggered when the last name is updated.
 *
 * State:
 * - firstName: A state variable holding the current value of the first name input.
 * - lastName: A state variable holding the current value of the last name input.
 *
 * Behavior:
 * - Initializes firstName and lastName states with the corresponding values from `profileData`.
 * - Updates state variables `firstName` and `lastName` based on the incoming `profileData` props.
 * - Validates the input for first and last names, ensuring it meets predefined pattern requirements.
 * - Invokes the provided callback functions (`onUpdateFirstName`, `onUpdateLastName`) on input changes.
 */
const ProfileNamesForm = (props) => {

    const {profileData, onUpdateFirstName, onUpdateLastName} = props;
    const [firstName, setFirstName] = useState(profileData.firstName || '');
    const [lastName, setLastName] = useState(profileData.lastName || '');

    useEffect(() => {
        if (profileData) {
            setFirstName(profileData.firstName || '');
            setLastName(profileData.lastName || '');
        }
    }, [profileData]);

    const handleFirstNameChange = (event) => {
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
        onUpdateFirstName(newFirstName);
    };

    const handleLastNameChange = (event) => {
        const newLastName = event.target.value;
        setLastName(newLastName);
        onUpdateLastName(newLastName);
    };

    return (
        <div className="info-section">
            <label>User name:</label>
            <br/>
            <input
                className="custom-textfield"
                type="text"
                value={profileData.login}
                disabled={true}
                readOnly
            />
            <br/>
            <label>Email:</label>
            <br/>
            <input
                className="custom-textfield"
                type="email"
                value={profileData.email}
                disabled={true}
                readOnly
            />
            <br/>
            <label>First Name:</label>
            <br/>
            <input
                className="custom-textfield"
                type="text"
                pattern="[A-Za-z0-9\-]"
                value={firstName}
                required
                onChange={handleFirstNameChange}
            />
            {!ValidationUtils.isTextNameValid(firstName) && (
                <span className={'span-alert'}>
                Invalid first name
            </span>)}
            <br/>
            <label>Last Name:</label>
            <br/>
            <input
                className="custom-textfield"
                type="text"
                pattern="[A-Za-z0-9\-]"
                value={lastName}
                required
                onChange={handleLastNameChange}
            />
            {!ValidationUtils.isTextNameValid(lastName) && (
                <span className={'span-alert'}>
                Invalid last name
            </span>)}
        </div>
    );
}

export default ProfileNamesForm;
