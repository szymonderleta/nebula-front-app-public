import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfirmationAccount from './ConfirmationAccount';
import ConfirmationTokenRequest from '../../api/account/ConfirmationTokenRequest';
import { useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../api/account/ConfirmationTokenRequest');

describe('ConfirmationAccount', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ id: '123', token: 'abc123token' });
        window.alert = jest.fn();
        delete window.location;
        window.location = { href: '' };
    });

    test('should render ID and token from the URL', () => {
        render(<ConfirmationAccount />);
        expect(screen.getByText(/ID: 123/i)).toBeInTheDocument();
        expect(screen.getByText(/Token: abc123token/i)).toBeInTheDocument();
    });

    test('should call ConfirmationTokenRequest with correct data on confirmation', async () => {
        ConfirmationTokenRequest.mockResolvedValueOnce();
        render(<ConfirmationAccount />);
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

        await waitFor(() => {
            expect(ConfirmationTokenRequest).toHaveBeenCalledWith({
                tokenId: 123,
                token: 'abc123token',
            });
        });
    });

    test('should display an alert and redirect to "/" on successful confirmation', async () => {
        ConfirmationTokenRequest.mockResolvedValueOnce();
        render(<ConfirmationAccount />);
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('The account has been confirmed');
        });
        await waitFor(() => {
            expect(window.location.href).toBe('/');
        });
    });

    test('should log an error if confirmation request fails', async () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const mockError = new Error('Request failed');
        ConfirmationTokenRequest.mockRejectedValueOnce(mockError);
        render(<ConfirmationAccount />);

        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith('Error during confirmation:', mockError);
        });
        consoleErrorMock.mockRestore();
    });
});
