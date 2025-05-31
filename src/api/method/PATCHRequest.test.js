import PATCHRequest from './PATCHRequest';
import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

// Mock the credentials module
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

// Mock fetch and btoa
global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));

describe('PATCHRequest', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        // Mock console.error to keep test output clean
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterEach(() => {
        // Restore console.error
        console.error.mockRestore();
    });

    test('should make a successful PATCH request with credentials', async () => {
        const mockData = {id: 1, name: 'Updated Resource'};
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const url = 'https://api.example.com/resource/1';
        const bodyData = {name: 'Updated Name'};
        const result = await PATCHRequest(url, bodyData);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'PATCH',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: JSON.stringify(bodyData),
        });
        expect(result).toEqual({success: true, data: mockData});
    });

    test('should handle HTTP error responses', async () => {
        const errorMessage = 'Resource not found';
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: () => Promise.resolve(errorMessage),
        });

        const url = 'https://api.example.com/resource/999';
        const result = await PATCHRequest(url, {});

        expect(result).toEqual({
            success: false,
            status: 404,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith(`Error: 404 - ${errorMessage}`);
    });

    test('should handle network errors', async () => {
        const errorMessage = 'Network failure';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const url = 'https://api.example.com/resource/1';
        const result = await PATCHRequest(url, {});

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

        const url = 'https://api.example.com/resource/1';
        await PATCHRequest(url, {});

        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(fetch.mock.calls[0][1].headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should include credentials: include in fetch options', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const url = 'https://api.example.com/resource/1';
        await PATCHRequest(url, {});

        expect(fetch.mock.calls[0][1].credentials).toBe('include');
    });

    test('should handle JSON parsing errors', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON')),
        });

        const url = 'https://api.example.com/resource/1';
        const result = await PATCHRequest(url, {});

        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid JSON');
    });
});
