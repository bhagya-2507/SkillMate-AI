const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = 'C:\\Users\\acer\\Desktop\\SkillMate_AI_Viva_Guide.pdf';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 32, bottom: 32, left: 38, right: 38 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper styles
const primaryColor = '#4F46E5';
const secondaryColor = '#0F172A';
const accentGreen = '#059669';
const accentOrange = '#D97706';
const textColor = '#1E293B';
const mutedColor = '#64748B';

const drawDivider = () => {
  doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(38, doc.y).lineTo(557, doc.y).stroke();
  doc.moveDown(0.4);
};

const drawBadge = (text, bg, fg = '#FFFFFF') => {
  const currentY = doc.y;
  doc.rect(38, currentY, 519, 18).fill(bg);
  doc.fillColor(fg).fontSize(9.5).font('Helvetica-Bold').text(text, 44, currentY + 4);
  doc.y = currentY + 23;
};

// ==========================================
// PAGE 1: TITLE & ELEVATOR PITCH
// ==========================================

// Header Banner
doc.rect(38, 25, 519, 80).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('SKILLMATE AI', 38, 36, { align: 'center' });
doc.fillColor('#818CF8').fontSize(11).font('Helvetica').text('Complete Viva Voce, 3-Dashboard Guide & Friend Laptop Setup', 38, 62, { align: 'center' });
doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text('B.Tech Major/Minor Project — Full-Stack Web Application (React + Node + MySQL + Gemini AI)', 38, 80, { align: 'center' });

doc.y = 118;

// SECTION 1: Elevator Pitch
doc.fillColor(primaryColor).fontSize(12.5).font('Helvetica-Bold').text('1. Examiner Ko Pehle 30 Seconds Mein Kya Bolna Hai? (Elevator Pitch)');
doc.moveDown(0.25);
doc.fillColor(textColor).fontSize(9).font('Helvetica').text(
  'Sir/Ma\'am, hamare project ka naam hai "SkillMate AI - Your Personal AI Learning & Career Assistant".\n\n' +
  'College students ke liye padhai aur placements do sabse badi challenges hoti hain. Students ko ye samajh nahi aata ki exam ke liye kab kya padhein, unke paas 24/7 doubts solve karne wala koi tutor nahi hota, aur semester ke time par 100-page ki notes padhne ka time nahi hota.\n\n' +
  'SkillMate AI is problem ka ek All-in-One AI-powered solution hai. Ye React, Node.js, Express, MySQL aur Google Gemini AI se bana ek complete production-level web application hai jisme 3 alag-alag role-based portals hain: Student, Mentor aur Admin.'
);
doc.moveDown(0.4);
drawDivider();

// SECTION 2: Why This Project?
doc.fillColor(primaryColor).fontSize(12.5).font('Helvetica-Bold').text('2. Core Problem vs SkillMate AI Solution');
doc.moveDown(0.25);

const problemSolutions = [
  ['Problem: Exam paas aate hi timetable nahi banta.', 'Solution: Smart Study Planner exam date aur available hours ke hisaab se 5-day realistic schedule banata hai.'],
  ['Problem: Theory padh li, par marks aayenge ya nahi pata nahi.', 'Solution: AI Quiz Generator B.Tech semester level ke MCQs banata hai aur explanation ke saath instant score deta hai.'],
  ['Problem: Exam ke ek raat pehle lambi PDF notes revise karna mushkil hai.', 'Solution: Notes Summarizer PDF/TXT upload karte hi key points aur exam revision checklist bana deta hai.'],
  ['Problem: Campus placement interviews ka darr lagta hai.', 'Solution: Interview Prep SDE-1 aur core roles ke technical questions puchta hai aur answer par AI feedback deta hai.'],
  ['Problem: Teachers ko students ki daily progress ka pata nahi chalta.', 'Solution: Mentor Dashboard par faculty live students ki progress, quiz scores aur feedback manage kar sakti hai.']
];

problemSolutions.forEach(([p, s]) => {
  doc.fillColor('#DC2626').fontSize(8.5).font('Helvetica-Bold').text('• ' + p);
  doc.fillColor(accentGreen).fontSize(8.5).font('Helvetica').text('   -> ' + s);
  doc.moveDown(0.18);
});

doc.moveDown(0.4);
drawDivider();

// SECTION 3: Tech Stack
doc.fillColor(primaryColor).fontSize(12.5).font('Helvetica-Bold').text('3. Project Ka Complete Tech Stack (Technical Viva)');
doc.moveDown(0.25);

