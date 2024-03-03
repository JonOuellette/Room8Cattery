import React from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';

const Navbar = () => {
    // Use the custom hook for authentication state
    const [userToken, setUserToken] = useLocalStorage('userToken', null);

    const handleLogout = () => {
        // Clear the user token to log out the user
        setUserToken(null); // Clears the token from both state and localStorage
        window.location.reload(); // Reload the page to update the UI
    };

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/adopt">Adopt</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/fosters">Fosters Sign</Link></li>
                <li><Link to="/donate">Donate</Link></li>
                {userToken ? (
                    <li><button onClick={handleLogout}>Sign Out</button></li> // You can style this as needed
                ) : (
                    <li><Link to="/signin">Sign In</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
