import React from 'react';
import {useParams} from 'react-router-dom';
import ConfirmationTokenRequest from "../../api/account/ConfirmationTokenRequest";

/**
 * ConfirmationAccount is a React functional component used for confirming user accounts
 * based on the provided ID and token retrieved from the URL parameters.
 * It provides a UI for displaying the ID and token, along with a button to confirm the account.
 *
 * The component utilizes the `useParams` hook to extract the ID and token from the URL.
 * It performs an account confirmation request upon user interaction, and redirects
 * the user upon successful confirmation.
 *
 * Key Functionalities:
 * - Extracts `id` and `token` from the URL using `useParams`.
 * - Processes and formats the ID and token into a structured object using `createTokenData`.
 * - Sends a confirmation request with the processed data.
 * - Alerts the user and redirects to the homepage upon successful account confirmation.
 * - Logs errors to the console if the request fails.
 */
const ConfirmationAccount = () => {
    const {id, token} = useParams();

    const createTokenData = (id, token) => {
        const parsedId = parseInt(id, 10);
        return {
            tokenId: parsedId,
            token: token,
        };
    };

    const handleConfirmation = () => {
        const confirmationData = createTokenData(id, token);
        ConfirmationTokenRequest(confirmationData)
            .then(() => {
                alert("The account has been confirmed");
                window.location.href = '/';
            })
            .catch((err) => console.error("Error during confirmation:", err));
    };

    return (
        <div>
            <h1>Account confirmation link</h1>
            <h1>ID: {id}</h1>
            <h2>Token: {token}</h2>
            <button onClick={handleConfirmation}>
                Confirm
            </button>
        </div>
    );
};

export default ConfirmationAccount;
