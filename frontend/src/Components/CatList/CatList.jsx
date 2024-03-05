import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
import CatDetails from '../CatDetails/CatDetails';

function CatList() {
    const [cats, setCats] = useState([]);
    const [error, setError] = useState(null);

    // Fetch adoptable cats from the API
    useEffect(() => {
        async function getCats() {
            try {
                const fetchedCats = await Room8Api.getAdoptableCats();
                setCats(fetchedCats);
                setError(null); // Clear error if the request is successful
            } catch (err) {
                console.error("Failed to fetch cats", err);
                setError("Failed to fetch cats. Please try again later."); // Set error message
            }
        }

        getCats();
    }, []); // Empty dependency array means this effect runs once after initial render

    return (
        <div>
            <h2>Adoptable Cats</h2>
            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message if error exists */}
            <div className="cat-list">
                {cats.length ? (
                    cats.map(cat => (
                        <div key={cat.id}>
                            <Link to={`/cats/${cat.id}`}>View {cat.name}</Link> 
                        </div>
                    ))
                ) : (
                    <p>No cats available for adoption right now.</p>
                )}
            </div>
        </div>
    );
}

export default CatList;
