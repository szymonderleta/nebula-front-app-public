import {APP_REQUEST_URL} from '../../data/Credentials';
import POSTRequest from "../method/POSTRequest";

async function ChangePasswordRequest(passwordData) {
    const url = APP_REQUEST_URL + '/account/change-password';
    const userData = JSON.parse(localStorage.getItem('userData'));
    const formData = await createFormData(passwordData, userData.email);
    return POSTRequest(url, formData);
}

async function createFormData(passwordData, email) {
    return {
        userId: passwordData.userId,
        email: email,
        actualPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
    };
}

export default ChangePasswordRequest;
