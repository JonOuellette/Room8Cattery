import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext
import Room8Api from '../../api/api';
import './Navbar.css';
import Room8Logo from '../../images/Room8Logo.png';

const Navbar = () => {
    // const { user, setUser, setToken } = useContext(UserContext); // Now using setToken as well
    const { user, token, handleLogout } = useContext(UserContext);
    console.log('Current user in NavBar:', user);
    const navigate = useNavigate();


    const logoutHandler = () => {
        handleLogout(); // Perform the logout operation
        navigate('/login'); // Navigate to the login page after logout
    };
    // If issues with logout consider using this method
    // const logoutHandler = async () => {
    //     await handleLogout(); // Assuming handleLogout might become asynchronous
    //     navigate('/login'); // Navigate after ensuring logout has been processed
    // };


    return (
        <nav className="navbar">
             <div className="logo-and-name">
                <div className="nav-brand">
                    <Link to="/">
                        <img src={Room8Logo} alt="Room8 Memorial Cat Foundation" />
                    </Link>
                </div>
                <h2 className="nav-name">Room 8 Memorial Cat Foundation</h2>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/adopt">Adopt</Link></li>
                <li><Link to="/volunteer">Volunteer</Link></li>
                <li><Link to="/donate">Donate</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
            </ul>
            <div className='nav-links'>
                {token ? (
                    <>
                        <span>Welcome, <Link to="/profile">{user ? user.first_name : 'User'}</Link></span>
                        <button onClick={logoutHandler}>Sign Out</button>
                    </>
                ) : (
                    <Link to="/login">Foster Sign In</Link>
                )}
            </div>
        </nav>
    );
};



export default Navbar;
