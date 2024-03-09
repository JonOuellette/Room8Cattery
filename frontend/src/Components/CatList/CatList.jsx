import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
import { UserContext } from '../UserContext';

function CatList() {
    const [cats, setCats] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const [refreshKey, setRefreshKey] = useState(0)

    console.log(user)

    const refreshCats = () => {
        setRefreshKey(Key => Key + 1); // This will trigger the useEffect to run again
    };

    useEffect(() => {
        async function getCats() {
            try {
                const fetchedCats = await Room8Api.getAdoptableCats();
                setCats(fetchedCats.filter(cat => !cat.adopted));
                setError(null);
            } catch (err) {
                console.error("Failed to fetch cats", err);
                setError("Failed to fetch cats. Please try again later.");
            }
        }

        getCats();
    }, [refreshKey]);

    

    return (
        <div>
            <h2>Adoptable Cats</h2>
            {user && (user.is_admin || user.is_foster) && (
                <Link to="/add-cat" className="btn btn-primary">Add Cat</Link>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="cat-list">
                {cats.length ? cats.map(cat => (
                    <div key={cat.id} className="cat-card">
                        <Link to={`/cats/${cat.id}`}>
                            <img src={cat.image_url} alt={cat.name} />
                            <h3>{cat.name}</h3>
                        </Link>
                        <p>{cat.description}</p>
                    </div>
                )) : (
                    <p>No cats available for adoption right now.</p>
                )}
            </div>
        </div>
    );
}

export default CatList;
