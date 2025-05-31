import React, {useState, useEffect} from 'react';

import profile from '../../resource/default/profile.png';
import UserAvatar from "../../data/UserAvatar";
import avatarListenerSingletonInstance from "../../singles/AvatarListenerSingleton";

/**
 * AvatarComponent is a functional React component responsible for displaying a user's avatar.
 * It dynamically fetches and updates the avatar whenever there's a change detected via an observer.
 *
 * The component initializes with a default or previously loaded avatar and listens for updates
 * using an observer pattern to ensure the avatar reflects the latest state.
 *
 * Props:
 *  - width: Specifies the width of the avatar image.
 *  - height: Specifies the height of the avatar image.
 *
 * State Variables:
 *  - avatarSrc: Stores the URL of the current avatar image.
 *  - isAvatarLoaded: Indicates whether the avatar is fully loaded.
 *  - avatarUpdate: Triggers updates to re-fetch the avatar.
 *
 * Side Effects:
 *  - Establishes an observer to listen for avatar update events.
 *  - Cleans up the observer on component unmount.
 *
 * Async Functionality:
 *  - fetchAndSetAvatar: Handles fetching the latest avatar URL and updating the component state.
 *
 * Error Handling:
 *  - Logs errors to the console if an avatar fetch operation fails.
 */
const AvatarComponent = ({width, height}) => {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
    const [avatarUpdate, setAvatarUpdate] = useState(1);

    useEffect(() => {
        const fetchAndSetAvatar = async () => {
            try {
                const updatedAvatar = await UserAvatar.getUserAvatar();
                setAvatarSrc(updatedAvatar);
                setIsAvatarLoaded(true);
            } catch (error) {
                console.error("Error updating avatar:", error);
            }
        };

        fetchAndSetAvatar();

        const handleAvatarUpdate = async () => {
            setAvatarUpdate((prev) => prev + 1);
            await fetchAndSetAvatar();
        };

        avatarListenerSingletonInstance.addObserver(handleAvatarUpdate);
        return () => {
            avatarListenerSingletonInstance.removeObserver(handleAvatarUpdate);
        };
    }, []);

    return (
        <div>
            <img
                src={isAvatarLoaded ? avatarSrc : profile}
                alt="Avatar"
                className="avatar"
                style={{width, height}}
            />
        </div>
    );
};

export default AvatarComponent;
