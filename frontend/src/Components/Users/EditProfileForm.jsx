import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import Room8Api from '../../api/api';

function EditProfileForm({ close }) {
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
    });
    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = [];
        // Add validation checks as needed, for example:
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
            const response = await Room8Api.updateUser(user.id, formData);
            console.log("UPDATE RESPONSE:", response);
            // If the API doesn't return the updated user data, fetch it again
            const updatedUserDetails = await Room8Api.getUserDetails();
            setUser(updatedUserDetails);
            alert('Profile updated successfully.');
            close();
        } catch (err) {
            console.error("Failed to update profile", err);
            setErrors([...errors, err.message || "Unknown error"]); // Add new error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.map((error, idx) => <p key={idx} className="error">{error}</p>)}
            {user.is_admin && (
                <>
                    <label htmlFor="first_name">First Name:</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} required />
                    <label htmlFor="last_name">Last Name:</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} required />
                </>
            )}
            <label htmlFor="email">Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} required />
            <label htmlFor="phone_number">Phone Number:</label>
            <input name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={close}>Cancel</button>
        </form>
    );
}

export default EditProfileForm;
