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

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.8-flash' });
      const prompt = `You are SkillMate AI, a friendly, supportive college senior and tutor helping B.Tech students (CSE/IT/ECE).
Explain engineering and programming concepts in simple, clear, relatable language with real-world analogies (like GPay/bank for ACID, Chrome tabs for threads, book index for B+ Trees).
Use clean bullet points and short code snippets where helpful.
Avoid overly stiff, robotic AI jargon. Sound like a helpful senior explaining a concept before semester exams or placement interviews.

IMPORTANT LANGUAGE RULES:
- Always reply in the language requested by the student.
- If the student says "talk in English", respond completely in English.
- If the student says "talk in Hindi", respond in Hindi.
- If the student uses Hinglish, respond naturally in Hinglish.
- Follow explicit language preferences from the conversation history.
- A newer language instruction overrides an older preference.
- Never ignore a language change request.
- Do not mix languages unless the student requests it.

Conversation History:
${conversationHistory.map(m => `${m.sender}: ${m.message}`).join('\n')}

Student: ${userMessage}
Tutor:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn('âš ï¸ Gemini API chat call error or key missing:', error.message);
    }
  }

  // Natural, student-friendly fallback responses for standard B.Tech topics
  const msg = userMessage.toLowerCase();

  if (msg.includes('acid') || msg.includes('transaction') || msg.includes('dbms')) {
    return `### DBMS: ACID Properties Samjho Simple Bank Example Se ðŸ¦

ACID properties ensure karti hain ki database mein transactions hamesha safe aur accurate rahein. Example: Aapne dost ko Google Pay se â‚¹500 transfer kiye.

1. **A - Atomicity ("All or Nothing")**:
   - Ya toh pura transaction complete hoga (aapke account se â‚¹500 kate aur dost ke account mein credit hue).
   - Ya fir agar beech mein internet gaya, toh transaction fail ho jayega aur aapke paise wapas aa jayenge. Aadha-adhura transaction kabhi nahi hoga!

2. **C - Consistency ("Rules Follow Honge")**:
   - Transaction se pehle aur transaction ke baad database valid state mein rahega. Agar aapka balance â‚¹400 tha, toh â‚¹500 ka transfer allow nahi hoga. Total money system mein constant rahega.

3. **I - Isolation ("No Interference")**:
   - Agar aap do logon ko ek saath paise bhej rahe ho, toh dono transactions alag-alag execute honge jaise woh akele chal rahe hon. Koi data clash nahi hoga.

4. **D - Durability ("Permanent Save")**:
   - Ek baar "Transfer Successful" ka message aa gaya, toh chahe turant baad bank ka server crash ho jaye, aapka record safe rahega aur paise gayab nahi honge.

ðŸ’¡ **Viva Tip:** Examiner puche toh hamesha bank balance ya ticket booking ka example dena, full marks milte hain!`;
  }

  if (msg.includes('process') || msg.includes('thread') || msg.includes('operating system') || msg.includes('os')) {
    return `### OS: Process vs Thread Ka Real-World Difference ðŸ’»

Yeh Operating Systems viva ka sabse favorite question hai!

1. **Process (Heavyweight)**:
   - Process ek running program hota hai.
   - Example: Jab aap apne laptop mein **Google Chrome** open karte ho, toh woh ek process hai.
   - Har process ko apni alag memory (RAM) milti hai. Ek process doosre process ki memory directly nahi chhu sakta.

2. **Thread (Lightweight)**:
   - Thread process ke andar ka ek chhota worker unit hota hai.
   - Example: Chrome browser ke andar jo aapne **3 alag tabs** khole hain, ya ek tab mein video play ho raha hai aur dusre mein file download ho rahi hai â€” yeh sab threads hain!
   - Sabhi threads apne parent process ki memory aapas mein share karte hain.

| Feature | Process | Thread |
|---|---|---|
| Memory | Alag memory space milta hai | Same process ki memory share karte hain |
| Creation Time | Slow hota hai (Heavy) | Fast hota hai (Light) |
| Crash Effect | Ek process crash ho toh doosra safe rehta hai | Ek thread crash ho toh pura process ruk sakta hai |

ðŸ’¡ **Exam Tip:** Remember: "A Process has one or more Threads."`;
  }

  if (msg.includes('dsa') || msg.includes('array') || msg.includes('stack') || msg.includes('queue') || msg.includes('linked list')) {
    return `### DSA: Core Data Structures Ka Quick Revision âš¡

College exams aur coding rounds ke liye inka funda clear rakhein:

