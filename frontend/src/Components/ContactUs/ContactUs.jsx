import React from 'react'
import './ContactUs.css';
import kittenbanner from '../../images/kittenbanner.jpg';


function ContactUs() {
    return (
        <div className='contact-container'>
            <div className='contact-banner-container'>
                <h1>Contact Us</h1>
            </div>
            <div className='contact-info'>
            <p>We're here to help and answer any question you might have. We look forward to hearing from you!</p>
            <h2>Email Us</h2>
            <p><a href="mailto:room8cats@gmail.com">room8cats@gmail.com</a></p>
            <h2>Call Us</h2>
            <p>Reach out to us at <strong>(951) 681-9609</strong></p>
            <h2>Visit Us</h2>
            <p>8354 63rd St, Jurupa Valley, CA 92509</p>
            <h2>Follow Us</h2>
            <p>Connect with us on our social media channels:</p>
            <p>
                <a href="https://www.facebook.com/room8memorialcatfoundation" target="_blank" rel="noopener noreferrer">Facebook</a> | 
                
                <a href="https://www.instagram.com/room8memorialcatfoundation/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </p>
        </div>

        </div>

    )
}

export default ContactUs