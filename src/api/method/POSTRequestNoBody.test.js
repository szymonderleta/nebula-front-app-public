import POSTRequestNoBody from './POSTRequestNoBody';
import { APP_USERNAME, APP_PASSWORD } from '../../data/Credentials';

// Mock credentials
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));

describe('POSTRequestNoBody', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('should make a successful POST request without a body and return data', async () => {
        const mockData = { success: true };
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve(mockData),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/endpoint';
        const result = await POSTRequestNoBody(url);

        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
        });
        expect(result).toEqual({ success: true, data: mockData });
    });

    test('should handle HTTP error responses and return error message and status', async () => {
        const errorMessage = 'Unauthorized';
        const mockResponse = {
            ok: false,
            status: 401,
            text: () => Promise.resolve(errorMessage),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/endpoint';
        const result = await POSTRequestNoBody(url);

        expect(result).toEqual({
            success: false,
            status: 401,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith(`Error: 401 - ${errorMessage}`);
    });

    test('should handle network errors gracefully', async () => {
        const errorMessage = 'Network failure';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const url = 'https://api.example.com/endpoint';
        const result = await POSTRequestNoBody(url);

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith('Error sending request:', expect.any(Error));
    });

    test('should include credentials: include in the request options', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/endpoint';
        await POSTRequestNoBody(url);

        expect(fetch.mock.calls[0][1].credentials).toBe('include');
    });

    test('should include proper Basic Auth header', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/endpoint';
        await POSTRequestNoBody(url);

        const headers = fetch.mock.calls[0][1].headers;
        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should set Content-Type to application/json', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/endpoint';
        await POSTRequestNoBody(url);

        const headers = fetch.mock.calls[0][1].headers;
        expect(headers.get('Content-Type')).toBe('application/json');
    });
});
