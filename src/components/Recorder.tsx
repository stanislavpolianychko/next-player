import React, { useState } from 'react';
import styles from '@/styles/Recorder.module.css';
import RecordBtn from '@/components/buttons/RecordBtn';
import DownloadBtn from '@/components/buttons/DownloadBtn';
import RecordingManager from '@/services/RecordingManager';


const Recorder: React.FC = () => {
    // State for managing recording status and existence
    const [recordingManager] = useState<RecordingManager>(new RecordingManager());
    const [recordingActive, setRecordingActive] = useState<boolean>(false);
    const [recordingExist, setRecordingExist] = useState<boolean>(false);

    // Toggles the recording status and updates the state accordingly
    const toggleRecording = () => {
        setRecordingExist(recordingActive);
        recordingManager.toggleRecording();
        setRecordingActive(!recordingActive);
    };

    return (
        // Container for the recorder section with record and download buttons
        <div className={styles.recorderContainer}>
            {/* Record button with the ability to start/stop recording */}
            <RecordBtn active={recordingActive} onClick={toggleRecording}></RecordBtn>

            {/* Download button with the ability to download the recording */}
            <DownloadBtn active={recordingExist} onClick={recordingManager.downloadRecording}></DownloadBtn>
        </div>
    );
};

export default Recorder;
