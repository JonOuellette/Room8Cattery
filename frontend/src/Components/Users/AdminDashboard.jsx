import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
import FosterList from './FosterList'; // Make sure this path is correct

const AdminDashboard = () => {
  
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <Link to="/create-user">Create New User</Link> {/* Change this to your route for creating users */}
            <FosterList />
        </div>
    );
};

export default AdminDashboard;
