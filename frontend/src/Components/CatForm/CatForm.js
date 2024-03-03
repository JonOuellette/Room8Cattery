import React, { useState, useEffect } from 'react';
import Room8Api from '../api/api'; 

function CatForm({ catId, setEditing, userRole }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        breed: '',
        description: '',
        specialNeeds: '',
        microchip: '',
        image_url: '',
        isFeatured: false,
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchCat = async () => {
            if (catId) {
                const catData = await Room8Api.getCatDetails(catId);
                setFormData({
                    name: catData.name,
                    age: catData.age,
                    breed: catData.breed,
                    description: catData.description,
                    specialNeeds: catData.special_needs,
                    microchip: catData.microchip,
                    image_url: catData.image_url,
                    isFeatured: catData.is_featured,
                });
            }
        };
        fetchCat();
    }, [catId]);

    const validateForm = () => {
        const newErrors = [];
        if (!formData.name) newErrors.push("Name is required.");
        if (!formData.age) newErrors.push("Age is required.");
        if (!formData.breed) newErrors.push("Breed is required.");
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(data => ({
            ...data,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            if (catId) {
                await Room8Api.updateCatInfo(catId, {
                    ...formData,
                    is_featured: userRole === 'admin' ? formData.isFeatured : false,  
                });
            } else {
                await Room8Api.addNewCat({
                    ...formData,
                    is_featured: userRole === 'admin' ? formData.isFeatured : false,
                });
            }
            setEditing && setEditing(false); // If editing, close the form after submit
        } catch (err) {
            console.error("Error submitting form:", err);
            setErrors([...errors, err.message || "Unknown error"]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.map((error, idx) => <p key={idx} className="error">{error}</p>)}
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />

            <label htmlFor="breed">Breed:</label>
            <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} required />

            {/* Additional fields */}

            {userRole === 'admin' && (
                <>
                    <label htmlFor="isFeatured">Featured:</label>
                    <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                </>
            )}

            <button type="submit">{catId ? 'Update Cat' : 'Add Cat'}</button>
        </form>
    );
}

export default CatForm;
