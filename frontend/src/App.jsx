import React, {useState} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './Components/UserContext';
import Navbar from './Components/Navbar/Navbar';
import AppRoutes from './Routes/AppRoutes'; 

function App() {
  return (
      <UserProvider>
          <Router>
              <Navbar />
              <div className="content-container">
                    <AppRoutes />
                </div>
          </Router>
      </UserProvider>
  );
}

export default App;