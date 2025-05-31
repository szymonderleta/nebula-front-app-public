import PATCHRequestPublic from './PATCHRequestPublic';
import {APP_PASSWORD, APP_USERNAME} from '../../data/Credentials';

// Mock the credentials module
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

// Mock btoa
global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));
global.alert = jest.fn();

describe('PATCHRequestPublic', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterEach(() => {
        console.error.mockRestore();
    })

    test('should make a successful PATCH request', async () => {
        const mockResponse = {success: true, data: {id: 1}};
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse.data),
        });
        global.fetch = mockFetch;

        const url = 'https://api.example.com/resource/1';
        const bodyData = {name: 'Updated Name'};
        const result = await PATCHRequestPublic(url, bodyData);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'PATCH',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: JSON.stringify(bodyData),
        });
        expect(btoa).toHaveBeenCalledWith(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(result).toEqual({success: true, data: mockResponse.data});
    });

    test('should handle non-ok responses', async () => {
        const errorMessage = 'Resource not found';
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: jest.fn().mockResolvedValueOnce(errorMessage),
        });
        global.fetch = mockFetch;

        const url = 'https://api.example.com/resource/999';
        const bodyData = {name: 'Updated Name'};
        const result = await PATCHRequestPublic(url, bodyData);

        expect(result).toEqual({
            success: false,
            status: 404,
            message: errorMessage,
        });
    });

    test('should handle network errors', async () => {
        const errorMessage = 'Network error';
        const mockFetch = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
        global.fetch = mockFetch;

        const url = 'https://api.example.com/resource/1';
        const bodyData = {name: 'Updated Name'};
        const result = await PATCHRequestPublic(url, bodyData);

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
    });

    test('should include correct Basic Auth header', async () => {
        const mockResponse = {success: true, data: {id: 1}};
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse.data),
        });
        global.fetch = mockFetch;

        const url = 'https://api.example.com/resource/1';
        const bodyData = {name: 'Updated Name'};
        await PATCHRequestPublic(url, bodyData);

        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(mockFetch.mock.calls[0][1].headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should handle JSON parsing errors', async () => {
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
        });
        global.fetch = mockFetch;

        const url = 'https://api.example.com/resource/1';
        const bodyData = {name: 'Updated Name'};
        const result = await PATCHRequestPublic(url, bodyData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid JSON');
    });
});
