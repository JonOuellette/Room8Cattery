import React, { useState } from 'react';
import Room8Api from '../../api/api';
import './ChangePassword.css'

function ChangePasswordForm({ userId, close }) {
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Change password using API
            await Room8Api.changeUserPassword(userId, passwordData.old_password, passwordData.new_password);
            alert('Password changed successfully.'); // Provide user feedback
            close(); // Close the modal
        } catch (err) {
            console.error("Failed to change password:", err);
            alert("Failed to change password: " + (err.response?.data?.error || err.message)); // Display error to user
        }
    };

    return (
        <form className='change-password-form' onSubmit={handleSubmit}>
            <label htmlFor="old-password">Old Password:</label>
            <input type="password" id="old-password" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} />
            <label htmlFor="new-password">New Password:</label>
            <input type="password" id="new-password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} />
            <button type="submit">Change Password</button>
            <button type="button" onClick={close}>Cancel</button>
        </form>
    );
}

export default ChangePasswordForm;
