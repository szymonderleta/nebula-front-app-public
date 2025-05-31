import RegistrationRequest from './RegistrationRequest';
import POSTRequestPublic from '../method/POSTRequestPublic';
import { APP_REQUEST_URL } from '../../data/Credentials';

jest.mock('../method/POSTRequestPublic');

describe('RegistrationRequest', () => {
    const userData = { username: 'testuser', email: 'test@example.com', password: '123456' };
    const url = APP_REQUEST_URL + '/account/register';

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls POSTRequestPublic with correct url and userData', async () => {
        const mockResponse = { success: true, id: 1 };
        POSTRequestPublic.mockResolvedValue(mockResponse);

        const result = await RegistrationRequest(userData);

        expect(POSTRequestPublic).toHaveBeenCalledTimes(1);
        expect(POSTRequestPublic).toHaveBeenCalledWith(url, userData);
        expect(result).toEqual(mockResponse);
    });

    test('throws error if POSTRequestPublic rejects', async () => {
        const error = new Error('Registration failed');
        POSTRequestPublic.mockRejectedValue(error);

        await expect(RegistrationRequest(userData)).rejects.toThrow('Registration failed');
        expect(POSTRequestPublic).toHaveBeenCalledWith(url, userData);
    });
});
