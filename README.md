# Planora - Task Management Web Application

Planora is a simple full-stack task management web application built for a college mini project. It uses React, Vite, Tailwind CSS, Node.js, Express.js, and SQLite.

## Features

- Create tasks
- View all tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed or pending
- Responsive modern dashboard UI
- SQLite database created automatically on first run

## Project Structure

```text
TaskFlow/
  client/
  server/
```

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- SQLite

## How to Run

Open two terminals.

### Backend

```bash
cd TaskFlow/server
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend

```bash
cd TaskFlow/client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Deployment Notes

Frontend can be deployed to Vercel from the `client` folder.

Backend can be deployed to Render or Railway from the `server` folder. Set the frontend environment variable `VITE_API_URL` to the deployed backend URL.

