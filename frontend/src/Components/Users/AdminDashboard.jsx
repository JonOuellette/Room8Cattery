import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
import FosterList from './FosterList';
import CreateAccountForm from '../CreateAccount/CreateAccountForm';
import ReactModal from 'react-modal';


const AdminDashboard = () => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [fosterUpdated, setFosterUpdated] = useState(false);
  

  ReactModal.setAppElement('#root');


  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => setIsCreatingAccount(true)}>Create New User</button>
      <FosterList fosterUpdated={fosterUpdated} />

      {/* Modal for creating a new account */}
      <ReactModal
        isOpen={isCreatingAccount}
        onRequestClose={() => setIsCreatingAccount(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%' // Adjust based on your design
          }
        }}
      >
        <CreateAccountForm
          closeModal={() => setIsCreatingAccount(false)}
          onUserCreated={() => setFosterUpdated(prev => !prev)} // Updating state on user creation
        />
      </ReactModal>

     
    </div>
  );
};

export default AdminDashboard;
