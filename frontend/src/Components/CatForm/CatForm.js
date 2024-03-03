import React, { useState, useEffect } from 'react';
import Room8Api from '../api/api'; 

function CatForm({ catId, setEditing }) {
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

    // Function to handle form data changes
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(data => ({
            ...data,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Function to submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (catId) {
                await Room8Api.updateCatInfo(catId, {
                    ...formData,
                    is_featured: formData.isFeatured,  
                });
            } else {
                await Room8Api.addNewCat({
                    ...formData,
                    is_featured: formData.isFeatured,
                });
            }
            setEditing && setEditing(false); // If editing, close the form after submit
           
        } catch (err) {
            console.error("Error submitting form:", err);
            
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />

            <label htmlFor="breed">Breed:</label>
            <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} />

            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

            <label htmlFor="specialNeeds">Special Needs:</label>
            <input type="text" id="specialNeeds" name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} />

            <label htmlFor="microchip">Microchip Number:</label>
            <input type="text" id="microchip" name="microchip" value={formData.microchip} onChange={handleChange} />

            <label htmlFor="image_url">Image URL:</label>
            <input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />

            <label htmlFor="isFeatured">Featured:</label>
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />

            <button type="submit">{catId ? 'Update Cat' : 'Add Cat'}</button>
        </form>
    );
}

export default CatForm;
