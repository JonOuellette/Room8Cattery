import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './DonationForm.css'

const DonationForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }
        
       
        const cardElement = elements.getElement(CardElement);

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('PaymentMethod', paymentMethod);

            // Here would send the paymentMethod.id and the amount to the backend
            // to create the charge and handle the response accordingly
        }
    };

    return (
        <form className='donation-form' onSubmit={handleSubmit}>
             <label htmlFor="amount">Donation Amount</label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <label>Card Information</label>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Donate
            </button>
        </form>
    );
};

export default DonationForm