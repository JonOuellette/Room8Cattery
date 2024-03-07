import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Room8Api from '../../api/api';

function Login() {
    const navigate = useNavigate();
    const { setUser, setToken } = useContext(UserContext); 
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await Room8Api.login(formData);
            if (res.access_token) {  // Ensure you're using the correct key for the token based on your backend response
                setUser(res.user);
                setToken(res.access_token);  // Saving token to context and local storage if necessary
                Room8Api.setToken(res.access_token);  // Setting token for future requests
                navigate('/');
            } else {
                throw new Error('No token received');
            }
        } catch (err) {
            setError(err.message || 'Failed to login');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
