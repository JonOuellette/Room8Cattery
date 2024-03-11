import React, { useState } from 'react';
import Room8Api from '../../api/api';

function AdminEditProfileForm({ userId, userDetails, close, onSave }) {
    const [formData, setFormData] = useState({
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
        phone_number: userDetails.phone_number,
        is_admin: userDetails.is_admin,
        is_foster: userDetails.is_foster,
    });
    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'is_admin' || name === 'is_foster') {
            finalValue = e.target.checked; // because these are checkboxes
        }
        setFormData(data => ({ ...data, [name]: finalValue }));
    };

    const validateForm = () => {
        const newErrors = [];
        // Add validation checks as needed
        if (!formData.first_name) newErrors.push("First name is required.");
        if (!formData.email) newErrors.push("Email is required.");
        // Add more validations as required
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return; // Stop the form submission if there are validation errors
        }
        setErrors([]); // Clear previous errors

        try {
            await Room8Api.updateUser(userId, formData);
            alert('Profile updated successfully.');
            const updatedUserDetails = await Room8Api.getUserDetailsById(userId);
            onSave(updatedUserDetails);
        } catch (err) {
            console.error("Failed to update profile", err);
            setErrors([...errors, err.message || "Unknown error"]); // Add new error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.map((error, idx) => <p key={idx} className="error">{error}</p>)}
            <label htmlFor="first_name">First Name:</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} required />
            <label htmlFor="last_name">Last Name:</label>
            <input name="last_name" value={formData.last_name} onChange={handleChange} required />
            <label htmlFor="email">Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} required />
            <label htmlFor="phone_number">Phone Number:</label>
            <input name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            
            <button type="submit">Save Changes</button>
            <button type="button" onClick={close}>Cancel</button>
        </form>
    );
}

export default AdminEditProfileForm;
