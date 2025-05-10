import React, {useEffect} from 'react';
import '../../resource/style/ImageUploader.css';
import AvatarComponent from "../component/AvatarComponent";
import UserAvatar from "../../data/UserAvatar";
import {processAndUploadImage} from "../../util/ImageUploaderUtil";

/**
 * ImageUploader is a React functional component that provides functionality for uploading and updating user avatars.
 * It supports drag-and-drop uploading, as well as file selection through an input element.
 *
 * Key functionalities include:
 * - Automatically updating the avatar upon component mount by invoking the `updateAvatarOnMount` method.
 * - Handling image uploads through drag-and-drop or file input selection via `handleDrop` and `handleFileUpload` methods.
 *
 * The uploaded file is processed and updated using internal methods.
 */
const ImageUploader = () => {

    useEffect(() => {
        updateAvatarOnMount();
    }, []);

    const updateAvatarOnMount = async () => {
        try {
            await UserAvatar.updateAvatar();
        } catch (error) {
            console.error("Failed to update avatar on mount:", error);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processAndUploadImage(file);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) processAndUploadImage(file);
    };

    return (
        <div className="imageLoaderDiv"
             onDrop={handleDrop}
             onDragOver={(e) => e.preventDefault()}>
            <AvatarComponent width="192px" height="192px"/>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{display: 'none'}}
                id="fileInput"
            />

            <label htmlFor="fileInput">
                Drag image to field or click <span className="highlight-here">here</span> to upload an image
            </label>


            {/*<label htmlFor="fileInput">Drag image to field or click here to upload an image</label>*/}
        </div>
    );
};

export default ImageUploader;
