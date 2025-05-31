import GETRequestPublic from './GETRequestPublic';
import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

// Mock the credentials module
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

// Mock fetch, btoa, and alert
global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));
global.alert = jest.fn();

describe('GETRequestPublic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('should make a successful GET request with basic auth', async () => {
        const mockData = {id: 1, name: 'Test Resource'};
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const url = 'https://api.example.com/resource/1';
        const result = await GETRequestPublic(url);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
        });
        expect(result).toEqual(mockData);
    });

    test('should return false for non-OK responses and show alert', async () => {
        const mockResponse = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/resource/999';
        const result = await GETRequestPublic(url);

        expect(result).toBe(false);
        expect(alert).toHaveBeenCalledWith(mockResponse);
    });

    test('should return undefined and log error when request fails', async () => {
        const errorMessage = 'Network Error';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const url = 'https://api.example.com/resource/1';
        const result = await GETRequestPublic(url);

        expect(result).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('Error sending request:', expect.any(Error));
    });

    test('should include correct Basic Auth header', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/resource/1';
        await GETRequestPublic(url);

        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(fetch.mock.calls[0][1].headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should handle JSON parsing errors', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON')),
        });

        const url = 'https://api.example.com/resource/1';
        const result = await GETRequestPublic(url);

        expect(result).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('Error sending request:', expect.any(Error));
    });
});
