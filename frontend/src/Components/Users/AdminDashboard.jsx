import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
import FosterList from './FosterList';
import CreateAccountForm from '../CreateAccount/CreateAccountForm';
import ReactModal from 'react-modal';
import './AdminDashboard.css'


const AdminDashboard = () => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [fosterUpdated, setFosterUpdated] = useState(false);
  const [catsSheetUrl, setCatsSheetUrl] = useState('');
  const [fostersSheetUrl, setFostersSheetUrl] = useState('');

  // Function to handle export of cat data to Google Sheets
  const handleExportCats = async () => {
    try {
      const response = await Room8Api.exportCats();
      console.log("RESPONSE:", response)
      setCatsSheetUrl(response.sheet_url);
    } catch (error) {
      console.error('Failed to export cats:', error);
    }
  };

  const handleExportFosters = async () => {
    try {
      const response = await Room8Api.exportFosters();
      setFostersSheetUrl(response.sheet_url);
    } catch (error) {
      console.error('Failed to export fosters:', error);
    }
  };

  ReactModal.setAppElement('#root');


  return (
    <div className='admin-dashboard'>
      <h2>Admin Dashboard</h2>
      <button onClick={() => setIsCreatingAccount(true)}>Create New User</button>
      <FosterList fosterUpdated={fosterUpdated} />

      {/* Buttons for exporting data to Google Sheets */}
      <button onClick={handleExportCats}>Export Cats to Google Sheets</button>
      {catsSheetUrl && <a href={catsSheetUrl} target="_blank" rel="noopener noreferrer">View Exported Cats</a>}
      <button onClick={handleExportFosters}>Export Fosters to Google Sheets</button>
      {fostersSheetUrl && <a href={fostersSheetUrl} target="_blank" rel="noopener noreferrer">View Exported Fosters</a>}

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
