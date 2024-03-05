import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedCats from '../FeaturedCats/FeaturedCats';
import Navbar from '../Navbar/Navbar';
import './Home.css'; 

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <h1>Welcome to Room8Cattery</h1>
                <p>Your companion awaits.</p>
                <Link to="/cats" className="btn btn-primary">View Cats</Link>
            </section>
            <section className="about-section">
                <h2>About Us</h2>
                <p>We are a non-profit organization dedicated to rescuing, caring for, and finding forever homes for displaced or abandoned cats.</p>
            </section>
            <section className="feature-section">
                <h2>Featured Cats</h2>
                <FeaturedCats /> 
            </section>
            <section className="volunteer-section">
                <h2>Get Involved</h2>
                <p>Become a part of our community by volunteering, fostering, or adopting.</p>
                <Link to="/volunteer" className="btn btn-secondary">Learn More</Link>
            </section>
        </div>
    );
};

export default Home;
