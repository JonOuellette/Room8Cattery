import React from 'react';
import './OurTeamMembers.css'; // Ensure this file exists and is correctly linked

const OurTeamMembers = ({ id, name, role, image, details }) => {
    // Alternate alignment based on even or odd ID
    const alignmentClass = id % 2 === 0 ? 'right-aligned' : 'left-aligned';
    // Alternate background color based on even or odd ID
    const bgColorClass = id % 2 === 0 ? 'bg-color-alternate' : 'bg-color-main';

    return (
        <div className={`team-member-card ${alignmentClass} ${bgColorClass}`}>
            <div className="team-member-image-container">
                <img src={image} alt={name} className="team-member-image" />
            </div>
            <div className="team-member-info">
                <h3 className="team-member-name">{name}</h3>
                <p className="team-member-role">{role}</p>
                {details && <p className="team-member-details">{details}</p>}
            </div>
        </div>
    );
};

export default OurTeamMembers;
