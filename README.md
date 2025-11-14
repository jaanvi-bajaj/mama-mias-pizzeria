# Mama Mia's Pizzeria

A full-stack web application for a pizza restaurant featuring a React frontend with Tailwind CSS and a Node.js/Express backend with MySQL database.

## Project Structure

```
root/
├── /client (React + Tailwind)
│   ├── src/
│   ├── public/
│   └── package.json
├── /public (HTML + CSS + JS)
│   ├── index.html
│   ├── menu.html
│   ├── about.html
│   ├── reservations.html
│   ├── testimonials.html
│   ├── contact.html
│   ├── style.css
│   ├── script.js
│   └── /images
├── /server
│   ├── app.js
│   ├── /routes
│   ├── /controllers
│   ├── /models
│   ├── /config
│   └── package.json
└── /database
    └── create_tables.sql
```

## Features

- Menu display with categories
- Online reservations
- Contact form
- Customer testimonials
- Responsive design
- REST API backend
- MySQL database

## Setup Instructions

### Database Setup

1. Install MySQL
2. Run the SQL script to create the database:
   ```bash
   mysql -u root -p < database/create_tables.sql
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database credentials

4. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup (Static HTML)

1. Open the `public/index.html` file in a web browser, or
2. Serve the public directory using a local server

### React Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `GET /api/menu/category/:category` - Get menu items by category
- `POST /api/reservations` - Create a reservation
- `GET /api/reservations` - Get all reservations
- `POST /api/contact` - Send contact message
- `GET /api/testimonials` - Get approved testimonials

## Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Lucide React (icons)
- HTML5/CSS3/JavaScript

### Backend
- Node.js
- Express.js
- MySQL
- CORS

## License

ISC