import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import DonationForm from '../DonationForm/DonationForm'
import { loadStripe } from '@stripe/stripe-js';
import './DonatePage.css'
import HungryCat from '../../images/HungryCat.png';

//This is a Stripe public test key 
const stripePromise = loadStripe('pk_test_51OpJy5AvBIBtEFmotX9rmUxnGQI6vohVdA3cAil32CIl9s7nF6B0rYVr1Ns5f2zY8DVUTP506b8Uv2NhtZNyiS0200drwLSjlt');

const DonatePage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="donate-page">

            <section className='donation-container'>
                <img src={HungryCat} alt="Hungry Cat" />
                <section className='donation-intro'>
                    <h1 className='donate-h1'>Support Our Cause</h1>
                    <p>Every donation, no matter the size, makes a profound impact on the lives of our rescued cats. By contributing to our cat rescue, you're providing essential funds for medical treatments, nutritious food, safe shelter, and loving care. Your generosity ensures these deserving animals receive a second chance at life and love. Please donate today and join our mission to save and improve the lives of cats in need. Together, we can make a difference, one cat at a time</p>
                    <button className="donate-button" onClick={openModal}>Donate Now</button>
                </section>
            </section>
            <h2> Other Ways you can Help</h2>
            <section className='donate-supplies-container'>
                
                <section className='supplies-needed-list'>
                <h3 className='donate-supplies-title'>Donate Supplies</h3>
                    <ul>
                        <li>Dry kibble and canned food </li>
                        <li>Kitty litter (clay or scoopable; unscented please)</li>
                        <li>Clean cloth towels, blankets, sheets</li>
                        <li>Postage stamps, copier paper</li>
                        <li>Cleaning supplies such as dish soap, laundry soap, bleach, paper towels</li>
                        <li>13 gallon trash bags</li>
                        <li>Cat furniture (scratching posts and Kuranda Towers)</li>
                    </ul>
                </section>
                <section className='donate-dry-food-container'>
                    <h3 className='dry-food-title'>Dry Food Needed</h3>
                    <p>In order to keep our cats healthy and happy, we feed the following brands/flavors of dry food:</p>
                    <ul>
                        <li>Kirkland brand (Costco) dry kibble</li>
                        <li>Purina One Sensitive Systems (for our seniors)</li>
                        <li>Purina One Indoor Advantage</li>
                    </ul>
                </section>
                <section className='donate-wet-food-container'>
                    <h3 className='wet-food-title'>Canned(Wet) Food Needed</h3>
                    <p>For canned (wet) food, our cats prefer the following</p>
                    <ul>
                        <li>Walmart Special Kitty Turkey and Giblets Pate</li>
                        <li>Friskies Buffet Turkey and Giblets</li>
                        <li>Stater Bros Turkey and Giblets</li>
                        <li>Purina One Turkey and Giblets Pate</li>
                        <li>Wholehearted Grain Free by Petco </li>
                    </ul>

                </section>

            </section>
            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                <button className="modal-close" onClick={closeModal}>Close</button>
                <Elements stripe={stripePromise}>
                    <DonationForm />
                </Elements>
            </ReactModal>
        </div>
    );
};

export default DonatePage;
