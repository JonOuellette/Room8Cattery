
import GailJackImg from '../../images/GailJackImg.png';
import EvaunImg from '../../images/EvaunImg.png';
import BoardMembersImg from '../../images/BoardMembersImg.png';
import FrankImg from '../../images/FrankImg.png';


const ourTeam = [
    {
        id: 1,
        name: 'Jack and Gail Shelton',
        role: 'Managers',
        details: "Jack and Gail both share a love for animals that goes beyond the normal affection of the average person. They see the need for attending to the health and medical needs that each cat might have. Gail has been working and overseeing the daily duties and needs of Room 8 Memorial Cat Foundation since 1996 and understands the importance of having a no-kill shelter and encouraging spaying and neutering of domestic animals. Jack has always been an animal lover and, upon meeting Gail, fell in love with her.  They married in March of 2012 bringing together a union of two peoples' compassion for animals.",
        image: GailJackImg
    },

    {
        id: 2,
        name: 'Evaun Anderson',
        role: 'Assistant Managers',
        details: "Animals have been a big part of Evaun's life and working at Room 8 Memorial Cat Foundation for the last eight years has been a purrfect fit for her!  As the Assistant Manager, she helps run the day-to-day operations, but her passions are special needs adoptions and fostering kittens to help them get a good start in life, medically and socially. ",
        image: EvaunImg
    },

    {
        id: 3,
        role: 'Board Members',
        names: ['Gail Anderson-Shelton', 'Jack Shelton', 'Linda Adams', 'Desiree Young', 'Jenny Fitzpatrick'], // List of board members
        details: "Folks who dedicate their time to helping us succeed!",
        image: BoardMembersImg
    },

    {
        id: 4,
        name: 'Frank',
        role: 'Honorary Cat',
        details: `Frank is an honorary cat with Room 8 Memorial Cat Foundation and was owned by a previous staff member. Here is his owner's story:

            "When I lived in a house full of roommates and college students, we would often go to Flo's restaurant on Sunday mornings to treat our hangovers with biscuits and gravy. One day, my roommate, Doug, asked if we could have a cat as a house mascot. Unable to think of a good enough objection at the moment, I tried to deflect the question with one of my own: 'What would we call him or her? Certainly, our cat needs a name, right?' I thought this would cause Doug hours or days of deep contemplation (and give me at least enough time to finish breakfast). Just then, the waitress walked behind him and yelled for the busboy - 'Frank.' Doug answered my question in a heartbeat - simply echoing the waitress. So, that was settled and soon a girlfriend brought over a kitten to match the name.
            
            Frank was black with a white shirt and shoes. We bought him a white flea collar and drew a little bow tie on the buckle with a Sharpie because the buckle always rotated to Frank's front. He would look like he had a little tuxedo on whenever he sat and stared at us - which was often.
            
            Frank was my first and only cat so far. I miss him."`,
        image: FrankImg,
    },

]

export default ourTeam;