import {APP_REQUEST_URL} from '../../data/Credentials';
import {GETRequest} from "../handler/handlerTokenRefresh";

async function UserDataRequest() {
    const url = APP_REQUEST_URL + '/users';
    return GETRequest(url);
}

export default UserDataRequest;
