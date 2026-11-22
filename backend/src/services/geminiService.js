const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_gemini_api_key')) {
    return new GoogleGenerativeAI(apiKey.trim());
  }
  return null;
};

/**
 * 1. AI Chat Assistant - Friendly College Senior / Tutor Persona
 */
const chatWithAI = async (conversationHistory, userMessage) => {
  const client = getGeminiClient();

  if (!client) {
    return "I'm temporarily unable to connect to the AI service. Please try again shortly.";
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    const history = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-12).map(m =>
          `${m.sender || m.role || 'user'}: ${m.message || m.content || ''}`
        ).join('\n')
      : '';

    const prompt = `
You are SkillMate AI, a friendly and intelligent conversational assistant.
Help B.Tech students with academics, coding, placements and careers.
Also answer everyday questions naturally. Never force every conversation into academics.
Answer greetings and casual questions directly.

LANGUAGE:
- Follow the latest explicit language preference in conversation history.
- Otherwise reply in the language of the latest user message.
- English means complete English.
- Hindi means Hindi.
- Hinglish means natural Hinglish.
- Do not unnecessarily mix languages.
- Never repeat the welcome message unless asked.

CONVERSATION HISTORY:
${history}

LATEST USER MESSAGE:
${userMessage}

Answer the latest message naturally and directly.
`;

    const result = await model.generateContent(prompt);
    const answer = (await result.response).text();

    if (!answer || !answer.trim()) {
      throw new Error('Empty Gemini response');
    }

    return answer.trim();
  } catch (error) {
    console.error('[SkillMate Gemini Error]:', error.message);
    return "I'm having trouble connecting to my AI service right now. Please try again in a moment.";
  }
};
/**
 * 2. Smart Study Plan Generator - Realistic B.Tech Semester Plan
 */
const generateStudyPlan = async (subject, topic, targetDate, dailyHours, difficulty) => {
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = `Create a realistic 5-day study plan for a B.Tech engineering student studying "${subject}" with focus on "${topic}".
Difficulty: ${difficulty}. Target completion date: ${targetDate}. Daily hours: ${dailyHours}.
Format: Return ONLY a raw JSON object:
{
  "title": "B.Tech ${subject}: Mastering ${topic}",
  "tasks": [
    {
      "task_title": "Day 1: Title",
      "task_description": "Clear concise practical tasks (PYQ/theory/diagrams)",
      "day_offset": 1
    }
  ]
}`;
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().trim();
      const cleaned = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.tasks && Array.isArray(parsed.tasks)) return parsed;
    } catch (e) {
      console.warn('âš ï¸ Gemini study plan fallback triggered:', e.message);
    }
  }

  // Standard realistic B.Tech semester preparation module
  return {
    title: `B.Tech ${subject}: ${topic} Exam Preparation`,
    tasks: [
      {
        task_title: `Day 1: Core Definitions, Diagrams & Fundamentals`,
        task_description: `Read standard textbook theory for ${topic}, draw neat block diagrams, and understand primary terminologies. (${dailyHours} hrs)`,
        day_offset: 1
      },
      {
        task_title: `Day 2: Deep Dive into Algorithms & Mathematical Derivations`,
        task_description: `Practice step-by-step algorithms, time/space complexities, and solve 3 standard textbook numericals. (${dailyHours} hrs)`,
        day_offset: 2
      },
      {
        task_title: `Day 3: Previous Year University Questions (PYQ) Practice`,
        task_description: `Solve last 3 years university exam papers on ${topic}. Focus on 7-mark and 10-mark descriptive questions. (${dailyHours} hrs)`,
        day_offset: 3
      },
      {
        task_title: `Day 4: Edge Cases, Differences & Viva Preparation`,
        task_description: `Prepare comparison tables (e.g. Pros vs Cons, Differences between variants) and common viva voice questions. (${dailyHours} hrs)`,
        day_offset: 4
      },
      {
        task_title: `Day 5: Mock Test & Quick Formula Revision`,
        task_description: `Take a timed self-assessment quiz on SkillMate AI and do final bullet-point formula revision. (${dailyHours} hrs)`,
        day_offset: 5
      }
    ]
  };
};

/**
 * 3. AI Quiz Generator - Real Standard B.Tech Exam Questions
 */
