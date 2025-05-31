import React from 'react';

import '../../resource/style/Main.css';
import '../../resource/style/FormDefault.css';
import logo from '../../resource/icon/logo/logo.png';

import {
    MESSAGE_HEADER_CONFIRMATION,
    MESSAGE_RECOVERY_PROMPT,
    MESSAGE_REGISTER_PROMPT, NAVIGATE_RECOVERY,
    NAVIGATE_REGISTER,
    RenderLink
} from '../../util/NavigationUtils';

/**
 * ConfirmationInfo is a functional React component that renders a confirmation interface.
 * It is used to display a header message along with prompts for account creation
 * or account recovery. The component includes navigation links that invoke the
 * provided navigation handler.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onNavigate - Function to handle navigation events when links are clicked.
 * @returns {JSX.Element} A React component rendering a confirmation message and navigation options.
 */
const ConfirmationInfo = ({onNavigate}) => {

    return (
        <div className={'div-major'}>
            <img src={logo} className="App-logo" alt="logo"/>
            <h1>{MESSAGE_HEADER_CONFIRMATION}</h1>
            <p>
                {MESSAGE_REGISTER_PROMPT} <RenderLink text="Create account" page={NAVIGATE_REGISTER} onNavigate={onNavigate}/>.
            </p>
            <p>
                {MESSAGE_RECOVERY_PROMPT} <RenderLink text="Restore it" page={NAVIGATE_RECOVERY} onNavigate={onNavigate}/>.
            </p>
        </div>
    );
};

export default ConfirmationInfo;
