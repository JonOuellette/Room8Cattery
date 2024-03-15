import React from 'react';
import './AdoptionCenter.css'; 

const AdoptionCenter = ({ name, address, image, location }) => {
    return (
        <div className="adoption-center-card">
            <div className="center-image-container">
                <img src={image} alt={name} className="center-image"/>
            </div>
            <div className="center-info">
                <h3 className="center-name">{name}</h3>
                <p className="center-address">{address}</p>
                <p className="center-location">{location}</p>
                <button className="details-button">Details</button>
            </div>
        </div>
    );
};

export default AdoptionCenter;
