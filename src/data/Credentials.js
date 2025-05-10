/**
 * Secure application data using environment variables
 */
export const APP_REQUEST_URL = process.env.REACT_APP_REQUEST_URL;
export const APP_USERNAME = process.env.REACT_APP_USERNAME;
export const APP_PASSWORD = process.env.REACT_APP_PASSWORD;

if (!APP_REQUEST_URL || !APP_USERNAME || !APP_PASSWORD) {
    console.error('Some environment variables are not set!');
}
