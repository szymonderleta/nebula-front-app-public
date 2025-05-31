import React, {useEffect, useState} from 'react';
import '../../resource/style/Achievements.css';
import UserData from "../../data/UserData";

const defaultTableHeaders = [
    {key: 'id', label: 'Id'},
    {key: 'iconUrl', label: 'Icon'},
    {key: 'name', label: 'Name'},
    {key: 'progress', label: 'Progress'},
    {key: 'level', label: '5-star scale'}
];

const RenderStarRating = ({rating}) => {
    const stars = Array.from({length: 5}, (_, i) => (
        <span
            key={i + 1}
            data-testid="star"
            className={i + 1 <= rating ? 'gold-star' : 'black-star'}
            aria-label={i + 1 <= rating ? 'gold star' : 'black star'}
        >
            &#9733;
        </span>
    ));
    return <div className="star-container" data-testid="star-container">{stars}</div>;
};


/**
 * Achievements component.
 *
 * This React component displays a table of user achievements. It fetches
 * user achievement data from an external source and renders it in an organized
 * format, including attributes like ID, icon, name, progress, and level.
 *
 * The component uses hooks such as `useState` to manage the achievements data
 * and `useEffect` to fetch data asynchronously upon component mount. It dynamically
 * renders the table headers and rows based on the fetched data.
 *
 * Key Features:
 * - Fetches user data including achievements from an external source.
 * - Displays achievements in a tabular layout with specific details.
 * - Renders achievements' icon, name, progress, and level with proper styling.
 *
 * Dependencies:
 * - Requires `UserData.loadUserData()` to return the achievement data in a specific format.
 * - Assumes the existence of `defaultTableHeaders` array for table header definitions.
 * - Utilizes `RenderStarRating` component to visually represent the achievement level.
 *
 * Styling:
 * - The parent container uses the class `full-page-container`.
 * - Table uses the class `custom-table` for styling.
 * - Achievement icons are styled using the class `achievement-icon`.
 */
const Achievements = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {achievements: achievementsData} = await UserData.loadUserData();
                setAchievements(achievementsData);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        fetchData();
    }, []);

    const renderTableHeader = () =>
        defaultTableHeaders.map(({key, label}) => (
            <th key={key} style={{textAlign: 'left'}}>
                {label}
            </th>
        ));

    return (
        <div className='full-page-container'>
            <table className="custom-table">
                <thead>
                    <tr>{renderTableHeader()}</tr>
                </thead>
                <tbody>
                {achievements.map(({id, iconUrl, name, progress, level}) => (
                    <tr key={id}>
                        <td style={{textAlign: 'left'}}>{id}</td>
                        <td style={{textAlign: 'left'}}>
                            <img
                                src={iconUrl}
                                alt={name}
                                className="achievement-icon"
                            />
                        </td>
                        <td style={{textAlign: 'left'}}>{name}</td>
                        <td style={{textAlign: 'left'}}>{progress}</td>
                        <td style={{textAlign: 'left'}}>
                            <RenderStarRating rating={level}/>
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );
};

export default Achievements;
