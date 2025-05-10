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

    loadUserData: async () => {
        try {
            return JSON.parse(localStorage.getItem('userData'));
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

    clearUserData: async () => {
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

    getThemeName(){
        try {
            return JSON.parse(localStorage.getItem('userData')).settings.general.theme.name;
        } catch (error) {
            return null;
        }
    },

    setTemporaryTheme(theme) {
        try {
            localStorage.getItem('userData').settings.general.theme = theme;
        } catch (error) {
            return null;
        }
    }
};

export default UserData;
