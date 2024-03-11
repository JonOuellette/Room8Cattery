import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Room8Api from '../../api/api';
const FosterList = () => {
    const [fosters, setFosters] = useState([]);

    useEffect(() => {
        const fetchFosters = async () => {
            const res = await Room8Api.getFosters();
            console.log("Fosters:", res);
            setFosters(res);
        };
        fetchFosters();
    }, []);
        
    return (
        <div>
            <h3>Fosters List</h3>
            <ul>
                {fosters.map(foster => (
                    
                    <li key={foster.id}>
                        <Link to={`/fosters/${foster.id}`}>{foster.first_name} {foster.last_name}</Link> - {foster.cat_count} Cats
                       
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export default FosterList;
