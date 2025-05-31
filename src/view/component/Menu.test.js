import React from 'react';
import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import Menu from './Menu';
import UserData from '../../data/UserData';
import themeListenerSingletonInstance from '../../singles/ThemeListenerSingleton';
import { processAndUploadImage } from '../../util/ImageUploaderUtils';

// Mock the dependencies
jest.mock('../../data/UserData', () => ({
    getThemeName: jest.fn(),
}));

jest.mock('../../singles/ThemeListenerSingleton', () => ({
    addObserver: jest.fn(),
    removeObserver: jest.fn(),
}));

jest.mock('../../util/ImageUploaderUtils', () => ({
    processAndUploadImage: jest.fn(),
}));

describe('Menu Component', () => {
    const mockOnNavigate = jest.fn();
    const mockOnSubNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        UserData.getThemeName.mockResolvedValue('Default');
    });

    afterEach(() => {
        console.error.mockRestore();
        console.warn.mockRestore();
    });

    test('renders correctly with default theme', async () => {
        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        expect(screen.getByTestId('menu-container')).toBeInTheDocument();
        expect(screen.getByAltText('logo')).toBeInTheDocument();
        expect(screen.getByText('Games')).toBeInTheDocument();
        expect(screen.getByText('Profile Editor')).toBeInTheDocument();
        expect(screen.getByText('User Settings')).toBeInTheDocument();
        expect(screen.getByText('Achievements')).toBeInTheDocument();
    });

    test('handles theme updates', async () => {
        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        expect(themeListenerSingletonInstance.addObserver).toHaveBeenCalled();
        expect(UserData.getThemeName).toHaveBeenCalled();
    });

    test('toggles menu open/close when avatar is clicked', () => {
        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        const avatarContainer = screen.getByTestId('avatar-container');
        fireEvent.click(avatarContainer);

        expect(screen.getByText('Change Avatar')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Log out')).toBeInTheDocument();

        fireEvent.click(avatarContainer);
        expect(screen.queryByText('Change Avatar')).not.toBeInTheDocument();
    });

    test('handles popup menu item clicks independently', async () => {
        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        // Click avatar to open popup and click password
        fireEvent.click(screen.getByTestId('avatar-container'));
        const passwordButton = await screen.findByTestId('password');
        fireEvent.click(passwordButton);
        expect(mockOnSubNavigate).toHaveBeenCalledWith('passwordChange');
        mockOnSubNavigate.mockClear();

        // Re-open popup to click profile
        fireEvent.click(screen.getByTestId('avatar-container'));
        const profileButton = await screen.findByTestId('profile');
        fireEvent.click(profileButton);
        expect(mockOnSubNavigate).toHaveBeenCalledWith('profileEditor');
        mockOnSubNavigate.mockClear();

        // Re-open popup to click logout
        fireEvent.click(screen.getByTestId('avatar-container'));
        const logoutButton = await screen.findByTestId('logout');
        fireEvent.click(logoutButton);
        expect(mockOnNavigate).toHaveBeenCalledWith('logout');
        mockOnNavigate.mockClear();
    });


    test('calls onSubNavigate with profileEditor when profile is clicked', () => {
        const mockOnNavigate = jest.fn();
        const mockOnSubNavigate = jest.fn();

        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        const avatarContainer = screen.getByTestId('avatar-container');
        fireEvent.click(avatarContainer);

        const profileButton = screen.getByTestId('profile');

        fireEvent.click(profileButton);

        expect(mockOnSubNavigate).toHaveBeenCalledWith('profileEditor');
    });


    test('handles avatar file upload', () => {
        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        // Open the popup menu
        const avatarContainer = screen.getByTestId('avatar-container');
        fireEvent.click(avatarContainer);

        // Click the Change Avatar option
        fireEvent.click(screen.getByText('Change Avatar'));

        // Simulate file selection
        const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('avatar-file-input');
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(processAndUploadImage).toHaveBeenCalledWith(file);
    });

    test('handles theme error gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // mock it

        UserData.getThemeName.mockRejectedValue(new Error('Theme error'));

        render(<Menu onNavigate={mockOnNavigate} onSubNavigate={mockOnSubNavigate} />);

        // Wait for component to handle the async rejection
        await waitFor(() => {
            expect(screen.getByTestId('menu-container')).toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
    });

});
