import React, { useEffect, useState } from 'react';
import styles from '@/styles/EpisodesList.module.css';
import Episode from '@/components/Episode';
import AudioManager from '@/services/AudioManager';
import axios from 'axios';
import xml2js from 'xml2js';

interface EpisodesListProps {
    url: string;
}

const EpisodesList: React.FC<EpisodesListProps> = ({ url }) => {
    // State for managing the audio manager and the currently playing episode ID
    const [audioManager, setAudioManager] = useState<AudioManager | undefined>(undefined);

    // Fetch RSS feed and initialize the audio manager when the component mounts
    useEffect(() => {
        axios
            .get(url)
            .then((response) => {
                // Parse the XML response and create an AudioManager instance
                xml2js.parseString(response.data, (err, result) => {
                    if (!err) {
                        setAudioManager(new AudioManager(result.rss.channel[0].item));
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching RSS feed:', error);
            });
    }, [url]);

    return (
        <>
            {/* Render the episodes container only when the audioManager is available */}
            {audioManager && (
                <div className={styles.episodesContainer}>
                    {/* Map through episodes and render Episode components */}
                    {audioManager.episodes.map((episode, index) => (
                        <Episode
                            key={index}
                            episode={episode}
                            onClick={() => audioManager.playEpisode(episode.enclosure[0].$.url, index)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default EpisodesList;
