import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Components/UserContext';
import Home from '../Components/Home/Home';
import CatList from '../Components/CatList/CatList';
import CatDetails from '../Components/CatDetails/CatDetails';
import CatForm from '../Components/CatForm/CatForm';
import DonatePage from '../Components/DonatePage/DonatePage';
import SignUp from '../Components/SignUp/SignUp';
import Login from '../Components/Login/Login';

function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" replace />;
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adopt" element={<CatList />} />
      <Route path="/cats/:catId" element={<CatDetails />} />
      <Route path="/add-cat" element={<PrivateRoute><CatForm /></PrivateRoute>} />
      <Route path="/edit-cat/:catId" element={<PrivateRoute><CatForm /></PrivateRoute>} />
      <Route path="/donate" element={<DonatePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
