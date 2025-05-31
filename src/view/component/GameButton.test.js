import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameButton from './GameButton';

describe('GameButton', () => {
    const gameEnabled = {
        enable: true,
        iconUrl: 'https://example.com/icon.png',
        name: 'Test Game',
        pageUrl: 'https://example.com/game',
    };

    const gameDisabled = {
        enable: false,
        iconUrl: 'https://example.com/icon.png',
        name: 'Test Game',
        pageUrl: 'https://example.com/game',
    };

    beforeEach(() => {
        // Mock window.location.href setter
        delete window.location;
        window.location = { href: '' };
    });

    test('renders button with game name', () => {
        render(<GameButton game={gameEnabled} />);
        expect(screen.getByRole('button')).toHaveTextContent('Test Game');
    });

    test('renders game icon if iconUrl is provided', () => {
        render(<GameButton game={gameEnabled} />);
        const img = screen.getByAltText('Test Game');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', gameEnabled.iconUrl);
    });

    test('does not render img if iconUrl is not provided', () => {
        const gameWithoutIcon = { ...gameEnabled, iconUrl: undefined };
        render(<GameButton game={gameWithoutIcon} />);
        expect(screen.queryByRole('img')).toBeNull();
    });

    test('button is enabled when game.enable is true', () => {
        render(<GameButton game={gameEnabled} />);
        expect(screen.getByRole('button')).toBeEnabled();
    });

    test('button is disabled when game.enable is false', () => {
        render(<GameButton game={gameDisabled} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('clicking enabled button sets window.location.href to game.pageUrl', () => {
        render(<GameButton game={gameEnabled} />);
        fireEvent.click(screen.getByRole('button'));
        expect(window.location.href).toBe(gameEnabled.pageUrl);
    });

    test('clicking disabled button does not change window.location.href', () => {
        render(<GameButton game={gameDisabled} />);
        fireEvent.click(screen.getByRole('button'));
        expect(window.location.href).toBe('');
    });
});
