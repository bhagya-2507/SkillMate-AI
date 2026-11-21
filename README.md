# 🎓 SKILLMATE AI
> **Tagline:** *Your Personal AI Learning & Career Assistant*

A complete, production-ready, full-stack college major/minor web application designed for engineering and university students. Powered by **React.js, Node.js, Express.js, MySQL (Sequelize ORM), and Google Gemini AI**.

---

## 🌟 Key Platform Features

### 👨‍🎓 Student Dashboard
1. **Overview**: Welcome banner, active streak counter, total study hours, completed quizzes, study plan completion rate, weekly Recharts graph, and quick AI module shortcuts.
2. **AI Learning Assistant**: Natural conversational AI tutor powered by Gemini with past chat memory saved in MySQL, clear-chat modal, and starter concept pills.
3. **Smart Study Planner**: Generates personalized, day-by-day task curricula based on student's exam date, available daily hours, and subject difficulty. Tracks completion checkboxes live in MySQL.
4. **AI Quiz Generator**: Generates 4-option multiple-choice quizzes on any subject/difficulty with instant grading, question-by-question explanations, and confetti celebrations.
5. **Notes & Document Summarizer**: Drag-and-drop or upload PDF/TXT lecture notes (up to 10MB) to extract key takeaways, formulas, definitions, and exam checklists. Includes copy and download as `.txt`.
6. **Career Guidance**: Formulates customized career pathways, salary outlooks, skill gap analysis, and 6-month placement roadmaps.
7. **Interview Preparation**: Practice role-specific technical questions (Full-Stack, Frontend, Backend, AI/Data) with AI scoring, strengths, improvements, and exemplary model answers.
8. **My Progress**: Performance analytics, quiz score charts, learning hours progression, and subject-wise mastery bar graphs.
9. **Profile & Settings**: Edit student profile, degree, college name, change password with live complexity validation, and secure logout.

### 🛡️ Administrator Dashboard
1. **Overview**: System-wide analytics (total registered students, active mentors, total quizzes, active study plans, recent signups, growth area charts).
2. **User Management**: Search, filter by role (STUDENT, MENTOR, ADMIN) and status (Active/Inactive), toggle activation, update roles, and delete accounts.
3. **Mentor Management**: Onboard new mentors with temporary credentials and pair faculty mentors with students.
4. **Content Management**: Curate and moderate published learning resources and documentation links.
5. **Quiz Management**: Review platform-wide quiz submissions and score distributions.
6. **Reports & Analytics**: System audit reports with 1-click **Export as CSV** and **Export as JSON**.

### 👨‍🏫 Mentor Dashboard
1. **Overview**: Assigned student metrics, resources published, and feedback counts.
2. **My Students**: Inspect assigned students, view their real-time study plan completion %, total quizzes, and average scores.
3. **Learning Resources**: Publish, edit, and delete reference guides and documentation links for students.
4. **Student Feedback**: Compose personalized recommendations that deliver directly to the student's dashboard and persist in MySQL.

---

## 🏗️ Technology Architecture

```
SkillMate-AI/
|-- frontend/                 # React.js (Vite) Single Page Application
|   |-- src/
|   |   |-- components/       # Common UI (Navbar, Footer, Modals, StatCards)
|   |   |-- context/          # AuthContext (JWT) & ToastContext
|   |   |-- pages/            # Public, Auth, Student, Admin, Mentor Pages
|   |   |-- services/         # Axios instance with request/response interceptors
|   |   |-- styles/           # Modern SaaS design system with CSS Variables
|   |-- package.json
|-- backend/                  # Node.js + Express.js REST API
|   |-- src/
|   |   |-- config/           # MySQL Sequelize connection pooling
|   |   |-- models/           # 15 Relational Sequelize models with Foreign Keys
|   |   |-- controllers/      # Route handler business logic
|   |   |-- routes/           # REST endpoints
|   |   |-- services/         # Google Gemini AI SDK service with fallbacks
|   |   |-- middleware/       # JWT Auth, RoleGuard, RateLimiter, ErrorHandler
|   |   |-- validators/       # express-validator schemas
|   |   |-- utils/            # Database seeder (seedData.js)
|   |-- package.json
|-- docs/                     # Full academic documentation & reports
|   |-- project_report.md
|   |-- database_design.md
|   |-- api_documentation.md
|   |-- setup_guide.md
|-- README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ installed
- **MySQL Server**: v8.0+ running on port 3306

### 2. MySQL Database Setup
Open your MySQL client and create the database:
```sql
CREATE DATABASE IF NOT EXISTS skillmate_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend Setup & Seeding
```bash
cd backend
npm install
```
Configure your MySQL password in `backend/.env` (default is `1234`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=skillmate_ai
JWT_SECRET=skillmate_ai_jwt_secret_token_key_development_2026
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

Run the database seeder to create tables and insert demo accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```
*Backend runs on: `http://localhost:5000`*

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🔑 Pre-Configured Demo Test Accounts

For viva presentation and evaluation, you can use the **1-Click Auto-Fill** buttons on `/login` or enter:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Student** | `student@skillmate.ai` | `Student@123` | Student Dashboard & All AI Tools |
| **Mentor** | `mentor@skillmate.ai` | `Mentor@123` | Mentor Dashboard & Student Guidance |
| **Admin** | `admin@skillmate.ai` | `Admin@123` | Platform Control, User Management & Reports |

---

## 🤖 Google Gemini AI Configuration
SkillMate AI uses the official Google Generative AI SDK (`@google/generative-ai`) on the backend only.
- Set `GEMINI_API_KEY=your_key` in `backend/.env`.
- If an API key is not configured or rate limits are reached, SkillMate AI gracefully runs in high-reliability demonstration mode with realistic college study responses and **never crashes**.

---

## 🚀 Production Deployment
- **Frontend**: Can be built via `npm run build` inside `frontend/` and hosted on Vercel, Netlify, or AWS S3 + CloudFront.
- **Backend**: Can be containerized with Docker or deployed to Render, Railway, AWS EC2, or DigitalOcean with a managed MySQL database.
