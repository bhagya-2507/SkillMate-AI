const pdfParse = require('pdf-parse');
const { Chat, ChatMessage, Note, CareerRecommendation, InterviewPractice } = require('../models');
const geminiService = require('../services/geminiService');

// 1. Get all chat sessions for user
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user_id: req.user.id })
      .sort({ updated_at: -1 })
      .select('title created_at updated_at');

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// 2. Get specific chat session with its messages
const getChatById = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findOne({ _id: chatId, user_id: req.user.id });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found.' });
    }

    const messages = await ChatMessage.find({ chat_id: chat._id })
      .sort({ created_at: 1 })
      .select('sender message created_at');

    const chatObj = chat.toJSON();
    chatObj.messages = messages;

    return res.status(200).json({ success: true, chat: chatObj });
  } catch (error) {
    next(error);
  }
};

// 3. Send message in chat
const sendChatMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    let chat;

    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user_id: req.user.id });
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat session not found.' });
      }
    } else {
      // Generate a title from the first message
      const titleSnippet = message.length > 40 ? `${message.substring(0, 40)}...` : message;
      chat = await Chat.create({
        user_id: req.user.id,
        title: titleSnippet
      });
    }

    // Save user message
    const userMsgRecord = await ChatMessage.create({
      chat_id: chat._id,
      sender: 'user',
      message
    });

    // Fetch conversation history for context
    const history = await ChatMessage.find({ chat_id: chat._id })
      .sort({ created_at: 1 })
      .limit(10);

    // Call Mentor AI Engine
    const aiReply = await geminiService.chatWithAI(history, message);

    // Save assistant reply
    const aiMsgRecord = await ChatMessage.create({
      chat_id: chat._id,
      sender: 'assistant',
      message: aiReply
    });

    // Touch chat updated_at
    chat.updated_at = new Date();
    await chat.save();

    return res.status(200).json({
      success: true,
      chatId: chat._id,
      userMessage: userMsgRecord,
      aiMessage: aiMsgRecord
    });
  } catch (error) {
    next(error);
  }
};

// 4. Delete chat session
const deleteChat = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findOne({ _id: chatId, user_id: req.user.id });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found.' });
    }

    await ChatMessage.deleteMany({ chat_id: chat._id });
    await Chat.findByIdAndDelete(chat._id);

    return res.status(200).json({ success: true, message: 'Chat history cleared successfully.' });
  } catch (error) {
    next(error);
  }
};

// 5. Notes Summarizer
const summarizeNotes = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a PDF or TXT document.'
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    let extractedText = '';

    if (
      mimetype === 'application/pdf' ||
      originalname.toLowerCase().endsWith('.pdf')
    ) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || '';
    } else {
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim() || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded file does not contain sufficient readable text for analysis.'
      });
    }

    const truncatedText = extractedText.substring(0, 12000);

    const generatedSummary = await geminiService.summarizeNotes(
      truncatedText,
      originalname
    );

    // Gemini service currently returns a string, normalize it safely.
    const summaryData = typeof generatedSummary === 'string'
      ? {
          title: `Summary: ${originalname}`,
          summary: generatedSummary.trim(),
          key_points: []
        }
      : {
          title: generatedSummary?.title || `Summary: ${originalname}`,
          summary: typeof generatedSummary?.summary === 'string'
            ? generatedSummary.summary.trim()
            : '',
          key_points: generatedSummary?.key_points || []
        };

    if (!summaryData.summary) {
      return res.status(502).json({
        success: false,
        message: 'AI could not generate a summary. Please try again.'
      });
    }

    const noteRecord = await Note.create({
      user_id: req.user.id,
      title: summaryData.title,
      original_filename: originalname,
      file_type: mimetype.includes('pdf') ? 'pdf' : 'txt',
      file_size: size,
      summary: summaryData.summary,
      key_points: summaryData.key_points
    });

    return res.status(201).json({
      success: true,
      message: 'Lecture notes parsed and summarized successfully.',
      note: noteRecord
    });
  } catch (error) {
    console.error('[Notes Summarizer Error]:', error.message);
    next(error);
  }
};
// 6. Get Notes Summaries History
const getNotesHistory = async (req, res, next) => {
  try {
    const notes = await Note.find({ user_id: req.user.id }).sort({ created_at: -1 });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    next(error);
  }
};

