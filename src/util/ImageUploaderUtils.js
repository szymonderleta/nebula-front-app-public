import ImageUploadRequest from "../api/image/ImageUploadRequest";
import avatarListenerSingletonInstance from "../singles/AvatarListenerSingleton";
import UserAvatar from "../data/UserAvatar";

/**
 * Reads a file and converts it to a DataURL string.
 * @param {File} file - The file to be read.
 * @returns {Promise<string>} - A promise resolving to the DataURL of the file.
 */
export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Failed to read file as DataURL.");
        reader.readAsDataURL(file);
    });
};

/**
 * Makes an upload request for the given image data URL.
 * @param {string} imageDataUrl - The DataURL of the image to upload.
 * @returns {Promise<boolean>} - A promise resolving to whether the upload was successful.
 */
export const uploadImageRequest = async (imageDataUrl) => {
    try {
        return await ImageUploadRequest(imageDataUrl);
    } catch (error) {
        console.error("Error during image upload request:", error);
        return false;
    }
};

/**
 * Notifies observers with a specified delay.
 * @param {number} delay - The delay in milliseconds before notifying observers.
 */
export const notifyObserversWithDelay = (delay) => {
    setTimeout(() => {
        avatarListenerSingletonInstance.notifyObservers();
    }, delay);
};

/**
 * Processes an image file and uploads it, while also updating the user's avatar and notifying observers.
 * @param {File} file - The file to process and upload.
 */
export const processAndUploadImage = async (file) => {
    try {
        const imageDataUrl = await readFileAsDataURL(file);
        const uploadSuccess = await uploadImageRequest(imageDataUrl);

        if (uploadSuccess) {
            const updateSuccess = await UserAvatar.updateAvatar();
            if (updateSuccess) {
                notifyObserversWithDelay(100);
            }
        } else {
            console.error("Image upload failed.");
        }
    } catch (error) {
        console.error("Error during image processing:", error);
    }
};
