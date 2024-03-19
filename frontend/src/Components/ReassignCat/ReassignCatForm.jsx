import React, { useState, useEffect } from 'react';
import Room8Api from '../../api/api';


const ReassignCatForm = ({ catId, closeModal, onCatReassigned }) => {
    const [fosters, setFosters] = useState([]);
    const [selectedFoster, setSelectedFoster] = useState('');
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fosterData = await Room8Api.getFosters();
                const adminData = await Room8Api.getAdmins();
                setFosters(fosterData);
                setAdmins(adminData);
                setSelectedFoster(fosterData[0]?.id); // Automatically select the first foster by default
            } catch (error) {
                console.error("Failed to fetch fosters:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Room8Api.reassignCat(catId, selectedFoster);
            onCatReassigned(); // Trigger any additional actions such as updating state
            closeModal(); // Close the modal after successful reassignment
        } catch (error) {
            console.error("Failed to reassign cat:", error);
            // Future: add error handling/display here
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fosterSelect">Select New Foster:</label>
                <select
                    id="fosterSelect"
                    value={selectedFoster}
                    onChange={(e) => setSelectedFoster(e.target.value)}
                    required
                >
                    <option value="">Select Foster/Admin</option>
                    {admins.map(admin => (
                        <option key={admin.id} value={admin.id}>
                            {admin.first_name} {admin.last_name} (Admin)
                        </option>
                    ))}
                    {fosters.map(foster => (
                        <option key={foster.id} value={foster.id}>
                            {foster.first_name} {foster.last_name} (Foster)
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Reassign Cat</button>
            <button type="button" onClick={closeModal}>Cancel</button>
        </form>
    );
};

export default ReassignCatForm;
