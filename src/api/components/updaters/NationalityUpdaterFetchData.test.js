import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NationalityUpdaterFetchData from './NationalityUpdaterFetchData';
import useFetchSortedData from '../UseFetchSortedData';

// Mock hook useFetchSortedData
jest.mock('../UseFetchSortedData');

describe('NationalityUpdaterFetchData', () => {
    const mockData = [
        { id: 2, name: 'Brazil' },
        { id: 1, name: 'Argentina' },
        { id: 3, name: 'Canada' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders options sorted by name', () => {
        useFetchSortedData.mockReturnValue({
            data: mockData.sort((a,b) => a.name.localeCompare(b.name)),
            selected: '',
            setSelected: jest.fn()
        });

        render(<NationalityUpdaterFetchData value={''} onChange={() => {}} />);

        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(mockData.length);
        expect(options[0].textContent).toBe('Argentina');
        expect(options[1].textContent).toBe('Brazil');
        expect(options[2].textContent).toBe('Canada');
    });

    test('selects the initial value correctly', () => {
        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: 2,
            setSelected: jest.fn()
        });

        render(<NationalityUpdaterFetchData value={{id: 2}} onChange={() => {}} />);

        const select = screen.getByRole('combobox');
        expect(select.value).toBe('2');
    });

    test('calls setSelected and onChange on option change', () => {
        const setSelectedMock = jest.fn();
        const onChangeMock = jest.fn();

        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock
        });

        render(<NationalityUpdaterFetchData value={''} onChange={onChangeMock} />);

        const select = screen.getByRole('combobox');

        fireEvent.change(select, { target: { value: '3' } });

        expect(setSelectedMock).toHaveBeenCalledWith(3);
        expect(onChangeMock).toHaveBeenCalledWith({ id: 3, name: 'Canada' });
    });

    test('handles invalid selected id gracefully', () => {
        const onChangeMock = jest.fn();
        const setSelectedMock = jest.fn();

        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<NationalityUpdaterFetchData value={null} onChange={onChangeMock} />);

        // Simulate selecting an invalid value (empty)
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: '' },
        });

        expect(setSelectedMock).toHaveBeenCalledWith('');
        expect(onChangeMock).toHaveBeenCalledWith('');
    });
});
