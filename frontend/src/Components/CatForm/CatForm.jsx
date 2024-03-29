import React, { useState, useEffect } from 'react';
import Room8Api from '../../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './CatForm.css';


function CatForm({ setEditing, userRole }) {
    const { catId } = useParams()
    const navigate = useNavigate();
    console.log(catId)
    console.log("Current user role:", userRole);

    const [formData, setFormData] = useState({
        cat_name: '',
        age: 0,
        gender: '',
        breed: '',
        description: '',
        special_needs: '',
        microchip: '',
        cat_image: '',
        isFeatured: false,
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchCat = async () => {
            if (catId) {
                const catData = await Room8Api.getCatDetails(catId);
                console.log(catData)
                setFormData({
                    cat_name: catData.name,
                    age: catData.age,
                    gender: catData.gender,
                    breed: catData.breed,
                    description: catData.description,
                    special_needs: catData.special_needs || '',
                    microchip: catData.microchip,
                    cat_image: catData.cat_image,
                    isFeatured: catData.is_featured,
                });

            }
        };

        fetchCat();
    }, [catId]);

    const validateForm = () => {
        const newErrors = [];
        if (!formData.cat_name) newErrors.push("Name is required.");
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
        console.log("Updating cat with data", formData);
        const newErrors = validateForm(); alert(`${formData.cat_name} has been updated successfully.`);
        // Redirect user back to the cat details page
        navigate(`/adopt`);
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            if (catId) {
                await Room8Api.updateCat(catId, {
                    ...formData,
                    is_featured: userRole === 'admin' ? formData.isFeatured : false,
                });

                // Redirect user back to the cat details page
                navigate(`/cats/${catId}`);
            } else {
                const addedCat = await Room8Api.addCat({
                    ...formData,
                    is_featured: userRole === 'admin' ? formData.isFeatured : false,
                });
                // Reset the form fields after successfully adding a cat
                setFormData({
                    cat_name: '',
                    age: 0,
                    gender: '',
                    breed: '',
                    description: '',
                    special_needs: '',
                    microchip: '',
                    cat_image: '',
                    isFeatured: false,
                });
                // Display a message that the cat has been added
                alert(`${addedCat.cat_name || 'The cat'} has been added`);
            }
            setEditing && setEditing(false); // If editing, close the form after submit
        } catch (err) {
            console.error("Error submitting form:", err);
            setErrors([...errors, err.message || "Unknown error"]);
        }

    };


    return (
        <form className='form-container' onSubmit={handleSubmit}>
            {errors.map((error, idx) => <p key={idx} className="error">{error}</p>)}
            <div className='form-field'>
                <label htmlFor="cat_name">Name:</label>
                <input type="text" id="cat_name" name="cat_name" value={formData.cat_name} onChange={handleChange} required />
            </div>

            <div className='form-field'>
                <label htmlFor="age">Age:</label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="0" required />
            </div>

            <div className='form-field'>
                <label htmlFor="gender">Gender:</label>
                <input type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} required />
            </div>

            <div className='form-field'>
                <label htmlFor="breed">Breed:</label>
                <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} required />
            </div>

            <div className='form-field'>
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className='form-field'>
                <label htmlFor="special_needs">Special Needs:</label>
                <input type="text" id="special_needs" name="special_needs" value={formData.special_needs} onChange={handleChange} required />
            </div>

            <div className='form-field'>
                <label htmlFor="microchip">Microchip #:</label>
                <input type="text" id="microchip" name="microchip" value={formData.microchip} onChange={handleChange} maxLength="15" pattern="\d*" required />
            </div>
            <div className='form-field'>
                <label htmlFor="cat_image">Cat Image URL:</label>
                <input type="text" id="cat_image" name="cat_image" value={formData.cat_image} onChange={handleChange} required />
            </div>

            {userRole === 'admin' && (
                <div className='form-field'>
                    <label htmlFor="isFeatured">Featured:</label>
                    <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                    />
                </div>
            )}
            <button type="submit">{catId ? 'Update Cat' : 'Add Cat'}</button>
        </form>
    );
}

export default CatForm;