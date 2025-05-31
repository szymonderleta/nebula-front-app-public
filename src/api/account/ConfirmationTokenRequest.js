import {APP_REQUEST_URL} from '../../data/Credentials';
import PATCHRequestPublic from "../method/PATCHRequestPublic";

async function ConfirmationTokenRequest(tokenData) {
    const url = APP_REQUEST_URL + '/account/confirm';
    return await PATCHRequestPublic(url, tokenData);
}

export default ConfirmationTokenRequest;
