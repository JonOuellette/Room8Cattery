import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import DonationForm from './DonationForm'; 
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OpJy5AvBIBtEFmotX9rmUxnGQI6vohVdA3cAil32CIl9s7nF6B0rYVr1Ns5f2zY8DVUTP506b8Uv2NhtZNyiS0200drwLSjlt'); 

const DonatePage = () => {
    return (
        <Elements stripe={stripePromise}>
            <DonationForm />
        </Elements>
    );
};

export default DonatePage;