doc.fillColor(textColor).fontSize(9).font('Helvetica').text(
  '• Frontend: React.js 19 (using Vite build tool), React Router DOM (v6), Axios, Lucide Icons, Recharts (Charts).\n' +
  '• Backend: Node.js, Express.js REST APIs, express-validator for robust input checks, Multer for file uploads.\n' +
  '• Database: MySQL 8.0 with Sequelize ORM (15 relational tables with Primary/Foreign Keys and Cascades).\n' +
  '• Security & Auth: JWT (JSON Web Tokens) for sessions, bcryptjs (10 salt rounds) for password hashing.\n' +
  '• AI Integration: Official Google Gemini AI SDK (@google/generative-ai) handled 100% on Backend with Fallback.'
);

// ==========================================
// PAGE 2: TEENO DASHBOARDS KA COMPLETE POST-MORTEM
// ==========================================
doc.addPage();

doc.fillColor(primaryColor).fontSize(13.5).font('Helvetica-Bold').text('4. Teeno Dashboards Ka Kaam & Features (Examiner In-Depth)');
doc.moveDown(0.35);

// A. STUDENT DASHBOARD
drawBadge('A. STUDENT DASHBOARD (Role: STUDENT)', '#4F46E5');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  'Student dashboard engineering student ki daily padhai aur campus placement preparation ke liye banaya gaya hai. Isme 9 modules hain:\n\n' +
  '1. Overview (Dashboard Home): Student ka active study streak (e.g. 4 Days), total learning hours, weekly activity graph, aur quick access buttons dikhata hai.\n' +
  '2. AI Learning Assistant: ChatGPT jaisa live AI tutor. Student B.Tech ke kisi bhi subject (DSA, DBMS, OS, CN) ke doubts puch sakta hai. Chat history MySQL database mein persist rehti hai.\n' +
  '3. Smart Study Planner: Student subject, focus topic aur exam target date select karta hai. Gemini AI day-wise practical milestones create karta hai jise student check/uncheck kar sakta hai.\n' +
  '4. AI Quiz Generator: Topic aur difficulty ke hisaab se instant MCQs generate hote hain. Student answer submit karta hai, system automatically score calculate karta hai aur har answer ka explanation dikhata hai.\n' +
  '5. Notes Summarizer: Student apni class notes ya book ki PDF/TXT file upload karta hai. Multer aur pdf-parse text extract karke AI se concise revision summary aur formula checklist banwate hain.\n' +
  '6. Career Guidance: Student ke skills aur interests ke mutabik high-paying tech career roadmaps (Full-Stack SDE, Cloud/DevOps, AI/ML) generate karta hai.\n' +
  '7. Interview Preparation: SDE-1, Java Developer aur Web Dev roles ke technical interview questions deta hai. Student apna answer likhta hai aur AI use 0-100 score aur model answer deta hai.\n' +
  '8. My Progress: Subject-wise mastery bar charts aur monthly study analytics dikhata hai.\n' +
  '9. Profile & Settings: Student apni details update kar sakta hai aur secure password change kar sakta hai.'
);
doc.moveDown(0.5);

// B. MENTOR DASHBOARD
drawBadge('B. MENTOR DASHBOARD (Role: MENTOR / FACULTY)', '#059669');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  'Mentor dashboard college professors ya teaching assistants ke liye hai taaki wo students ko guide kar sakein:\n\n' +
  '1. Mentor Overview: Total assigned students, active learners aur pending reviews ka high-level summary.\n' +
  '2. My Students: Faculty ko assigned students ki list milti hai. Mentor dekh sakta hai ki kis student ne kitne quiz diye, uska average score kya hai aur study plan kitne % complete hai.\n' +
  '3. Learning Resources: Mentor khud ke curated notes, video links ya reference material subject-wise publish kar sakta hai, jo students ko display hote hain.\n' +
  '4. Student Feedback: Kisi specific student ko select karke uski performance par 1-on-1 recommendations aur guidance feedback bhej sakta hai.\n' +
  '5. Mentor Profile: Teacher ki profile aur password management.'
);
doc.moveDown(0.5);

