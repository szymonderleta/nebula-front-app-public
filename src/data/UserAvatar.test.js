import UserAvatar from './UserAvatar';
import UserData from './UserData';
import defaultProfileImage from '../resource/default/profile.png';

jest.mock('./UserData', () => ({
    getUserId: jest.fn(),
}));

describe('UserAvatar Module', () => {
    let originalConsoleError;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        global.fetch = jest.fn();

        global.FileReader = jest.fn(() => {
            return {
                result: null,
                onloadend: null,
                onerror: null,
                readAsDataURL(blob) {
                    this.result = 'data:image/jpeg;base64,mockedBase64Data';
                    setTimeout(() => {
                        if (this.onloadend) this.onloadend();
                    }, 0);
                }
            };
        });

        originalConsoleError = console.error;
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    describe('getUserAvatar', () => {
        test('returns avatar from localStorage if exists', async () => {
            const mockAvatar = 'data:image/png;base64,fakeavatar';
            localStorage.setItem('userAvatar', mockAvatar);
            const result = await UserAvatar.getUserAvatar();
            expect(result).toBe(mockAvatar);
        });

        test('returns default avatar if none is stored', async () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            const result = await UserAvatar.getUserAvatar();
            expect(result).toBe(defaultProfileImage);
            warnSpy.mockRestore();
        });

        test('returns null if localStorage throws error', async () => {
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('localStorage error');
            });
            const result = await UserAvatar.getUserAvatar();
            expect(result).toBeNull();
        });
    });

    describe('fetchAndSaveUserAvatar', () => {
        test('returns false if userId is invalid', async () => {
            const result = await UserAvatar.fetchAndSaveUserAvatar(null);
            expect(result).toBe(false);
        });

        test('stores avatar in localStorage if fetch succeeds', async () => {
            const mockBlob = new Blob(['fake image data'], {type: 'image/jpeg'});
            fetch.mockResolvedValueOnce({
                ok: true,
                blob: () => Promise.resolve(mockBlob),
            });

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            const result = await UserAvatar.fetchAndSaveUserAvatar('123');
            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(result).toBe(true);
            expect(setItemSpy).toHaveBeenCalledWith('userAvatar', 'data:image/jpeg;base64,mockedBase64Data');
            setItemSpy.mockRestore();
        });

        test('sets default avatar and returns false if fetch fails', async () => {
            fetch.mockRejectedValueOnce(new Error('Fetch error'));
            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            const result = await UserAvatar.fetchAndSaveUserAvatar('123');
            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(result).toBe(false);
            expect(setItemSpy).toHaveBeenCalledWith('userAvatar', defaultProfileImage);
            setItemSpy.mockRestore();
        });
    });

    describe('updateAvatar', () => {
        test('returns true if avatar update succeeds', async () => {
            UserData.getUserId.mockReturnValue('123');
            fetch.mockResolvedValueOnce({
                ok: true,
                blob: () => Promise.resolve(new Blob(['data'], {type: 'image/jpeg'})),
            });
            const result = await UserAvatar.updateAvatar();
            expect(result).toBe(true);
        });

        test('returns false if fetchAndSaveUserAvatar fails', async () => {
            UserData.getUserId.mockReturnValue('123');
            fetch.mockRejectedValueOnce(new Error('error'));
            const result = await UserAvatar.updateAvatar();
            expect(result).toBe(false);
        });
    });
});
