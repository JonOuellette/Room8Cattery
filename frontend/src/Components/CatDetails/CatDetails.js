import React, { useState, useEffect } from 'react';
import Room8Api from '../api/api'; 
import { useParams } from 'react-router-dom';

function CatDetails() {
    const [cat, setCat] = useState(null);
    const [error, setError] = useState(null);
    const { catId } = useParams();

    useEffect(() => {
        async function getCatDetails() {
            try {
                const catDetails = await Room8Api.getCatDetails(catId);
                setCat(catDetails);
            } catch (err) {
                console.error("Error loading cat details:", err);
                setError("Unable to load cat details. Please try again later.");
            }
        }

        getCatDetails();
    }, [catId]); // Reload if catId changes

    if (error) {
        return <div className="alert alert-danger" role="alert">{error}</div>;
    }

    if (!cat) return <div>Loading...</div>;

    return (
        <div className="cat-details">
            <h2>{cat.name} ({cat.age} years old)</h2>
            <div><img src={cat.image_url} alt={cat.name} style={{ maxWidth: '100%' }}/></div>
            <p>Breed: {cat.breed}</p>
            <p>Description: {cat.description}</p>
            <p>Special Needs: {cat.special_needs || 'None'}</p>
            <p>Featured: {cat.is_featured ? 'Yes' : 'No'}</p>
            
        </div>
    );
}

export default CatDetails;
