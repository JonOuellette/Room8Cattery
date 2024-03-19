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
  const [volunteersSheetUrl, setVolunteersSheetUrl] = useState('');

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

  // Function to handle export of fosters to Google Sheet
  const handleExportFosters = async () => {
    try {
      const response = await Room8Api.exportFosters();
      setFostersSheetUrl(response.sheet_url);
    } catch (error) {
      console.error('Failed to export fosters:', error);
    }
  };

  const handleExportVolunteers = async () => {
    try {
      const response = await Room8Api.exportVolunteers();
      console.log("RESPONSE:", response)
      setVolunteersSheetUrl(response.sheet_url);
    } catch (error) {
      console.error('Failed to export volunteers:', error);
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
      <button onClick={handleExportVolunteers}>Export Volunteers to Google Sheets</button>
      {volunteersSheetUrl && <a href={volunteersSheetUrl} target="_blank" rel="noopener noreferrer">View Exported Volunteers</a>}

      {/* Modal for creating a new account */}
      <ReactModal
        isOpen={isCreatingAccount}
        onRequestClose={() => setIsCreatingAccount(false)}
        style={{
          content: {
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '45%' 
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
