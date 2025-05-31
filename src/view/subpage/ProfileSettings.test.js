import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import UserData from '../../data/UserData';
import UserSettingsUpdate from '../../api/user/UserSettingsUpdate';
import themeListenerSingletonInstance from '../../singles/ThemeListenerSingleton';
import ProfileSettings from "./ProfileSettings";

jest.mock('../../data/UserData');
jest.mock('../../api/user/UserSettingsUpdate');
jest.mock('../../singles/ThemeListenerSingleton');
jest.mock('../../api/components/updaters/ThemeUpdaterFetchData', () => ({
    __esModule: true,
    default: ({value, onChange}) => (
        <select
            data-testid="theme-selector"
            value={value.name}
            onChange={(e) => onChange({id: 1, name: e.target.value})}
        >
            <option value="Default">Default</option>
            <option value="Dark">Dark</option>
        </select>
    )
}));

// Mock for window.alert
window.alert = jest.fn();

const mockUserData = {
    id: 1,
    settings: {
        general: {
            theme: {
                id: 17,
                name: 'Default'
            }
        },
        sound: {
            muted: false,
            volumeMaster: 100,
            volumeMusic: 100,
            volumeEffects: 100,
            volumeVoices: 100,
            battleCry: true
        }
    }
};


describe('ProfileSettings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        UserData.loadUserData.mockResolvedValue(mockUserData);
        UserSettingsUpdate.mockResolvedValue(true);
        themeListenerSingletonInstance.notifyObservers.mockResolvedValue();
    });

    test('renders settings sections', async () => {
        render(<ProfileSettings/>);

        await waitFor(() => {
            expect(screen.getByText('General')).toBeInTheDocument();
        })
        await waitFor(() => {
            expect(screen.getByText('Sound')).toBeInTheDocument();
        })
        await waitFor(() => {
            expect(screen.getByText(/theme:/i)).toBeInTheDocument();
        })
    });

    test('renders theme selector with options', async () => {
        render(<ProfileSettings/>);
        const themeSelector = screen.getByTestId('theme-selector');
        await waitFor(() => {
            expect(themeSelector).toBeInTheDocument();
        })
        await waitFor(() => {
            expect(screen.getByRole('option', {name: 'Default'})).toBeInTheDocument();
        })
        await waitFor(() => {
            expect(screen.getByRole('option', {name: 'Dark'})).toBeInTheDocument();
        })
    });

    test('renders volume controls with correct initial values', async () => {
        render(<ProfileSettings/>);

        const volumeControls = [
            {name: 'volumeMaster', label: 'Volume Master'},
            {name: 'volumeMusic', label: 'Volume Music'},
            {name: 'volumeEffects', label: 'Volume Effects'},
            {name: 'volumeVoices', label: 'Volume Voices'}
        ];

        await waitFor(() => {
            volumeControls.forEach(control => {
                expect(screen.getByText(new RegExp(control.label))).toBeInTheDocument();
                const slider = screen.getAllByRole('slider')
                    .find(s => s.getAttribute('name') === control.name);
                expect(slider).toHaveAttribute('type', 'range');
                expect(slider).toHaveAttribute('min', '0');
                expect(slider).toHaveAttribute('max', '100');
                expect(slider).toHaveAttribute('value', '100');
            });
        });
    });

    test('handles volume changes', async () => {
        render(<ProfileSettings/>);

        const masterVolumeSlider = screen.getAllByRole('slider')
            .find(slider => slider.getAttribute('name') === 'volumeMaster');

        fireEvent.change(masterVolumeSlider, {target: {value: '50'}});

        await waitFor(() => {
            expect(masterVolumeSlider).toHaveValue('50');
        })
    });

    test('renders and handles checkbox controls', async () => {
        render(<ProfileSettings/>);
        const battleCryCheckbox = await screen.findByRole('checkbox', {name: /battle cry/i});
        const mutedCheckbox = await screen.findByRole('checkbox', {name: /muted/i});

        await waitFor(() => {
            expect(battleCryCheckbox).toBeChecked();
        });

        await waitFor(() => {
            expect(mutedCheckbox).not.toBeChecked();
        });

        fireEvent.click(mutedCheckbox);
        fireEvent.click(battleCryCheckbox);

        await waitFor(() => {
            expect(mutedCheckbox).toBeChecked();
        });

        await waitFor(() => {
            expect(battleCryCheckbox).not.toBeChecked();
        });
    });


    test('handles theme change', async () => {
        render(<ProfileSettings/>);
        const themeSelector = screen.getByTestId('theme-selector');
        fireEvent.change(themeSelector, {target: {value: 'Dark'}});

        await waitFor(() => {
            expect(UserData.setTemporaryTheme).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(themeListenerSingletonInstance.notifyObservers).toHaveBeenCalled();
        });
    });

    test('saves changes successfully', async () => {
        render(<ProfileSettings/>);

        const saveButton = await screen.findByRole('button', {name: /save changes/i});

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(UserSettingsUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: 0,
                    theme: expect.objectContaining({
                        id: 17,
                        name: "Default"
                    })
                }),
                expect.objectContaining({
                    userId: 0,
                    volumeMaster: 100,
                    volumeMusic: 100,
                    volumeEffects: 100,
                    volumeVoices: 100,
                    muted: false,
                    battleCry: true
                })
            );
        });

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Profile data updated but not downloaded');
        });
    });

    test('handles save failure', async () => {
        UserSettingsUpdate.mockResolvedValue(false);
        render(<ProfileSettings/>);
        const saveButton = await screen.findByRole('button', {name: /save changes/i});
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Something is wrong...');
        });
    });

});
