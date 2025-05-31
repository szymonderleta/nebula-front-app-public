import DateTimeUtils from './DateTimeUtils';

describe('DateTimeUtils', () => {
    describe('transformToTimestamp', () => {
        test('should correctly transform a Date object to an ISO 8601 string', () => {
            const date = new Date('2023-11-01T10:00:00Z');
            const result = DateTimeUtils.transformToTimestamp(date);
            expect(result).toBe('2023-11-01T10:00:00.000Z');
        });

        test('should correctly transform a string date to an ISO 8601 string', () => {
            const date = '2023-11-01T10:00:00Z';
            const result = DateTimeUtils.transformToTimestamp(date);
            expect(result).toBe('2023-11-01T10:00:00.000Z');
        });

        test('should correctly transform a timestamp to an ISO 8601 string', () => {
            const timestamp = 1698832800000; // Equivalent to '2023-11-01T10:00:00.000Z'
            const result = DateTimeUtils.transformToTimestamp(timestamp);
            expect(result).toBe('2023-11-01T10:00:00.000Z');
        });

        test('should throw an error for invalid date input', () => {
            const invalidDate = 'invalid-date';
            expect(() => DateTimeUtils.transformToTimestamp(invalidDate)).toThrow('Invalid date input');
        });

        test('should throw an error for undefined input', () => {
            expect(() => DateTimeUtils.transformToTimestamp(undefined)).toThrow('Invalid date input');
        });

        test('should throw an error for null input', () => {
            expect(() => DateTimeUtils.transformToTimestamp(null)).toThrow('Invalid date input');
        });
    });
});

