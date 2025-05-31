import POSTRequestForMultipart from './POSTRequestForMultipart';
import { APP_USERNAME, APP_PASSWORD } from '../../data/Credentials';

// Mock the credentials module
jest.mock('../../data/Credentials', () => ({
    APP_USERNAME: 'testuser',
    APP_PASSWORD: 'testpass',
}));

// Mock fetch, btoa, and console.error
global.fetch = jest.fn();
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));

describe('POSTRequestForMultipart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('should make a successful multipart POST request with credentials', async () => {
        const mockResponse = { ok: true };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/upload';
        const formData = new FormData();
        formData.append('file', new Blob(['test content'], { type: 'text/plain' }));

        const result = await POSTRequestForMultipart(url, formData);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Authorization': 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`),
            }),
            body: formData,
        });
        expect(result).toEqual({ success: true, data: mockResponse });
    });

    test('should handle HTTP error responses', async () => {
        const errorMessage = 'File too large';
        const mockResponse = {
            ok: false,
            status: 413,
            text: () => Promise.resolve(errorMessage),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const url = 'https://api.example.com/upload';
        const result = await POSTRequestForMultipart(url, new FormData());

        expect(result).toEqual({
            success: false,
            status: 413,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith(`Error: 413 - ${errorMessage}`);
    });

    test('should handle network errors', async () => {
        const errorMessage = 'Network failure';
        fetch.mockRejectedValueOnce(new Error(errorMessage));

        const url = 'https://api.example.com/upload';
        const result = await POSTRequestForMultipart(url, new FormData());

        expect(result).toEqual({
            success: false,
            message: errorMessage,
        });
        expect(console.error).toHaveBeenCalledWith('Error sending request:', expect.any(Error));
    });

    test('should include correct credentials configuration', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const url = 'https://api.example.com/upload';
        await POSTRequestForMultipart(url, new FormData());

        expect(fetch.mock.calls[0][1].credentials).toBe('include');
    });

    test('should include proper Basic Auth header', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const url = 'https://api.example.com/upload';
        await POSTRequestForMultipart(url, new FormData());

        const expectedAuth = 'Basic ' + btoa(`${APP_USERNAME}:${APP_PASSWORD}`);
        expect(fetch.mock.calls[0][1].headers.get('Authorization')).toBe(expectedAuth);
    });

    test('should not include Content-Type header for FormData', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const url = 'https://api.example.com/upload';
        await POSTRequestForMultipart(url, new FormData());

        const headers = fetch.mock.calls[0][1].headers;
        expect(headers.has('Content-Type')).toBe(false);
    });

    test('should handle empty FormData', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const url = 'https://api.example.com/upload';
        const result = await POSTRequestForMultipart(url, new FormData());

        expect(result.success).toBe(true);
    });
});
