import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import Achievements from './Achievements';
import UserData from '../../data/UserData';

// Mock dependencies
jest.mock('../../data/UserData');

describe('Achievements', () => {
    const mockAchievements = [
        {id: 1, iconUrl: 'icon1.png', name: 'Achievement 1', progress: '50%', level: 3},
        {id: 2, iconUrl: 'icon2.png', name: 'Achievement 2', progress: '100%', level: 5},
        {id: 3, iconUrl: 'icon3.png', name: 'Achievement 3', progress: '25%', level: 1}
    ];

    const mockUserData = {
        achievements: mockAchievements
    };

    beforeEach(() => {
        jest.clearAllMocks();
        UserData.loadUserData = jest.fn().mockResolvedValue(mockUserData);
    });

    describe('Star Rating Functionality', () => {
        test('renders correct number of gold and black stars based on achievement level', async () => {
            render(<Achievements/>);

            await waitFor(() => {
                mockAchievements.forEach(achievement => {
                    const row = screen.getByRole('row', {name: new RegExp(achievement.name, 'i')});

                    const starContainer = within(row).getByTestId('star-container');

                    const stars = within(starContainer).getAllByTestId('star');
                    expect(stars).toHaveLength(5);

                    const goldStars = stars.filter(star => star.classList.contains('gold-star'));
                    expect(goldStars).toHaveLength(achievement.level);

                    const blackStars = stars.filter(star => star.classList.contains('black-star'));
                    expect(blackStars).toHaveLength(5 - achievement.level);

                });
            });
        });
    });

    describe('Achievements Component Rendering', () => {
        test('renders table with correct headers', async () => {
            render(<Achievements/>);
            await waitFor(() => {
                expect(screen.getByText('Id')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Icon')).toBeInTheDocument();
            });
            await waitFor(() => {
                expect(screen.getByText('Name')).toBeInTheDocument();
            });
            await waitFor(() => {
                expect(screen.getByText('Progress')).toBeInTheDocument();
            });
            await waitFor(() => {
                expect(screen.getByText('5-star scale')).toBeInTheDocument();
            });
        });

        test('renders achievements data correctly', async () => {
            render(<Achievements/>);

            await waitFor(() => {
                mockAchievements.forEach(achievement => {
                    expect(screen.getByText(achievement.id.toString())).toBeInTheDocument();
                    expect(screen.getByText(achievement.name)).toBeInTheDocument();
                    expect(screen.getByText(achievement.progress)).toBeInTheDocument();

                    const image = screen.getByAltText(achievement.name);
                    expect(image).toBeInTheDocument();
                    expect(image).toHaveAttribute('src', achievement.iconUrl);
                    expect(image).toHaveClass('achievement-icon');
                });
            });
        });

        test('renders star ratings for each achievement', async () => {
            render(<Achievements/>);

            await waitFor(() => {
                // We should have 3 achievements with 5 stars each = 15 stars total
                const stars = screen.getAllByText('★');
                expect(stars.length).toBe(15);
            });
        });

        test('renders empty table when no achievements data', async () => {
            UserData.loadUserData.mockResolvedValue({achievements: []});

            render(<Achievements/>);

            const table = await screen.findByRole('table');

            expect(screen.getByText('Id')).toBeInTheDocument();

            const rows = within(table).queryAllByRole('row', {name: /^(?!.*Id).*$/i});
            expect(rows).toHaveLength(0);
        });

    });

    describe('Data Loading', () => {
        test('loads user data on mount', async () => {
            render(<Achievements/>);
            await waitFor(() => {
                expect(UserData.loadUserData).toHaveBeenCalled();
            })
        });

        test('handles error when loading user data', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
            });
            const error = new Error('Failed to load user data');
            UserData.loadUserData.mockRejectedValue(error);

            render(<Achievements/>);

            await screen.findByRole('table');

            expect(screen.getByText('Id')).toBeInTheDocument();

            const rows = screen.queryAllByRole('row');
            expect(rows.length - 1).toBe(0);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error loading user data:',
                error
            );

            consoleSpy.mockRestore();
        });


        test('handles case when achievements property is missing', async () => {
            UserData.loadUserData.mockResolvedValue({
                user: 'data but no achievements',
                achievements: []
            });

            render(<Achievements/>);

            await screen.findByRole('table');

            expect(screen.getByText('Id')).toBeInTheDocument();

            const rows = screen.queryAllByRole('row');
            expect(rows.length - 1).toBe(0);
        });

    });
});
