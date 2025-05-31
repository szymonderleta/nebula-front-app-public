import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {useNavigate} from 'react-router-dom';
import Redirect from './Redirect';
import LoginUserRequest from '../../api/account/LoginUserRequest';
import GETRequestPublic from '../../api/method/GETRequestPublic';
import ValidationUtils from "../../util/ValidationUtils";
import {TestMemoryRouterWrapper} from "../../util/TestUtils";

// Mock the dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../../api/account/LoginUserRequest');
jest.mock('../../api/method/GETRequestPublic');
jest.mock('../../util/ValidationUtils');

describe('Redirect Component', () => {
    // Setup and teardown
    let originalWindowLocation;
    let originalConsoleLog;
    let originalConsoleError;

    beforeEach(() => {
        // Save original window.location
        originalWindowLocation = window.location;
        delete window.location;
        window.location = {
            ...originalWindowLocation,
            search: '',
            href: '',
        };

        // Mock console methods
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
        console.log = jest.fn();
        console.error = jest.fn();

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restore original values
        window.location = originalWindowLocation;
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });

    // Tests
    test('should render the LoginForm component', async () => {
        render(
            <TestMemoryRouterWrapper>
                <Redirect/>
            </TestMemoryRouterWrapper>
        );
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    test('should fetch the list of games on mount', async () => {
        const mockGames = [
            {name: 'game1', pageUrl: 'http://game1.com'},
            {name: 'game2', pageUrl: 'http://game2.com'}
        ];
        GETRequestPublic.mockResolvedValue(mockGames);

        render(
            <TestMemoryRouterWrapper>
                <Redirect/>
            </TestMemoryRouterWrapper>
        );

        await waitFor(() => {
            expect(GETRequestPublic).toHaveBeenCalledWith(
                'https://milkyway.local:8555/nebula-rest-api/api/v1/games/enabled'
            );
        });
    });

    test('should show error message for invalid login data', async () => {
        // Setup
        ValidationUtils.isLoginDataValid.mockImplementation((email, password) => false);
        GETRequestPublic.mockResolvedValue([{ name: 'testGame', pageUrl: 'http://test-game.com' }]);

        // Render
        render(
            <TestMemoryRouterWrapper>
                <Redirect />
            </TestMemoryRouterWrapper>
        );

        // Wait for games to load
        await waitFor(() => {
            expect(GETRequestPublic).toHaveBeenCalled();
        });

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter invalid data and submit
        fireEvent.change(usernameInput, { target: { value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { value: 'weak' } });
        fireEvent.click(submitButton);

        // Verify
        expect(console.log).toHaveBeenCalledWith("Invalid login data criteria.");
        expect(LoginUserRequest).not.toHaveBeenCalled();
    });

    test('should redirect to game page after successful login with destination', async () => {
        // Setup
        ValidationUtils.isLoginDataValid.mockImplementation((email, password) => true);
        const mockGames = [{ name: 'testGame', pageUrl: 'http://test-game.com' }];
        GETRequestPublic.mockResolvedValue(mockGames);
        LoginUserRequest.mockResolvedValue({ success: true });
        window.location.search = '?destination=testGame';

        // Render
        render(
            <TestMemoryRouterWrapper>
                <Redirect />
            </TestMemoryRouterWrapper>
        );

        // Wait for games to load
        await waitFor(() => {
            expect(GETRequestPublic).toHaveBeenCalled();
        });

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter valid data and submit
        fireEvent.change(usernameInput, { target: { value: 'valid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPassword123' } });
        fireEvent.click(submitButton);

        // Verify
        await waitFor(() => {
            expect(LoginUserRequest).toHaveBeenCalledWith({
                email: 'valid@example.com',
                password: 'StrongPassword123'
            });
        });

        // Check redirection
        expect(window.location.href).toBe('http://test-game.com');
    });

    test('should redirect to home page after successful login without destination', async () => {
        // Setup
        ValidationUtils.isLoginDataValid.mockImplementation((email, password) => true);
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);
        GETRequestPublic.mockResolvedValue([{ name: 'SomeGame', pageUrl: '/some-url' }]);
        LoginUserRequest.mockResolvedValue({ success: true });
        window.location.search = '';

        // Render
        render(
            <TestMemoryRouterWrapper>
                <Redirect />
            </TestMemoryRouterWrapper>
        );

        // Wait for games to load
        await waitFor(() => {
            expect(GETRequestPublic).toHaveBeenCalled();
        });

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter valid data and submit
        fireEvent.change(usernameInput, { target: { value: 'valid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPassword123' } });
        fireEvent.click(submitButton);

        // Verify
        await waitFor(() => {
            expect(LoginUserRequest).toHaveBeenCalledWith({
                email: 'valid@example.com',
                password: 'StrongPassword123'
            });
        });

        // Check navigation
        expect(navigate).toHaveBeenCalledWith('/');
    });

    test('should show error message on failed login', async () => {
        // Setup
        ValidationUtils.isLoginDataValid.mockImplementation((email, password) => true);
        GETRequestPublic.mockResolvedValue([{ name: 'testGame', pageUrl: 'http://test-game.com' }]);
        LoginUserRequest.mockResolvedValue({ success: false });

        // Render
        render(
            <TestMemoryRouterWrapper>
                <Redirect />
            </TestMemoryRouterWrapper>
        );

        // Wait for games to load
        await waitFor(() => {
            expect(GETRequestPublic).toHaveBeenCalled();
        });

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter valid data and submit
        fireEvent.change(usernameInput, { target: { value: 'valid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPassword123' } });
        fireEvent.click(submitButton);

        // Verify
        await waitFor(() => {
            expect(LoginUserRequest).toHaveBeenCalled();
        });

        // Check error message
        const errorElement = screen.getByText(/wrong username or password/i);
        expect(errorElement).toBeInTheDocument();
    });

    test('should handle error when fetching games fails', async () => {
        // Setup
        GETRequestPublic.mockRejectedValue(new Error('Network error'));

        // Render
        render(
            <TestMemoryRouterWrapper>
                <Redirect />
            </TestMemoryRouterWrapper>
        );

        // Verify
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
        });
    });

    test('should handle error during login request', async () => {
        // Setup
        ValidationUtils.isLoginDataValid.mockImplementation((email, password) => true);
        GETRequestPublic.mockResolvedValue([{ name: 'testGame', pageUrl: 'http://test-game.com' }]);
        LoginUserRequest.mockRejectedValue(new Error('Login failed'));

        // Render
        render(
            <TestMemoryRouterWrapper>
                <Redirect />
            </TestMemoryRouterWrapper>
        );

        // Wait for games to load
        await waitFor(() => {
            expect(GETRequestPublic).toHaveBeenCalled();
        });

        // Get form elements
        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Enter valid data and submit
        fireEvent.change(usernameInput, { target: { value: 'valid@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'StrongPassword123' } });
        fireEvent.click(submitButton);

        // Verify error handling
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error retrieving JSON data for JWT:', expect.any(Error));
        });

        // Check error message
        const errorElement = screen.getByText(/wrong username or password/i);
        expect(errorElement).toBeInTheDocument();
    });
});
