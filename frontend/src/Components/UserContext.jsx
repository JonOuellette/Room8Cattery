import React, { createContext, useState, useContext, useEffect } from 'react';
import Room8Api from '../api/api';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const storedToken = localStorage.getItem("token");
    const [token, setInternalToken] = useState(storedToken);

    // Modify setUser to log when it's called
    const updateUser = (newUser) => {
        console.log('setUser called with:', newUser);
        setUser(newUser);
    };

    // Define fetchUserDetails
    const fetchUserDetails = async () => {
        if (token) {
            Room8Api.setToken(token);
            try {
                const userDetails = await Room8Api.getUserDetails();
                console.log('User details fetched:', userDetails);
                updateUser(userDetails);
            } catch (error) {
                console.error("Error fetching user details:", error);
                updateUser(null); // Log will be shown via updateUser
                setInternalToken(null);
                localStorage.removeItem('token');
            }
        } else {
            updateUser(null); // Log will be shown via updateUser
            Room8Api.setToken(null);
        }
    };

    useEffect(() => {
        console.log('useEffect triggered by token change:', token);
        fetchUserDetails();
    }, [token]); // React to changes in token

    const setToken = (newToken) => {
        console.log('setToken called with:', newToken);
        localStorage.setItem("token", newToken);
        setInternalToken(newToken);
        fetchUserDetails();  // Log will be shown via fetchUserDetails
    };
    
    const handleLogout = () => {
        setUser(null); // Clear user state
        setToken(null); // Clear token state
        localStorage.removeItem('token'); // Clears the token from localStorage
        Room8Api.setToken(null); // Ensure subsequent API calls are not using the old token
       
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser, token, setToken, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
