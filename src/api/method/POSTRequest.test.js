import POSTRequest from './POSTRequest';
import { APP_USERNAME, APP_PASSWORD } from '../../data/Credentials';

// Mock the credentials module
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

// Mock fetch, btoa, and console.error
global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));

describe('POSTRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('should make a successful POST request with credentials and auth header', async () => {
        const mockData = { id: 1, name: 'New Resource' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const url = 'https://api.example.com/resources';
        const bodyData = { name: 'New Item' };
        const result = await POSTRequest(url, bodyData);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: JSON.stringify(bodyData),
        });
        expect(result).toEqual({ success: true, data: mockData });
    });

    test('should handle HTTP error responses', async () => {
        const errorMessage = 'Validation failed';
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            text: () => Promise.resolve(errorMessage),
        });

        const url = 'https://api.example.com/resources';
        const bodyData = { name: '' }; // Invalid data
        const result = await POSTRequest(url, bodyData);

        expect(result).toEqual({
            success: false,
            status: 400,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith(`Error: 400 - ${errorMessage}`);
    });

    test('should handle network errors', async () => {
        const errorMessage = 'Network failure';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const url = 'https://api.example.com/resources';
        const result = await POSTRequest(url, {});

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith('Error sending request:', expect.any(Error));
    });

    test('should include correct credentials configuration', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/resources';
        await POSTRequest(url, {});

        expect(fetch.mock.calls[0][1].credentials).toBe('include');
    });

    test('should include proper Basic Auth header', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/resources';
        await POSTRequest(url, {});

        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(fetch.mock.calls[0][1].headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should handle empty body data', async () => {
        const mockData = { id: 1 };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const url = 'https://api.example.com/resources';
        const result = await POSTRequest(url, {});

        expect(result).toEqual({ success: true, data: mockData });
        expect(fetch.mock.calls[0][1].body).toBe('{}');
    });

    test('should handle JSON parsing errors', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON')),
        });

        const url = 'https://api.example.com/resources';
        const result = await POSTRequest(url, {});

        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid JSON');
    });
});
