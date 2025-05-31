import ImageUploadRequest from './ImageUploadRequest';
import POSTRequestForMultipart from '../method/POSTRequestForMultipart';

jest.mock('../method/POSTRequestForMultipart');

describe('ImageUploadRequest', () => {
    const mockBase64Image = 'data:image/png;base64,' + btoa('mockImageData');
    const mockResponse = {success: true, message: 'File uploaded successfully'};

    beforeEach(() => {
        POSTRequestForMultipart.mockClear();
    });

    test('should upload a valid Base64 image properly', async () => {
        POSTRequestForMultipart.mockResolvedValue(mockResponse);

        const response = await ImageUploadRequest(mockBase64Image);

        expect(POSTRequestForMultipart).toHaveBeenCalledTimes(1);
        expect(POSTRequestForMultipart).toHaveBeenCalledWith(
            expect.stringContaining('/image'),
            expect.any(FormData)
        );
        expect(response).toEqual(mockResponse);
    });

    test('should correctly create FormData with valid Base64 image', async () => {
        POSTRequestForMultipart.mockResolvedValue(mockResponse);

        const fileName = 'test-image.png';
        const response = await ImageUploadRequest(mockBase64Image);

        expect(POSTRequestForMultipart).toHaveBeenCalledTimes(1);

        const formData = POSTRequestForMultipart.mock.calls[0][1];
        const entries = [...formData.entries()];

        const fileEntry = entries.find(([key]) => key === 'file');
        expect(fileEntry).toBeDefined();
        const fileBlob = fileEntry[1];

        expect(fileBlob).toBeInstanceOf(Blob);
        expect(fileBlob.type).toBe('image/png');
    });

    test('should throw error if image is not a string', async () => {
        const invalidImage = {data: null};

        await expect(ImageUploadRequest(invalidImage)).rejects.toThrowError(
            /image.split is not a function/
        );

        expect(POSTRequestForMultipart).not.toHaveBeenCalled();
    });

    test('should throw error if invalid Base64 string is provided', async () => {
        const invalidBase64 = 'invalid-base64-data';

        await expect(ImageUploadRequest(invalidBase64)).rejects.toThrowError(
            /(The string to be decoded contains invalid characters|Failed to execute 'atob' on 'Window')/
        );

        expect(POSTRequestForMultipart).not.toHaveBeenCalled();
    });
});
