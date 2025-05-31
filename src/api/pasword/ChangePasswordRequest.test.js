import ChangePasswordRequest from './ChangePasswordRequest';
import { POSTRequest } from '../handler/handlerTokenRefresh';

jest.mock('../../data/Credentials', () => ({
    APP_REQUEST_URL: 'https://api.example.com',
}));

jest.mock('../handler/handlerTokenRefresh', () => ({
    POSTRequest: jest.fn(),
}));

describe('ChangePasswordRequest', () => {
    const passwordData = {
        userId: 'user123',
        currentPassword: 'oldPass',
        newPassword: 'newPass',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage.getItem to return a JSON string with email
        Storage.prototype.getItem = jest.fn(() => JSON.stringify({ email: 'test@example.com' }));
    });

    test('should call POSTRequest with correct URL and formData', async () => {
        const mockResponse = { success: true };
        POSTRequest.mockResolvedValue(mockResponse);

        const result = await ChangePasswordRequest(passwordData);

        expect(localStorage.getItem).toHaveBeenCalledWith('userData');
        expect(POSTRequest).toHaveBeenCalledTimes(1);
        expect(POSTRequest).toHaveBeenCalledWith('https://api.example.com/account/change-password', {
            userId: passwordData.userId,
            email: 'test@example.com',
            actualPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });
        expect(result).toBe(mockResponse);
    });

    test('should propagate errors from POSTRequest', async () => {
        const error = new Error('Request failed');
        POSTRequest.mockRejectedValue(error);

        await expect(ChangePasswordRequest(passwordData)).rejects.toThrow('Request failed');
    });
});
