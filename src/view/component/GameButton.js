import React from "react";

/**
 * A functional component that renders a button for a game. The button, when enabled
 * and clicked, redirects the user to the game's page URL. The button also displays
 * an optional game icon and the game's name.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.game - The game object containing the details to display and configure the button.
 * @param {boolean} props.game.enable - Determines whether the button is clickable or disabled.
 * @param {string} [props.game.iconUrl] - Optional URL for the game's icon to display on the button.
 * @param {string} props.game.name - The name of the game to display as the button text.
 * @param {string} props.game.pageUrl - The URL to redirect to when the button is clicked.
 *
 * @returns {JSX.Element} The rendered button component for the game.
 */
const GameButton = ({game}) => {
    const handleClick = () => {
        if (game.enable) {
            window.location.href = game.pageUrl;
        }
    };

    return (
        <button className="game-button" onClick={handleClick} disabled={!game.enable}>
            {game.iconUrl && <img className="game-icon" src={game.iconUrl} alt={game.name}/>}
            {game.name}
        </button>
    );
};

export default GameButton;
