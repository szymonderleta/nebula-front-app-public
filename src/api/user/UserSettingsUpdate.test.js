import UserSettingsUpdate from './UserSettingsUpdate';
import PUTRequest from '../method/PUTRequest';

jest.mock('../method/PUTRequest');

jest.mock('../../data/Credentials', () => ({
    APP_REQUEST_URL: 'https://api.example.com',
}));

describe('UserSettingsUpdate', () => {
    const generalSettings = {
        userId: 'user123',
        theme: { id: 'dark', name: 'Dark Mode' }
    };
    const soundSettings = {
        userId: 'user123',
        muted: false,
        battleCry: true,
        volumeMaster: 80,
        volumeMusic: 70,
        volumeEffects: 60,
        volumeVoices: 50,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call PUTRequest with correct URL and formData', async () => {
        const mockResponse = { success: true };
        PUTRequest.mockResolvedValue(mockResponse);

        const result = await UserSettingsUpdate(generalSettings, soundSettings);

        expect(PUTRequest).toHaveBeenCalledTimes(1);

        const expectedUrl = 'https://api.example.com/users/settings';
        expect(PUTRequest).toHaveBeenCalledWith(expectedUrl, {
            userId: generalSettings.userId,
            general: {
                userId: generalSettings.userId,
                theme: {
                    id: generalSettings.theme.id,
                    name: generalSettings.theme.name,
                },
            },
            sound: {
                userId: soundSettings.userId,
                muted: soundSettings.muted,
                battleCry: soundSettings.battleCry,
                volumeMaster: soundSettings.volumeMaster,
                volumeMusic: soundSettings.volumeMusic,
                volumeEffects: soundSettings.volumeEffects,
                volumeVoices: soundSettings.volumeVoices,
            }
        });

        expect(result).toBe(mockResponse);
    });

    test('should propagate errors from PUTRequest', async () => {
        const error = new Error('Request failed');
        PUTRequest.mockRejectedValue(error);

        await expect(UserSettingsUpdate(generalSettings, soundSettings)).rejects.toThrow('Request failed');
    });
});
