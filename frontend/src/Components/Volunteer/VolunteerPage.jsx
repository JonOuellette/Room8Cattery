import React, { useState } from 'react';
import ReactModal from 'react-modal';
import VolunteerForm from './VolunteerForm'; 

import './VolunteerPage.css';

const VolunteerPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="volunteer-page">
            <section className='volunteer-intro'>
            <h1>Become a Volunteer</h1>
            <p>Do you have a passion for helping animals? Do you love cats? Room 8 would love to have you volunteer! A variety of opportunities are waiting for you and the end result is helping the cats and getting them ready to be adopted into new, loving, permanent homes.</p>
            <p>​Do you have a few hours on a Saturday morning (or two) each month to donate your time helping clean the cattery at Room 8? We have a few volunteers, but could really use more. Not necessarily fun stuff -- cleaning/sanitizing litter boxes, sweeping catios and rooms, wiping down cat furniture and shelves, cleaning kitten cages (well, actually that is fun), doing laundry and maybe washing a few dishes. Not hard labor :) and -- BONUS! -- you get to talk to and pet cats while you work! If you are interested please complete the volunteer form.</p>
            </section>
            <button className= 'volunteer-button' onClick={openModal}>Volunteer with Us!</button>
            
            <ReactModal
                className="modal-content"
                overlayClassName="modal-overlay"
                //  style={{
                //     content: {
                //       top: '25%',
                //       left: '50%',
                //       right: 'auto',
                //       bottom: 'auto',
                //       marginRight: '-50%',
                //       transform: 'translate(-50%, -50%)',
                //       width: '50%' 
                //     }
                //   }}
                
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Volunteer Form"
                ariaHideApp={false} 
            >
                <button className='volunteer-modal-close' onClick={closeModal}>Close</button>
                <VolunteerForm />
            </ReactModal>
        </div>
    );
};

export default VolunteerPage;
