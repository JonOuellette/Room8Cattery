import React, { createContext, useState, useContext } from 'react';

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for using context
export const useUser = () => useContext(UserContext);
