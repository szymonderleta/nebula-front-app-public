import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import ProfileEditor, {PROFILE_UPDATE_ERROR_MESSAGE} from './ProfileEditor';
import UserData from '../../data/UserData';
import ValidationUtils from "../../util/ValidationUtils";
import UserProfileDataUpdate from "../../api/user/UserProfileDataUpdate";
import NationalityUpdaterFetchData from "../../api/components/updaters/NationalityUpdaterFetchData";

jest.mock('../../data/UserData');
jest.mock('../../api/user/UserProfileDataUpdate');
jest.mock('../../util/ValidationUtils');
jest.mock('../component/ImageUploader', () => () => <div data-testid="image-uploader">Image Uploader</div>);
jest.mock('../component/ProfileNamesForm', () => ({profileData, onUpdateFirstName, onUpdateLastName}) => (
    <div data-testid="profile-names-form">
        <input
            data-testid="first-name-input"
            value={profileData.firstName}
            onChange={(e) => onUpdateFirstName(e.target.value)}
        />
        <input
            data-testid="last-name-input"
            value={profileData.lastName}
            onChange={(e) => onUpdateLastName(e.target.value)}
        />
    </div>
));
jest.mock('../../api/components/updaters/NationalityUpdaterFetchData', () => ({value, onChange}) => (
    <select
        data-testid="nationality-select"
        value={value.id}
        onChange={(e) => onChange({id: Number(e.target.value), name: "Test Country", code: "TST"})}
    >
        <option value="180">Poland</option>
    </select>
));
jest.mock('../../api/components/updaters/GenderUpdaterFetchData', () => ({value, onChange}) => (
    <select
        data-testid="gender-select"
        value={value.id}
        onChange={(e) => onChange({id: Number(e.target.value), name: "Test Gender"})}
    >
        <option value="3">Unknown</option>
    </select>
));

