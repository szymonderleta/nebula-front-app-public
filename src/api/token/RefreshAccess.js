import {APP_REQUEST_URL} from "../../data/Credentials";
import POSTRequestNoBody from "../method/POSTRequestNoBody";

async function RefreshAccess() {
    const url = APP_REQUEST_URL + '/token/refresh/access';
    return await POSTRequestNoBody(url);
}

export default RefreshAccess;
