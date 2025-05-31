import RefreshAccess from './RefreshAccess';
import POSTRequestNoBody from '../method/POSTRequestNoBody';

jest.mock('../../data/Credentials', () => ({
    APP_REQUEST_URL: 'https://api.example.com',
}));

jest.mock('../method/POSTRequestNoBody');

describe('RefreshAccess', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call POSTRequestNoBody with correct URL', async () => {
        const mockResponse = { success: true, token: 'newaccesstoken' };
        POSTRequestNoBody.mockResolvedValue(mockResponse);

        const result = await RefreshAccess();

        expect(POSTRequestNoBody).toHaveBeenCalledTimes(1);
        expect(POSTRequestNoBody).toHaveBeenCalledWith('https://api.example.com/token/refresh/access');
        expect(result).toBe(mockResponse);
    });

    test('should propagate errors from POSTRequestNoBody', async () => {
        const error = new Error('Network error');
        POSTRequestNoBody.mockRejectedValue(error);

        await expect(RefreshAccess()).rejects.toThrow('Network error');
    });
});
