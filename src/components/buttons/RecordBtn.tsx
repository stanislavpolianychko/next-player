import { FaRecordVinyl } from "react-icons/fa6";
import styles from "@/styles/IconButton.module.css"
import React from 'react';

/**
 * RecordBtn is a TypeScript functional component representing a record button
 * with a vinyl icon that can be activated or deactivated based on the 'active' prop.
 *
 * @param {Object} props - The properties of the RecordBtn component.
 * @param {boolean} props.active - Determines whether the button is in an active state.
 * @param {Function} props.onClick - The function to be executed when the button is clicked.
 * @returns {JSX.Element} The JSX representation of the RecordBtn component.
 */
interface BtnProps {
    active: boolean;
    onClick: () => void
}

const RecordBtn: React.FC<BtnProps> = ({ active, onClick }) => {
    // Determine the color of the icon based on the 'active' prop
    const iconColor = active ? "red" : "black";

    return (
        <button className={styles.iconButton} onClick={onClick}>
            <FaRecordVinyl color={iconColor} className={styles.icon}></FaRecordVinyl>
        </button>
    );
};

export default RecordBtn;