# User Management Dashboard

A full-stack MERN application for managing users with a responsive dashboard, complete CRUD functionality, and a custom theming engine. Users can personalize the application using predefined themes, custom button colors, and uploaded fonts.

## 🚀 Features

### 📊 Dashboard
- View total users, active users, and inactive users.
- Display recently added users.
- Fetch statistics dynamically from the backend API.

### 👥 User Management
- Create, view, update, and delete users.
- Manage user details such as name, email, role, phone number, and status.
- Search and filter users.
- Validate form inputs on the client side.
- Store user data in MongoDB through REST APIs.
- Confirm before deleting a user.

### 🎨 Custom Theming Engine
- Choose from four built-in themes:
  - Indigo
  - Ocean
  - Forest
  - Sunset

- Customize the primary button color independently of the selected theme.
- Upload custom fonts in `.ttf`, `.otf`, `.woff`, or `.woff2` format.
- Apply custom fonts throughout the application.
- Preview theme changes instantly.
- Persist theme preferences using browser localStorage.
- Reset customizations to the default theme.

### 📱 Responsive Design
- Plain CSS without Tailwind CSS.
- Responsive dashboard, navigation, tables, forms, and theme controls.
- Reusable React components and CSS variables.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- Axios
- Context API
- Plain CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## 📁 Project Structure

```text
User Management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── StatCard.jsx
│   │   └── UserModal.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── Pages/
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   └── ThemeStudio.jsx
│   ├── services/
│   │   └── userService.js
│   ├── styles/
│   │   └── app.css
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:
- Node.js and npm
- MongoDB locally or a MongoDB Atlas database
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd User-Management
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's URL.

### 2. Install frontend dependencies

From the project root, run:

```bash
npm install
```

### 3. Configure the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongo_url
CLIENT_URL=http://localhost:5173
```

If you use MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string.

### 4. Start the backend

From the `backend` directory, run the command configured in your backend `package.json`, commonly:

```bash
npm run dev
```

If your backend uses a different script, use the corresponding command.

### 5. Configure the frontend

Create a `.env` file in the frontend project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Ensure this URL matches the address where your backend is running.

### 6. Start the frontend

Open a separate terminal in the frontend project root and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🔌 REST API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Retrieve all users |
| POST | `/users` | Create a user |
| GET | `/users/:id` | Retrieve a user by ID |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |


## 🗄️ Database

User records are stored in MongoDB using Mongoose.

User information includes:
- Name
- Email
- Role
- Phone number
- Active/inactive status
- Creation and update timestamps

The backend handles database operations and validates incoming user data.

## 🎨 How the Theming Engine Works

The application uses React Context API to manage theme preferences and CSS custom properties to apply styling globally.

1. Select a predefined theme.
2. Override the primary button color independently.
3. Upload a supported custom font.
4. Preview changes immediately across the application.
5. Save theme preferences in localStorage so they remain available after refreshing the browser.


## 📌 Future Improvements

- Pagination for large user lists.
- Authentication and role-based access control.
- More theme presets and advanced typography controls.
- Automated tests for API endpoints and UI components.
- Deployment with a hosted frontend, backend, and database.
