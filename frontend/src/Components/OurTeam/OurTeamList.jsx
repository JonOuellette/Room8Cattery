import React from 'react';
import ourTeam from './ourTeam'; // Make sure this is the correct path
import './OurTeamList.css'; // Reusing styles, ensure this is intentional
import OurTeamMembers from './OurTeamMembers'; // Ensure this component is correctly implemented

const OurTeamList = () => {
    return (
        <div className="team-member-list"> {/* Consider renaming this class to something more relevant, like 'our-team-list' */}
            {ourTeam.map(member => {
                // If 'names' field exists, this is the Board Members item
                if (member.role === 'Board Members') {
                    return (
                        <div key={member.id} className="team-member-card team-member-board-members">
                            <div className="team-member-image-container">
                                <img src={member.image} alt="Board Members" className="team-member-image" />
                            </div>
                            <div className="team-member-info">
                                <h3 className="team-member-role">{member.role}</h3>
                                <ul>
                                    {member.names.map((name, index) => (
                                        <li key={index}>{name}</li> // Using index as key because names are likely not unique
                                    ))}
                                </ul>
                                <p>{member.details}</p>
                            </div>
                        </div>
                    );
                } else {
                    // For all other roles
                    return <OurTeamMembers key={member.id} name={member.name} role={member.role} image={member.image} details={member.details} />;
                }
            })}
        </div>
    );
};

export default OurTeamList;