// C. ADMIN DASHBOARD
drawBadge('C. ADMIN DASHBOARD (Role: ADMIN / HOD / PRINCIPAL)', '#D97706');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  'Admin dashboard pooray platform ka command center hai jise sirf authorized admins access kar sakte hain:\n\n' +
  '1. Platform Overview: Real-time analytics — Total students, active mentors, quizzes taken, user growth trends.\n' +
  '2. User Management: Platform ke saare users ki searchable list. Admin kisi bhi user ko Activate/Deactivate kar sakta hai, role badal sakta hai (Student se Mentor), ya account delete kar sakta hai.\n' +
  '3. Mentor Management: Naye faculty mentors ko platform par add karna aur unhe specific students assign karna.\n' +
  '4. Content & Quiz Management: Platform par chal rahe subjects, study material aur global quiz categories ko monitor karna.\n' +
  '5. Reports & Audit Analytics: Pooray college ka learning report aur quiz performance 1-click mein CSV format mein download/export karna.\n' +
  '6. Admin Profile: Secure administrator account settings.'
);

// ==========================================
// PAGE 3: TOP 15 VIVA QUESTIONS & ANSWERS (PART 1)
// ==========================================
doc.addPage();

doc.fillColor(primaryColor).fontSize(13.5).font('Helvetica-Bold').text('5. Top 15 Viva Voce Questions & Answers (Examiner Favorites)');
doc.moveDown(0.25);
doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text('Note: In answers ko simple Hinglish mein yaad rakhein, examiner bohot impress hoga.');
doc.moveDown(0.35);

const qnasPart1 = [
  {
    q: 'Q1. Project ka flow/architecture kya hai? Ek request kaise travel karti hai?',
    a: 'Ans: Sabse pehle user React frontend par button click karta hai. Frontend se Axios ek REST API call bhejta hai Express backend ko. Backend par JWT Auth middleware token verify karta hai. Phir controller Sequelize ORM ke zariye MySQL database se data query karta hai. Agar AI feature ho toh backend se Gemini SDK call hota hai. Response JSON format mein React ko milta hai aur state update hokar UI re-render ho jati hai.'
  },
  {
    q: 'Q2. Database kahan hai aur kitni tables banayi hain?',
    a: 'Ans: Humne MySQL 8.0 relational database use kiya hai jiska naam "skillmate_ai" hai. Isme total 15 tables hain: users, chats, chat_messages, study_plans, study_tasks, quizzes, questions, quiz_attempts, notes, career_recommendations, interview_practices, mentor_assignments, learning_resources, mentor_feedbacks, aur contact_messages. Saari tables Foreign Keys aur ON DELETE CASCADE se interconnected hain.'
  },
  {
    q: 'Q3. Sequelize ORM kyun use kiya? Direct SQL queries kyun nahi likhi?',
    a: 'Ans: Sequelize use karne ke 3 bade fayde hain: 1) SQL Injection Attacks se 100% protection milti hai kyunki queries parameterized hoti hain. 2) JavaScript objects aur models ke through database schema manage hota hai (Migrations/Sync). 3) Associations (hasMany, belongsTo) se relational joins likhna bohot clean aur fast ho jata hai.'
  },
  {
    q: 'Q4. Passwords database mein kaise store hote hain? Kya Admin kisi ka password dekh sakta hai?',
    a: 'Ans: Bilkul nahi! Passwords database mein kabhi plain text mein nahi jaate. Humne "bcryptjs" use kiya hai with 10 salt rounds. Jab user register ya password change karta hai, toh bcrypt ek one-way cryptographic hash generate karta hai. Is hash ko decode/decrypt karna mathematically impossible hai.'
  },
  {
    q: 'Q5. Authentication kaise kaam karti hai? (JWT Token Flow)',
    a: 'Ans: Humne stateless JWT (JSON Web Token) authentication use ki hai. Jab user email aur password se login karta hai, toh server verify karne ke baad ek JWT token return karta hai jisme user ka ID aur Role (STUDENT/MENTOR/ADMIN) signed rehta hai. Frontend par Axios interceptor har request ke Authorization header mein "Bearer <token>" bhejta hai.'
  },
  {
    q: 'Q6. Role-Based Access Control (RBAC) kaise implement kiya hai?',
    a: 'Ans: RBAC dono jagah enforce hota hai: Frontend par "RoleGuard" component hai jo URL check karta hai; agar student /admin URL type kare toh access deny ho jata hai. Backend par "authorize(roles)" middleware hai jo API level par token ka role check karta hai; agar role match na kare toh seedha HTTP 403 Forbidden return hota hai.'
  },
  {
    q: 'Q7. Google Gemini AI kaise integrate kiya hai? Kya API key frontend mein exposed hai?',
    a: 'Ans: AI integration official Google SDK "@google/generative-ai" ke through hua hai aur ye 100% Backend par execute hota hai. API key server ke .env file mein rakhi gayi hai. Frontend code ya browser inspect element mein API key kabhi nahi dikhti, jisse quota misuse ya key leak ka koi risk nahi hai.'
  }
];

