import React from 'react';
import {render, screen, waitFor, act} from '@testing-library/react';
import Games from './Games';
import UserData from '../../data/UserData';
import themeListenerSingletonInstance from '../../singles/ThemeListenerSingleton';

// Mock dependencies
jest.mock('../../data/UserData');
jest.mock('../../singles/ThemeListenerSingleton');
jest.mock('../component/GameButton', () => ({game}) => (
    <div data-testid={`game-button-${game.id}`} className="game-button-mock">
        {game.name}
    </div>
));

describe('Games', () => {
    const mockGames = [
        {id: 1, name: 'Game 1'},
        {id: 2, name: 'Game 2'},
        {id: 3, name: 'Game 3'}
    ];

    const mockUserData = {
        games: mockGames
    };

    let addObserverMock;
    let removeObserverMock;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock UserData methods
        UserData.getThemeName = jest.fn().mockReturnValue('Default');
        UserData.loadUserData = jest.fn().mockResolvedValue(mockUserData);

        // Mock theme listener methods
        addObserverMock = jest.fn();
        removeObserverMock = jest.fn();
        themeListenerSingletonInstance.addObserver = addObserverMock;
        themeListenerSingletonInstance.removeObserver = removeObserverMock;
    });

    describe('Rendering', () => {
        test('renders with default theme initially', async () => {
            render(<Games/>);

            const container = screen.getByTestId('game-container');
            await waitFor(() => {
                expect(container).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(container).toHaveAttribute('data-theme', 'Default');
            })
        });

        test('renders game buttons for each game in user data', async () => {
            render(<Games/>);

            await waitFor(() => {
                mockGames.forEach(game => {
                    expect(screen.getByTestId(`game-button-${game.id}`)).toBeInTheDocument();
                    expect(screen.getByText(game.name)).toBeInTheDocument();
                });
            });
        });

        test('renders no game buttons when user data has no games', async () => {
            UserData.loadUserData.mockResolvedValue({games: []});

            render(<Games/>);

            await screen.findByTestId('game-container');

            expect(screen.queryAllByRole('button')).toHaveLength(0);
        });

        test('renders no game buttons when user data is undefined', async () => {
            UserData.loadUserData.mockResolvedValue(undefined);

            render(<Games/>);

            await screen.findByTestId('game-container');

            expect(screen.queryAllByRole('button')).toHaveLength(0);
        });

    });

    describe('Theme Management', () => {
        test('registers theme observer on mount', async () => {
            render(<Games/>);
            await waitFor(() => {
                expect(addObserverMock).toHaveBeenCalled();
            })
        });

        test('removes theme observer on unmount', async () => {
            const {unmount} = render(<Games/>);

            await act(async () => {
                unmount();
            });

            expect(removeObserverMock).toHaveBeenCalled();
        });

        test('updates theme when theme changes', async () => {
            // Capture the update function passed to addObserver
            let themeUpdateFn;
            addObserverMock.mockImplementation((fn) => {
                themeUpdateFn = fn;
            });

            render(<Games/>);

            UserData.getThemeName.mockReturnValue('Dark');

            await act(async () => {
                await themeUpdateFn();
            });

            const container = screen.getByTestId('game-container');
            expect(container).toHaveAttribute('data-theme', 'Dark');
        });
    });

    describe('Data Loading', () => {
        test('loads user data on mount', async () => {
            render(<Games/>);
            await waitFor(() => {
                expect(UserData.loadUserData).toHaveBeenCalled();
            });
        });

        test('updates games state when user data changes', async () => {
            render(<Games/>);

            await waitFor(() => {
                mockGames.forEach(game => {
                    expect(screen.getByTestId(`game-button-${game.id}`)).toBeInTheDocument();
                });
            });

            const newGames = [
                {id: 4, name: 'New Game 1'},
                {id: 5, name: 'New Game 2'}
            ];

            UserData.loadUserData.mockResolvedValue({games: newGames});
            render(<Games/>);

            await waitFor(() => {
                newGames.forEach(game => {
                    expect(screen.getByTestId(`game-button-${game.id}`)).toBeInTheDocument();
                });
            });
        });

        test('handles error when loading user data', async () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
            });

            UserData.loadUserData = jest.fn().mockRejectedValue(
                new Error('Failed to load user data')
            );

            render(<Games/>);
            await screen.findByTestId('game-container');
            expect(screen.queryAllByRole('button')).toHaveLength(0);

            expect(errorSpy).toHaveBeenCalled();

            errorSpy.mockRestore();
        });
    });
});