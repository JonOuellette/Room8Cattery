import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext

// const Navbar = () => {
//     const { token, setUser } = useContext(UserContext); // Use UserContext

//     const handleLogout = () => {
//         // Clears the user and token from context and localStorage
//         setUser({ ...user, isLoggedIn: false });
//         localStorage.removeItem('token'); // Clears the token from localStorage
//         window.location.reload(); // Reload the page to update the UI
//     };

//     return (
//         <nav className="navbar">
//             <ul className="nav-links">
//                 <li><Link to="/">Home</Link></li>
//                 <li><Link to="/about">About Us</Link></li>
//                 <li><Link to="/adopt">Adopt</Link></li>
//                 <li><Link to="/contact">Contact</Link></li>
//                 <li><Link to="/donate">Donate</Link></li>
//                 {token ? (
//                     <li><button onClick={handleLogout}>Sign Out</button></li>
//                 ) : (
//                     <li><Link to="/login">Foster Sign In</Link></li>
//                 )}
//             </ul>
//         </nav>
//     );
// };

const Navbar = () => {
    const { setUser, setToken } = useContext(UserContext); // Now using setToken as well

    const handleLogout = () => {
        setUser(null); // Clear user state
        setToken(null); // Clear token state
        localStorage.removeItem('token'); // Clears the token from localStorage
        Room8Api.setToken(null); // Ensure subsequent API calls are not using the old token
        window.location.reload(); // Optionally, redirect to login or home instead of reloading
    };

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/adopt">Adopt</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/donate">Donate</Link></li>
                {localStorage.getItem("token") ? (  // Changed to check localStorage directly
                    <li><button onClick={handleLogout}>Sign Out</button></li>
                ) : (
                    <li><Link to="/login">Foster Sign In</Link></li>
                )}
            </ul>
        </nav>
    );
};



export default Navbar;
