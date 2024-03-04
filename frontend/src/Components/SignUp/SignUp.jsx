import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';


const SignUp = () => {
    const { user, setUser } = useUser(); 
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
            setErrorMessage('All fields are required');
            return;
        }

        if (userRole !== 'admin') {
            setErrorMessage('Only admins can create new accounts');
            return;
        }

        try {
            // Adds the token in the request's headers
            const response = await axios.post('/admin/create-user', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, //should obtain token from local Storage
                },
            });
            console.log(response.data); // Process response data
            setErrorMessage(''); // Clear error message
        } catch (error) {
            setErrorMessage('Error creating user: ' + error.response.data.error);
        }
    };

    if (userRole !== 'admin') {
        return <div>Only admins can create new accounts.</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="error-message">{errorMessage}</div>
            {/* Other form elements */}
        </form>
    );
};

export default SignUp;
