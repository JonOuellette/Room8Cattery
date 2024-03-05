import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedCats = () => {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const cats = await Room8Api.getFeaturedCats();
                console.log(fetchedCats);
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
                    <Link to={`/cats/${cat.id}`}>
                        <img src={cat.image_url} alt={cat.name} />
                        <h3>{cat.name}</h3>
                        <p>{cat.description}</p>
                    </Link>
                </div>
            ))}
        </div>

    );
};

export default FeaturedCats;
