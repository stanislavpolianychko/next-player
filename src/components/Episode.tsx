import React from 'react';
import styles from '@/styles/Episode.module.css';

/**
 * Episode is a TypeScript functional component representing an individual podcast episode.
 *
 * @param {Object} props - The properties of the Episode component.
 * @param {any} props.episode - The data for the episode.
 * @param {boolean} props.active - Determines whether the episode is in an active state.
 * @param {Function} props.onClick - The function to be executed when the episode is clicked.
 * @returns {JSX.Element} The JSX representation of the Episode component.
 */
interface EpisodeProps {
    episode: any;
    onClick: () => void;
}

const Episode: React.FC<EpisodeProps> = ({ episode, onClick }) => {
    return (
        <div onClick={onClick} className={styles.episodeContainer}>
            <h3 className={styles.episodeTitle}>{episode.title}</h3>
            <img alt="" src={episode['itunes:image'][0].$.href ?? "/episode-default-icon.png"} className={styles.image}/>
        </div>
    );
};

export default Episode;