describe('ProfileEditor', () => {
    const mockUserData = {
        id: 1,
        login: 'testuser',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '2000-01-01',
        nationality: {id: 180, name: "Poland", code: "POL"},
        gender: {id: 3, name: "Unknown"}
    };

    beforeEach(() => {
        UserData.loadUserData.mockResolvedValue(mockUserData);
        UserData.fetchUserData.mockResolvedValue(true);
        UserProfileDataUpdate.mockResolvedValue(true);
        ValidationUtils.isProfileUpdateDataValid.mockReturnValue(true);
        ValidationUtils.isNationalityValid.mockReturnValue(true);
        ValidationUtils.isGenderValid.mockReturnValue(true);
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders all required components initially', async () => {
            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<ProfileEditor/>);
            });

            expect(screen.getByTestId('image-uploader')).toBeInTheDocument();
            expect(screen.getByTestId('profile-names-form')).toBeInTheDocument();
            expect(screen.getByTestId('nationality-select')).toBeInTheDocument();
            expect(screen.getByTestId('gender-select')).toBeInTheDocument();
        });

        test('loads and displays user data correctly on mount', async () => {
            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<ProfileEditor/>);
            });

            expect(screen.getByDisplayValue(mockUserData.firstName)).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockUserData.lastName)).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockUserData.birthDate)).toBeInTheDocument();
        });

        test('handles initial data loading failure gracefully', async () => {
            UserData.loadUserData.mockResolvedValue(null);

            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<ProfileEditor/>);
            });

            expect(screen.getByTestId('profile-names-form')).toBeInTheDocument();
            expect(screen.getByDisplayValue('2000-01-01')).toBeInTheDocument();
        });
    });

    describe('Form Field Updates', () => {
        describe('Name Fields', () => {
            test('handles first name change correctly', async () => {
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    render(<ProfileEditor/>);
                });

                const firstNameInput = screen.getByTestId('first-name-input');
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    fireEvent.change(firstNameInput, {target: {value: 'Jane'}});
                });

                expect(firstNameInput.value).toBe('Jane');
            });

            test('does not update name when empty value provided', async () => {
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    render(<ProfileEditor/>);
                });

                const firstNameInput = screen.getByTestId('first-name-input');
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    fireEvent.change(firstNameInput, {target: {value: ''}});
                });

                expect(firstNameInput.value).toBe(mockUserData.firstName);
            });

            // Nowy test
            test('handles last name change correctly', async () => {
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    render(<ProfileEditor/>);
                });

                const lastNameInput = screen.getByTestId('last-name-input');
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    fireEvent.change(lastNameInput, {target: {value: 'Smith'}});
                });

                expect(lastNameInput.value).toBe('Smith');
            });
        });

        describe('Date Field', () => {
            test('handles date change correctly', async () => {
                render(<ProfileEditor/>);

                const dateInput = await screen.findByLabelText(/birthdate/i);
                fireEvent.change(dateInput, {target: {value: '2001-02-03'}});

                expect(dateInput.value).toBe('2001-02-03');
            });

            test('clears field when invalid date format provided', async () => {
                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    render(<ProfileEditor/>);
                });

                const dateInput = await screen.findByLabelText(/birthdate/i);

                // eslint-disable-next-line testing-library/no-unnecessary-act
                await act(async () => {
                    fireEvent.change(dateInput, {target: {value: 'invalid-date'}});
                });

                expect(dateInput.value).toBe('');
            });
        });

        describe('Select Fields', () => {
            describe('Nationality Select', () => {
                test('handles nationality change correctly', async () => {
                    jest.clearAllMocks();

                    const onChangeMock = jest.fn();

                    // eslint-disable-next-line testing-library/no-unnecessary-act
                    await act(async () => {
                        render(
                            <NationalityUpdaterFetchData
                                value={{id: 180}}
                                onChange={onChangeMock}
                            />
                        );
                    });

                    const nationalitySelect = screen.getByTestId('nationality-select');

                    // eslint-disable-next-line testing-library/no-unnecessary-act
                    await act(async () => {
                        fireEvent.change(nationalitySelect, {target: {value: '181'}});
                    });

                    expect(onChangeMock).toHaveBeenCalledWith(
                        expect.objectContaining({
                            id: 0,
                            name: "Test Country",
                            code: "TST"
                        })
                    );
                });

                test('shows nationality validation error', async () => {
                    ValidationUtils.isNationalityValid.mockReturnValue(false);

                    render(<ProfileEditor/>);

                    await waitFor(() => {
                        expect(screen.getByText('Select Nationality from list.')).toBeInTheDocument();
                    });
                });
            });

            describe('Gender Select', () => {
                test('shows gender validation error', async () => {
                    ValidationUtils.isGenderValid.mockReturnValue(false);

                    render(<ProfileEditor/>);

                    await waitFor(() => {
                        expect(screen.getByText('Select Gender from list.')).toBeInTheDocument();
                    });
                });

                test('maintains current gender value when invalid value provided', async () => {
                    // eslint-disable-next-line testing-library/no-unnecessary-act
                    await act(async () => {
                        render(<ProfileEditor/>);
                    });

                    const genderSelect = screen.getByTestId('gender-select');
                    const initialValue = genderSelect.value;

                    // eslint-disable-next-line testing-library/no-unnecessary-act
                    await act(async () => {
                        fireEvent.change(genderSelect, {target: {value: 'invalid'}});
                    });

                    expect(genderSelect.value).toBe(initialValue);
                });
            });
        });

        test('handles multiple field changes correctly', async () => {
            render(<ProfileEditor/>);

            const dateInput = screen.getByDisplayValue(mockUserData.birthDate);
            const firstNameInput = screen.getByTestId('first-name-input');
            const genderSelect = screen.getByTestId('gender-select');

            fireEvent.change(dateInput, {target: {value: '2001-02-03'}});
            fireEvent.change(firstNameInput, {target: {value: 'Jane'}});
            fireEvent.change(genderSelect, {target: {value: '3'}});

            await waitFor(() => {
                expect(dateInput.value).toBe('2001-02-03');

            })
            await waitFor(() => {
                expect(firstNameInput.value).toBe('Jane');

            })
            await waitFor(() => {
                expect(genderSelect.value).toBe('3');

            })
        });
    });

    describe('Form Submission', () => {
        test('successfully saves profile changes', async () => {
            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<ProfileEditor/>);
            });

            const saveButton = screen.getByText('Save Changes');

            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                fireEvent.click(saveButton);
            });

            expect(UserProfileDataUpdate).toHaveBeenCalled();
            expect(UserData.fetchUserData).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith('Profile data updated');
        });

        test('shows validation error when data is invalid', async () => {
            ValidationUtils.isProfileUpdateDataValid.mockReturnValue(false);

            render(<ProfileEditor/>);

            const saveButton = await screen.findByText('Save Changes');
            fireEvent.click(saveButton);

            expect(window.alert).toHaveBeenCalledWith('Incorrect form data, this usually happens if the name fields contain illegal characters or are empty.');
        });

        test('shows partial success message when data update succeeds but fetch fails', async () => {
            UserData.fetchUserData.mockResolvedValue(false);

            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<ProfileEditor/>);
            });

            const saveButton = screen.getByText('Save Changes');
            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                fireEvent.click(saveButton);
            });

            expect(window.alert).toHaveBeenCalledWith('Profile data updated but not downloaded');
        });

        test('handles API error during save', async () => {
            const errorMessage = 'API Error';
            UserProfileDataUpdate.mockRejectedValue(new Error(errorMessage));
            ValidationUtils.isProfileUpdateDataValid.mockReturnValue(true);

            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                render(<ProfileEditor/>);
            });

            const saveButton = screen.getByText('Save Changes');

            // eslint-disable-next-line testing-library/no-unnecessary-act
            await act(async () => {
                fireEvent.click(saveButton);
            });

            expect(window.alert).toHaveBeenCalledWith(`${PROFILE_UPDATE_ERROR_MESSAGE}: ${errorMessage}`);
            expect(UserData.fetchUserData).not.toHaveBeenCalled();
        });

    });

    describe('Edge Cases', () => {
        test('handles very long input values', async () => {
            render(<ProfileEditor/>);

            const firstNameInput = screen.getByTestId('first-name-input');
            const veryLongName = 'a'.repeat(100);

            fireEvent.change(firstNameInput, {target: {value: veryLongName}});

            await waitFor(() => {
                expect(firstNameInput.value).toBe(mockUserData.firstName);
            })

        });

        test('handles special characters in input fields', async () => {
            render(<ProfileEditor/>);

            const firstNameInput = screen.getByTestId('first-name-input');
            const specialCharsName = '!@#$%^&*()';

            fireEvent.change(firstNameInput, {target: {value: specialCharsName}});

            await waitFor(() => {
                expect(firstNameInput.value).toBe(mockUserData.firstName);

            })
        });
    });
});
