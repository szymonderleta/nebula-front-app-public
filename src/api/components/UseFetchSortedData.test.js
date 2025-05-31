import {renderHook, act, waitFor} from '@testing-library/react';
import useFetchSortedData from './UseFetchSortedData';
import GETRequestPublic from '../method/GETRequestPublic';

jest.mock('../method/GETRequestPublic');

describe('useFetchSortedData', () => {
    const mockData = [
        { id: '2', name: 'B' },
        { id: '1', name: 'A' },
        { id: '3', name: 'C' },
    ];

    const sortByName = (a, b) => a.name.localeCompare(b.name);

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('fetches and sorts data correctly', async () => {
        GETRequestPublic.mockResolvedValueOnce(mockData);

        const { result } = renderHook(() =>
            useFetchSortedData('/test-url', sortByName)
        );

        // Upewnij się, że hook zaczyna w stanie ładowania
        expect(result.current.isLoading).toBe(true);

        // Czekaj aż ładowanie się zakończy
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Sprawdź czy dane zostały poprawnie posortowane
        expect(result.current.data).toEqual([
            { id: '1', name: 'A' },
            { id: '2', name: 'B' },
            { id: '3', name: 'C' },
        ]);

        expect(result.current.error).toBeNull();
    });

    test('sets initial selected value if provided', async () => {
        GETRequestPublic.mockResolvedValueOnce(mockData);

        const { result, waitForNextUpdate } = renderHook(() =>
            useFetchSortedData('/test-url', sortByName, { id: '2' })
        );

        await waitFor( () => {
            expect(result.current.selected).toBe('2');
        });

    });


    test('handles fetch error correctly', async () => {
        GETRequestPublic.mockRejectedValueOnce(new Error('Failed to fetch'));

        const { result } = renderHook(() =>
            useFetchSortedData('/bad-url', sortByName)
        );

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to fetch');
        expect(result.current.data).toEqual([]);
    });

    test('setSelected updates selected id', async () => {
        GETRequestPublic.mockResolvedValueOnce(mockData);

        const { result } = renderHook(() =>
            useFetchSortedData('/test-url', sortByName)
        );

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            result.current.setSelected('3');
        });

        expect(result.current.selected).toBe('3');
    });
});
