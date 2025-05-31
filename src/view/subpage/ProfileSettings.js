import React, {useEffect, useState} from 'react';
import '../../resource/style/FormUpdater.css';

import UserData from '../../data/UserData';
import ThemeUpdaterFetchData from "../../api/components/updaters/ThemeUpdaterFetchData";
import UserSettingsUpdate from "../../api/user/UserSettingsUpdate";
import themeListenerSingletonInstance from "../../singles/ThemeListenerSingleton";

const initializeGeneralSettings = (userData) => ({
    userId: userData.id,
    theme: {
        id: userData.settings.general.theme.id,
        name: userData.settings.general.theme.name,
    },
});

const initializeSoundSettings = (userData) => ({
    userId: userData.id,
    muted: userData.settings.sound.muted,
    volumeMaster: userData.settings.sound.volumeMaster,
    volumeMusic: userData.settings.sound.volumeMusic,
    volumeEffects: userData.settings.sound.volumeEffects,
    volumeVoices: userData.settings.sound.volumeVoices,
    battleCry: userData.settings.sound.battleCry,
});

/**
 * ProfileEditor is a React functional component designed to manage user profile settings. It handles user preferences
 * related to general settings (e.g., themes) and sound settings (e.g., volume levels, mute state). The component
 * leverages React state and effect hooks to load and update user data dynamically and notify observers upon changes.
 *
 * Key aspects:
 * - **General Settings**: Includes theme selection functionality.
 * - **Sound Settings**: Allows modification of volume levels, mute status, and enabling/disabling battle cry sounds.
 * - **State Management**: Manages internal state for general and sound settings using React's `useState`.
 * - **Side Effects**: Initializes user data and updates the state when the component is rendered using `useEffect`.
 * - **Save Functionality**: Provides an asynchronous mechanism to save user settings and notify observers upon success.
 */
const ProfileEditor = () => {
    const [themeUpdaterKey, setThemeUpdaterKey] = useState(17);
    const [generalSettings, setGeneralSettings] = useState({
        userId: 0,
        theme: {
            id: 17,
            name: "Default"
        }
    });
    const [soundSettings, setSoundSettings] = useState({
        userId: 0,
        battleCry: true,
        muted: false,
        volumeEffects: 100,
        volumeMaster: 100,
        volumeMusic: 100,
        volumeVoices: 100
    });

    useEffect(() => {
        const initializeUserData = async () => {
            const userData = await UserData.loadUserData();
            if (userData) {
                setGeneralSettings(initializeGeneralSettings(userData));
                setSoundSettings(initializeSoundSettings(userData));
                setThemeUpdaterKey((prevKey) => prevKey + 1);
            }
        };
        initializeUserData();
    }, []);

    const handleSoundChange = (e) => {
        const {name, value, type, checked} = e.target;
        const newValue = type === 'checkbox' ? checked : parseInt(value);
        setSoundSettings({...soundSettings, [name]: newValue});
    };

    const handleThemeChange = (theme) => {
        setGeneralSettings(prevData => ({
            ...prevData,
            theme,
        }));
        UserData.setTemporaryTheme(theme);
        themeListenerSingletonInstance.notifyObservers();
    };

    const saveChanges = async () => {
        let result = await UserSettingsUpdate(generalSettings, soundSettings);
        if (result) {
            let updated = await UserData.fetchUserData();
            if (updated) {
                alert('Profile data updated');
                await themeListenerSingletonInstance.notifyObservers();
            } else {
                alert('Profile data updated but not downloaded');
            }
        } else alert('Something is wrong...');
    };

    return (
        <div className="editor-container editor-profile-settings">
            <div className="form-section form-section-center" >
                <label className="label-title">General</label>
                <div className="item-container">
                    <label>Theme: </label>
                    <ThemeUpdaterFetchData
                        key={themeUpdaterKey}
                        value={generalSettings.theme}
                        onChange={handleThemeChange}/>
                </div>
                <label className="label-title">Sound</label>

                {['volumeMaster', 'volumeMusic', 'volumeEffects', 'volumeVoices'].map((setting) => (
                    <div className="item-container" key={setting}>
                        <label>{setting.replace('volume', 'Volume ')}:</label>
                        <input
                            type="range"
                            name={setting}
                            min="0"
                            max="100"
                            value={soundSettings?.[setting] || 0}
                            onChange={handleSoundChange}
                        />
                        <label className="label-title">{soundSettings?.[setting]}</label>
                    </div>
                ))}
                <div className="item-container">
                    <label>
                        <input
                            type="checkbox"
                            name="battleCry"
                            checked={soundSettings.battleCry}
                            onChange={handleSoundChange}
                        />
                        Battle Cry
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="muted"
                            checked={soundSettings.muted}
                            onChange={handleSoundChange}
                        />
                        Muted
                    </label>
                </div>
                <button onClick={saveChanges}>Save Changes</button>
            </div>
        </div>
    );
};

export default ProfileEditor;
