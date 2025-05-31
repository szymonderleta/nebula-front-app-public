import UserDataRequest from "../api/user/UserDataRequest";

const UserData = {
    saveUserData: async (userData) => {
        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error during saving user data:', error);
            return false;
        }
    },

    /**
     * @deprecated
     * Old, incorrect version of loadUserData,
     */
    loadUserDataDepreciated: async () => {
        try {
            return JSON.parse(localStorage.getItem('userData'));
        } catch (error) {
            console.error('Error during loading user data:', error);
            return null;
        }
    },

    loadUserData: () => {
        try {
            const item = localStorage.getItem('userData');
            return JSON.parse(item);
        } catch (error) {
            console.error('Error during loading user data:', error);
            return null;
        }
    },

    fetchUserData: async () => {
        try {
            const userData = await UserDataRequest();
            await UserData.saveUserData(userData);
            return true;
        } catch (error) {
            console.error('Error during fetching user data:', error);
            return null;
        }
    },

    clearUserData: () => {
        try {
            localStorage.removeItem('userData');
            return true;
        } catch (error) {
            console.error('Error during removing user token:', error);
            return false;
        }
    },

    getUserId() {
        try {
            return JSON.parse(localStorage.getItem('userData')).id;
        } catch (error) {
            console.error('Error during loading user data:', error);
            return null;
        }
    },

    getThemeName() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            return userData?.settings?.general?.theme?.name || null;
        } catch (error) {
            return null;
        }
    },

    /**
     * @deprecated
     * Old, incorrect version of setTemporaryTheme,
     * doesn't work properly because localStorage.getItem returns a string.
     */
    setTemporaryThemeDeprecated(theme) {
        try {
            localStorage.getItem('userData').settings.general.theme = theme;
        } catch (error) {
            return null;
        }
    },

    setTemporaryTheme(theme) {
        try {
            const userDataString = localStorage.getItem('userData');
            if (!userDataString) return null;
            const userData = JSON.parse(userDataString);
            userData.settings.general.theme = theme;
            localStorage.setItem('userData', JSON.stringify(userData));
            return true;
        } catch (error) {
            return null;
        }
    }

};

export default UserData;
