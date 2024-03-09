// import React, { useState, useEffect } from 'react';
// import Room8Api from '../../api/api';
// import { useParams } from 'react-router-dom';
// import { UserContext } from '../UserContext';

// function CatDetails() {
//     const [cat, setCat] = useState(null);
//     const [error, setError] = useState(null);
//     const { catId } = useParams();

//     useEffect(() => {
//         async function getCatDetails() {
//             try {
//                 const catDetails = await Room8Api.getCatDetails(catId);
//                 setCat(catDetails);
//             } catch (err) {
//                 console.error("Error loading cat details:", err);
//                 setError("Unable to load cat details. Please try again later.");
//             }
//         }

//         getCatDetails();
//     }, [catId]); // Reload if catId changes

//     if (error) {
//         return <div className="alert alert-danger" role="alert">{error}</div>;
//     }

//     if (!cat) return <div>Loading...</div>;

//     return (
//         <div className="cat-details">
//             <h2>{cat.name} ({cat.age} years old)</h2>
//             <div><img src={cat.image_url} alt={cat.name} style={{ maxWidth: '100%' }}/></div>
//             <p>Breed: {cat.breed}</p>
//             <p>Description: {cat.description}</p>
//             <p>Special Needs: {cat.special_needs || 'None'}</p>
//             <p>Featured: {cat.is_featured ? 'Yes' : 'No'}</p>

//         </div>
//     );
// }

// export default CatDetails;


// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { UserContext } from '../UserContext'; // Adjust path as necessary
// import Room8Api from '../../api/api';

// function CatDetails() {
//     const [cat, setCat] = useState(null);
//     const [error, setError] = useState(null);
//     const { catId } = useParams();
//     const navigate = useNavigate();
//     const { user } = useContext(UserContext);

//     useEffect(() => {
//         async function getCatDetails() {
//             try {
//                 const catDetails = await Room8Api.getCatDetails(catId);
//                 setCat(catDetails);
//             } catch (err) {
//                 console.error("Error loading cat details:", err);
//                 setError("Unable to load cat details. Please try again later.");
//             }
//         }
//         getCatDetails();
//     }, [catId]);

//     const handleDelete = async () => {
//         if (window.confirm("Are you sure you want to delete this cat?")) {
//             try {
//                 await Room8Api.deleteCat(catId);
//                 navigate('/adopt');
//             } catch (err) {
//                 console.error("Failed to delete cat:", err);
//                 setError("Failed to delete cat. Please try again later.");
//             }
//         }
//     };

//     const handleAdopt = async () => {
//         try {
//             await Room8Api.adoptCat(catId);
//             setCat({ ...cat, adopted: true });
//         } catch (err) {
//             console.error("Failed to mark as adopted:", err);
//             setError("Failed to mark as adopted. Please try again later.");
//         }
//     };

//     const handleFeatureToggle = async () => {
//         try {
//             await Room8Api.updateCat(catId, { is_featured: !cat.is_featured });
//             setCat({ ...cat, is_featured: !cat.is_featured });
//         } catch (err) {
//             console.error("Failed to update featured status:", err);
//             setError("Failed to update featured status. Please try again later.");
//         }
//     };

//     if (error) {
//         return <div className="alert alert-danger" role="alert">{error}</div>;
//     }

//     if (!cat) return <div>Loading...</div>;

//     return (
//         <div className="cat-details">
//             <h2>{cat.cat_name} ({cat.age} years old)</h2>
//             <div><img src={cat.image_url} alt={cat.cat_name} style={{ maxWidth: '100%' }}/></div>
//             <p>Breed: {cat.breed}</p>
//             <p>Description: {cat.description}</p>
//             <p>Special Needs: {cat.special_needs || 'None'}</p>
//             <p>Featured: {cat.is_featured ? 'Yes' : 'No'}</p>
//             {(user && user.is_admin) || (user && user.is_foster && user.id === cat.foster_id) ? (
//                 <button onClick={() => navigate(`/edit-cat/${catId}`)}>Edit</button>
//             ) : null}
//             {user && user.is_admin && (
//                 <>
//                     <button onClick={handleDelete}>Delete Cat</button>
//                     <button onClick={handleAdopt}>Mark as Adopted</button>
//                     <label>
//                         Featured:
//                         <input
//                             type="checkbox"
//                             checked={cat.is_featured}
//                             onChange={handleFeatureToggle}
//                         />
//                     </label>
//                 </>
//             )}
//         </div>
//     );
// }

// export default CatDetails;


import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Adjust path as necessary
import Room8Api from '../../api/api';

function CatDetails() {
    const [cat, setCat] = useState(null);
    const [error, setError] = useState(null);
    const { catId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function getCatDetails() {
            try {
                const catDetails = await Room8Api.getCatDetails(catId);
                setCat(catDetails);
            } catch (err) {
                console.error("Error loading cat details:", err);
                setError("Unable to load cat details. Please try again later.");
            }
        }
        getCatDetails();
    }, [catId]);

    const handleDelete = async () => {
        if (user && user.is_admin) {
            if (window.confirm("Are you sure you want to delete this cat?")) {
                try {
                    await Room8Api.deleteCat(catId);
                    navigate('/adopt');
                } catch (err) {
                    console.error("Failed to delete cat:", err);
                    setError("Failed to delete cat. Please try again later.");
                }
            }
        } else {
            setError("Unauthorized: You do not have permission to delete this cat.");
        }
    };

    const handleAdopt = async () => {
        if (user && user.is_admin) {  // Ensure only admins can mark as adopted
            try {
                await Room8Api.adoptCat(catId);
                setCat({ ...cat, adopted: true });
                alert(`${cat.name} has been successfully adopted.`);
                navigate('/adopt');
            } catch (err) {
                console.error("Failed to mark as adopted:", err);
                setError("Failed to mark as adopted. Please try again later.");
            }
        } else {
            setError("Unauthorized: You do not have permission to mark this cat as adopted.");
        }
    };

    const handleFeatureToggle = async () => {
        if (user && user.is_admin) {  // Ensure only admins can toggle the featured status
            try {
                const updatedCat = await Room8Api.toggleCatFeatured(catId);
                setCat({ ...cat, is_featured: updatedCat.is_featured });
            } catch (err) {
                console.error("Failed to update featured status:", err);
                setError("Failed to update featured status. Please try again later.");
            }
        } else {
            setError("Unauthorized: You do not have permission to modify this cat's featured status.");
        }
    };

    if (error) {
        return <div className="alert alert-danger" role="alert">{error}</div>;
    }

    if (!cat) return <div>Loading...</div>;

    return (
        <div className="cat-details">
            <h2>{cat.name} ({cat.age} years old)</h2>
            <div><img src={cat.cat_image} alt={cat.cat_name} style={{ maxWidth: '100%' }} /></div>
            <p>Breed: {cat.breed}</p>
            <p>Description: {cat.description}</p>
            <p>Special Needs: {cat.special_needs || 'None'}</p>
            <p>Featured: {cat.is_featured ? 'Yes' : 'No'}</p>
            {(user && user.is_admin) || (user && user.is_foster && cat.foster_id === user.id) ? (
                <button onClick={() => navigate(`/edit-cat/${catId}`)}>Edit</button>
            ) : null}

            {user && user.is_admin && (
                <>
                    <button onClick={handleDelete}>Delete Cat</button>
                    <button onClick={handleAdopt}>Mark as Adopted</button>
                    <label>
                        Featured:
                        <input
                            type="checkbox"
                            checked={cat.is_featured}
                            onChange={handleFeatureToggle}
                        />
                    </label>
                </>
            )}
        </div>
    );
}

export default CatDetails;
