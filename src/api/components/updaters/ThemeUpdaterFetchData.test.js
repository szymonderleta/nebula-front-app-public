import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeUpdaterFetchData from './ThemeUpdaterFetchData';
import useFetchSortedData from '../UseFetchSortedData';
import NationalityUpdaterFetchData from "./NationalityUpdaterFetchData";

jest.mock('../UseFetchSortedData');

const mockData = [
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
    { id: 3, name: 'Gamma' },
];

describe('ThemeUpdaterFetchData', () => {
    let setSelectedMock;
    let onChangeMock;

    beforeEach(() => {
        setSelectedMock = jest.fn();
        onChangeMock = jest.fn();
    });

    test('renders options sorted by name', () => {
        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<ThemeUpdaterFetchData value={''} onChange={onChangeMock} />);

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(mockData.length);
        // Check if options are rendered and in the correct order (Alpha, Beta, Gamma)
        expect(options[0]).toHaveTextContent('Alpha');
        expect(options[1]).toHaveTextContent('Beta');
        expect(options[2]).toHaveTextContent('Gamma');
    });

    test('calls setSelected and onChange with selected object on valid selection', () => {
        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<ThemeUpdaterFetchData value={''} onChange={onChangeMock} />);

        const select = screen.getByRole('combobox');

        fireEvent.change(select, { target: { value: '2' } });

        expect(setSelectedMock).toHaveBeenCalledWith(2);
        expect(onChangeMock).toHaveBeenCalledWith({ id: 2, name: 'Beta' });
    });

    test('handles invalid (NaN) selection by resetting selected and calling onChange with empty string', () => {
        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<ThemeUpdaterFetchData value={''} onChange={onChangeMock} />);

        const select = screen.getByRole('combobox');

        // Fire event with invalid string that parseInt returns NaN
        fireEvent.change(select, { target: { value: 'invalid' } });

        expect(setSelectedMock).toHaveBeenCalledWith('');
        expect(onChangeMock).toHaveBeenCalledWith('');
    });

    test('handles invalid selected id gracefully', () => {
        const onChangeMock = jest.fn();
        const setSelectedMock = jest.fn();

        useFetchSortedData.mockReturnValue({
            data: mockData,
            selected: '',
            setSelected: setSelectedMock,
        });

        render(<ThemeUpdaterFetchData value={null} onChange={onChangeMock} />);

        // Simulate selecting an invalid value (empty)
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: '' },
        });

        expect(setSelectedMock).toHaveBeenCalledWith('');
        expect(onChangeMock).toHaveBeenCalledWith('');
    });
});
