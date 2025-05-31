import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from './ImageUploader';
import UserAvatar from '../../data/UserAvatar';
import { processAndUploadImage } from '../../util/ImageUploaderUtils';

// Mock the dependencies
jest.mock('../../data/UserAvatar', () => ({
    updateAvatar: jest.fn(),
}));

jest.mock('../../util/ImageUploaderUtils', () => ({
    processAndUploadImage: jest.fn(),
}));

describe('ImageUploader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});

    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('calls updateAvatar on mount', () => {
        render(<ImageUploader />);
        expect(UserAvatar.updateAvatar).toHaveBeenCalledTimes(1);
    });

    test('handles file drop and calls processAndUploadImage', () => {
        render(<ImageUploader />);

        // Create a mock file
        const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });

        // Fire drop event with file
        fireEvent.drop(screen.getByText(/Drag image to field or click/i), {
            dataTransfer: {
                files: [file],
            },
        });

        expect(processAndUploadImage).toHaveBeenCalledWith(file);
    });

    test('handles file input change and calls processAndUploadImage', () => {
        render(<ImageUploader />);

        const file = new File(['dummy content'], 'avatar2.png', { type: 'image/png' });

        const input = screen.getByLabelText(/drag image to field or click/i);

        // Get the hidden input by its id (fileInput)
        const fileInput = screen.getByTestId('file-input') || document.getElementById('fileInput');

        // fireEvent.change requires the input element, so use fileInput directly
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(processAndUploadImage).toHaveBeenCalledWith(file);
    });

    test('renders AvatarComponent and label correctly', () => {
        render(<ImageUploader />);

        expect(screen.getByText(/Drag image to field or click/i)).toBeInTheDocument();
        expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Assuming AvatarComponent renders img
    });
});
