import UserDataRequest from './UserDataRequest';
import { GETRequest } from '../handler/handlerTokenRefresh';

jest.mock('../../data/Credentials', () => ({
    APP_REQUEST_URL: 'https://api.example.com',
}));

jest.mock('../handler/handlerTokenRefresh', () => ({
    GETRequest: jest.fn(),
}));

describe('UserDataRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call GETRequest with the correct URL', async () => {
        const mockResponse = { success: true, data: [{ id: 1, name: 'John Doe' }] };
        GETRequest.mockResolvedValue(mockResponse);

        const result = await UserDataRequest();

        expect(GETRequest).toHaveBeenCalledTimes(1);
        expect(GETRequest).toHaveBeenCalledWith('https://api.example.com/users');
        expect(result).toBe(mockResponse);
    });

    test('should propagate errors from GETRequest', async () => {
        const error = new Error('Network error');
        GETRequest.mockRejectedValue(error);

        await expect(UserDataRequest()).rejects.toThrow('Network error');
    });
});
