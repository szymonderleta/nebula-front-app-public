import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import LoginForm from './LoginForm';
import ValidationUtils from '../../util/ValidationUtils';
import {NAVIGATE_RECOVERY, NAVIGATE_REGISTER} from '../../util/NavigationUtils';

// Mock ValidationUtils
jest.mock('../../util/ValidationUtils', () => ({
    isLoginDataValid: jest.fn()
}));

// Mock NavigationUtils
jest.mock('../../util/NavigationUtils', () => ({
    MESSAGE_RECOVERY_PROMPT: 'Forgot your password?',
    MESSAGE_REGISTER_PROMPT: 'Don\'t have an account?',
    NAVIGATE_RECOVERY: 'recovery',
    NAVIGATE_REGISTER: 'register',
    RenderLink: ({text, page, onNavigate}) => (
        <button onClick={() => onNavigate(page)}>{text}</button>
    )
}));

describe('LoginForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders the login form with all elements', () => {
            render(<LoginForm onLogin={jest.fn()} onNavigate={jest.fn()}/>);

            const loginElements = screen.getAllByText('Login');
            expect(loginElements).toHaveLength(2);

            expect(loginElements[0].tagName).toBe('H1');
            expect(loginElements[1].tagName).toBe('BUTTON');

            expect(screen.getByLabelText('Username or email:')).toBeInTheDocument();
            expect(screen.getByLabelText('Password:')).toBeInTheDocument();
            expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument();
            expect(screen.getByText('Create account')).toBeInTheDocument();
            expect(screen.getByText('Restore it')).toBeInTheDocument();
        });

        test('renders the logo', () => {
            render(<LoginForm onLogin={jest.fn()} onNavigate={jest.fn()}/>);

            // Check if the logo is rendered
            const logo = screen.getByAltText('logo');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveClass('App-logo');
        });

        test('does not show error message by default', () => {
            render(<LoginForm onLogin={jest.fn()} onNavigate={jest.fn()}/>);

            // Check that error message is not displayed
            expect(screen.queryByText('Wrong username or password')).not.toBeInTheDocument();
        });

        test('shows error message when loginError prop is true', () => {
            render(<LoginForm onLogin={jest.fn()} loginError={true} onNavigate={jest.fn()}/>);

            // Check that error message is displayed
            expect(screen.getByText('Wrong username or password')).toBeInTheDocument();
        });
    });

    describe('Form Interaction', () => {
        test('updates username state when input changes', () => {
            render(<LoginForm onLogin={jest.fn()} onNavigate={jest.fn()}/>);

            const usernameInput = screen.getByLabelText('Username or email:');
            fireEvent.change(usernameInput, {target: {value: 'testuser'}});

            expect(usernameInput.value).toBe('testuser');
        });

        test('updates password state when input changes', () => {
            render(<LoginForm onLogin={jest.fn()} onNavigate={jest.fn()}/>);

            const passwordInput = screen.getByLabelText('Password:');
            fireEvent.change(passwordInput, {target: {value: 'password123'}});

            expect(passwordInput.value).toBe('password123');
        });
    });

    describe('Form Validation and Submission', () => {
        test('validates login data when login button is clicked', () => {
            ValidationUtils.isLoginDataValid.mockReturnValue(false);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
            });

            render(<LoginForm onLogin={jest.fn()} onNavigate={jest.fn()}/>);

            const usernameInput = screen.getByLabelText('Username or email:');
            const passwordInput = screen.getByLabelText('Password:');

            fireEvent.change(usernameInput, {target: {value: 'testuser'}});
            fireEvent.change(passwordInput, {target: {value: 'password123'}});

            fireEvent.click(screen.getByRole('button', {name: 'Login'}));

            expect(ValidationUtils.isLoginDataValid).toHaveBeenCalledWith('testuser', 'password123');
            expect(consoleSpy).toHaveBeenCalledWith('Invalid login data criteria.');

            consoleSpy.mockRestore();
        });

        test('calls onLogin with correct data when validation passes', () => {
            ValidationUtils.isLoginDataValid.mockReturnValue(true);
            const onLoginMock = jest.fn();

            render(<LoginForm onLogin={onLoginMock} onNavigate={jest.fn()}/>);

            const usernameInput = screen.getByLabelText('Username or email:');
            const passwordInput = screen.getByLabelText('Password:');

            fireEvent.change(usernameInput, {target: {value: 'testuser'}});
            fireEvent.change(passwordInput, {target: {value: 'password123'}});

            fireEvent.click(screen.getByRole('button', {name: 'Login'}));

            expect(ValidationUtils.isLoginDataValid).toHaveBeenCalledWith('testuser', 'password123');
            expect(onLoginMock).toHaveBeenCalledWith({
                email: 'testuser',
                password: 'password123'
            });
        });
    });

    describe('Navigation', () => {
        test('navigates to registration page when "Create account" is clicked', () => {
            const mockNavigate = jest.fn();
            render(<LoginForm onLogin={jest.fn()} onNavigate={mockNavigate}/>);

            fireEvent.click(screen.getByText('Create account'));

            expect(mockNavigate).toHaveBeenCalledWith(NAVIGATE_REGISTER);
        });

        test('navigates to recovery page when "Restore it" is clicked', () => {
            const mockNavigate = jest.fn();
            render(<LoginForm onLogin={jest.fn()} onNavigate={mockNavigate}/>);

            fireEvent.click(screen.getByText('Restore it'));

            expect(mockNavigate).toHaveBeenCalledWith(NAVIGATE_RECOVERY);
        });
    });
});