import * as handlers from './handlerTokenRefresh';
import RefreshAccess from "../token/RefreshAccess";
import GETRequestOriginal from "../method/GETRequest";
import POSTRequestOriginal from "../method/POSTRequest";
import PATCHRequestOriginal from "../method/PATCHRequest";
import PUTRequestOriginal from "../method/PUTRequest";
import POSTRequestForMultipartOriginal from "../method/POSTRequestForMultipart";
import POSTRequestNoBodyOriginal from "../method/POSTRequestNoBody";

jest.mock('../token/RefreshAccess');
jest.mock('../method/GETRequest');
jest.mock('../method/POSTRequest');
jest.mock('../method/PATCHRequest');
jest.mock('../method/PUTRequest');
jest.mock('../method/POSTRequestForMultipart');
jest.mock('../method/POSTRequestNoBody');

describe('Handler Token Refresh', () => {
    const testUrl = 'http://api.example.com/test';
    const testBody = {data: 'test'};
    const successResponse = {status: 200, data: 'success'};
    const tokenExpiredError = {
        status: 401,
        error: 'TOKEN_EXPIRED'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GETRequest', () => {
        it('should execute GET request successfully', async () => {
            GETRequestOriginal.mockResolvedValueOnce(successResponse);

            const result = await handlers.GETRequest(testUrl);

            expect(GETRequestOriginal.mock.calls[0][0]).toBe(testUrl);
            expect(result).toEqual(successResponse);
            expect(RefreshAccess).not.toHaveBeenCalled();
        });

        it('should handle token expiration and retry request', async () => {
            GETRequestOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockResolvedValueOnce(successResponse);

            RefreshAccess.mockResolvedValueOnce();

            const result = await handlers.GETRequest(testUrl);

            expect(GETRequestOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
            expect(result).toEqual(successResponse);
        });

        it('should propagate error if not TOKEN_EXPIRED', async () => {
            const error = new Error('Network error');
            GETRequestOriginal.mockRejectedValueOnce(error);

            await expect(handlers.GETRequest(testUrl))
                .rejects.toThrow('Network error');
            expect(RefreshAccess).not.toHaveBeenCalled();
        });
    });

    describe('POSTRequest', () => {
        it('should execute POST request successfully', async () => {
            POSTRequestOriginal.mockResolvedValueOnce(successResponse);

            const result = await handlers.POSTRequest(testUrl, testBody);

            expect(POSTRequestOriginal).toHaveBeenCalledWith(testUrl, testBody);
            expect(result).toEqual(successResponse);
        });

        it('should handle token expiration for POST', async () => {
            POSTRequestOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockResolvedValueOnce(successResponse);

            RefreshAccess.mockResolvedValueOnce();

            const result = await handlers.POSTRequest(testUrl, testBody);

            expect(POSTRequestOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
            expect(result).toEqual(successResponse);
        });
    });

    describe('PATCHRequest', () => {
        it('should execute PATCH request successfully', async () => {
            PATCHRequestOriginal.mockResolvedValueOnce(successResponse);

            const result = await handlers.PATCHRequest(testUrl, testBody);

            expect(PATCHRequestOriginal).toHaveBeenCalledWith(testUrl, testBody);
            expect(result).toEqual(successResponse);
        });

        it('should handle token expiration for PATCH', async () => {
            PATCHRequestOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockResolvedValueOnce(successResponse);

            RefreshAccess.mockResolvedValueOnce();

            const result = await handlers.PATCHRequest(testUrl, testBody);

            expect(PATCHRequestOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
            expect(result).toEqual(successResponse);
        });
    });

    describe('PUTRequest', () => {
        it('should execute PUT request successfully', async () => {
            PUTRequestOriginal.mockResolvedValueOnce(successResponse);

            const result = await handlers.PUTRequest(testUrl, testBody);

            expect(PUTRequestOriginal).toHaveBeenCalledWith(testUrl, testBody);
            expect(result).toEqual(successResponse);
        });

        it('should handle token expiration for PUT', async () => {
            PUTRequestOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockResolvedValueOnce(successResponse);

            RefreshAccess.mockResolvedValueOnce();

            const result = await handlers.PUTRequest(testUrl, testBody);

            expect(PUTRequestOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
            expect(result).toEqual(successResponse);
        });
    });

    describe('POSTRequestForMultipart', () => {
        const formData = new FormData();
        formData.append('file', new Blob(['test']), 'documentation.txt');

        it('should execute multipart request successfully', async () => {
            POSTRequestForMultipartOriginal.mockResolvedValueOnce(successResponse);

            const result = await handlers.POSTRequestForMultipart(testUrl, formData);

            expect(POSTRequestForMultipartOriginal).toHaveBeenCalledWith(testUrl, formData);
            expect(result).toEqual(successResponse);
        });

        it('should handle token expiration for multipart', async () => {
            POSTRequestForMultipartOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockResolvedValueOnce(successResponse);

            RefreshAccess.mockResolvedValueOnce();

            const result = await handlers.POSTRequestForMultipart(testUrl, formData);

            expect(POSTRequestForMultipartOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
            expect(result).toEqual(successResponse);
        });
    });

    describe('POSTRequestNoBody', () => {
        it('should execute POST request without body successfully', async () => {
            POSTRequestNoBodyOriginal.mockResolvedValueOnce(successResponse);

            const result = await handlers.POSTRequestNoBody(testUrl);

            expect(POSTRequestNoBodyOriginal.mock.calls[0][0]).toBe(testUrl);
            expect(result).toEqual(successResponse);
        });

        it('should handle token expiration for POST without body', async () => {
            POSTRequestNoBodyOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockResolvedValueOnce(successResponse);

            RefreshAccess.mockResolvedValueOnce();

            const result = await handlers.POSTRequestNoBody(testUrl);

            expect(POSTRequestNoBodyOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
            expect(result).toEqual(successResponse);
        });
    });

    describe('Token refresh error handling', () => {
        it('should propagate error when token refresh fails', async () => {
            const refreshError = new Error('Refresh failed');
            GETRequestOriginal.mockRejectedValueOnce(tokenExpiredError);
            RefreshAccess.mockRejectedValueOnce(refreshError);

            await expect(handlers.GETRequest(testUrl))
                .rejects.toThrow('Refresh failed');
            expect(GETRequestOriginal).toHaveBeenCalledTimes(1);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
        });

        it('should handle token expiration after refresh', async () => {
            GETRequestOriginal
                .mockRejectedValueOnce(tokenExpiredError)
                .mockRejectedValueOnce(tokenExpiredError);

            RefreshAccess.mockResolvedValueOnce();

            await expect(handlers.GETRequest(testUrl))
                .rejects.toEqual(tokenExpiredError);
            expect(GETRequestOriginal).toHaveBeenCalledTimes(2);
            expect(RefreshAccess).toHaveBeenCalledTimes(1);
        });
    });
});
