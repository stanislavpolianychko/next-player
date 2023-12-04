import React from 'react';
import styles from '@/styles/IconButton.module.css';
import { HiOutlineDownload } from 'react-icons/hi';

/**
 * DownloadBtn is a TypeScript functional component representing a download button
 * with an icon that can be activated or deactivated based on the 'active' prop.
 *
 * @param {Object} props - The properties of the DownloadBtn component.
 * @param {boolean} props.active - Determines whether the button is in an active state.
 * @param {Function} props.onClick - The function to be executed when the button is clicked.
 * @returns {JSX.Element} The JSX representation of the DownloadBtn component.
 */
interface BtnProps {
    active: boolean;
    onClick: () => void;
}

const DownloadBtn: React.FC<BtnProps> = ({ active, onClick }) => {
    // Determine the color of the icon based on the 'active' prop
    const iconColor = active ? "black" : "gray";

    return (
        <button className={styles.iconButton} onClick={onClick}>
            {/* Download icon with color based on the 'active' prop */}
            <HiOutlineDownload color={iconColor} className={styles.icon} />
        </button>
    );
};

export default DownloadBtn;
