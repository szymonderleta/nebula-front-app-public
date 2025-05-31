import ResetPasswordRequest from './ResetPasswordRequest';
import POSTRequestNoBodyPublic from '../method/POSTRequestNoBodyPublic';

jest.mock('../../data/Credentials', () => ({
    APP_REQUEST_URL: 'https://api.example.com',
}));

jest.mock('../method/POSTRequestNoBodyPublic');

describe('ResetPasswordRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call POSTRequestNoBodyPublic with correct URL', async () => {
        const email = 'user@example.com';
        const mockResponse = { success: true };
        POSTRequestNoBodyPublic.mockResolvedValue(mockResponse);

        const result = await ResetPasswordRequest(email);

        expect(POSTRequestNoBodyPublic).toHaveBeenCalledTimes(1);
        expect(POSTRequestNoBodyPublic).toHaveBeenCalledWith(`https://api.example.com/account/reset-password/${email}`);
        expect(result).toBe(mockResponse);
    });

    test('should propagate errors from POSTRequestNoBodyPublic', async () => {
        const email = 'user@example.com';
        const error = new Error('Network error');
        POSTRequestNoBodyPublic.mockRejectedValue(error);

        await expect(ResetPasswordRequest(email)).rejects.toThrow('Network error');
    });
});
