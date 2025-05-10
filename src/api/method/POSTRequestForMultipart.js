import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

async function POSTRequestForMultipart(url, bodyData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: bodyData,
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error: ${response.status} - ${errorMessage}`);
            return {success: false, status: response.status, message: errorMessage};
        }
        const data = await response;
        return {success: true, data};
    } catch (error) {
        console.error('Error sending request:', error);
        return {success: false, message: error.message};
    }
}

export default POSTRequestForMultipart;
