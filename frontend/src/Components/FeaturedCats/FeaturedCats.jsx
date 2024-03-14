import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
import './FeaturedCats.css'; 


const FeaturedCats = () => {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const cats = await Room8Api.getFeaturedCats();
                console.log(cats);
                setCats(cats);
            } catch (error) {
                console.error('Error fetching featured cats:', error);
            }
        };

        fetchCats();
    }, []);

    return (
        <div className="featured-cats-container">
            {cats.map(cat => (
                <div key={cat.id} className="cat-card">
                    <Link style= {{textDecoration: 'none'}} to={`/cats/${cat.id}`}>
                        <img src={cat.cat_image} alt={cat.name} />
                        <h3>{cat.name} Age: {cat.age} months old</h3>
                    </Link>
                    
                </div>
            ))}
        </div>

    );
};

export default FeaturedCats;
