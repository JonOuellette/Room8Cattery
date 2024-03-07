import React, { createContext, useState, useContext, useEffect } from 'react';
import Room8Api from '../api/api';

// // Create Context
// export const UserContext = createContext();

// // Provider Component
// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState("");

//     useEffect(() => {
//         const fetchUserDetails = async () => {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 Room8Api.setToken(token); // Ensure API calls use the token
//                 try {
//                     const userDetails = await Room8Api.getUserDetails(); 
//                     setUser(userDetails);
//                 } catch (error) {
//                     console.error("Error fetching user details:", error);
//                     setUser(null);
//                     localStorage.removeItem('token'); 
//                     // Handle error, e.g., clearing invalid token
//                 }
//             }
//         };

//         fetchUserDetails();
//     }, [token]);


//     return (
//         <UserContext.Provider value={{ user, setUser, token, setToken }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// // Custom hook for using context
// export const useUser = () => useContext(UserContext);



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const storedToken = localStorage.getItem("token"); // Get token from localStorage at the start
    const [token, setInternalToken] = useState(storedToken);

    useEffect(() => {
        fetchUserDetails();
    }, [token]); // React to changes in token

    const fetchUserDetails = async () => {
        if (token) {
            Room8Api.setToken(token);
            try {
                const userDetails = await Room8Api.getUserDetails();
                setUser(userDetails);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setUser(null);
                setInternalToken(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null); // Ensure user is null if there's no token
            Room8Api.setToken(null); // Clear API token
        }
    };

    const setToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setInternalToken(newToken); // Update internal state to trigger useEffect
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);


