import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

/**
 * Sends a GET request to the specified URL with credentials included.
 * The request uses Basic Authentication and expects a JSON response.
 *
 * @param {string} url - The URL to which the GET request will be sent.
 * @return {Promise<Object|boolean>} A promise that resolves to the parsed JSON response if the request succeeds,
 *                                   or `false` if the server response is not OK.
 */
async function GETRequest(url) {
    try {

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`)
            }),
        });
        if (!response.ok) {
            alert(response);
            return false;
        }
        return await response.json();
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

export default GETRequest;
