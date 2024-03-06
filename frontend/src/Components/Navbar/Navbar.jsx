import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext

const Navbar = () => {
    const { user, setUser } = useContext(UserContext); // Use UserContext

    const handleLogout = () => {
        setUser(null); // Clears the user from context
        localStorage.removeItem('userToken'); // Clears the token from localStorage
        window.location.reload(); // Reload the page to update the UI
    };

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/adopt">Adopt</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/donate">Donate</Link></li>
                {user ? (
                    <li><button onClick={handleLogout}>Sign Out</button></li>
                ) : (
                    <li><Link to="/login">Foster Sign In</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
