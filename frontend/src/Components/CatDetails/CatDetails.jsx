import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Adjust path as necessary
import Room8Api from '../../api/api';
import ReassignCatForm from '../ReassignCat/ReassignCatForm';
import ReactModal from 'react-modal';

function CatDetails() {
    const [cat, setCat] = useState(null);
    const [error, setError] = useState(null);
    const { catId } = useParams();
    console.log("Cat ID:",catId);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [isReassigning, setIsReassigning] = useState(false);

    console.log("Logged in user details:", user);
    
    
    const getCatDetails = async () => {
        try {
            const catDetails = await Room8Api.getCatDetails(catId);
            setCat(catDetails);
            console.log("Fetched Cat Details:", catDetails);
        } catch (err) {
            console.error("Error loading cat details:", err);
            setError("Unable to load cat details. Please try again later.");
        }
    };

    useEffect(() => {
        getCatDetails();
    }, [catId]);


    const handleDelete = async () => {
        if (user && user.is_admin) {
            if (window.confirm("Are you sure you want to delete this cat?")) {
                try {
                    await Room8Api.deleteCat(catId);
                    navigate('/adopt');
                } catch (err) {
                    console.error("Failed to delete cat:", err);
                    setError("Failed to delete cat. Please try again later.");
                }
            }
        } else {
            setError("Unauthorized: You do not have permission to delete this cat.");
        }
    };

    const handleAdopt = async () => {
        if (user && user.is_admin) {  // Ensure only admins can mark as adopted
            try {
                await Room8Api.adoptCat(catId);
                setCat({ ...cat, adopted: true });
                alert(`${cat.name} has been successfully adopted.`);
                navigate('/adopt');
            } catch (err) {
                console.error("Failed to mark as adopted:", err);
                setError("Failed to mark as adopted. Please try again later.");
            }
        } else {
            setError("Unauthorized: You do not have permission to mark this cat as adopted.");
        }
    };

    const handleFeatureToggle = async () => {
        if (user && user.is_admin) {  // Ensure only admins can toggle the featured status
            try {
                const updatedCat = await Room8Api.toggleCatFeatured(catId);
                setCat({ ...cat, is_featured: updatedCat.is_featured });
            } catch (err) {
                console.error("Failed to update featured status:", err);
                setError("Failed to update featured status. Please try again later.");
            }
        } else {
            setError("Unauthorized: You do not have permission to modify this cat's featured status.");
        }
    };

    if (error) {
        return <div className="alert alert-danger" role="alert">{error}</div>;
    }

    if (!cat) return <div>Loading...</div>;
    console.log("FOSTER INFORMATION:", cat.foster)
    return (
        <div className="cat-details">
            <h2>{cat.name} ({cat.age} years old)</h2>
            <div><img src={cat.cat_image} alt={cat.cat_name} style={{ maxWidth: '100%' }} /></div>
            <p>Breed: {cat.breed}</p>
            <p>Description: {cat.description}</p>
            <p>Special Needs: {cat.special_needs || 'None'}</p>
            <p>Featured: {cat.is_featured ? 'Yes' : 'No'}</p>
            
            <p>Foster: {cat.foster_name ? cat.foster_name : 'No foster assigned'}</p>
            {(user && (user.is_admin || user.id === cat.foster_id)) && (
                        <button onClick={() => navigate(`/edit-cat/${catId}`)}>Edit</button>
                    )}

            {user && user.is_admin && (
                <>
                    <button onClick={handleDelete}>Delete Cat</button>
                    <button onClick={handleAdopt}>Mark as Adopted</button>
                    <button onClick={() => setIsReassigning(true)}>Reassign Foster</button>
                    <label>
                        Featured:
                        <input
                            type="checkbox"
                            checked={cat.is_featured}
                            onChange={handleFeatureToggle}
                        />
                    </label>
                </>
            )}

            {/* ReactModal for reassigning a cat to a new foster */}
            <ReactModal
                isOpen={isReassigning}
                onRequestClose={() => setIsReassigning(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%', // Adjust based on your design
                        height: 'auto' // Adjust based on your content
                    }
                }}
            >
                <ReassignCatForm 
                    catId={catId} 
                    closeModal={() => setIsReassigning(false)} 
                    onCatReassigned={getCatDetails}
                    // onCatReassigned={() => {
                    //     setIsReassigning(false); // Close the modal on successful reassignment
                    //     getCatDetails(); // Refresh cat details to update the foster name
                    // }}
                />
            </ReactModal>
        </div>
    );
}

export default CatDetails;
