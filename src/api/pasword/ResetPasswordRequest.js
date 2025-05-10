import {APP_REQUEST_URL} from '../../data/Credentials';
import POSTRequestNoBodyPublic from "../method/POSTRequestNoBodyPublic";

async function ResetPasswordRequest(email) {
    const url = APP_REQUEST_URL + '/account/reset-password/' + email;
    return POSTRequestNoBodyPublic(url);
}

export default ResetPasswordRequest;