// 7. Career Guidance Generator
const generateCareerGuidance = async (req, res, next) => {
  try {
    const { interests, skills, education, goals } = req.body;

    const recommendation = await geminiService.generateCareerGuidance(
      interests,
      skills,
      education || req.user.education,
      goals
    );

    const record = await CareerRecommendation.create({
      user_id: req.user.id,
      interests,
      skills,
      education: education || req.user.education || '',
      goals: goals || '',
      recommendation
    });

    return res.status(201).json({
      success: true,
      message: 'Personalized career roadmap generated.',
      recommendation: record
    });
  } catch (error) {
    next(error);
  }
};

// 8. Get Career Recommendations History
const getCareerHistory = async (req, res, next) => {
  try {
    const history = await CareerRecommendation.find({ user_id: req.user.id }).sort({ created_at: -1 });
    return res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

// 9. Generate Interview Questions
const getInterviewQuestions = async (req, res, next) => {
  try {
    const { jobRole } = req.query;
    const role = jobRole || 'Software Engineer (SDE-1)';

    const questionsByRole = {
      'Software Engineer (SDE-1)': [
        "How do you detect a cycle in a Singly Linked List using Floyd's Tortoise and Hare algorithm?",
        "Explain the difference between BFS and DFS traversals in graphs, and their time complexities.",
        "Explain ACID properties in DBMS with a real-world banking transaction example.",
        "What is the difference between a Process and a Thread in Operating Systems?"
      ],
      'Java Developer': [
        "Explain the 4 pillars of OOPs (Encapsulation, Abstraction, Inheritance, Polymorphism) in Java.",
        "What is the difference between == and .equals() method in Java?",
        "Explain Java Garbage Collection and difference between Heap and Stack memory.",
        "What is the difference between HashMap and ConcurrentHashMap?"
      ],
      'Full-Stack Developer': [
        "Explain how the Event Loop works in Node.js and how it handles asynchronous non-blocking I/O.",
        "What are the key trade-offs between Client-Side Rendering (CSR) and Server-Side Rendering (SSR)?",
        "How do you design a secure JWT authentication flow and mitigate XSS and CSRF attacks?",
        "Explain database normalization up to 3NF and when you might choose to denormalize in a high-traffic app."
      ],
      'Frontend Engineer': [
        "Explain React's Virtual DOM reconciliation algorithm and how React keys optimize re-renders.",
        "What is the difference between useState and useEffect hooks, and how do you prevent infinite loops?",
        "Compare CSS Flexbox vs CSS Grid and provide scenarios where each is best suited.",
        "How do you optimize page loading performance and Core Web Vitals in React?"
      ],
      'Backend Engineer': [
        "How does connection pooling in databases improve API throughput and latency?",
        "Explain ACID properties in database transactions and how they guarantee data integrity.",
        "What strategies do you use for API rate limiting and DDoS protection?",
        "Explain how indexing with B-Trees works and why indexing every column can degrade write performance."
      ]
    };

    const questions = questionsByRole[role] || questionsByRole['Software Engineer (SDE-1)'];

    return res.status(200).json({
      success: true,
      jobRole: role,
      questions
    });
  } catch (error) {
    next(error);
  }
};

// 10. Evaluate Interview Answer
const evaluateInterviewPractice = async (req, res, next) => {
  try {
    const { job_role, question, user_answer } = req.body;

    const evaluation = await geminiService.evaluateInterviewAnswer(job_role, question, user_answer);

    const record = await InterviewPractice.create({
      user_id: req.user.id,
      job_role,
      question,
      user_answer,
      feedback: JSON.stringify(evaluation),
      score: evaluation.score || 80,
      sample_answer: evaluation.model_answer || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Interview answer evaluated successfully.',
      evaluation,
      recordId: record._id
    });
  } catch (error) {
    next(error);
  }
};

// 11. Get Interview History
const getInterviewHistory = async (req, res, next) => {
  try {
    const history = await InterviewPractice.find({ user_id: req.user.id }).sort({ created_at: -1 });

    const parsed = history.map(item => {
      let feedbackObj = {};
      try {
        feedbackObj = typeof item.feedback === 'string' ? JSON.parse(item.feedback) : (item.feedback || {});
      } catch (e) {
        feedbackObj = { feedback_summary: item.feedback };
      }
      return {
        id: item._id,
        job_role: item.job_role,
        question: item.question,
        user_answer: item.user_answer,
        score: item.score,
        feedback: feedbackObj,
        created_at: item.created_at
      };
    });

    return res.status(200).json({ success: true, history: parsed });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
  getChatById,
  sendChatMessage,
  deleteChat,
  summarizeNotes,
  getNotesHistory,
  generateCareerGuidance,
  getCareerHistory,
  getInterviewQuestions,
  evaluateInterviewPractice,
  getInterviewHistory
};


