import React from 'react';
import styles from '@/styles/Header.module.css';

/**
 * Functional component representing a header with a specified text.
 *
 * @component
 * @param {HeaderProps} props - The properties of the Header component.
 * @returns {JSX.Element} The rendered Header component.
 */
interface HeaderProps {
    headerText: string;
}

const Header: React.FC<HeaderProps> = ({ headerText }) => {
    return (
        <header className={styles.header}>
            <h1>{headerText}</h1>
        </header>
    );
};

export default Header;
