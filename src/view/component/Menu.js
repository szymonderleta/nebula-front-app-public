import React, {useState, useRef, useEffect} from 'react';

import '../../resource/style/Themes.css';
import '../../resource/style/Menu.css';
import logo from '../../resource/icon/logo/menu-logo.png';
import games from '../../resource/icon/menu/games.png';
import achievements from '../../resource/icon/menu/achievements.png';
import profileEditor from '../../resource/icon/menu/profileEditor.png';
import profileSettings from '../../resource/icon/menu/profileSettings.png';
import AvatarComponent from "./AvatarComponent";
import UserData from "../../data/UserData";
import themeListenerSingletonInstance from "../../singles/ThemeListenerSingleton";
import {processAndUploadImage} from "../../util/ImageUploaderUtil";

/**
 * Represents a Menu component used for navigation and user interactions within the application.
 *
 * @param {Object} props - Props passed to the component.
 * @param {Function} props.onNavigate - A callback function that navigates to a primary route or page.
 * @param {Function} props.onSubNavigate - A callback function that navigates to a secondary or sub-route.
 *
 * @returns {JSX.Element} A structured menu interface containing navigation options and user avatar functionality.
 *
 * The Menu component handles:
 * - Theme switching by observing a theme listener singleton.
 * - Navigation to different routes upon interaction with menu items.
 * - User avatar interactions, such as changing avatar or accessing profile-related actions.
 * - Uploading and processing user avatar images.
 */
const Menu = ({onNavigate, onSubNavigate}) => {

    const [theme, setTheme] = useState(UserData.getThemeName() || 'Default');

    useEffect(() => {
        themeListenerSingletonInstance.addObserver(handleThemeUpdate);
        return () => {
            themeListenerSingletonInstance.removeObserver(handleThemeUpdate);
        };
    }, []);

    const handleThemeUpdate = async () => {
        setTheme(await UserData.getThemeName() || 'Default');
    };

    const [isMenuOpen, setMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleMenuItemClick = (action) => {
        if (action === 'passwordChange') {
            onSubNavigate('passwordChange');
        } else if (action === 'logout') {
            onNavigate('logout');
        } else if (action === 'achievements') {
            onSubNavigate('achievements');
        } else if (action === 'games') {
            onSubNavigate('games');
        } else if (action === 'profileSettings') {
            onSubNavigate('profileSettings');
        } else if (action === 'profileEditor') {
            onSubNavigate('profileEditor');
        }
        setMenuOpen(false);
    };

    const handleAvatarChange = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) processAndUploadImage(file);
    };

    return (
        <div className="menu-container" data-theme={theme}>
            <div className="left-section">
                <img src={logo} className="Menu-logo" alt="logo"/>
            </div>
            <div className="menu-items">
                <div className="menu-items">
                    <div className="menu-item" onClick={() => handleMenuItemClick('games')}>
                        <img src={games} alt="Games"/>
                        <span>Games</span>
                    </div>
                    <div className="menu-item" onClick={() => handleMenuItemClick('profileEditor')}>
                        <img src={profileEditor} alt="Profile Edit"/>
                        <span>Profile Editor</span>
                    </div>
                    <div className="menu-item" onClick={() => handleMenuItemClick('profileSettings')}>
                        <img src={profileSettings} alt="Settings"/>
                        <span>User Settings</span>
                    </div>
                    <div className="menu-item" onClick={() => handleMenuItemClick('achievements')}>
                        <img src={achievements} alt="Achievements"/>
                        <span>Achievements</span>
                    </div>
                </div>
            </div>
            <div className="right-section">
                <div className="avatar-container" onClick={handleAvatarClick}>
                    <AvatarComponent width="64px" height="64px"/>
                    {isMenuOpen && (
                        <div className="popup-menu">
                            <div onClick={handleAvatarChange}>Change Avatar</div>
                            <div onClick={() => handleMenuItemClick('profileEditor')}>Profile</div>
                            <div onClick={() => handleMenuItemClick('passwordChange')}>Password</div>
                            <div onClick={() => handleMenuItemClick('logout')}>Log out</div>
                        </div>
                    )}
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                style={{display: 'none'}}
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default Menu;