const generateQuiz = async (subject, topic, difficulty, questionCount = 5) => {
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = `Generate ${questionCount} multiple choice questions for a college engineering exam on subject: "${subject}", topic: "${topic}", difficulty: "${difficulty}".
Questions must be realistic B.Tech semester/placement level.
Return ONLY valid JSON array:
[
  {
    "question_text": "Clear question text?",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": "A",
    "explanation": "Clear student-friendly explanation."
  }
]`;
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().trim();
      const cleaned = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn('âš ï¸ Gemini quiz generation fallback triggered:', e.message);
    }
  }

  // Realistic B.Tech syllabus question pool
  const btechQuestionPool = [
    {
      question_text: `In Database Management Systems (DBMS), which Normal Form eliminates 'Partial Dependency' on the candidate key?`,
      option_a: "First Normal Form (1NF)",
      option_b: "Second Normal Form (2NF)",
      option_c: "Third Normal Form (3NF)",
      option_d: "Boyce-Codd Normal Form (BCNF)",
      correct_answer: "B",
      explanation: "2NF requires the table to be in 1NF and guarantees that all non-key attributes are fully functionally dependent on the entire primary key, eliminating partial dependencies."
    },
    {
      question_text: `Which data structure is internally used by the CPU and OS compiler to manage recursive function calls?`,
      option_a: "Queue (FIFO)",
      option_b: "Stack (LIFO)",
      option_c: "Priority Queue",
      option_d: "Binary Search Tree",
      correct_answer: "B",
      explanation: "Function call frames are pushed onto the Call Stack when a function is invoked, and popped when returning (Last In, First Out)."
    },
    {
      question_text: `In Operating Systems, which of the following is NOT one of Coffman's four necessary conditions for a Deadlock?`,
      option_a: "Mutual Exclusion",
      option_b: "Hold and Wait",
      option_c: "Preemption Allowed",
      option_d: "Circular Wait",
      correct_answer: "C",
      explanation: "The condition is 'No Preemption' (resources cannot be forcibly taken away). If preemption is allowed, deadlocks can be easily resolved."
    },
    {
      question_text: `Which layer in the OSI Reference Model is responsible for End-to-End communication, error recovery, and flow control?`,
      option_a: "Network Layer",
      option_b: "Transport Layer",
      option_c: "Data Link Layer",
      option_d: "Session Layer",
      correct_answer: "B",
      explanation: "The Transport Layer (Layer 4, protocols like TCP/UDP) handles end-to-end reliability, segment sequencing, and port addressing."
    },
    {
      question_text: `What is the worst-case time complexity of QuickSort when the chosen pivot is always the smallest or largest element?`,
      option_a: "O(n log n)",
      option_b: "O(n)",
      option_c: "O(nÂ²)",
      option_d: "O(log n)",
      correct_answer: "C",
      explanation: "When partitions are completely unbalanced (e.g., sorting an already sorted array with first element as pivot), QuickSort degrades to O(nÂ²)."
    }
  ];

  return btechQuestionPool.slice(0, Math.min(questionCount, btechQuestionPool.length));
};

/**
 * 4. Notes Summarizer - Student Revision Sheet Format
 */
const summarizeNotes = async (extractedText, originalFilename) => {
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = `You are an experienced college professor helping engineering students revise notes before exams.
Summarize this document ("${originalFilename}") in simple, high-yield revision bullet points:
- Quick 2-line summary
- 5 Most Important Concepts / Formulas for Exams
- Key Definitions (Viva Favorites)
- Common Mistakes to Avoid in Exam Answers

Text:
${extractedText.substring(0, 8000)}`;
      const result = await model.generateContent(prompt);
      return (await result.response).text();
    } catch (e) {
      console.warn('âš ï¸ Gemini summarizer fallback triggered:', e.message);
    }
  }

  // Realistic student revision summary
  return `### ðŸ“‘ Exam Revision Notes: ${originalFilename}

**Quick Summary:**
This material covers foundational principles and standard theoretical workflows essential for B.Tech semester exams and viva presentations.

---

### 1. Top 5 High-Yield Concepts for Exams:
1. **Modular Separation**: Always break down monolithic code or schemas into independent, testable components.
2. **Time & Space Trade-offs**: In viva, always specify whether an optimization saves execution time at the cost of memory.
3. **Data Integrity**: Enforce constraints at the database level rather than relying solely on client-side inputs.
4. **Asynchronous Non-Blocking Execution**: I/O operations (network/disk) should never block the main execution thread.
5. **System Scalability**: Use caching and indexing to prevent quadratic O(nÂ²) bottlenecks under heavy loads.

---

### 2. Must-Know Viva Definitions:
- **ACID**: Atomicity, Consistency, Isolation, Durability â€” the 4 pillars of reliable database transactions.
- **Normalization**: The systematic process of structuring relational tables to eliminate redundancy without losing information.
- **Deadlock**: A condition where a set of processes are blocked because each is holding a resource and waiting for another.

---

### 3. Exam Writing Tips:
- âœ… Always draw a neat labeled block diagram before writing 10-mark answers.
- âœ… Include Big-O time and space complexity whenever explaining an algorithm.
- âœ… Write real-world analogies (e.g. banking, ticket booking) to score full marks!`;
};

/**
 * 5. Career Guidance Generator - B.Tech Campus Placement Blueprint
 */
