import defaultProfileImage from '../resource/default/profile.png';
import UserData from "./UserData";

const AVATAR_BASE_URL = "https://milkyway.local/user/avatar";
const AVATAR_EXTENSION = ".jpg"

const getAvatarUrl = (userId) => `${AVATAR_BASE_URL}/${userId}${AVATAR_EXTENSION}`;
const isValidUserId = (userId) => userId !== undefined && userId !== null;

const saveBlobToLocalStorage = (blob, storageKey) => {
    if (!blob || blob.size === 0) {
        console.error('Blob is empty or invalid.');
        throw new Error('Blob is empty or invalid.');
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            const dataUrl = reader.result;

            if (dataUrl) {
                localStorage.setItem(storageKey, dataUrl);
                resolve(dataUrl);
            } else {
                console.error('Failed to convert blob to Base64.');
                reject('Failed to convert blob to Base64.');
            }
        };

        reader.onerror = () => {
            console.error('Error occurred during FileReader operation.');
            reject('Error reading blob using FileReader.');
        };

        reader.readAsDataURL(blob);
    });
};

const handleFetchErrors = (response) => {
    if (!response.ok) {
        throw new Error(`Failed to fetch: HTTP error ${response.status}`);
    }
};

const fetchAndSaveAvatarData = async (userId) => {
    const avatarUrl = getAvatarUrl(userId);
    const response = await fetch(avatarUrl);

    handleFetchErrors(response);
    const blob = await response.blob();
    return saveBlobToLocalStorage(blob, 'userAvatar');
};

const UserAvatar = {
    updateAvatar: async () => {
        try {
            const userId = UserData.getUserId();
            return await UserAvatar.fetchAndSaveUserAvatar(userId);
        } catch (error) {
            console.error('An error occurred while updating the avatar:', error);
            return false;
        }
    },

    fetchAndSaveUserAvatar: async (userId) => {
        try {
            if (!isValidUserId(userId)) {
                console.error('Invalid user ID for downloading avatar.');
                return false;
            }
            await fetchAndSaveAvatarData(userId);
            return true;
        } catch (error) {
            console.error('An error occurred while downloading the user avatar:', error);
            localStorage.setItem('userAvatar', defaultProfileImage);
            return false;
        }
    },

    getUserAvatar: async () => {
        try {
            const userAvatar = localStorage.getItem('userAvatar');
            if (!userAvatar) {
                console.warn('User avatar not found, returning default.');
                return defaultProfileImage;
            }
            return userAvatar;
        } catch (error) {
            console.error('An error occurred while reading user avatar:', error);
            return null;
        }
    },

};

export default UserAvatar;
