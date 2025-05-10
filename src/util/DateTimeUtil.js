/**
 * Utility class for DateTime operations.
 */
class DateTimeUtil {

    /**
     * Converts a given date input into an ISO 8601 formatted timestamp string.
     *
     * @param {string|number|Date} date - The date to be transformed. It can be a string, a number (timestamp), or a Date object.
     * @return {string} The ISO 8601 formatted timestamp string.
     */
    static transformToTimestamp(date) {
        const dateObj = new Date(date);
        return dateObj.toISOString();
    }

}

export default DateTimeUtil;
