import {APP_REQUEST_URL} from '../../data/Credentials';
import POSTRequestForMultipart from "../method/POSTRequestForMultipart";

async function ImageUploadRequest(image) {
    const url = APP_REQUEST_URL + '/image';
    const formData = await createFormDataFromImage(image, image.name);
    return await POSTRequestForMultipart(url, formData);
}

async function createFormDataFromImage(image, fileName) {
    const binaryData = atob(image.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

    const fileType = getFileType(image);
    const mimeType = `image/${fileType}`;
    const fileExtension = `image.${fileType}`;

    const formData = new FormData();
    formData.append('file', new Blob([arrayBuffer], {type: mimeType}), fileName || fileExtension);
    return formData;
}

function getFileType(image) {
    const header = image.split(',')[0];
    const type = header.match(/image\/([a-zA-Z]+)/);
    return type ? type[1] : 'jpeg';
}

export default ImageUploadRequest;
