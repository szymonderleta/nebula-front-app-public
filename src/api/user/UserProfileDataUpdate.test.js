import UserProfileDataUpdate from './UserProfileDataUpdate';
import { PATCHRequest } from '../handler/handlerTokenRefresh';
import DateTimeUtils from '../../util/DateTimeUtils';
import { APP_REQUEST_URL } from '../../data/Credentials';

jest.mock('../handler/handlerTokenRefresh', () => ({
    PATCHRequest: jest.fn(),
}));

jest.mock('../../util/DateTimeUtils', () => ({
    transformToTimestamp: jest.fn(),
}));

jest.mock('../../data/Credentials', () => ({
    APP_REQUEST_URL: 'https://api.example.com',
}));

describe('UserProfileDataUpdate', () => {
    const profileData = {
        id: 'user456',
        firstName: 'Jan',
        lastName: 'Kowalski',
        birthDate: '1990-01-01',
        nationality: { id: 'pl' },
        gender: { id: 'male' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call PATCHRequest with correct URL and transformed formData', async () => {
        DateTimeUtils.transformToTimestamp.mockReturnValue(631152000000);

        const mockResponse = { success: true };
        PATCHRequest.mockResolvedValue(mockResponse);

        const result = await UserProfileDataUpdate(profileData);

        expect(DateTimeUtils.transformToTimestamp).toHaveBeenCalledWith(profileData.birthDate);

        const expectedUrl = 'https://api.example.com/users/profile';
        const expectedFormData = {
            userId: profileData.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            birthdate: 631152000000,
            nationalityId: profileData.nationality.id,
            genderId: profileData.gender.id,
        };

        expect(PATCHRequest).toHaveBeenCalledTimes(1);
        expect(PATCHRequest).toHaveBeenCalledWith(expectedUrl, expectedFormData);

        expect(result).toBe(mockResponse);
    });

    test('should propagate errors from PATCHRequest', async () => {
        const error = new Error('Failed to update');
        PATCHRequest.mockRejectedValue(error);

        await expect(UserProfileDataUpdate(profileData)).rejects.toThrow('Failed to update');
    });
});
