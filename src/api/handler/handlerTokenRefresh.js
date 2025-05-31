import RefreshAccess from "../token/RefreshAccess";
import GETRequestOriginal from "../method/GETRequest";
import PATCHRequestOriginal from "../method/PATCHRequest";
import POSTRequestOriginal from "../method/POSTRequest";
import POSTRequestForMultipartOriginal from "../method/POSTRequestForMultipart";
import POSTRequestNoBodyOriginal from "../method/POSTRequestNoBody";
import PUTRequestOriginal from "../method/PUTRequest";

/**
 * Checks if the error is caused by an expired token.
 *
 * @param {Object} error - The error object containing HTTP response details.
 * @returns {boolean} - True if the token has expired, false otherwise.
 */
const isTokenExpired = (error) => error.status === 401 && error?.error === "TOKEN_EXPIRED";

/**
 * Executes a given request function and retries it after refreshing the token
 * if the token is expired.
 *
 * @param {Function} requestFunction - The function representing the request to be executed.
 * It should return a promise.
 * @return {Promise<*>} A promise that resolves with the result of the request function,
 * either immediately or after a token refresh, or rejects with an error if the request
 * fails for other reasons.
 */
async function executeWithTokenRefresh(requestFunction) {
    try {
        return await requestFunction();
    } catch (error) {
        if (isTokenExpired(error)) {
            await RefreshAccess();
            return await requestFunction();
        }
        throw error;
    }
}

/**
 * A collection of request implementation mappings for various HTTP methods.
 *
 * Each key represents an HTTP method or a specific type of request,
 * and the corresponding value is the implementation or handler for that method.
 *
 * @type {Object}
 */
const requestImplementations = {
    GET: GETRequestOriginal,
    PATCH: PATCHRequestOriginal,
    POST: POSTRequestOriginal,
    POST_MULTIPART: POSTRequestForMultipartOriginal,
    POST_NO_BODY: POSTRequestNoBodyOriginal,
    PUT: PUTRequestOriginal,
};

/**
 * A higher-order function that wraps a given request function with additional logic
 * to handle token refresh scenarios. This ensures that the provided request function
 * is executed with valid authentication tokens.
 *
 * @param {Function} requestFn - The request function to be wrapped. It is responsible
 * for making the actual HTTP request and is invoked with parameters such as the URL
 * and body data.
 * @returns {Function} - A wrapped version of the provided request function, which
 * accepts the same parameters (URL and bodyData) and handles token refresh before
 * executing the original function.
 */
const createRequestWrapper = (requestFn) => (url, bodyData) =>
    executeWithTokenRefresh(() => requestFn(url, bodyData));

/**
 * An object that aggregates wrapped versions of functions derived from the
 * `requestImplementations` object. Each function is processed using the
 * `createRequestWrapper` function and added to the `wrapped` object, keyed by
 * the HTTP method name.
 *
 * @type {Object.<string, Function>} An object where keys are HTTP methods
 * (e.g., GET, POST) and values are wrapped versions of the corresponding request functions.
 */
const wrapped = Object.entries(requestImplementations).reduce(
    (acc, [method, fn]) => ({
        ...acc,
        [method]: createRequestWrapper(fn), // Using the method (e.g., 'GET', 'POST') as the key
    }),
    {}
);

/**
 * Exporting the wrapped request functions individually for named imports.
 */
export const {
    GET: GETRequest,
    PATCH: PATCHRequest,
    POST: POSTRequest,
    POST_MULTIPART: POSTRequestForMultipart,
    POST_NO_BODY: POSTRequestNoBody,
    PUT: PUTRequest,
} = wrapped;
