import POSTRequestPublic from './POSTRequestPublic';
import { APP_USERNAME, APP_PASSWORD } from '../../data/Credentials';

// Mock credentials
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));

describe('POSTRequestPublic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('should make a successful POST request with body data and return response data', async () => {
        const mockData = { message: 'Created' };
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve(mockData),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/create';
        const bodyData = { name: 'Test' };
        const result = await POSTRequestPublic(url, bodyData);

        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: JSON.stringify(bodyData),
        });
        expect(result).toEqual({ success: true, data: mockData });
    });

    test('should handle HTTP error responses and return error message and status', async () => {
        const errorMessage = 'Invalid input';
        const mockResponse = {
            ok: false,
            status: 400,
            text: () => Promise.resolve(errorMessage),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/create';
        const bodyData = { name: '' };
        const result = await POSTRequestPublic(url, bodyData);

        expect(result).toEqual({
            success: false,
            status: 400,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith(`Error: 400 - ${errorMessage}`);
    });

    test('should handle network errors gracefully', async () => {
        const errorMessage = 'Network error';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const url = 'https://api.example.com/create';
        const bodyData = { name: 'Test' };
        const result = await POSTRequestPublic(url, bodyData);

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith('Error sending request:', expect.any(Error));
    });

    test('should include correct Basic Auth header', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/create';
        const bodyData = { name: 'Test' };
        await POSTRequestPublic(url, bodyData);

        const headers = fetch.mock.calls[0][1].headers;
        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should include Content-Type as application/json', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/create';
        const bodyData = { test: 'value' };
        await POSTRequestPublic(url, bodyData);

        const headers = fetch.mock.calls[0][1].headers;
        expect(headers.get('Content-Type')).toBe('application/json');
    });

    test('should stringify the body data correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/create';
        const bodyData = { user: 'abc', age: 30 };
        await POSTRequestPublic(url, bodyData);

        const body = fetch.mock.calls[0][1].body;
        expect(body).toBe(JSON.stringify(bodyData));
    });
});
