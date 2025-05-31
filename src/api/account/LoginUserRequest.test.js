import LoginUserRequest from './LoginUserRequest';
import { POSTRequest } from '../handler/handlerTokenRefresh';
import { APP_REQUEST_URL } from '../../data/Credentials';

jest.mock('../handler/handlerTokenRefresh');

describe('LoginUserRequest', () => {
    const loginData = { username: 'user1', password: 'pass123' };
    const url = `${APP_REQUEST_URL}/account/token`;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls POSTRequest with correct url and loginData', async () => {
        const mockResponse = { token: 'abc123' };
        POSTRequest.mockResolvedValue(mockResponse);

        const result = await LoginUserRequest(loginData);

        expect(POSTRequest).toHaveBeenCalledTimes(1);
        expect(POSTRequest).toHaveBeenCalledWith(url, loginData);
        expect(result).toEqual(mockResponse);
    });

    test('throws error if POSTRequest rejects', async () => {
        const error = new Error('Invalid credentials');
        POSTRequest.mockRejectedValue(error);

        await expect(LoginUserRequest(loginData)).rejects.toThrow('Invalid credentials');
        expect(POSTRequest).toHaveBeenCalledWith(url, loginData);
    });
});
