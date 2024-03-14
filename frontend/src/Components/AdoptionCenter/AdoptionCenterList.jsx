import React from 'react';
import adoptionCenters from './adoptionCenters';
import './AdoptionCenterList.css';
import AdoptionCenter from './AdoptionCenter';


// Assuming this data might come from a backend or a static file

const AdoptionCentersList = () => {
    return (
        <div className="adoption-centers-list">
            {adoptionCenters.map(center => (
                <AdoptionCenter key={center.id} name={center.name} address={center.address} image={center.image} location={center.location} />

            ))}
        </div>
    );
};

export default AdoptionCentersList;
