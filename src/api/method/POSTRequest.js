import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

/**
 * Sends a POST request to the specified URL with the provided body data and returns the response.
 * Includes basic authentication and JSON content type in the request headers.
 *
 * @param {string} url - The URL to which the POST request will be sent.
 * @param {Object} bodyData - The data to be included in the body of the POST request.
 * @return {Promise<Object>} A promise that resolves to an object containing the success status,
 *                           response data (if successful), or failure details such as status code and error message.
 */
async function POSTRequest(url, bodyData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: JSON.stringify(bodyData),
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

export default POSTRequest;
