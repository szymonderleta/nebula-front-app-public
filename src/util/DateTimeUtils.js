/**
 * Utility class for DateTime operations.
 */
class DateTimeUtils {


    /**
     * Converts a given date input to its ISO 8601 timestamp representation.
     * Throws a TypeError if the input is null, undefined, an empty string, or an invalid date.
     *
     * @param {string|number|Date} date - The date input to be transformed. Can be a string, a number (timestamp), or a Date object.
     * @return {string} The ISO 8601 formatted timestamp.
     */
    static transformToTimestamp(date) {
        if (date === null || date === undefined || (typeof date === 'string' && date.trim() === '')) {
            throw new TypeError('Invalid date input');
        }

        const dateObj = new Date(date);

        if (isNaN(dateObj.getTime())) {
            throw new TypeError('Invalid date input');
        }

        return dateObj.toISOString();
    }

}

export default DateTimeUtils;
