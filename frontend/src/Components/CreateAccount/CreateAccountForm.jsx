import React, { useState } from 'react';
import Room8Api from '../../api/api';

function CreateAccountForm({ closeModal, onUserCreated }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        is_foster: false,
        is_admin: false
    });
    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(f => ({
            ...f,
            [name]: name === 'is_foster' || name === 'is_admin' ? e.target.checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Room8Api.createUser(formData);
            alert('User created successfully.');
            setFormData({
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                is_foster: false,
                is_admin: false
            }); // Reset form

            setErrors([]);
            closeModal();
            onUserCreated();
        } catch (err) {
            console.error("Error creating user:", err.response ? err.response.data : err); // Log detailed error information
            const errorMessages = err.response && err.response.data && err.response.data.errors
                ? err.response.data.errors // Assuming the server responds with a structured error
                : [err.message || 'Something went wrong']; // Fallback error message
            setErrors(errorMessages);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="first_name">First Name:</label>
                <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="last_name">Last Name:</label>
                <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="phone_number">Phone Number:</label>
                <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="is_foster"
                        checked={formData.is_foster}
                        onChange={handleChange}
                    />
                    Is Foster
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="is_admin"
                        checked={formData.is_admin}
                        onChange={handleChange}
                    />
                    Is Admin
                </label>
            </div>
            {errors.length > 0 && (
                <div>
                    {errors.map((error, index) => (
                        <p key={index} style={{ color: 'red' }}>
                            {error}
                        </p>
                    ))}
                </div>
            )}
            <div>
                <button type="submit">Create Account</button>
                <button type="button" onClick={closeModal}>Cancel</button> 
            </div>
        </form>
    );
}

export default CreateAccountForm;
