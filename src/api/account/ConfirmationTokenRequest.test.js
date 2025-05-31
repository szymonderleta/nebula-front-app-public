import ConfirmationTokenRequest from './ConfirmationTokenRequest';
import PATCHRequestPublic from '../method/PATCHRequestPublic';
import { APP_REQUEST_URL } from '../../data/Credentials';

jest.mock('../method/PATCHRequestPublic');

describe('ConfirmationTokenRequest', () => {
    const tokenData = { token: 'abc123' };
    const url = APP_REQUEST_URL + '/account/confirm';

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls PATCHRequestPublic with correct url and tokenData', async () => {
        PATCHRequestPublic.mockResolvedValue({ success: true });

        const result = await ConfirmationTokenRequest(tokenData);

        expect(PATCHRequestPublic).toHaveBeenCalledTimes(1);
        expect(PATCHRequestPublic).toHaveBeenCalledWith(url, tokenData);
        expect(result).toEqual({ success: true });
    });

    test('throws error if PATCHRequestPublic rejects', async () => {
        const error = new Error('Network error');
        PATCHRequestPublic.mockRejectedValue(error);

        await expect(ConfirmationTokenRequest(tokenData)).rejects.toThrow('Network error');
        expect(PATCHRequestPublic).toHaveBeenCalledWith(url, tokenData);
    });
});
