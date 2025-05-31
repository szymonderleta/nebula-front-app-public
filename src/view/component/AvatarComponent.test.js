import React from 'react';
import {act, render, screen, waitFor} from '@testing-library/react';
import AvatarComponent from './AvatarComponent';
import UserAvatar from '../../data/UserAvatar';
import avatarListenerSingletonInstance from '../../singles/AvatarListenerSingleton';

jest.mock('../../data/UserAvatar');
jest.mock('../../singles/AvatarListenerSingleton', () => ({
    addObserver: jest.fn(),
    removeObserver: jest.fn(),
}));
jest.mock('../../resource/default/profile.png', () => 'profile-image-path');

describe('AvatarComponent', () => {
    const mockAvatarUrl = 'https://example.com/avatar.jpg';
    const width = '100px';
    const height = '100px';

    beforeEach(() => {
        jest.clearAllMocks();
        avatarListenerSingletonInstance.addObserver = jest.fn();
        avatarListenerSingletonInstance.removeObserver = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders with default profile image when avatar is not loaded', async () => {
        UserAvatar.getUserAvatar.mockResolvedValue(null);

        render(<AvatarComponent width={width} height={height} />);
        const imgElement = await screen.findByAltText('Avatar');
        expect(imgElement).toHaveAttribute('src', 'profile-image-path');
        expect(imgElement).toHaveStyle({ width, height });
    });

    test('renders with user avatar when avatar is loaded', async () => {
        UserAvatar.getUserAvatar.mockResolvedValue(mockAvatarUrl);

        render(<AvatarComponent width={width} height={height} />);
        const imgElement = await screen.findByAltText('Avatar');
        expect(imgElement).toHaveAttribute('src', mockAvatarUrl);
        expect(imgElement).toHaveStyle({ width, height });
    });

    test('fetches avatar on mount', async () => {
        UserAvatar.getUserAvatar.mockResolvedValue(mockAvatarUrl);

        render(<AvatarComponent width={width} height={height} />);
        await waitFor(() => {
            expect(UserAvatar.getUserAvatar).toHaveBeenCalledTimes(1);
        });
    });

    test('registers observer with avatarListenerSingleton on mount', async () => {
        UserAvatar.getUserAvatar.mockResolvedValue(mockAvatarUrl);

        render(<AvatarComponent width={width} height={height} />);
        await waitFor(() => {
            expect(avatarListenerSingletonInstance.addObserver).toHaveBeenCalledTimes(1);
        });
    });

    test('unregisters observer when unmounted', async () => {
        UserAvatar.getUserAvatar.mockResolvedValue(mockAvatarUrl);

        const { unmount } = render(<AvatarComponent width={width} height={height} />);
        const observerCallback = avatarListenerSingletonInstance.addObserver.mock.calls[0][0];
        unmount();
        expect(avatarListenerSingletonInstance.removeObserver).toHaveBeenCalledTimes(1);
        expect(avatarListenerSingletonInstance.removeObserver).toHaveBeenCalledWith(observerCallback);
    });

    test('updates avatar when observer notifies (using findBy)', async () => {
        UserAvatar.getUserAvatar
            .mockResolvedValueOnce('initial-avatar.jpg')
            .mockResolvedValueOnce('updated-avatar.jpg');

        render(<AvatarComponent width={width} height={height} />);

        const observerCallback = avatarListenerSingletonInstance.addObserver.mock.calls[0][0];

        await act(async () => {
            await observerCallback();
        });

        const imgElement = await screen.findByAltText('Avatar');
        expect(imgElement).toHaveAttribute('src', 'updated-avatar.jpg');
        expect(UserAvatar.getUserAvatar).toHaveBeenCalledTimes(2);
    });


    test('handles avatar fetch error gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        UserAvatar.getUserAvatar.mockRejectedValue(new Error('Fetch failed'));

        render(<AvatarComponent width={width} height={height} />);
        const imgElement = await screen.findByAltText('Avatar');
        expect(imgElement).toHaveAttribute('src', 'profile-image-path');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating avatar:', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });
});
