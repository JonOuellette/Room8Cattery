import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link, useParams } from 'react-router-dom';
import Room8Api from '../../api/api';

function FosterDashboard() {
    const { user } = useContext(UserContext);
    const { fosterId } = useParams();
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await Room8Api.getFosterCats(user.id); // user.id should be the foster's ID
                setCats(res);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch cats:', err);
                setError('Failed to fetch your cats. Please try again later.');
                setLoading(false);
            }
        };

        if (user && user.is_foster) {
            fetchCats();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (cats.length === 0) return <div>No cats listed.</div>;

    return (
        <div>
            <h2>Your Cats</h2>
            {cats.map(cat => (
                <div key={cat.id} className="cat-card">
                <Link to={`/cats/${cat.id}`}>
                    <h3>{cat.name}</h3>
                    <img src={cat.cat_image} alt={cat.name} />  
                </Link>
                    <h4> {cat.age} years old</h4>
                    <p>Special Needs: {cat.special_needs}</p>
            </div>
            ))}
        </div>
    );
}

export default FosterDashboard;
