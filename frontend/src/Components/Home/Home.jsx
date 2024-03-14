import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedCats from '../FeaturedCats/FeaturedCats';
import Navbar from '../Navbar/Navbar';
import './Home.css';
import AdoptionCentersList from '../AdoptionCenter/AdoptionCenterList';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <h1>Welcome to Room 8 Memorial Cat Foundation</h1>
            </section>
            <section className="call-to-action-section">
                <div className="cta-text">
                    <h2>Adopt A Rescue Cat or Kitten</h2>
                    <p>Visit our adoption page to see our available cats. Each profile provides information about the cat's personality, needs, and how they might fit into your home. If you find a cat that captures your heart, please contact us to start the application process. Our team will guide you every step of the way, from meeting your potential new family member to completing the adoption.

                        Adopting a cat is a rewarding experience that changes lives—yours and theirs. Join us in our mission to provide forever homes to cats in need, one adoption at a time.

                        Let’s create happy endings together. Adopt today.</p>
                </div>
                <div className="cta-button">
                    <Link to="/adopt" className="btn btn-primary">Meet Our Cats!</Link>
                </div>
            </section>
            <section className="feature-section">
                <h2>Featured Cats</h2>
                <FeaturedCats />
            </section>
            <section className="volunteer-section">
                <h2>Get Involved!</h2>
                <p>Become a part of our community by volunteering, fostering, adopting or donating!.</p>
                <Link to="/volunteer" className="btn btn-secondary">Volunteer</Link>
                <Link to="/adopt" className="btn btn-secondary">Adopt</Link>
                <Link to="/donate" className="btn btn-secondary">Donate</Link>
            </section>
            <section className='adoption-centers'>
                <h2>You Can Find Some of Our Cats At These Adoption Centers</h2>
                <AdoptionCentersList />
            </section>

        </div>
    );
};

export default Home;
