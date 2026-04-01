# 🎮 Real-Time Multiplayer Coding Game ⚡💻
Live Link - https://codingo-seven.vercel.app

A real-time **multiplayer coding game** built using the **MERN stack + Socket.IO**, where players join rooms, solve coding challenges, and get AI-based feedback and scoring.

The core focus of this project is understanding:
- **real-time systems (WebSockets)**
- **multiplayer state synchronization**
- **AI integration in applications**

---

## 📸 Screenshots

![Game UI](./frontend/public/screenshots/game.png)

---

## ⚙️ Tech Stack

### Frontend 🎨
- React (Vite)
- Tailwind CSS
- Socket.IO Client
- Zustand (state management)
- Monaco Editor (code editor)
- React Router
- Axios
- React Toastify

### Backend 🧠
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication (cookies)
- bcrypt (password hashing)

### AI Integration 🤖
- Google AI SDK (`@ai-sdk/google`)
- AI-based:
  - Question generation
  - Code evaluation & scoring

---

## ✨ Features

- 🔐 User authentication (JWT)
- 👥 Multiplayer rooms (create / join)
- 🟢 Real-time player presence & readiness
- 🎮 Host-controlled game start
- ⏱️ Timed coding challenges
- 💻 In-browser code editor (Monaco)
- ⚡ Real-time updates using Socket.IO
- 🤖 AI-generated coding questions
- 📊 AI-based scoring & feedback (including roast 😏)
- 📄 View submissions & results after game

---

## 🚀 Learnings

This project was made by two college students in a month. the main goal was to learn how to execute our ideas into a real working project.

### 🔌 Socket.IO (Core Learning)
- Room-based communication
- Broadcasting events to players
- Handling disconnects
- Syncing game state across clients

### 🧠 Multiplayer Architecture
- Managing shared state (rooms, players, game status)
- Handling host vs player roles
- Game lifecycle:
  - Lobby → Ready → Start → Timer → Submit → Results

### 🔐 Authentication
- JWT with cookies (session-style)
- Protected routes & session persistence

### 🤖 AI Integration
- Generating dynamic coding questions
- Evaluating code using prompts
- Handling failures with fallback logic

### 🗂️ State Management
- Zustand for global state
- Syncing frontend state with backend events

### ⚡ Code Execution
- Running user code safely in browser (iframe-based execution)

---

## 🧱 Project Structure

```
/frontend
  /components
  /pages
  /store
/backend
  /models
  /routes
  /sockets
```

---

## 🚀 Run This Project Locally

### 1️⃣ Clone the repository
```bash
git clone <repo-url>
cd project-folder
```

---

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

#### Create `.env` file (backend)
```
PORT=4001
SERVER_ENV=development
FRONTEND_URL=http://localhost:5173

JWT_SECRET=your_secret
MONGODB_URI=your_mongodb_uri

GOOGLE_API_KEY=your_ai_key (add here for testing or directly in live app)
```

#### Start backend
```bash
npm start
```

---

### 3️⃣ Setup Frontend
```bash
cd frontend
npm install
```

#### Create `.env` file (frontend)
```
VITE_BACKEND_URL=http://localhost:4001
```

#### Start frontend
```bash
npm run dev
```

---

## ⚠️ Limitations (Current)

- Room state stored in memory (resets on server restart)
- No matchmaking system (manual room join)
- Limited code execution sandboxing
- Small room ID space (possible collisions lol)
- developers are poor so players will have to provide their gemini api to play. (basically use your own api key to play)


## 🔮 Future Improvements

- clean and scalable code architecture
- player limiting and disconnect handling

---

## 💡 Notes

This project demonstrates:
- Real-time system design
- Multiplayer architecture
- AI integration in full-stack apps
- project was made by two developers in a month, so the code quality is not the best, but it serves as a great learning experience for us. We plan to refactor and improve the code in the future to make it more scalable and maintainable. we loved this project haaha
