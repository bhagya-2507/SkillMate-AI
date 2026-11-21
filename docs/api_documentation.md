# SkillMate AI - REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP Header:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register Student
- **Route:** `POST /api/auth/register`
- **Access:** Public (Students Only)
- **Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@college.edu",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "education": "B.Tech Computer Science",
  "college": "Metro State University",
  "interests": "Full Stack, AI"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Student account registered successfully. Welcome to SkillMate AI!",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Alex Johnson",
    "email": "alex@college.edu",
    "role": "STUDENT"
  }
}
```

### 1.2 Login
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "student@skillmate.ai",
  "password": "Student@123"
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Welcome back, Alex Johnson!",
  "token": "eyJhbGci...",
  "user": {
    "id": 3,
    "name": "Alex Johnson",
    "email": "student@skillmate.ai",
    "role": "STUDENT"
  }
}
```

### 1.3 Get Current User Profile
- **Route:** `GET /api/auth/me`
- **Access:** Authenticated

### 1.4 Update Profile
- **Route:** `PUT /api/auth/profile`
- **Access:** Authenticated
- **Body:**
```json
{
  "name": "Alex Johnson",
  "education": "B.Tech CSE Final Year",
  "college": "Metro State University",
  "interests": "Cloud Computing, Full-Stack"
}
```

### 1.5 Change Password
- **Route:** `PUT /api/auth/change-password`
- **Access:** Authenticated
- **Body:**
```json
{
  "currentPassword": "Student@123",
  "newPassword": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

---

## 2. AI Learning Endpoints

### 2.1 Chat with AI Assistant
- **Route:** `POST /api/ai/chat`
- **Access:** Authenticated (Student/Mentor/Admin)
- **Body:**
```json
{
  "chatId": null,
  "message": "Explain B+ Tree indexing in MySQL"
}
```
- **Response (200):**
```json
{
  "success": true,
  "chatId": 1,
  "userMessage": { "id": 1, "sender": "user", "message": "..." },
  "aiMessage": { "id": 2, "sender": "assistant", "message": "..." }
}
```

### 2.2 Get Chat Sessions
- **Route:** `GET /api/ai/chats`
- **Access:** Authenticated

### 2.3 Get Chat Messages
- **Route:** `GET /api/ai/chats/:id`
- **Access:** Authenticated (Owner only)

### 2.4 Delete Chat Session
- **Route:** `DELETE /api/ai/chats/:id`
- **Access:** Authenticated (Owner only)

### 2.5 Summarize Document (PDF/TXT)
- **Route:** `POST /api/ai/summarize`
- **Access:** Authenticated
- **Content-Type:** `multipart/form-data`
- **Form Field:** `document` (PDF or TXT, max 10MB)

### 2.6 Generate Career Guidance
- **Route:** `POST /api/ai/career-guidance`
- **Access:** Authenticated
- **Body:**
```json
{
  "interests": "Full Stack, AI",
  "skills": "JavaScript, React, Node, SQL",
  "education": "B.Tech CSE",
  "goals": "SDE at top tech firm"
}
```

### 2.7 Practice Interview Question Feedback
- **Route:** `POST /api/ai/interview-feedback`
- **Access:** Authenticated
- **Body:**
```json
{
  "job_role": "Full-Stack Developer",
  "question": "Explain Event Loop in Node.js",
  "user_answer": "Node.js uses a single-threaded event loop with libuv..."
}
```

---

## 3. Study Planner Endpoints

### 3.1 Create Study Plan
- **Route:** `POST /api/study-plans`
- **Access:** Authenticated
- **Body:**
```json
{
  "subject": "Database Management Systems",
  "topic": "Normalization and Indexing",
  "target_date": "2026-12-15",
  "daily_hours": 2.5,
  "difficulty": "Intermediate"
}
```

### 3.2 List Study Plans
- **Route:** `GET /api/study-plans`
- **Access:** Authenticated

### 3.3 Toggle Task Completion
- **Route:** `PUT /api/study-plans/tasks/:id/complete`
- **Access:** Authenticated
- **Body:**
```json
{
  "is_completed": true
}
```

### 3.4 Delete Study Plan
- **Route:** `DELETE /api/study-plans/:id`
- **Access:** Authenticated

---

## 4. AI Quiz Endpoints

### 4.1 Generate AI Quiz
- **Route:** `POST /api/quizzes/generate`
- **Access:** Authenticated
- **Body:**
```json
{
  "subject": "Computer Networks",
  "topic": "TCP 3-Way Handshake",
  "difficulty": "Medium",
  "total_questions": 5
}
```

### 4.2 Submit Quiz Answers
- **Route:** `POST /api/quizzes/:id/submit`
- **Access:** Authenticated
- **Body:**
```json
{
  "answers": {
    "1": "B",
    "2": "A",
    "3": "C"
  }
}
```

### 4.3 Quiz Attempt History
- **Route:** `GET /api/quizzes/history`
- **Access:** Authenticated

---

## 5. Progress Tracking Endpoints

### 5.1 Progress Overview
- **Route:** `GET /api/progress/overview`
- **Access:** Authenticated

### 5.2 Subject Mastery
- **Route:** `GET /api/progress/subjects`
- **Access:** Authenticated

### 5.3 Activity Trends
- **Route:** `GET /api/progress/activity`
- **Access:** Authenticated

---

## 6. Admin Endpoints

- `GET /api/admin/dashboard` - Platform statistics
- `GET /api/admin/users?page=1&limit=10&role=STUDENT` - Filter users with pagination
- `PUT /api/admin/users/:id` - Update user role & active status
- `DELETE /api/admin/users/:id` - Delete user account
- `POST /api/admin/mentors` - Onboard mentor account
- `POST /api/admin/assign-mentor` - Pair mentor with student
- `GET /api/admin/reports` - Generate audit reports

---

## 7. Mentor Endpoints

- `GET /api/mentor/dashboard` - Mentor stats overview
- `GET /api/mentor/students` - Assigned students list with progress
- `GET /api/mentor/resources` - Published learning resources
- `POST /api/mentor/resources` - Publish learning resource
- `DELETE /api/mentor/resources/:id` - Delete resource
- `POST /api/mentor/feedback` - Deliver feedback to assigned student
- `GET /api/mentor/feedback` - History of given feedbacks

---

## 8. Public Contact

- `POST /api/contact` - Submit contact inquiry to database
