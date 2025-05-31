import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ConfirmationInfo from './ConfirmationInfo';
import {NAVIGATE_RECOVERY, NAVIGATE_REGISTER} from '../../util/NavigationUtils';

// Mock the NavigationUtils constants
jest.mock('../../util/NavigationUtils', () => ({
    MESSAGE_HEADER_CONFIRMATION: 'Confirmation Header',
    MESSAGE_RECOVERY_PROMPT: 'Forgot your password?',
    MESSAGE_REGISTER_PROMPT: 'Don\'t have an account?',
    NAVIGATE_RECOVERY: 'recovery',
    NAVIGATE_REGISTER: 'register',
    RenderLink: ({text, page, onNavigate}) => (
        <button onClick={() => onNavigate(page)}>{text}</button>
    )
}));

describe('ConfirmationInfo Component', () => {
    describe('Rendering', () => {
        test('renders the component with correct header and messages', () => {
            render(<ConfirmationInfo onNavigate={jest.fn()}/>);

            // Check if the header is rendered
            expect(screen.getByText((content) => content.includes("Confirmation Header"))).toBeInTheDocument();

            // Check if the registration prompt is rendered
            expect(screen.getByText((content) => content.includes("Don't have an account?"))).toBeInTheDocument();

            // Check if the recovery prompt is rendered
            expect(screen.getByText((content) => content.includes("Forgot your password?"))).toBeInTheDocument();

            // Check if the navigation links are rendered
            expect(screen.getByText('Create account')).toBeInTheDocument();
            expect(screen.getByText('Restore it')).toBeInTheDocument();
        });


        test('renders the logo', () => {
            render(<ConfirmationInfo onNavigate={jest.fn()}/>);

            // Check if the logo is rendered
            const logo = screen.getByAltText('logo');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveClass('App-logo');
        });
    });

    describe('Navigation', () => {
        test('navigates to registration page when "Create account" is clicked', () => {
            const mockNavigate = jest.fn();
            render(<ConfirmationInfo onNavigate={mockNavigate}/>);

            // Click the "Create account" link
            fireEvent.click(screen.getByText('Create account'));

            // Check if onNavigate was called with the correct parameter
            expect(mockNavigate).toHaveBeenCalledWith(NAVIGATE_REGISTER);
        });

        test('navigates to recovery page when "Restore it" is clicked', () => {
            const mockNavigate = jest.fn();
            render(<ConfirmationInfo onNavigate={mockNavigate}/>);

            // Click the "Restore it" link
            fireEvent.click(screen.getByText('Restore it'));

            // Check if onNavigate was called with the correct parameter
            expect(mockNavigate).toHaveBeenCalledWith(NAVIGATE_RECOVERY);
        });
    });
});
