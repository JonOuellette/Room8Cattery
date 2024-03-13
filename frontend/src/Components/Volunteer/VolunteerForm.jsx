import React, { useState } from 'react';
import Room8Api from '../../api/api'; 
import './VolunteerFormStyles.css';

function VolunteerForm() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        days_available: [],
        start_date: '',
        about: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedDays = [...formData.days_available];
        if (checked && !updatedDays.includes(value)) {
            updatedDays.push(value);
        } else {
            updatedDays = updatedDays.filter(day => day !== value);
        }
        setFormData(data => ({
            ...data,
            days_available: updatedDays
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Room8Api.submitVolunteerForm(formData);
            setMessage(response.message); 
            // Reset form if needed
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                days_available: [],
                start_date: '',
                about: ''
            });
        } catch (err) {
            console.error("Failed to submit volunteer form:", err);
            setMessage('Failed to submit form. Please try again later.');
        }
    };

    return (
        <div className='volunteer-form-container'>
            <h2>Volunteer Application</h2>
            {message && <p>{message}</p>}
            <form className="volunteer-form" onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input 
                        type="text" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Last Name:
                    <input 
                        type="text" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Phone:
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                    />
                </label>
                <fieldset>
                    <legend>Days Available:</legend>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                name="days_available"
                                value={day}
                                checked={formData.days_available.includes(day)}
                                onChange={handleCheckboxChange}
                            />
                            {day}
                        </label>
                    ))}
                </fieldset>
                <label>
                    Start Date:
                    <input 
                        type="date" 
                        name="start_date" 
                        value={formData.start_date} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Tell us about yourself:
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default VolunteerForm;