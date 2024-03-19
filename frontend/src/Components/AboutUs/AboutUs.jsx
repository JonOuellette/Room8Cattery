import React from 'react';
import './AboutUs.css'; 
import Room8Cat from '../../images/Room8Cat.png';
import OurTeamList from '../OurTeam/OurTeamList';

const AboutUs = () => {
    return (
        
        <div className="about-us">
            <h1>Our Story</h1>
            <div className="about-section">
                <div className="image-container">
                    <img src={Room8Cat} alt="Room8 Memorial Cat Foundation" className="about-image" />
                </div>
                <div className="text-container">
                    <h2>A Cat Called Room 8</h2>
                    <p>A stray cat wandered into a classroom at Elysian Heights Elementary School in 1952. After coming back to the classroom several mornings in a row, the children decided to name him after the number of their room -- "Room 8." He was loved and cared for by the students.</p>
                    <p>When "Room 8" came back to school after each summer vacation, he suddenly became famous. Newspapers sent reporters and photographers to the school. Television stations told the story of "Room 8." He was featured in Look Magazine, Cats Magazine, and the Weekly Reader. His picture was taken every year with the 6th grade graduating class.</p>
                    <p>"Room 8" never missed a day of school in 16 years until his death in 1968. His estimated age was 22 years. He is buried under a beautiful headstone in the Los Angeles Pet Memorial Park in Calabasas, California.</p>
                    <p>In 1972, Hettie L. Perry founded Room 8 Memorial Cat Foundation and named it after "Room 8" and it is now a cat rescue shelter. His legacy lives on through our work, as we strive to help as many cats as we can, honoring his memory and the joy he brought to so many.</p>
                </div>
            </div>

            <section className="mission-statement">
                <h2>Our Mission</h2>
                <section className='mission-text'>
                <ul>
                    <li>To offer care, shelter, and ensure the loving and successful adoption of homeless domestic cats.</li>
                    <li>To encourage kindness and responsible care for all animals.</li>
                    <li>To educate the public on the importance of spaying and/or neutering their pets.</li>
                </ul>
                <p>Room 8 is a private, no-kill, 501(c)3 non-profit organization that depends entirely on donations to continue its work and fulfill its mission.  Our no-cage environment provides a safe and caring home for dozens of cats awaiting adoption, as well as lifetime care for those who cannot be placed.</p>
                </section>
            </section>

            <section className="history">
                <h2>Our History</h2>
                <p>The Room 8 Memorial Cat Foundation was established in 1972 by Hettie Perry in memory of Room 8, a stray cat who wandered into a classroom in 1952 and became a beloved pet of the students and teachers. For almost for 16 years Hetty and her husband would feed, nurse, groom and care for cats in their privaete home causing her to be affecetionaly known as "The Cat Lady."
                <br /> <br />
                In the mid to late 80's Hetty and her husband moved to Jurupa Valley where the cattyer was built.  There Hetty took in approximately 180 homeless cats. With the help of volunteers, she continued to work hard to care for the cats until she passed away in 1996 - making sure that the cats would be continued to be cared for.  Today, Room 8 is run by a Board of Directors to make sure Hetti's love for cats live on.
                </p>
            </section>
            
            <section className="our-team-section">
                <h2>Our Team</h2>
                <OurTeamList />            
            </section>
        </div>
    );
}

export default AboutUs;