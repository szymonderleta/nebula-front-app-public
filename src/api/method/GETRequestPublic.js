import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

/**
 * Sends a GET request to the specified URL with basic authentication headers.
 *
 * @param {string} url - The URL to which the GET request is sent.
 * @return {Promise<Object|boolean>} - Resolves with the parsed JSON response if successful,
 * or `false` if the response status is not OK. Returns `undefined` in case of an error.
 */
async function GETRequestPublic(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
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

export default GETRequestPublic;
