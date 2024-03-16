# Room 8 Cattery

Welcome to the [Room 8 Cattery](#)! This is a full-stack web application dedicated to the fostering and adoption of cats.

## Website Functionality

Room 8 Cattery has several access controls.  General users will be able to view adoptable cats and there details, submit volunteer form, donate and learn information about the Cattery.  There are 2 type of users with credentials: Fosters and Admins.  Fosters can add new cats and manage their foster cats.  Admins can add cats, update all cat information, create new account, handle permissions and manage profiles.

## Features

- **Role Base Access Control**: As a non profit Cat Rescue, this site has been set up to only allow admins to create accounts for fosters who are volunteering with the organization. As such, the roles dicate the level of access a user has.
- **Cat Management**: Admins and Fosters both can add, and update cats.  Where as admins have further access controls that allow them to delete cat profiles, set featured cats to the front page and set cats stataus to adopted. 
- **Fostering Functionality**: Users can apply to foster, view their fostered cats, and update cat information.
- **Volunteer Applications**: Allows users to fill out a form expressing interest in volunteering.
- **Data Export**: Admins can export cat and foster information to Google Sheets for external processing and review.

These features were implemented to ensure a comprehensive system for managing cat adoption and fostering, providing a user-friendly interface for volunteers, fosters, and administrators.

## Running Tests

Backend tests are located in the `tests` folder. To run them, navigate to your backend directory and execute:
python -m pytest

## Standard User Flow

1. **Visit the site**: Users can browse adoptable cats, information about the cattery and submit volunteer form without logging in.
2. **Foster Sign In**: Foster or Admins can log in to the site.
3. **Foster**: Can add new cats which will be linked to there id.  View all the cats tied to there id under the Foster Dashboard/profile page.
4. **Foster Dashboard**: Fosters from there dashboard can edit there information and change there passwords. They can also view all cats that are available for adoption that they added and edit cat information for only those they have added. 
4. **Admin **: Admin users can manage all aspects of the site, including user roles, cat profiles, and exporting data.

## API Information

The backend API supports all functionalities required by the frontend, handling user authentication, data management, and external integrations with Stripe and Google Sheets.
https://docs.stripe.com/api
https://developers.google.com/sheets/api/reference/rest

## Technology Stack

- **Frontend**: React, Axios, Bootstrap
- **Backend**: Flask, SQLAlchemy, JWT for authentication, Stripe API for donations, Google Sheets API for data export
- **Database**: PostgreSQL
- **Deployment**: 
