import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenderUpdaterFetchData from './GenderUpdaterFetchData';
import useFetchSortedData from '../UseFetchSortedData';

// Mock custom hook
jest.mock('../UseFetchSortedData');

describe('GenderUpdaterFetchData', () => {
    const mockData = [
        { id: 1, name: 'Female' },
        { id: 2, name: 'Male' },
        { id: 3, name: 'Other' },
    ];

    const sortedMockData = [...mockData].sort((a, b) => a.name.localeCompare(b.name));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders dropdown with sorted options', () => {
        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: '',
            setSelected: jest.fn(),
        });

        render(<GenderUpdaterFetchData value={null} onChange={() => {}} />);

        expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();

        sortedMockData.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
        });
    });

    test('calls onChange and setSelected when a gender is selected', () => {
        const onChangeMock = jest.fn();
        const setSelectedMock = jest.fn();

        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<GenderUpdaterFetchData value={null} onChange={onChangeMock} />);

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: '2' }, // Male
        });

        expect(setSelectedMock).toHaveBeenCalledWith(2);
        expect(onChangeMock).toHaveBeenCalledWith({ id: 2, name: 'Male' });
    });

    test('sets default selected value from props', () => {
        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: 1, // Female
            setSelected: jest.fn(),
        });

        render(<GenderUpdaterFetchData value={{ id: 1 }} onChange={() => {}} />);
        expect(screen.getByRole('combobox').value).toBe('1');
    });

    test('handles invalid selected id gracefully', () => {
        const onChangeMock = jest.fn();
        const setSelectedMock = jest.fn();

        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<GenderUpdaterFetchData value={null} onChange={onChangeMock} />);

        // Simulate selecting an invalid value (empty)
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: '' },
        });

        expect(setSelectedMock).toHaveBeenCalledWith('');
        expect(onChangeMock).toHaveBeenCalledWith('');
    });
});
