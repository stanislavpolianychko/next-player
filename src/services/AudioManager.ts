class AudioManager {
    public readonly episodes: any[];
    private currentPlaying: { audio: HTMLAudioElement; id: number } | null = null;
    private isOperationInProgress: boolean = false;

    constructor(episodes: any[]) {
        this.episodes = episodes;
    }

    /**
     * Creates an HTMLAudioElement for the given audio URL.
     * @param audioUrl - The URL of the audio.
     * @returns The created HTMLAudioElement.
     */
    private createAudioElement(audioUrl: string): HTMLAudioElement {
        const audio = new Audio(audioUrl);
        audio.addEventListener('ended', this.playNext);
        return audio;
    }


    /**
     * Plays the next episode in the playlist.
     */
    private playNext = (): void => {
        const nextIndex = this.currentPlaying ? (this.currentPlaying.id + 1) % this.episodes.length : 0;
        const nextEpisode = this.episodes[nextIndex];
        this.switchAudio(nextEpisode.enclosure[0].$.url, nextIndex);
    };

    /**
     * Asynchronously plays the given audio and updates the currentPlaying state.
     * @param audio - The audio element to play.
     * @param id - The ID of the episode.
     * @returns A promise that resolves when the play operation is complete.
     */
    private async play(audio: HTMLAudioElement, id: number): Promise<void> {
        if (!this.isOperationInProgress) {
            this.isOperationInProgress = true;
            try {
                await audio.play();
                this.currentPlaying = { audio, id };
            } catch (error) {
                console.error("Error while playing audio:", error);
            } finally {
                this.isOperationInProgress = false;
            }
        }
    }

    /**
     * Pauses the given audio and updates the currentPlaying state.
     * @param audio - The audio element to pause.
     */
    private pause(audio: HTMLAudioElement): void {
        if (!this.isOperationInProgress) {
            this.isOperationInProgress = true;
            audio.pause();
            this.isOperationInProgress = false;
        }
    }

    /**
     * Switches to the next audio with a delay.
     */
    private switchAudio(nextAudioUrl: string, nextIndex: number): void {
        if (!this.isOperationInProgress) {
            this.playEpisode(nextAudioUrl, nextIndex);
        }
    }

    /**
     * Plays or pauses the current episode based on the current state.
     * If the audio is paused, it resumes playback. If playing, it pauses.
     */
    private togglePlayPause = (): void => {
        if (this.currentPlaying) {
            const audio = this.currentPlaying.audio;
            if (audio.paused) {
                this.play(audio, this.currentPlaying.id).catch(error => console.error("Error while playing audio:", error));
            } else {
                this.pause(audio);
            }
        }
    };

    /**
     * Plays the specified episode.
     * If the episode is already playing, it toggles between play and pause.
     * @param audioUrl - The URL of the audio to play.
     * @param id - The ID of the episode.
     */
    public playEpisode = (audioUrl: string, id: number) => {
        if (this.currentPlaying && this.currentPlaying.id === id) {
            this.togglePlayPause();
        } else {
            if (this.currentPlaying) {
                this.togglePlayPause();
            }
            const audio = this.createAudioElement(audioUrl);
            this.play(audio, id);
        }
    }

}

export default AudioManager;