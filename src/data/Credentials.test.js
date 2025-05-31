describe('Environment variable configuration', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // Clear cache
        process.env = { ...ORIGINAL_ENV }; // Reset env to original
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
    });

    test('loads all required environment variables', () => {
        process.env.REACT_APP_REQUEST_URL = 'https://api.example.com';
        process.env.REACT_APP_USERNAME = 'user';
        process.env.REACT_APP_PASSWORD = 'pass';

        const {
            APP_REQUEST_URL,
            APP_USERNAME,
            APP_PASSWORD
        } = require('./Credentials');

        expect(APP_REQUEST_URL).toBe('https://api.example.com');
        expect(APP_USERNAME).toBe('user');
        expect(APP_PASSWORD).toBe('pass');
    });

    test('logs error if environment variables are missing', () => {
        delete process.env.REACT_APP_REQUEST_URL;
        delete process.env.REACT_APP_USERNAME;
        delete process.env.REACT_APP_PASSWORD;

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        require('./Credentials');

        expect(consoleSpy).toHaveBeenCalledWith('Some environment variables are not set!');

        consoleSpy.mockRestore();
    });
});
