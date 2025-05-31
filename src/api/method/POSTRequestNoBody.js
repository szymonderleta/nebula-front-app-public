import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';


/**
 * Sends an HTTP POST request to the specified URL with predefined headers and credentials.
 * Handles response parsing and error handling.
 *
 * @param {string} url - The URL to which the POST request will be sent.
 * @return {Promise<Object>} A promise that resolves to an object containing the success status,
 *                           response data if successful, or an error message if the request fails.
 */
async function POSTRequestNoBody(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error: ${response.status} - ${errorMessage}`);
            return {success: false, status: response.status, message: errorMessage};
        }
        const data = await response.json();
        return {success: true, data};
    } catch (error) {
        console.error('Error sending request:', error);
        return {success: false, message: error.message};
    }
}

export default POSTRequestNoBody;
