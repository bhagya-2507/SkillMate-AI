# SkillMate AI - Comprehensive Setup & Installation Guide

This guide details how to install, configure, migrate, seed, and run the **SkillMate AI** platform on your development machine.

---

## 1. Prerequisites
Ensure you have the following installed on your operating system:
1. **Node.js**: v18.0.0 or higher (`node -v`)
2. **npm**: v9.0.0 or higher (`npm -v`)
3. **MySQL Server**: v8.0 or higher running on port `3306` (`mysql --version`)
4. **Git**: (`git --version`)

---

## 2. MySQL Database Setup

1. Start your local MySQL service (e.g., in Windows Services: `MySQL80`).
2. Log into MySQL CLI or MySQL Workbench as `root`:
   ```bash
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS skillmate_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES;
   EXIT;
   ```

---

## 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd SkillMate-AI/backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=skillmate_ai
   JWT_SECRET=skillmate_ai_jwt_secret_token_key_development_2026
   JWT_EXPIRES_IN=24h
   GEMINI_API_KEY=your_gemini_api_key_here
   CLIENT_URL=http://localhost:5173
   ```
   > 💡 **Note on Gemini API Key:** You can generate a free API key at [Google AI Studio](https://aistudio.google.com/). If left empty, SkillMate AI will run in demonstration mode with realistic academic responses and will never crash.

4. Run the database seeder to create tables and insert demo accounts:
   ```bash
   npm run seed
   ```
   *Expected output:*
   ```text
   🌱 Starting SkillMate AI database seeder...
   ✅ Database seeding completed successfully!
   -------------------------------------------------------
   🔑 Local Demo Test Accounts:
   - Student: student@skillmate.ai  /  Student@123
   - Mentor:  mentor@skillmate.ai   /  Mentor@123
   - Admin:   admin@skillmate.ai    /  Admin@123
   -------------------------------------------------------
   ```

5. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Server will start on `http://localhost:5000`.

---

## 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd SkillMate-AI/frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Verify or edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your web browser at:
   ```
   http://localhost:5173
   ```

---

## 5. Verifying Demo Accounts & Testing

Visit `http://localhost:5173/login`:
- **Student Dashboard:**
  - Click the **"👨‍🎓 Student"** 1-click button or enter `student@skillmate.ai` / `Student@123`
  - Test AI Chat, create a study plan, take a quiz, summarize a PDF document.
- **Mentor Dashboard:**
  - Click the **"👨‍🏫 Mentor"** button or enter `mentor@skillmate.ai` / `Mentor@123`
  - Review assigned students, publish a resource, submit student advice.
- **Admin Dashboard:**
  - Click the **"🛡️ Admin"** button or enter `admin@skillmate.ai` / `Admin@123`
  - Manage user permissions, onboard new mentors, export JSON/CSV reports.

---

## 6. Troubleshooting Common Issues

### Issue 1: `ECONNREFUSED 127.0.0.1:3306`
- **Cause:** MySQL service is not running.
- **Fix:** On Windows, run `Start-Service MySQL80` in PowerShell as Administrator or start MySQL in the Services management console.

### Issue 2: `Access denied for user 'root'@'localhost'`
- **Cause:** Incorrect MySQL root password in `backend/.env`.
- **Fix:** Update `DB_PASSWORD` in `backend/.env` with your actual MySQL password.

### Issue 3: `Port 5000 in use`
- **Cause:** Another process is occupying port 5000.
- **Fix:** Kill the process using port 5000:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
  ```
