import {APP_REQUEST_URL} from '../../data/Credentials';
import {POSTRequest} from "../handler/handlerTokenRefresh";

async function LoginUserRequest(loginData) {
    const url = `${APP_REQUEST_URL}/account/token`;
    return POSTRequest(url, loginData)
}

export default LoginUserRequest;
