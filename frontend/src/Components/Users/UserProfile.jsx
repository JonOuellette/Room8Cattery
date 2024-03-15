import React, { useEffect, useState, useContext } from 'react';
import Room8Api from '../../api/api';
import { UserContext } from '../UserContext';
import AdminDashboard from './AdminDashboard';
import FosterDashboard from './FosterDashboard';
import ReactModal from 'react-modal';
import EditProfileForm from './EditProfileForm'; 
import ChangePasswordForm from './ChangePasswordForm'; 
import './UserProfile.css'

ReactModal.setAppElement('#root'); 

function UserProfile() {
    const { user, setUser } = useContext(UserContext);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const userData = await Room8Api.getUserDetails();
                setProfileData(userData);
                setLoading(false);
            } catch (err) {
                console.error("Error loading user profile:", err);
                setLoading(false);
            }
        };
        getProfileData();
    }, [setUser]);

    if (loading) {
        return <div>Loading...</div>;
    }
    console.log("PROFILE DATA:", profileData)
    return (
        <div className='user-profile'>
            <h2>{profileData.username}'s Profile</h2>
            <div>First Name: {profileData.first_name}</div>
            <div>Last Name: {profileData.last_name}</div>
            <div>Phone Number: {profileData.phone_number}</div>
            <div>Email: {profileData.email}</div>
            <div>Role: {user.is_admin ? 'Admin' : 'Foster'}</div>
            <button onClick={() => setEditModalIsOpen(true)}>Edit Profile</button>
            <button onClick={() => setPasswordModalIsOpen(true)}>Change Password</button>
            {user.is_admin && <AdminDashboard />}
            {!user.is_admin && user.is_foster && <FosterDashboard />}

            <ReactModal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)}>
                <EditProfileForm user={profileData} close={() => setEditModalIsOpen(false)} />
            </ReactModal>

            <ReactModal isOpen={passwordModalIsOpen} onRequestClose={() => setPasswordModalIsOpen(false)}>
                <ChangePasswordForm userId={profileData.id} close={() => setPasswordModalIsOpen(false)} />
            </ReactModal>
        </div>
    );
}

export default UserProfile;

