const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = 'C:\\Users\\acer\\Desktop\\SkillMate_AI_Project_Guide.pdf';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper for horizontal rule
const drawDivider = () => {
  doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.6);
};

// --- HEADER / TITLE ---
doc.rect(45, 35, 505, 75).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('SKILLMATE AI', 55, 48, { align: 'center' });
doc.fillColor('#818CF8').fontSize(12).font('Helvetica').text('Your Personal AI Learning & Career Assistant', 55, 75, { align: 'center' });
doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text('College Major/Minor Project - Complete Guide & Viva Preparation', 55, 92, { align: 'center' });

doc.y = 125;

// --- SECTION 1 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('1. Yeh Project Asal Mein Kya Hai? (In Simple Words)');
doc.moveDown(0.3);
doc.fillColor('#1E293B').fontSize(10).font('Helvetica').text(
  'SkillMate AI college students ke liye ek All-in-One AI Study & Career Platform hai. ' +
  'Yeh student ka 24/7 Personal AI Tutor bhi hai, Smart Exam Planner bhi, Automatic Quiz Tester bhi, ' +
  'aur campus placements ke liye Mock Interviewer & Career Counselor bhi hai.'
);
doc.moveDown(0.3);
doc.text(
  'Isme 3 Alag-Alag Role-Based Dashboards hain:\n' +
  '• Student Dashboard: Padhai, AI quiz, notes summarize karna, roadmap aur mock interview.\n' +
  '• Mentor Dashboard: Professors ke liye students ko track karna, study resources aur feedback dena.\n' +
  '• Admin Dashboard: College management ke liye user access aur audit reports export karna.'
);
doc.moveDown(0.5);
drawDivider();

// --- SECTION 2 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('2. Problem vs Solution (Kyun Banaya Gaya?)');
doc.moveDown(0.3);

const problems = [
  ['Problem 1: Exam pass aa rahe hain, samajh nahi aata kab kya padhein.', 'Solution: Smart Study Planner exam date ke hisab se day-wise timetable banata hai.'],
  ['Problem 2: Padhai toh kar li par marks aayenge ya nahi pata nahi.', 'Solution: AI Quiz Maker turant 4 options wale MCQs banata hai aur scoring explain karta hai.'],
  ['Problem 3: 100-page ki lambi PDF/PPT notes padhne ka time nahi hai.', 'Solution: Notes Summarizer PDF upload karte hi main points aur exam checklist de deta hai.'],
  ['Problem 4: Placement technical interview ka darr lagta hai.', 'Solution: Interview Prep role ke mutabik sawal puchta hai, score (0-100) aur model answer deta hai.'],
  ['Problem 5: Teachers ko students ki progress ka pata nahi chalta.', 'Solution: Mentor Dashboard par faculty live student progress aur quiz analytics dekh sakte hain.']
];

problems.forEach(([p, s]) => {
  doc.fillColor('#DC2626').fontSize(9).font('Helvetica-Bold').text('• ' + p);
  doc.fillColor('#059669').fontSize(9).font('Helvetica').text('   ' + s);
  doc.moveDown(0.2);
});
doc.moveDown(0.5);
drawDivider();

// --- SECTION 3 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('3. Complete Technology Stack (Viva Points)');
doc.moveDown(0.3);
doc.fillColor('#1E293B').fontSize(9.5).font('Helvetica').text(
  '• Frontend (UI): React.js (Vite) + CSS3 Variables + Recharts (SVG Charts) + Lucide Icons.\n' +
  '• Backend (APIs): Node.js + Express.js REST APIs with express-validator for robust schema checks.\n' +
  '• Database (Storage): MySQL 8.0 with Sequelize ORM across 15 relational tables with Foreign Keys.\n' +
  '• Security & Auth: JWT (JSON Web Tokens) for sessions + bcryptjs (10 salt rounds) for password hashing.\n' +
  '• AI Engine: Official Google Gemini AI SDK (@google/generative-ai) integrated securely on backend.'
);
doc.moveDown(0.6);

// --- NEW PAGE ---
doc.addPage();

// --- SECTION 4 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('4. Teeno Portals Ke Features Detail Mein');
doc.moveDown(0.4);

doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('A. Student Dashboard (Alex Johnson)');
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '1. Overview: Active study streak (e.g. 4 Days), total learning hours, weekly activity graph.\n' +
  '2. AI Learning Assistant: ChatGPT jaisa live AI tutor. Chat history MySQL mein persist rehti hai.\n' +
  '3. Smart Study Planner: Subject aur target date dalo, AI daily task milestones banata hai.\n' +
  '4. AI Quiz Generator: Topic aur difficulty ke hisab se MCQs. Instant score calculation aur explanations.\n' +
  '5. Notes Summarizer: PDF ya TXT notes upload karo (upto 10MB). AI summary aur revision checklist deta hai.\n' +
  '6. Career Guidance: Interests aur skills dalo, AI recommended tech roles, salary ranges aur roadmap deta hai.\n' +
  '7. Interview Prep: Role-wise technical questions, student answer input, AI score (0-100) aur model answer.\n' +
  '8. My Progress: Subject-wise mastery bar chart aur monthly activity volume progression graph.\n' +
  '9. Profile Settings: Degree, college details update aur password change with strength checks.'
);
doc.moveDown(0.5);

doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('B. Mentor Dashboard (Prof. Marcus Brody)');
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '1. My Students: Assigned students ki list, unka study plan completion % aur average quiz scores.\n' +
  '2. Learning Resources: Faculty mentor study material aur reference links publish/edit kar sakta hai.\n' +
  '3. Student Feedback: Kisi bhi student ko select karke personal guidance aur recommendations bhejna.'
);
doc.moveDown(0.5);

doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('C. Admin Dashboard (Dr. Evelyn Vance)');
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '1. Platform Overview: Total students, active mentors, quizzes attempted aur user growth area charts.\n' +
  '2. User Management: Search users, toggle active/deactive status, role change (STUDENT, MENTOR, ADMIN).\n' +
  '3. Mentor Management: Naye faculty mentors ko onboard karna aur unhe students ke saath assign karna.\n' +
  '4. Audit Reports: Platform report 1-click mein CSV ya JSON format mein export/download karna.'
);
doc.moveDown(0.5);
drawDivider();

// --- SECTION 5 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('5. Pre-Configured Demo Test Accounts');
doc.moveDown(0.3);
doc.fillColor('#1E293B').fontSize(9.5).font('Helvetica').text(
  'College viva demonstration ke liye login page (/login) par 1-Click Demo Buttons hain:\n' +
  '• Student Account: student@skillmate.ai  |  Password: Student@123\n' +
  '• Mentor Account:  mentor@skillmate.ai   |  Password: Mentor@123\n' +
  '• Admin Account:   admin@skillmate.ai    |  Password: Admin@123'
);
doc.moveDown(0.6);

// --- NEW PAGE ---
doc.addPage();

// --- SECTION 6 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('6. Viva Ke Top 5 Questions & Best Answers');
doc.moveDown(0.4);

const qnas = [
  {
    q: 'Q1: Database kahan hai aur kya use kiya hai?',
    a: 'Ans: Humne local MySQL 8.0 database use kiya hai jiska naam skillmate_ai hai. Node.js backend mein Sequelize ORM use kiya hai jo SQL injection se bachata hai aur 15 relational tables mein Foreign Keys, Primary Keys aur Cascades handle karta hai.'
  },
  {
    q: 'Q2: Passwords secure kaise hain?',
    a: 'Ans: Passwords database mein kabhi plain text mein nahi jaate. Humne bcryptjs use kiya hai jo 10 salt rounds ke saath password ko irreversible cryptographic hash mein convert karta hai.'
  },
  {
    q: 'Q3: Authentication kaise ho rahi hai?',
    a: 'Ans: Stateless JWT (JSON Web Tokens) se. Login par server digitally signed token return karta hai jisme user ID aur Role encapsulated hota hai. Frontend par Axios interceptor har protected API request ke sath Authorization: Bearer <token> bhejta hai.'
  },
  {
    q: 'Q4: Kya Student user Admin ke pages ya APIs access kar sakta hai?',
    a: 'Ans: Bilkul nahi. Frontend par RoleGuard component unauthorized pages block karta hai, aur Backend par authorize("ADMIN") middleware har request ko verify karta hai. Student ke call karne par 403 Forbidden return hota hai.'
  },
  {
    q: 'Q5: Google Gemini AI kaise integrate hua hai?',
    a: 'Ans: Gemini API calls 100% Backend se execute hoti hain using @google/generative-ai SDK. API key server ke .env mein secure rehti hai. Agar internet ya key na ho, toh system crash nahi hota, smart fallback mode mein answer karta hai.'
  }
];

qnas.forEach((item) => {
  doc.fillColor('#0F172A').fontSize(9.5).font('Helvetica-Bold').text(item.q);
  doc.fillColor('#334155').fontSize(9).font('Helvetica').text(item.a);
  doc.moveDown(0.4);
});

doc.moveDown(0.4);
drawDivider();

// --- SECTION 7 ---
doc.fillColor('#4F46E5').fontSize(14).font('Helvetica-Bold').text('7. Project Run Karne Ka Tarika (Step-by-Step)');
doc.moveDown(0.3);
doc.fillColor('#1E293B').fontSize(9.5).font('Helvetica').text(
  '1. Backend Terminal:\n' +
  '   cd C:\\Users\\acer\\Desktop\\SkillMate-AI\\backend\n' +
  '   npm start\n' +
  '   (Runs on http://localhost:5000)\n\n' +
  '2. Frontend Terminal (Dusre Window mein):\n' +
  '   cd C:\\Users\\acer\\Desktop\\SkillMate-AI\\frontend\n' +
  '   npm run dev\n' +
  '   (Runs on http://localhost:5173)\n\n' +
  '3. Browser mein open karein: http://localhost:5173'
);

doc.moveDown(1);
doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text(
  'SkillMate AI — Project Documentation & Viva Defense Guide. Created on Desktop for easy sharing.',
  { align: 'center' }
);

// End document
doc.end();

writeStream.on('finish', () => {
  console.log('PDF_GENERATED_SUCCESSFULLY');
});
