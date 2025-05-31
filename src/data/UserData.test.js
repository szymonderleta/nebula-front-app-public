import UserData from './UserData';
import UserDataRequest from '../api/user/UserDataRequest';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
});

// Mock UserDataRequest
jest.mock('../api/user/UserDataRequest');

describe('UserData', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    describe('saveUserData', () => {
        it('should save user data to localStorage and return true', async () => {
            const data = { id: 1, name: 'John' };
            const result = await UserData.saveUserData(data);
            expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(data));
            expect(result).toBe(true);
        });

        it('should return false if localStorage.setItem throws', async () => {
            localStorage.setItem.mockImplementation(() => { throw new Error('fail'); });
            const result = await UserData.saveUserData({ id: 1 });
            expect(result).toBe(false);
        });
    });

    describe('loadUserData', () => {
        it('should parse and return user data', () => {
            const user = { id: 3 };
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(user));
            const result = UserData.loadUserData();
            expect(result).toEqual(user);
        });

        it('should return null if JSON parsing fails', () => {
            localStorage.getItem.mockReturnValueOnce('invalid json');
            const result = UserData.loadUserData();
            expect(result).toBeNull();
        });
    });

    describe('fetchUserData', () => {
        it('should fetch user data, save it and return true', async () => {
            const user = { id: 5 };
            UserDataRequest.mockResolvedValue(user);
            const saveSpy = jest.spyOn(UserData, 'saveUserData').mockResolvedValue(true);

            const result = await UserData.fetchUserData();

            expect(UserDataRequest).toHaveBeenCalled();
            expect(saveSpy).toHaveBeenCalledWith(user);
            expect(result).toBe(true);

            saveSpy.mockRestore();
        });

        it('should return null if UserDataRequest throws', async () => {
            UserDataRequest.mockRejectedValue(new Error('fail'));
            const result = await UserData.fetchUserData();
            expect(result).toBeNull();
        });
    });

    describe('clearUserData', () => {
        it('should remove userData from localStorage and return true', () => {
            const result = UserData.clearUserData();
            expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
            expect(result).toBe(true);
        });

        it('should return false if removeItem throws', () => {
            localStorage.removeItem.mockImplementation(() => { throw new Error('fail'); });
            const result = UserData.clearUserData();
            expect(result).toBe(false);
        });
    });

    describe('getUserId', () => {
        it('should return user id from localStorage', () => {
            const user = { id: 42 };
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(user));
            expect(UserData.getUserId()).toBe(42);
        });

        it('should return null if parsing fails or no userData', () => {
            localStorage.getItem.mockReturnValueOnce(null);
            expect(UserData.getUserId()).toBeNull();

            localStorage.getItem.mockReturnValueOnce('invalid json');
            expect(UserData.getUserId()).toBeNull();
        });
    });

    describe('getThemeName', () => {
        it('should return theme name if present', () => {
            const user = { settings: { general: { theme: { name: 'dark' } } } };
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(user));
            expect(UserData.getThemeName()).toBe('dark');
        });

        it('should return null if theme name or structure missing', () => {
            localStorage.getItem.mockReturnValueOnce(JSON.stringify({}));
            expect(UserData.getThemeName()).toBeNull();

            localStorage.getItem.mockReturnValueOnce('invalid json');
            expect(UserData.getThemeName()).toBeNull();
        });
    });

    describe('setTemporaryThemeDeprecated', () => {
        it('should handle error gracefully', () => {
            localStorage.getItem.mockReturnValueOnce(null);
            expect(UserData.setTemporaryThemeDeprecated('dark')).toBeNull();
        });
    });

    describe('setTemporaryTheme', () => {
        it('should update theme and save to localStorage', () => {
            const user = { settings: { general: { theme: { name: 'light' } } } };
            localStorage.getItem.mockReturnValueOnce(JSON.stringify(user));
            const result = UserData.setTemporaryTheme({ name: 'dark' });

            expect(result).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalled();

            // Verify that stored userData has the updated theme
            const storedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
            expect(storedData.settings.general.theme).toEqual({ name: 'dark' });
        });

        it('should return null if no userData in localStorage', () => {
            localStorage.getItem.mockReturnValueOnce(null);
            expect(UserData.setTemporaryTheme({ name: 'dark' })).toBeNull();
        });

        it('should return null on JSON parsing error', () => {
            localStorage.getItem.mockReturnValueOnce('invalid json');
            expect(UserData.setTemporaryTheme({ name: 'dark' })).toBeNull();
        });
    });
});
