import { useCallback, useEffect, useState } from "react";
import GETRequestPublic from "../method/GETRequestPublic";

/**
 * A custom React hook to fetch, sort, and manage data from a given URL.
 * It provides functionalities such as error handling, loading state tracking, and data sorting.
 *
 * @param {string} url - The endpoint URL from which data will be fetched.
 * @param {function} sortFunction - A comparator function for sorting the fetched data.
 * @param {object} [initialValue] - An optional initial value object containing an `id` property.
 * @returns {Object} An object containing:
 *                   - `data` (Array): The sorted data fetched from the URL.
 *                   - `selected` (string): The currently selected item's id, which can be updated.
 *                   - `setSelected` (function): A function to update the `selected` id.
 *                   - `error` (string|null): An error message if the fetch request fails, otherwise null.
 *                   - `isLoading` (boolean): A flag indicating whether data is being fetched.
 */
const useFetchSortedData = (url, sortFunction, initialValue) => {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(initialValue?.id || '');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const initializeData = useCallback((result) => {
        const sortedData = result.sort(sortFunction);
        setData(sortedData);
        if (initialValue?.id) {
            setSelected(initialValue.id);
        }
    }, [sortFunction, initialValue?.id]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const result = await GETRequestPublic(url);
                if (isMounted) {
                    initializeData(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();
        return () => {
            isMounted = false;
        };
    }, [url, initializeData]);

    return {
        data,
        selected,
        setSelected,
        error,
        isLoading,
    };
};

export default useFetchSortedData;
