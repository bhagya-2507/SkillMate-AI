# SkillMate AI - Comprehensive Academic Project Report

**Project Title:** SKILLMATE AI: Your Personal AI Learning & Career Assistant  
**Category:** Full-Stack Web Application & Artificial Intelligence Integration  
**Architecture:** Multi-Tier Client-Server Architecture (React.js, Node.js, Express.js, MySQL, Google Gemini)  

---

## 1. Executive Summary
SkillMate AI is an AI-powered academic learning companion and career accelerator tailored specifically for university and college engineering students. While contemporary e-learning systems provide static video content and rigid assessments, SkillMate AI introduces an adaptive, student-centric paradigm. By integrating Google Gemini's generative models directly into a secure, normalized MySQL relational database environment with strict role-based dashboards (Student, Mentor, Administrator), the platform enables students to generate personalized daily study plans, take dynamic self-assessments with instant explanations, summarize dense lecture slides, and practice technical interview questions.

---

## 2. Problem Statement & Existing System Limitations
In standard university environments:
1. **Syllabus Overload**: Students are overwhelmed by broad semester curricula with little guidance on prioritizing daily study milestones.
2. **Delayed Assessment Feedback**: Traditional college assignments and quizzes often take days or weeks for grading, leaving students unaware of conceptual misunderstandings until formal exams.
3. **Manual Note Digesting**: Extracting actionable exam points and formulas from dense 100-page slide decks and textbooks consumes critical revision time.
4. **Campus Placement Anxiety**: Students often possess academic theory but struggle with live coding interviews, STAR-method behavioral responses, and systems design trade-offs.
5. **Disconnected Mentorship**: Academic counselors have limited real-time visibility into whether assigned mentees are consistently studying or completing revision milestones.

---

## 3. Proposed Solution
SkillMate AI solves these challenges through a unified platform featuring:
- **AI Learning Assistant**: An interactive chat interface with memory persistence in MySQL for continuous question-and-answer tutoring.
- **Smart Study Planner**: Generates day-wise task milestones calculated against the student's exam date and available daily hours.
- **AI Quiz Generator**: Generates 4-option multiple-choice questions with automated grading and detailed explanations.
- **Document Summarizer**: Parses PDF/TXT files using `pdf-parse` and Gemini models into key concepts and exam revision checklists.
- **Career & Interview Simulator**: Recommends personalized roadmaps and scores typed interview answers with strengths, weaknesses, and model solutions.
- **Role-Based Portals**: Differentiated portals for Students, Mentors, and Administrators ensuring privacy and data ownership.

---

## 4. Technical Stack Rationale

| Layer | Chosen Technology | Rationale |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast HMR, reactive state management, high-performance Virtual DOM. |
| **Icons & Design** | Lucide React + CSS3 | SaaS aesthetics with Plus Jakarta Sans typography and CSS variables. |
| **Visualizations** | Recharts | SVG-rendered, responsive charts for learning hours and quiz mastery. |
| **Backend API** | Node.js + Express.js | Non-blocking asynchronous I/O ideal for handling AI and DB requests. |
| **Database** | MySQL 8.0 + Sequelize ORM | Relational structure with primary/foreign keys, indexes, and ACID transactions. |
| **Authentication** | JWT + bcryptjs | Stateless, secure authentication with 10-round salted password hashing. |
| **AI Integration** | Google Gemini SDK | High context window and fast inference using `gemini-1.5-flash` with graceful fallbacks. |

---

## 5. Security & Verification Measures
1. **Dual-Layer Form Validation**: Every input undergoes client-side checks and backend schema validation (`express-validator`).
2. **Access Control**: RoleGuard components on the client paired with `authorize()` middleware on the backend enforce access limits.
3. **Zero Leaked Secrets**: Gemini API keys and database credentials reside strictly within server-side environment variables.
4. **Resource Ownership**: Private entities (chats, study plans, quiz attempts) verify `user_id` ownership before allowing mutations.
5. **Rate Limiting & Helmet**: Protects authentication and AI generation endpoints from spam and automated brute-force attacks.

---

## 6. Conclusion & Viva Defense Points
SkillMate AI satisfies all criteria for an advanced major project:
- Fully functional without mock frontends or localStorage placeholders.
- True relational MySQL persistence across 15 normalized tables.
- Resilient architecture that operates smoothly in live Gemini AI mode or local educational fallback mode without crashing.