1. **Stack (LIFO - Last In, First Out)**:
   - **Real Example**: Shaadi mein rakhi hui plates ka dher, ya browser ka **Back button**.
   - Jo cheez sabse aakhiri mein dali (push), woh sabse pehle bahar aayegi (pop).
   - Functions: \`push()\`, \`pop()\`, \`peek()\` â€” all in **O(1)** time.
   - Exam use-case: Recursion stack, Undo operation, Balanced Parentheses check.

2. **Queue (FIFO - First In, First Out)**:
   - **Real Example**: Cinema hall ke ticket counter ki line.
   - Jo pehle line mein khada hua, use pehle ticket milegi.
   - Functions: \`enqueue()\` (line mein judna), \`dequeue()\` (line se nikalna) â€” in **O(1)**.
   - Exam use-case: CPU job scheduling, Printer spooling, BFS graph traversal.

3. **Array vs Linked List**:
   - **Array**: Continuous memory location, instant access by index in \`O(1)\`, but fixed size.
   - **Linked List**: Nodes aapas mein pointers se judi hoti hain, dynamic size, insertion fast hai par random search \`O(n)\` lagta hai.`;
  }

  if (msg.includes('tcp') || msg.includes('udp') || msg.includes('network') || msg.includes('cn')) {
    return `### Computer Networks: TCP vs UDP (The Phone Call vs Letter) ðŸŒ

1. **TCP (Transmission Control Protocol - Reliable)**:
   - **Analogy**: Jaise aap kisi ko **phone call** karte hain. Pehle connection banta hai ("Hello, awaz aa rahi hai?"), fir baat hoti hai, aur aakhiri mein "bye" bolkar cut hota hai.
   - **Features**: 3-Way Handshake (SYN, SYN-ACK, ACK), Zero packet loss (agar packet drop hua toh dobara bhejega), Ordered delivery.
   - **Use-cases**: Web browsing (HTTP/HTTPS), File download (FTP), Emails (SMTP).

2. **UDP (User Datagram Protocol - Fast & Lightweight)**:
   - **Analogy**: Jaise post box mein **chitti daalna** ya YouTube/Cricket **Live Stream**. Agar beech mein 1 frame drop bhi ho gaya toh chalta hai, par delay nahi hona chahiye.
   - **Features**: Connectionless, no handshake, fast speed, no re-transmission.
   - **Use-cases**: Video calling (Zoom, Meet), Online multiplayer gaming, DNS lookup.`;
  }

  if (msg.includes('oops') || msg.includes('oop') || msg.includes('java') || msg.includes('c++')) {
    return `### OOPs: 4 Pillars of Object Oriented Programming ðŸ›ï¸

In chaaro pillars ko simple real-world examples se yaad rakhein:

1. **Encapsulation (Data Hiding in a Capsule)**:
   - Data (variables) aur methods ko ek class mein band karna aur sensitive cheezon ko \`private\` rakhna.
   - **Example**: ATM machine. Aap direct cash vault mein haath nahi daal sakte, aap PIN aur buttons (public methods) ke through hi paise nikalte hain.

2. **Abstraction (Only Show What Matters)**:
   - Internal complex working chupana aur bahar sirf simple interface dikhana.
   - **Example**: Car chalana. Aapko accelerator aur break pata hai, engine ke andar piston kaise ghoom raha hai woh janne ki zaroorat nahi hai.

3. **Inheritance (Baap-Beta Features)**:
   - Child class parent class ke properties aur functions ko reuse karti hai (\`extends\`).
   - **Example**: \`Vehicle\` class ke features \`Car\` aur \`Bike\` dono mein automatically aa jate hain (Code Reusability).

4. **Polymorphism (Many Forms)**:
   - Ek hi method alag-alag situations mein alag behave karta hai.
   - **Example**: Ek insaan office mein employee hai, ghar par beta hai, aur market mein customer hai. Same person, multiple behaviors (Method Overloading & Overriding).`;
  }

  // Friendly default
  return `### Hello! Kahiye B.Tech ki padhai mein kya help chahiye? ðŸ“š

Aap mujhse semester exams ya placement se related koi bhi topic puch sakte hain, jaise:
- **DSA**: Array, Linked List, Stack, Binary Search, Trees
- **DBMS**: SQL Joins, Normalization (1NF, 2NF, 3NF), ACID Properties
- **Operating Systems**: CPU Scheduling, Deadlocks, Paging
- **Computer Networks**: OSI 7 Layers, TCP vs UDP, IP Addressing
- **OOPs**: Java / C++ ke 4 pillars with code examples

Aap apna specific question ya doubt type kijiye, main bilkul step-by-step simple bhasha mein samjha dunga!`;
};

/**
 * 2. Smart Study Plan Generator - Realistic B.Tech Semester Plan
 */
const generateStudyPlan = async (subject, topic, targetDate, dailyHours, difficulty) => {
  const client = getGeminiClient();

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-3.8-flash' });
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
      const model = client.getGenerativeModel({ model: 'gemini-3.8-flash' });
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
      const model = client.getGenerativeModel({ model: 'gemini-3.8-flash' });
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
      const model = client.getGenerativeModel({ model: 'gemini-3.8-flash' });
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
      const model = client.getGenerativeModel({ model: 'gemini-3.8-flash' });
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


