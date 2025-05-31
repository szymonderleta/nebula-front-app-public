import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenderFetchData from './GenderFetchData';
import useFetchSortedData from '../UseFetchSortedData';

jest.mock('../UseFetchSortedData');

describe('GenderFetchData', () => {
    const mockData = [
        { id: '1', name: 'Female' },
        { id: '2', name: 'Male' },
        { id: '3', name: 'Other' },
    ];

    const setSelectedMock = jest.fn();
    const onChangeMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock,
            error: null,
            isLoading: false,
        });
    });

    test('renders the select with all options', () => {
        render(<GenderFetchData onChange={onChangeMock} />);

        expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();

        expect(screen.getAllByRole('option')).toHaveLength(4);

        expect(screen.getByText('Select')).toBeInTheDocument();
        expect(screen.getByText('Female')).toBeInTheDocument();
        expect(screen.getByText('Male')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();
    });

    test('calls setSelected and onChange on selection', () => {
        render(<GenderFetchData onChange={onChangeMock} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });

        expect(setSelectedMock).toHaveBeenCalledWith('2');
        expect(onChangeMock).toHaveBeenCalledWith('2');
    });
});
