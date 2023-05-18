Restaurant Reservation System

This is a web application that allows users to make and manage reservations for restaurants.
Features

    View a list of reservations
    Create a new reservation
    Edit existing reservations
    Delete reservations

Technologies Used

    React
    Firebase (Firestore, Authentication)
    Google Maps API
    axios
    react-responsive-carousel
    Next.js

API Reference
Get all reservations

http

GET /api/reservations

Returns a list of all reservations.
Get a specific reservation

http

GET /api/reservations/${id}

Returns the details of a specific reservation identified by its ID.
Create a new reservation

http

POST /api/reservations

Creates a new reservation. Requires the following parameters in the request body:

    fullName (string): The full name of the person making the reservation.
    hour (string): The reservation time.
    persons (string): The number of persons for the reservation.
    phoneNumber (string): The phone number of the person making the reservation.

Update a reservation

http

PUT /api/reservations/${id}

Updates an existing reservation identified by its ID. Requires the following parameters in the request body:

    fullName (string): The updated full name of the person making the reservation.
    hour (string): The updated reservation time.
    persons (string): The updated number of persons for the reservation.
    phoneNumber (string): The updated phone number of the person making the reservation.

Delete a reservation

http

DELETE /api/reservations/${id}

Deletes a reservation identified by its ID.
///////
API KEYS
GOOGLE_MAPS_API_KEY="AIzaSyCmQincHk8_tGoBVBPjyD5L0W_25-hSBWc"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyCmQincHk8_tGoBVBPjyD5L0W_25-hSBWc"