qnasPart1.forEach((item) => {
  doc.fillColor(secondaryColor).fontSize(8.8).font('Helvetica-Bold').text(item.q);
  doc.fillColor(textColor).fontSize(8.3).font('Helvetica').text(item.a);
  doc.moveDown(0.3);
});

// ==========================================
// PAGE 4: TOP 15 VIVA QUESTIONS & ANSWERS (PART 2)
// ==========================================
doc.addPage();

const qnasPart2 = [
  {
    q: 'Q8. Agar internet chala jaye ya Gemini API key invalid ho, toh kya website crash ho jayegi?',
    a: 'Ans: Bilkul nahi! Humne backend service mein "Graceful Fallback Mechanism" banaya hai. Agar Gemini API timeout hoti hai ya rate-limit aati hai, toh system crash hone ke bajaye local pre-configured B.Tech academic dataset (DBMS, OS, DSA questions) se instant answer return karta hai aur UI smoothly kaam karti hai.'
  },
  {
    q: 'Q9. Notes Summarizer mein PDF file upload aur text extraction kaise hoti hai?',
    a: 'Ans: Frontend se FormData ke zariye file upload hoti hai. Backend par "Multer" middleware file format (PDF/TXT) aur size (max 10MB) validate karta hai. Uske baad "pdf-parse" library PDF ke data stream se raw text extract karti hai. Phir wo text Gemini AI ko structured prompt ke sath bheja jata hai jo revision summary return karta hai.'
  },
  {
    q: 'Q10. AI Quiz Generator score aur result kaise calculate karta hai?',
    a: 'Ans: Jab student quiz submit karta hai, toh frontend backend API ko { quiz_id, answers: { question_id: "A" } } bhejta hai. Server database se original correct answers verify karta hai, score percentage calculate karta hai, attempt record save karta hai, aur har question ka correct answer aur explanation student ko display karta hai.'
  },
  {
    q: 'Q11. Frontend aur Backend alag-alag ports (5173 aur 5000) par hain, CORS error kaise handle kiya?',
    a: 'Ans: Express backend mein "cors" middleware configure kiya hai jo port 5173 (Vite dev server) ke origins aur methods (GET, POST, PUT, DELETE) ko safely allow karta hai.'
  },
  {
    q: 'Q12. Input validation kaise ki gayi hai? Kya hacker empty ya galat data bhej sakta hai?',
    a: 'Ans: Dual validation hai. Frontend par React form level validation hai jo user ko turant error dikhati hai. Backend par "express-validator" middleware hai jo email format, password length (min 6 chars), required fields aur data types ko sanitize aur validate karta hai.'
  },
  {
    q: 'Q13. Kya public registration se koi Admin ya Mentor ban sakta hai?',
    a: 'Ans: Bilkul nahi! Security rule ke mutabik public registration page (/register) se sirf aur sirf "STUDENT" account ban sakta hai. Admin aur Mentor accounts sirf system ke authorized super-admin ke dwara hi create ya promote kiye ja sakte hain.'
  },
  {
    q: 'Q14. Is project mein security ke kya-kya measures liye gaye hain?',
    a: 'Ans: 1) bcrypt password hashing, 2) JWT token verification on all protected routes, 3) Role-Based Access Control, 4) SQL Injection protection via Sequelize ORM, 5) Express Helmet for HTTP security headers, 6) File upload validation (type & size limits).'
  },
  {
    q: 'Q15. Is project ka Future Scope kya hai? Aage kya add kar sakte hain?',
    a: 'Ans: 1) Real-time voice interview evaluation (microphone input), 2) Live code compiler integration (Judge0) taaki DSA code bhi run ho sake, 3) College LMS (Moodle/Canvas) integration, 4) Mobile App using React Native.'
  }
];

qnasPart2.forEach((item) => {
  doc.fillColor(secondaryColor).fontSize(8.8).font('Helvetica-Bold').text(item.q);
  doc.fillColor(textColor).fontSize(8.3).font('Helvetica').text(item.a);
  doc.moveDown(0.3);
});

doc.moveDown(0.25);
drawDivider();

// SECTION 6: Demo Logins Box
doc.fillColor(primaryColor).fontSize(11.5).font('Helvetica-Bold').text('6. Viva Demonstration Ke Liye Ready Logins');
doc.moveDown(0.15);

doc.fillColor(textColor).fontSize(8.8).font('Helvetica').text(
  'Login page (/login) par examiner ke samne 1-Click buttons diye hain:\n' +
  '• Student Login: student@skillmate.ai  |  Password: Student@123\n' +
  '• Mentor Login:  mentor@skillmate.ai   |  Password: Mentor@123\n' +
  '• Admin Login:   admin@skillmate.ai    |  Password: Admin@123'
);

