import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Room8Api from '../../api/api';
import ReactModal from 'react-modal';
import AdminEditProfileForm from './AdminEditProfileForm';

function FosterDashboard() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [cats, setCats] = useState([]);
    const [fosterDetails, setFosterDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { fosterId } = useParams();
    const [isEditing, setIsEditing] = useState(false);

    ReactModal.setAppElement('#root');

    const handleDeleteFoster = async () => {
        if (window.confirm("Are you sure you want to delete this foster? This cannot be undone.")) {
            try {
                await Room8Api.deleteUser(fosterId); // Make sure this matches your API method for deleting a user
                navigate('/admin-dashboard'); // Redirect Admin back to the dashboard or another appropriate page
                alert('Foster has been successfully deleted.');
            } catch (err) {
                console.error("Error deleting foster:", err);
                alert('Failed to delete the foster. They might still have fostered cats.');
            }
        }
    };

    useEffect(() => {
        setLoading(true);

        const fetchFosterDetails = async () => {
            try {
                let details;
                // For admin accessing another user's profile or a foster accessing another foster's profile
                if (user.is_admin && fosterId) {
                    console.log("FOSTER ID:", fosterId)
                    console.log("IS USER ADMIN:", user.is_admin)
                    details = await Room8Api.getUserDetailsById(fosterId);
                    console.log("DETAILS:", details)
                } else {
                    // For fosters or admins accessing their own profile
                    details = await Room8Api.getUserDetails();
                }
                setFosterDetails(details);
            } catch (err) {
                console.error('Failed to fetch foster details:', err);
                setError('Failed to fetch foster details. Please try again later.');
                if (err.message === 'Unauthorized') {
                    navigate('/login'); // Redirect to login if unauthorized
                }
            }
        };

        const fetchCats = async () => {
            try {
                const targetUserId = fosterId || user.id;
                console.log("FETCH CAT TARGET USER ID:", targetUserId);
                const catResponse = await Room8Api.getFosterCats(targetUserId); // Should work for both foster and admin as it uses the auth token
                console.log("FETCH CAT USER ID:", user.id)
                console.log("CAT RESPONSE:", catResponse)
                setCats(catResponse);
            } catch (err) {
                console.error('Failed to fetch cats:', err);
                setError('Failed to fetch your cats. Please try again later.');
            }
        };

        if (user && (user.is_foster || user.is_admin)) {
            fetchFosterDetails();
            fetchCats();
        }

        setLoading(false);
    }, [user, fosterId, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className='foster-dashboard'>
            <h2>{fosterDetails.first_name}'s Cats</h2>
            <div>
                {/* <h3>Foster Information</h3>
                <p>Name: {fosterDetails.first_name} {fosterDetails.last_name}</p>
                <p>Email: {fosterDetails.email}</p>
                <p>Phone: {fosterDetails.phone_number}</p> */}
                {user.is_admin && (
                    <>
                        <button onClick={() => setIsEditing(true)}>Edit Foster Profile</button>
                        <button onClick={handleDeleteFoster} style={{ marginLeft: '10px' }}>Delete Foster Profile</button>
                    </>
                )}
            </div>
            {cats.length === 0 ? <div>No cats listed for this foster.</div> : cats.map(cat => (
                <div key={cat.id} className="cat-card">
                    <Link to={`/cats/${cat.id}`}>
                        <h3>{cat.name}</h3>
                        <img src={cat.cat_image} alt={cat.name} style={{ maxWidth: "300px", maxHeight: "300px", width: "auto", height: "auto" }} />

                    </Link>
                    <h4>{cat.age} years old</h4>
                    <p>Special Needs: {cat.special_needs}</p>
                </div>
            ))}

            <ReactModal
                isOpen={isEditing}
                onRequestClose={() => setIsEditing(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%'  // Adjust based on your design
                    }
                }}
            >
                <AdminEditProfileForm
                    userId={fosterId}
                    userDetails={fosterDetails}
                    close={() => setIsEditing(false)}
                    onSave={(updatedDetails) => {
                        setFosterDetails(updatedDetails);
                        setIsEditing(false); // Close the modal
                    }}
                />
            </ReactModal>
        </div>
    );
}

export default FosterDashboard;
