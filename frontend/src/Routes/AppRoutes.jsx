import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CatList from '../Components/CatList/CatList';
import CatDetails from '../Components/CatDetails/CatDetails';
import CatForm from '../Components/CatForm/CatForm';
import DonatePage from '../Components/DonatePage/DonatePage';
import SignUp from '../Components/SignUp/SignUp';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CatList />} />
            <Route path="/cats/:id" element={<CatDetails />} />
            <Route path="/add-cat" element={<CatForm />} />
            <Route path="/edit-cat/:id" element={<CatForm />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
};

export default AppRoutes;
