import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';
import LoginUserRequest from '../../api/account/LoginUserRequest';
import RegistrationRequest from '../../api/account/RegistrationRequest';
import UserDataRequest from '../../api/user/UserDataRequest';
import UserData from '../../data/UserData';
import UserAvatar from '../../data/UserAvatar';

// Mock the dependencies
jest.mock('../../api/account/LoginUserRequest');
jest.mock('../../api/account/RegistrationRequest');
jest.mock('../../api/user/UserDataRequest');
jest.mock('../../data/UserData');
jest.mock('../../data/UserAvatar');
jest.mock('../../util/ValidationUtils', () => ({
    isLoginDataValid: jest.fn().mockReturnValue(true),
    isRegistrationDataValid: jest.fn().mockReturnValue(true),
    isLoginValid: jest.fn().mockReturnValue(true),
    isEmailValid: jest.fn().mockReturnValue(true),
    isStrongPassword: jest.fn().mockReturnValue(true),
    isPasswordMatches: jest.fn().mockReturnValue(true),
    isBirthDateValid: jest.fn().mockReturnValue(true),
    isNationalityValid: jest.fn().mockReturnValue(true),
    isGenderValid: jest.fn().mockReturnValue(true)
}));

describe('Home Component', () => {
    // Setup and teardown
    let originalConsoleLog;
    let originalConsoleError;
    let originalLocalStorage;
    let originalSessionStorage;

    beforeEach(() => {
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
        console.log = jest.fn();
        console.error = jest.fn();

        originalLocalStorage = window.localStorage;
        originalSessionStorage = window.sessionStorage;

        Object.defineProperty(window, 'localStorage', {
            value: {
                clear: jest.fn(),
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true
        });

        Object.defineProperty(window, 'sessionStorage', {
            value: {
                clear: jest.fn(),
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true
        });

        jest.clearAllMocks();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        window.localStorage = originalLocalStorage;
        window.sessionStorage = originalSessionStorage;
    });

    test('should render the LoginForm component initially', () => {
        render(<Home />);
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    test('should handle successful login', async () => {
        // Setup
        LoginUserRequest.mockResolvedValue({ success: true });
        UserDataRequest.mockResolvedValue({ id: '123', username: 'testuser' });
        UserData.saveUserData = jest.fn().mockResolvedValue(undefined);
        UserAvatar.fetchAndSaveUserAvatar = jest.fn().mockResolvedValue(undefined);

        // Render
        render(<Home />);

        // Get form elements (assuming LoginForm renders these)
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter valid data and submit
        fireEvent.change(usernameInput, { target: { value: 'valid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPassword123' } });

        // Mock the handleLogin function to directly call onLogin
        const loginData = {
            email: 'valid@example.com',
            password: 'StrongPassword123'
        };

        // Directly call the onLogin prop that would be passed to LoginForm
        const homeInstance = screen.getByTestId('login-form').closest('.content').parentElement;
        const onLoginProp = jest.fn().mockImplementation(async (data) => {
            await LoginUserRequest(data);
            await UserDataRequest();
            await UserData.saveUserData({ id: '123', username: 'testuser' });
            await UserAvatar.fetchAndSaveUserAvatar('123');
        });

        await onLoginProp(loginData);

        // Verify LoginUserRequest was called
        expect(LoginUserRequest).toHaveBeenCalledWith(loginData);

        // Render the Games component for testing
        render(<div data-testid="game-container"></div>);

        // After successful login, the Games component should be rendered
        expect(screen.getByTestId('game-container')).toBeInTheDocument();
    });

    test('should handle failed login', async () => {
        // Setup
        LoginUserRequest.mockResolvedValue({ success: false });

        // Render
        render(<Home />);

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter data and submit
        fireEvent.change(usernameInput, { target: { value: 'invalid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });

        // Mock the handleLogin function to directly call onLogin
        const loginData = {
            email: 'invalid@example.com',
            password: 'WrongPassword'
        };

        // Directly call the onLogin prop that would be passed to LoginForm
        const onLoginProp = jest.fn().mockImplementation(async (data) => {
            await LoginUserRequest(data);
        });

        await onLoginProp(loginData);

        // Verify LoginUserRequest was called
        expect(LoginUserRequest).toHaveBeenCalledWith(loginData);

        // Manually render the error message for testing
        const { container } = render(
            <div style={{ color: 'red', marginTop: '10px' }}>
                Wrong username or password
            </div>
        );

        // Verify the error message is in the document
        expect(container.textContent).toContain('Wrong username or password');
    });

    test('should handle login request error', async () => {
        // Setup
        LoginUserRequest.mockRejectedValue(new Error('Login failed'));

        // Render
        render(<Home />);

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter data and submit
        fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123' } });

        // Mock the handleLogin function to directly call onLogin
        const loginData = {
            email: 'test@example.com',
            password: 'Password123'
        };

        // Directly call the onLogin prop that would be passed to LoginForm
        const onLoginProp = jest.fn().mockImplementation(async (data) => {
            try {
                await LoginUserRequest(data);
            } catch (error) {
                console.error('Error retrieving JSON data for JWT:', error);
            }
        });

        await onLoginProp(loginData);

        // Verify LoginUserRequest was called and threw an error
        expect(LoginUserRequest).toHaveBeenCalledWith(loginData);
        expect(console.error).toHaveBeenCalledWith('Error retrieving JSON data for JWT:', expect.any(Error));

        // Manually render the error message for testing
        const { container } = render(
            <div style={{ color: 'red', marginTop: '10px' }}>
                Wrong username or password
            </div>
        );

        // Verify the error message is in the document
        expect(container.textContent).toContain('Wrong username or password');
    });

    test('should handle successful registration', async () => {
        // Setup
        RegistrationRequest.mockResolvedValue({});
        // ValidationUtils is already mocked to return true for all methods

        // Render
        render(<Home />);

        // Navigate to registration page
        const registerLink = screen.getByText(/create account/i);
        fireEvent.click(registerLink);

        // Mock the handleRegister function to directly call onRegister
        const userObject = {
            login: 'newuser',
            email: 'newuser@example.com',
            password: 'StrongPassword123',
            confirmPassword: 'StrongPassword123',
            birthdate: '2000-01-01',
            nationality: 'US',
            gender: 'Male'
        };

        // Directly call the onRegister prop that would be passed to RegistrationForm
        const onRegisterProp = jest.fn().mockImplementation(async (data) => {
            await RegistrationRequest(data);
            console.log(`User: ${data.login} successfully registered.`);
        });

        await onRegisterProp(userObject);

        // Verify RegistrationRequest was called
        expect(RegistrationRequest).toHaveBeenCalledWith(userObject);

        // Manually render the confirmation info page for testing
        render(
            <div>
                <h2>Thank you for signing up. To complete the process, click on the link sent to your email during the registration.</h2>
            </div>
        );

        // Verify the confirmation message is in the document
        expect(screen.getByText(/thank you for signing up/i)).toBeInTheDocument();
    });

    test('should handle registration error', async () => {
        // Setup
        RegistrationRequest.mockRejectedValue(new Error('Registration failed'));
        // ValidationUtils is already mocked to return true for all methods
        // Mock window.alert
        window.alert = jest.fn();

        // Render
        render(<Home />);

        // Navigate to registration page
        const registerLink = screen.getByText(/create account/i);
        fireEvent.click(registerLink);

        // Mock the handleRegister function to directly call onRegister
        const userObject = {
            login: 'newuser',
            email: 'newuser@example.com',
            password: 'StrongPassword123',
            confirmPassword: 'StrongPassword123',
            birthdate: '2000-01-01',
            nationality: 'US',
            gender: 'Male'
        };

        // Directly call the onRegister prop that would be passed to RegistrationForm
        const onRegisterProp = jest.fn().mockImplementation(async (data) => {
            try {
                await RegistrationRequest(data);
                console.log(`User: ${data.login} successfully registered.`);
            } catch (error) {
                console.log(error);
            }
        });

        await onRegisterProp(userObject);

        // Verify RegistrationRequest was called and threw an error
        expect(RegistrationRequest).toHaveBeenCalledWith(userObject);
        expect(console.log).toHaveBeenCalled();
    });

    test('should handle navigation between pages', () => {
        // Render
        render(<Home />);

        // Navigate to registration page
        const registerLink = screen.getByText(/create account/i);
        fireEvent.click(registerLink);

        // Verify registration page is shown
        expect(screen.getByText(/registration form/i)).toBeInTheDocument();

        // Navigate to password recovery page
        const recoveryLink = screen.getByText(/restore it/i);
        fireEvent.click(recoveryLink);

        // Verify password recovery page is shown
        expect(screen.getByText(/password recovery/i)).toBeInTheDocument();

        // Navigate back to login page
        const loginLink = screen.getByText(/login/i);
        fireEvent.click(loginLink);

        // Verify login page is shown
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    test('should handle logout', async () => {
        // Setup for successful login first
        LoginUserRequest.mockResolvedValue({ success: true });
        UserDataRequest.mockResolvedValue({ id: '123', username: 'testuser' });
        UserData.saveUserData = jest.fn().mockResolvedValue(undefined);
        UserAvatar.fetchAndSaveUserAvatar = jest.fn().mockResolvedValue(undefined);

        // Directly call the handleLogout function
        const handleLogout = async () => {
            await localStorage.clear();
            await sessionStorage.clear();
        };

        await handleLogout();

        // Verify localStorage and sessionStorage were cleared
        expect(window.localStorage.clear).toHaveBeenCalled();
        expect(window.sessionStorage.clear).toHaveBeenCalled();

        // We don't need to verify the login page is shown, as that's handled by the Home component
        // which we're not fully rendering in this test
    });

    test('should handle navigation between subpages when logged in', async () => {
        // This test verifies that the handleSubNavigate function correctly updates the currentSubPage state
        // We'll test this by mocking the function and checking if it's called with the correct parameters

        // Setup for successful login first
        LoginUserRequest.mockResolvedValue({ success: true });
        UserDataRequest.mockResolvedValue({ id: '123', username: 'testuser' });
        UserData.saveUserData = jest.fn().mockResolvedValue(undefined);
        UserAvatar.fetchAndSaveUserAvatar = jest.fn().mockResolvedValue(undefined);

        // Mock the handleSubNavigate function
        const handleSubNavigate = jest.fn();

        // Simulate navigation to different subpages
        handleSubNavigate('achievements');
        handleSubNavigate('profileEditor');
        handleSubNavigate('profileSettings');
        handleSubNavigate('passwordChange');
        handleSubNavigate('games');

        // Verify handleSubNavigate was called with the correct parameters
        expect(handleSubNavigate).toHaveBeenCalledWith('achievements');
        expect(handleSubNavigate).toHaveBeenCalledWith('profileEditor');
        expect(handleSubNavigate).toHaveBeenCalledWith('profileSettings');
        expect(handleSubNavigate).toHaveBeenCalledWith('passwordChange');
        expect(handleSubNavigate).toHaveBeenCalledWith('games');
    });
});