// ==========================================
// PAGE 5: FRIEND KE LAPTOP PAR RUN KARNE KA COMPLETE GUIDE
// ==========================================
doc.addPage();

doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('7. Dost Ke Laptop Par Project Transfer & Run Kaise Karein?');
doc.moveDown(0.2);
doc.fillColor(mutedColor).fontSize(8.5).font('Helvetica').text('Aapki dost ke laptop par ye 5 simple steps follow karte hi pura project 100% chal jayega:');
doc.moveDown(0.4);

// STEP 1
drawBadge('STEP 1: Project Folder Ko Dost Ke Laptop Par Copy Karein', '#0F172A');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  '1. Apne Desktop se "SkillMate-AI" folder ko Pen Drive ya Google Drive mein copy karein.\n' +
  '2. Dost ke laptop ke Desktop par paste karein (Path banega: C:\\Users\\...\\Desktop\\SkillMate-AI).\n' +
  'Note: Saari files, images aur dependencies folder ke andar pehle se set hain.'
);
doc.moveDown(0.4);

// STEP 2
drawBadge('STEP 2: Dost Ke Laptop Par 2 Softwares Check/Install Karein', '#4F46E5');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  'Dost ke laptop par bas ye 2 basic cheezein honi chahiye:\n' +
  '• 1. Node.js (v18 ya higher): nodejs.org se download karke simple next-next install kar lein.\n' +
  '• 2. MySQL Server (ya XAMPP): College ke laptops par MySQL Server 8.0 ya XAMPP installed hota hai.'
);
doc.moveDown(0.4);

// STEP 3
drawBadge('STEP 3: Database Create Karein & Password Check Karein (2 Minutes)', '#059669');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  '1. Dost ke MySQL Command Line ya MySQL Workbench mein login karein aur bas ye 1 query chalayein:\n' +
  '      CREATE DATABASE skillmate_ai;\n' +
  '2. "SkillMate-AI/backend/.env" file Notepad mein kholein aur apna MySQL password check karein:\n' +
  '      DB_PASSWORD=1234  (Agar dost ka password "root" ya kuch aur hai, toh yahan apna password likhein).'
);
doc.moveDown(0.4);

// STEP 4
drawBadge('STEP 4: Database Setup & Demo Accounts Sync (1-Click)', '#D97706');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  'Humne dost ke liye 1-Click setup batch file bana di hai:\n' +
  '• SkillMate-AI folder ke andar "setup_database.bat" par double-click karein.\n' +
  '  (Ye automatically saari 15 tables sync kar dega aur Student, Mentor, Admin demo accounts bana dega).'
);
doc.moveDown(0.4);

// STEP 5
drawBadge('STEP 5: Project Start Karein (1-Click Launcher!)', '#4F46E5');
doc.fillColor(textColor).fontSize(8.5).font('Helvetica').text(
  '• SkillMate-AI folder ke andar "start_project.bat" par double-click karein!\n' +
  '• Ye ek click mein Backend (Port 5000) aur Frontend (Port 5173) dono start karega aur browser mein seedha website khol dega!\n\n' +
  'Manual Terminal Option (Agar batch file na chalani ho):\n' +
  '  Terminal 1: cd SkillMate-AI/backend  ->  npm start\n' +
  '  Terminal 2: cd SkillMate-AI/frontend ->  npm run dev'
);
doc.moveDown(0.4);

// STEP 6: Troubleshooting Box
doc.rect(38, doc.y, 519, 45).fill('#FEF2F2');
doc.fillColor('#DC2626').fontSize(8.5).font('Helvetica-Bold').text('⚠️ Common Troubleshooting (Agar Dost Ko Koi Error Aaye):', 44, doc.y - 38);
doc.fillColor('#7F1D1D').fontSize(7.8).font('Helvetica').text(
  '• Error: "Access denied for user root@localhost" -> backend/.env mein DB_PASSWORD dost ke MySQL password se match karein.\n' +
  '• Error: "Port 5000 already in use" -> Task manager mein node.exe band karein ya laptop restart karein.\n' +
  '• Error: "Cannot find module" -> backend ya frontend folder mein jakar "npm install" run karein.',
  44, doc.y - 24
);

// End document
doc.end();

writeStream.on('finish', () => {
  console.log('VIVA_AND_SETUP_GUIDE_PDF_GENERATED_SUCCESSFULLY');
});
