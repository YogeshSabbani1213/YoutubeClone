# An Youtube Clone - Video Platform (MERN Stack)

A full-stack video sharing platform built with **MongoDB, Express, React, and Node.js**.
The application supports user authentication, channel management, video uploads, comments, and protected routes on both the backend and frontend.

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected backend API routes
* Protected frontend pages using route guards

### Channels

* Create and manage channels
* View channel details
* Channel–video relationship handling

### Videos

* Upload videos
* Fetch videos by channel
* Video player integration
* Video cards and video listings

### Comments

* Add comments to videos
* Fetch comments per video

### Database Seeding

Seed scripts provided for:

* Users
* Channels
* Videos
* Comments

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT Authentication
* Middleware-based architecture

### Frontend

* React (Vite)
* React Router
* Context API
* Protected Routes
* Axios

---

## Project Structure

### Backend

```
backend/
 ├── src/
 │   ├── config/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── models/
 │   ├── routes/
 │   ├── seed/
 │   └── app.js
 ├── server.js
 └── package.json
```

### Frontend

```
frontend/
 ├── src/
 │   ├── components/
 │   ├── context/
 │   ├── pages/
 │   ├── utils/
 │   ├── App.jsx
 │   └── main.jsx
 └── package.json
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

---

## Database Seeding

The project uses **MongoDB Atlas**.
To seed sample data locally, run the following scripts from the backend directory:

```
cd backend
node src/seed/seedUser.js
node src/seed/seedChannel.js
node src/seed/seedVideos.js
node src/seed/seedComments.js
```

Ensure your Atlas cluster connection string is correctly set in the `.env` file before running the scripts.

---

## Running the Project

### Backend

```
cd backend
npm install
npm start
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## Author

Your Name
Yogesh Sabbani

