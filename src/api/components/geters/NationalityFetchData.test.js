import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NationalityFetchData from './NationalityFetchData';
import useFetchSortedData from '../UseFetchSortedData';

// Mocking custom hook
jest.mock('../UseFetchSortedData');

describe('NationalityFetchData', () => {
    const mockData = [
        { id: '1', name: 'French' },
        { id: '2', name: 'Polish' },
        { id: '3', name: 'Japanese' },
    ];

    const sortedMockData = [...mockData].sort((a, b) => a.name.localeCompare(b.name));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders label and select options', () => {
        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: '',
            setSelected: jest.fn(),
            error: null,
            isLoading: false,
        });

        render(<NationalityFetchData onChange={() => {}} />);

        expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Select')).toBeInTheDocument();

        // checking if all options are presents
        sortedMockData.forEach(n => {
            expect(screen.getByText(n.name)).toBeInTheDocument();
        });
    });

    test('calls onChange and setSelected when selecting a value', () => {
        const setSelectedMock = jest.fn();
        const onChangeMock = jest.fn();

        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: '',
            setSelected: setSelectedMock,
            error: null,
            isLoading: false,
        });

        render(<NationalityFetchData onChange={onChangeMock} />);

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: '2' }, // Polish
        });

        expect(setSelectedMock).toHaveBeenCalledWith('2');
        expect(onChangeMock).toHaveBeenCalledWith('2');
    });

    test('displays default selected value', () => {
        useFetchSortedData.mockReturnValue({
            data: sortedMockData,
            selected: '3', // Japanese
            setSelected: jest.fn(),
            error: null,
            isLoading: false,
        });

        render(<NationalityFetchData onChange={() => {}} />);
        const select = screen.getByRole('combobox');
        expect(select.value).toBe('3');
    });
});
