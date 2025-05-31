import ValidationUtils from './ValidationUtils';

describe('ValidationUtils', () => {

    describe('isLoginDataValid', () => {
        it('should return true for valid email and strong password', () => {
            expect(ValidationUtils.isLoginDataValid('test@example.com', 'StrongP4ssword')).toBe(true);
        });

        it('should return false for invalid email and strong password', () => {
            expect(ValidationUtils.isLoginDataValid('invalid-email', 'StrongP4ssword')).toBe(false);
        });

        it('should return false for valid email and weak password', () => {
            expect(ValidationUtils.isLoginDataValid('test@example.com', 'weak')).toBe(false);
        });

        it('should return false for invalid email and weak password', () => {
            expect(ValidationUtils.isLoginDataValid('invalid-email', 'weak')).toBe(false);
        });
    });

    describe('isProfileUpdateDataValid', () => {
        it('should return true for valid profile data', () => {
            const validProfile = {
                firstName: 'John',
                lastName: 'Doe',
                nationality: { id: 100 },
                gender: { id: 2 },
                birthDate: '2000-01-01',
            };
            expect(ValidationUtils.isProfileUpdateDataValid(validProfile)).toBe(true);
        });

        it('should return false for invalid first name', () => {
            const invalidProfile = {
                firstName: 'Jo!',
                lastName: 'Doe',
                nationality: { id: 100 },
                gender: { id: 2 },
                birthDate: '2000-01-01',
            };
            expect(ValidationUtils.isProfileUpdateDataValid(invalidProfile)).toBe(false);
        });

        it('should return false for invalid nationality', () => {
            const invalidProfile = {
                firstName: 'John',
                lastName: 'Doe',
                nationality: { id: 300 },
                gender: { id: 2 },
                birthDate: '2000-01-01',
            };
            expect(ValidationUtils.isProfileUpdateDataValid(invalidProfile)).toBe(false);
        });
    });

    describe('isRegistrationDataValid', () => {
        it('should return true for valid registration data', () => {
            expect(
                ValidationUtils.isRegistrationDataValid(
                    'validUser',
                    'test@example.com',
                    'StrongP4ssword',
                    'StrongP4ssword',
                    '2000-01-01',
                    100,
                    2
                )
            ).toBe(true);
        });

        it('should return false for mismatched passwords', () => {
            expect(
                ValidationUtils.isRegistrationDataValid(
                    'validUser',
                    'test@example.com',
                    'StrongP4ssword',
                    'DifferentP4ssword',
                    '2000-01-01',
                    100,
                    2
                )
            ).toBe(false);
        });

        it('should return false for invalid email', () => {
            expect(
                ValidationUtils.isRegistrationDataValid(
                    'validUser',
                    'invalid-email',
                    'StrongP4ssword',
                    'StrongP4ssword',
                    '2000-01-01',
                    100,
                    2
                )
            ).toBe(false);
        });
    });

    describe('isLoginValid', () => {
        it('should return true for valid login', () => {
            expect(ValidationUtils.isLoginValid('valid-login123')).toBe(true);
        });

        it('should return false for login that is too short', () => {
            expect(ValidationUtils.isLoginValid('ab')).toBe(false);
        });

        it('should return false for login containing special characters', () => {
            expect(ValidationUtils.isLoginValid('invalid@user!')).toBe(false);
        });
    });

    describe('isTextNameValid', () => {
        it('should return true for valid name', () => {
            expect(ValidationUtils.isTextNameValid('John')).toBe(true);
        });

        it('should return false for name with special characters', () => {
            expect(ValidationUtils.isTextNameValid('Joh#n')).toBe(false);
        });

        it('should return false for name that is too short', () => {
            expect(ValidationUtils.isTextNameValid('Jo')).toBe(false);
        });
    });

    describe('isEmailValid', () => {
        it('should return true for valid email', () => {
            expect(ValidationUtils.isEmailValid('test@example.com')).toBe(true);
        });

        it('should return false for email without "@"', () => {
            expect(ValidationUtils.isEmailValid('testexample.com')).toBe(false);
        });

        it('should return false for email with spaces', () => {
            expect(ValidationUtils.isEmailValid('test@ example.com')).toBe(false);
        });
    });

    describe('isPasswordValid', () => {
        it('should return true for matching strong passwords', () => {
            expect(ValidationUtils.isPasswordValid('StrongP4ssword', 'StrongP4ssword')).toBe(true);
        });

        it('should return false for mismatched passwords', () => {
            expect(ValidationUtils.isPasswordValid('StrongP4ssword', 'DifferentP4ssword')).toBe(false);
        });

        it('should return false for weak password', () => {
            expect(ValidationUtils.isPasswordValid('weakpass', 'weakpass')).toBe(false);
        });
    });

    describe('isBirthDateValid', () => {
        it('should return true for valid birth date', () => {
            expect(ValidationUtils.isBirthDateValid('2000-01-01')).toBe(true);
        });

        it('should return false for a date in the future', () => {
            expect(ValidationUtils.isBirthDateValid('3000-01-01')).toBe(false);
        });

        it('should return false for a date too far in the past', () => {
            expect(ValidationUtils.isBirthDateValid('1800-01-01')).toBe(false);
        });
    });

    describe('isNationalityValid', () => {
        it('should return true for a valid nationality ID', () => {
            expect(ValidationUtils.isNationalityValid(120)).toBe(true);
        });

        it('should return false for an invalid nationality ID (too low)', () => {
            expect(ValidationUtils.isNationalityValid(0)).toBe(false);
        });

        it('should return false for an invalid nationality ID (too high)', () => {
            expect(ValidationUtils.isNationalityValid(300)).toBe(false);
        });
    });

    describe('isGenderValid', () => {
        it('should return true for a valid gender ID', () => {
            expect(ValidationUtils.isGenderValid(2)).toBe(true);
        });

        it('should return false for an invalid gender ID (too low)', () => {
            expect(ValidationUtils.isGenderValid(0)).toBe(false);
        });

        it('should return false for an invalid gender ID (too high)', () => {
            expect(ValidationUtils.isGenderValid(5)).toBe(false);
        });
    });

});