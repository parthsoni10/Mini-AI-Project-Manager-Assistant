# TaskFlow AI — Mini AI Project Manager Assistant

TaskFlow AI is a modern full-stack MERN application that allows teams to input unstructured meeting notes, transcripts, or standup updates, and automatically extracts structured tasks with owners, deadlines, and priorities using Advanced AI.

The app is built with a premium dark-mode, glassmorphism design that features custom hover effects, badge alerts, filters, modal editors, and a CSV exporter.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string or Local MongoDB fallback.

### 1. Environment Configuration
Ensure you have a `.env` file in the `Backend` directory containing:
```env
PORT=5000
MONGO_URL=mongodb://<atlas-replica-set-urls>/taskflow?ssl=true...
GEMINI_API_KEY=AIzaSy...
```

### 2. Run the Backend Server
```bash
cd Backend
npm install
npm start
```
The server will run on `http://localhost:5000`. It connects directly to your MongoDB Atlas cluster.

### 3. Run the Frontend Client
```bash
cd Frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`. API calls are automatically proxied to port 5000 to prevent CORS issues.

---

## 🛠️ Key Design Decisions & Architectural Highlights

### 1. Global Background Task Extraction
Extraction is managed globally via `ExtractContext`. If a user navigates away from the home screen to the dashboard while extraction is processing, the extraction continues uninterrupted in the background. A floating glassmorphic widget appears at the bottom-right of the screen to show background progress; clicking it navigates the user back to the status board.

### 2. Step-by-Step AI Progress Pipeline
Instead of a simple loading spinner, a detailed, animated checkmark checklist guides the user through each extraction step:
1. Connecting to the AI Engine
2. Parsing text and resolving dates
3. Saving meeting logs in the Atlas DB
4. Validating constraints via Zod
5. Structuring and inserting final tasks

### 3. Chronological Batch Grouping & Stable Indexing
Tasks are grouped on the dashboard by the specific meeting notes log from which they were extracted. The batches are numbered stably from oldest to newest (the oldest log is `Batch #1`, the next is `Batch #2`, etc.) while displaying the latest batches at the top of the dashboard. This ensures batch numbers never change dynamically when new logs are added.

### 4. Bulk Batch Deletion
Project managers can delete an entire meeting batch and all of its associated tasks at once with a single click, using the red "Delete Batch" button next to each batch header.

### 5. Case-Insensitive Owner Normalization
Owner name strings are formatted to proper Title Case when extracted by the AI or modified by a user. The dynamic dropdown filter list de-duplicates matching names case-insensitively and sorts them alphabetically.

### 6. Auto-Clearing Smart Input
The raw meeting notes textarea clears automatically upon successful task extraction. If the extraction fails, it preserves your input notes so no data is lost.

---

## 📂 Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── config/db.js          # Database connection & Atlas configurations
│   │   ├── models/               # Mongoose Schemas (Task, Meeting)
│   │   ├── schemas/              # Zod Schemas
│   │   ├── services/             # AI Extraction Service
│   │   ├── controllers/          # Business logic (Extract, Tasks, CSV export)
│   │   ├── routes/               # Express endpoints mapping
│   │   ├── middleware/           # Global error handler
│   │   └── utils/                # CSV exporter engine
│   ├── index.js                  # App Entry Point
│   └── .env
│
└── Frontend/
    ├── src/
    │   ├── api/axiosClient.js    # Pre-configured Axios instance
    │   ├── components/           # UI elements (Cards, Modals, Loaders, Filters)
    │   ├── context/              # Global state (ExtractContext)
    │   ├── pages/                # HomePage, TaskListPage, NotFoundPage
    │   ├── App.jsx               # Router & Core layout wrapper
    │   ├── index.css             # Tailwind imports & glassmorphic styles
    │   └── main.jsx              # React Entry Point
    └── vite.config.js            # Vite config (backend proxy)
```

---

## 📊 API Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/extract` | Paste notes → Returns extracted tasks + creates linked meeting history. |
| `GET` | `/api/tasks` | Fetches tasks. Accepts query params: `?status=&priority=&owner=` |
| `PUT` | `/api/tasks/:id` | Update task details (description, status, priority, owner, due date) |
| `DELETE` | `/api/tasks/:id` | Deletes an individual task. |
| `DELETE` | `/api/tasks/batch/:meetingId` | Deletes a meeting batch log and all of its associated tasks. |
| `GET` | `/api/tasks/export/csv` | Downloads CSV of tasks matching currently active filters. |
