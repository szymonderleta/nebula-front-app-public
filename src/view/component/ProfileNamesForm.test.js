import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileNamesForm from './ProfileNamesForm';
import ValidationUtils from '../../util/ValidationUtils';

// Mock ValidationUtils
jest.mock('../../util/ValidationUtils', () => ({
    isTextNameValid: jest.fn(),
}));

describe('ProfileNamesForm', () => {
    const profileData = {
        login: 'user123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
    };

    const onUpdateFirstName = jest.fn();
    const onUpdateLastName = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all inputs with correct initial values', () => {
        render(
            <ProfileNamesForm
                profileData={profileData}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        expect(screen.getByLabelText(/User name:/i)).toHaveValue(profileData.login);
        expect(screen.getByLabelText(/Email:/i)).toHaveValue(profileData.email);
        expect(screen.getByLabelText(/First Name:/i)).toHaveValue(profileData.firstName);
        expect(screen.getByLabelText(/Last Name:/i)).toHaveValue(profileData.lastName);
    });

    test('calls onUpdateFirstName when first name input changes', () => {
        ValidationUtils.isTextNameValid.mockReturnValue(true);
        render(
            <ProfileNamesForm
                profileData={profileData}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        const firstNameInput = screen.getByLabelText(/First Name:/i);
        fireEvent.change(firstNameInput, { target: { value: 'Alice' } });

        expect(onUpdateFirstName).toHaveBeenCalledWith('Alice');
        expect(firstNameInput).toHaveValue('Alice');
    });

    test('calls onUpdateLastName when last name input changes', () => {
        ValidationUtils.isTextNameValid.mockReturnValue(true);
        render(
            <ProfileNamesForm
                profileData={profileData}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

        expect(onUpdateLastName).toHaveBeenCalledWith('Smith');
        expect(lastNameInput).toHaveValue('Smith');
    });

    test('shows invalid first name message when validation fails', () => {
        ValidationUtils.isTextNameValid.mockImplementation((text) => text !== 'Invalid');

        render(
            <ProfileNamesForm
                profileData={{ ...profileData, firstName: 'Invalid' }}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        expect(screen.getByText(/Invalid first name/i)).toBeInTheDocument();
    });

    test('shows invalid last name message when validation fails', () => {
        ValidationUtils.isTextNameValid.mockImplementation((text) => text !== 'Invalid');

        render(
            <ProfileNamesForm
                profileData={{ ...profileData, lastName: 'Invalid' }}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        expect(screen.getByText(/Invalid last name/i)).toBeInTheDocument();
    });

    test('updates firstName and lastName state when profileData prop changes', () => {
        const { rerender } = render(
            <ProfileNamesForm
                profileData={profileData}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        expect(screen.getByLabelText(/First Name:/i)).toHaveValue('John');
        expect(screen.getByLabelText(/Last Name:/i)).toHaveValue('Doe');

        // Rerender with new profileData
        const newProfileData = { ...profileData, firstName: 'NewFirst', lastName: 'NewLast' };
        rerender(
            <ProfileNamesForm
                profileData={newProfileData}
                onUpdateFirstName={onUpdateFirstName}
                onUpdateLastName={onUpdateLastName}
            />
        );

        expect(screen.getByLabelText(/First Name:/i)).toHaveValue('NewFirst');
        expect(screen.getByLabelText(/Last Name:/i)).toHaveValue('NewLast');
    });
});
