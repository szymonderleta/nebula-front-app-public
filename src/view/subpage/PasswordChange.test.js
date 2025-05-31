import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordChange from './PasswordChange';
import ValidationUtils from '../../util/ValidationUtils';
import ChangePasswordRequest from '../../api/pasword/ChangePasswordRequest';
import UserData from '../../data/UserData';

jest.mock('../../util/ValidationUtils');
jest.mock('../../api/pasword/ChangePasswordRequest');
jest.mock('../../data/UserData');

describe('PasswordChange', () => {
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        UserData.getUserId.mockReturnValue('123');
        window.alert = jest.fn();
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    test('renders password change form with all required elements', () => {
        render(<PasswordChange/>);

        expect(screen.getByTestId('current-password-input')).toBeInTheDocument();
        expect(screen.getByTestId('new-password-input')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();

        expect(screen.getByText('Actual password:')).toBeInTheDocument();
        expect(screen.getByText('New Password:')).toBeInTheDocument();
        expect(screen.getByText('Confirm password:')).toBeInTheDocument();

        expect(screen.getByRole('button', {name: 'Show current password'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Show new password'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Show confirm password'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Change password'})).toBeInTheDocument();
    });

    test('all password fields should be initially hidden and empty', () => {
        render(<PasswordChange/>);

        const inputs = [
            screen.getByTestId('current-password-input'),
            screen.getByTestId('new-password-input'),
            screen.getByTestId('confirm-password-input')
        ];

        inputs.forEach(input => {
            expect(input).toHaveAttribute('type', 'password');
            expect(input).toHaveValue('');
        });
    });

    test('toggles password visibility on mouse events', async () => {
        render(<PasswordChange/>);

        const currentPasswordInput = screen.getByTestId('current-password-input');
        const showPasswordButton = screen.getByRole('button', {name: 'Show current password'});

        expect(currentPasswordInput).toHaveAttribute('type', 'password');

        fireEvent.mouseDown(showPasswordButton);
        await waitFor(() => {
            expect(currentPasswordInput).toHaveAttribute('type', 'text');

        })

        fireEvent.mouseUp(showPasswordButton);
        await waitFor(() => {
            expect(currentPasswordInput).toHaveAttribute('type', 'password');
        })
    });

    test('handles successful password change', async () => {
        ValidationUtils.isUpdatePasswordValid.mockReturnValue(true);
        ChangePasswordRequest.mockResolvedValue(true);

        render(<PasswordChange/>);

        await userEvent.type(screen.getByTestId('current-password-input'), 'oldPass123');
        await userEvent.type(screen.getByTestId('new-password-input'), 'newPass123');
        await userEvent.type(screen.getByTestId('confirm-password-input'), 'newPass123');

        await userEvent.click(screen.getByRole('button', {name: 'Change password'}));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Password updated');
        });
    });

    test('shows error message when validation fails', async () => {
        ValidationUtils.isUpdatePasswordValid.mockReturnValue(false);

        render(<PasswordChange/>);

        await userEvent.click(screen.getByRole('button', {name: 'Change password'}));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                'Incorrect form data. Ensure your password is strong and matches the confirmation.'
            );
        })
    });

    test('shows error message when API call fails', async () => {
        ValidationUtils.isUpdatePasswordValid.mockReturnValue(true);
        const apiError = new Error('API Error');
        ChangePasswordRequest.mockRejectedValue(apiError);

        render(<PasswordChange/>);

        await userEvent.click(screen.getByRole('button', {name: 'Change password'}));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Something is wrong...');

        });
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                'Password change request failed:',
                apiError
            );
        });
    });

    test('typing in password fields updates state correctly', async () => {
        render(<PasswordChange/>);

        await userEvent.type(screen.getByTestId('current-password-input'), 'test123');
        expect(screen.getByTestId('current-password-input')).toHaveValue('test123');
        await userEvent.type(screen.getByTestId('new-password-input'), 'newpass123');
        expect(screen.getByTestId('new-password-input')).toHaveValue('newpass123');
    });
});