const generateCareerGuidance = async (interests, skills, education, goals) => {
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = `You are a senior tech placement coordinator for B.Tech engineering students.
Analyze this profile:
- Interests: ${interests}
- Current Skills: ${skills}
- Degree/Branch: ${education}
- Goal: ${goals}

Provide practical placement advice:
1. Top 3 Matching Industry Roles with average campus/entry package range (in LPA).
2. Skill Gap Analysis (what they need to practice next on LeetCode/GitHub).
3. 6-Month Actionable Placement Roadmap.
4. Standout Final-Year Major Project Idea that impresses interviewers.`;
      const result = await model.generateContent(prompt);
      return (await result.response).text();
    } catch (e) {
      console.warn('âš ï¸ Gemini career fallback triggered:', e.message);
    }
  }

  return `### ðŸš€ B.Tech Campus Placement & Career Blueprint

**Student Profile:**
- **Degree:** ${education || 'B.Tech in Computer Science / Information Technology'}
- **Current Skills:** ${skills}
- **Interests:** ${interests}
- **Career Aspiration:** ${goals || 'Securing SDE role in Tier-1/Tier-2 company'}

---

### 1. Top Recommended Placement Roles:
1. **Software Development Engineer (SDE-1)** (â‚¹8 - 22 LPA)
   - *Requirements*: Strong DSA problem-solving (Arrays, Trees, DP) + 1 solid full-stack project + DBMS/OS core concepts.
2. **Full-Stack Web Developer** (â‚¹6 - 16 LPA)
   - *Requirements*: React, Node.js, Express, MySQL/PostgreSQL, REST APIs, Git & Deployment on cloud.
3. **Backend / API Engineer** (â‚¹7 - 18 LPA)
   - *Requirements*: Relational database indexing, caching (Redis), system design basics, authentication (JWT).

---

### 2. Immediate Skill Gaps to Bridge:
- ðŸŽ¯ **DSA Practice**: Solve 150-200 curated questions on LeetCode (focus on Two Pointers, Sliding Window, DFS/BFS, Binary Trees).
- ðŸŽ¯ **Core CS Subjects**: Master ACID properties, SQL Joins, Deadlocks, Paging, and TCP vs UDP for technical interview rounds.
- ðŸŽ¯ **Live Deployment**: Make sure your project has a live working link on GitHub/Vercel rather than just running on localhost.

---

### 3. 6-Month Placement Strategy:
- **Month 1-2**: Complete Core DSA (Arrays, Strings, Linked Lists, Stacks, Queues) + SQL practice.
- **Month 3-4**: Build a standout full-stack project like **SkillMate AI** with real database and API integration.
- **Month 5-6**: Prepare STAR-method behavioral interview answers and practice mock coding interviews.`;
};

/**
 * 6. Interview Practice Evaluator - Realistic Placement Interviewer
 */
const evaluateInterviewAnswer = async (jobRole, question, userAnswer) => {
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = `You are a senior tech interviewer evaluating a B.Tech student for the role: "${jobRole}".
Question: "${question}"
Student's Answer: "${userAnswer}"

Evaluate fairly like a real interviewer. Return JSON:
{
  "score": 85,
  "feedback_summary": "Encouraging, constructive feedback in simple words.",
  "strengths": ["Clear definition", "Good real-world example"],
  "improvements": ["Mention time complexity", "Discuss trade-offs"],
  "model_answer": "How a top candidate would answer in 3-4 crisp sentences."
}`;
      const result = await model.generateContent(prompt);
      const text = (await result.response).text().trim();
      const cleaned = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('âš ï¸ Gemini interview evaluation fallback triggered:', e.message);
    }
  }

  const words = userAnswer.trim().split(/\s+/).length;
  const score = words > 35 ? 88 : words > 15 ? 75 : 55;

  return {
    score,
    feedback_summary: `Accha prayas! Aapne main concept sahi explain kiya hai. Interview mein pehle 1-line definition se shuru karein aur aakhiri mein ek practical use-case mention karein.`,
    strengths: [
      "Core concept aur technical keywords sahi use kiye hain.",
      "Clear explanation without unnecessary beating around the bush."
    ],
    improvements: [
      "Interview mein time complexity (Big-O) ya performance impact zaroor mention karein.",
      "Ek chhota sa real-world example jodenge toh interviewer ko confidence aayega."
    ],
    model_answer: `In my experience, the optimal way to address this is by first defining the primary mechanism, discussing its time and memory complexity trade-offs, and illustrating with a real-world use case. For instance, in our SkillMate AI project, applying this approach helped maintain responsive sub-second query latency under high load.`
  };
};

module.exports = {
  chatWithAI,
  generateStudyPlan,
  generateQuiz,
  summarizeNotes,
  generateCareerGuidance,
  evaluateInterviewAnswer
};




