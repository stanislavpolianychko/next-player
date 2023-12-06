import React, { useRef } from "react";
import AudioConverter from "@/services/AudioConverter";

/**
 * Manages audio recording functionality.
 */
class RecordingManager {
    private _recordingActive: boolean = false;
    private audioBlob: Blob | null = null;
    private mediaRecorderRef: React.MutableRefObject<MediaRecorder | null> = useRef<MediaRecorder | null>(null);

    /**
     * Gets whether recording is currently active.
     */
    get recordingActive(): boolean {
        return this._recordingActive;
    }

    /**
     * Sets the recording status.
     * @param value - The new recording status.
     */
    set recordingActive(value: boolean) {
        this._recordingActive = value;
    }

    /**
     * Toggle the audio recording.
     */
    public toggleRecording = () => {
        if (this.recordingActive) {
            this.stopRecording();
        }
        else {
            this.startRecording();
        }
    };

    /**
     * Starts the audio recording.
     */
    private startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.setupMediaRecorder(stream);
                this.recordingActive = true;
            })
            .catch(error => {
                console.error("Error starting recording: ", error);
            });
    };

    /**
     * Stops the audio recording.
     */
    private stopRecording = () => {
        if (this.mediaRecorderRef.current) {
            this.mediaRecorderRef.current.stop();
            this.mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            this.recordingActive = false;
        }
    };

    /**
     * Downloads the recorded audio encoded in mp3 MP3.
     */
    public downloadRecording = async () => {
        if (this.audioBlob) {
            const audioConverter = new AudioConverter();
            await audioConverter.convertToMp3(this.audioBlob, (mp3Url: string) => {
                const a = document.createElement('a');
                a.href = mp3Url;
                a.download = 'recording.mp3';
                a.click();
                URL.revokeObjectURL(mp3Url);
            });
        }
    };

    /**
     * Handles the availability of audio data during recording.
     * @param event - The BlobEvent containing audio data.
     */
    private handleDataAvailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
            this.audioBlob = event.data;
            console.log("Recorded audio MIME type:", event.data.type);
            console.log("Recorded audio blob size:", event.data.size);
        }
    };

    /**
     * Sets up the MediaRecorder with the provided MediaStream.
     * @param stream - The MediaStream for recording.
     */
    private setupMediaRecorder = (stream: MediaStream) => {
        this.mediaRecorderRef.current = new MediaRecorder(stream);
        this.mediaRecorderRef.current.ondataavailable = this.handleDataAvailable;
        this.mediaRecorderRef.current.start();
    };
}

export default RecordingManager;
