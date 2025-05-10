import {APP_REQUEST_URL} from '../../data/Credentials';
import POSTRequestPublic from "../method/POSTRequestPublic";

async function RegistrationRequest(userData) {
    const url = APP_REQUEST_URL + '/account/register';
    return await POSTRequestPublic(url, userData);
}

export default RegistrationRequest;
