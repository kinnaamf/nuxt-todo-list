# Nuxt 3 Collaborative To-Do App

A modern, responsive, and collaborative task management application built with **Nuxt 4** and **TypeScript**. It features live synchronization via a shared backend and resilience using LocalStorage.

## Features
*   **Real-time Collaboration:** Shared backend allowing multiple users/devices to sync tasks.
*   **Modern UI:** Beautiful transitions and styles built with Tailwind CSS.
---

## Getting Started

### Prerequisites
Make sure you have **Node.js** (v18.x or higher) installed.

### 1. Clone the repository
```
git clone https://github.com/kinnaamf/nuxt-todo-list
cd nuxt-todo-list
```

### 2. Install dependencies
```
npm install
```

### 3. Environment Setup
Create a .env file in the root directory and specify your API endpoint:
```
NUXT_PUBLIC_API_BASE=http://localhost:5000
```

### 4. Run the Backend (Mock API)
The project uses json-server to mock the REST API. In a separate terminal window, run:
```
json-server --watch ./db.json --port 5000
```
### 5. Run the Frontend (Nuxt)
Start the Nuxt development server:
```
npm run dev
or
nuxt dev
```
Open http://localhost:3000 in your browser to see the app in action!

### Deployment
To bundle the application for production production use:
```
npm run build
```
The output will be generated in the .output/ directory, ready to be managed by PM2 behind a reverse proxy like Caddy or Nginx.
