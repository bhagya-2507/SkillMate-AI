import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  Brain,
  Send,
  Plus,
  Trash2,
  Sparkles,
  Bot,
  User,
  MessageSquare,
  Clock,
  Code2,
  RefreshCw
} from 'lucide-react';

const Chat = () => {
  const toast = useToast();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Load chats on mount
  const fetchChats = async () => {
    try {
      const res = await api.get('/ai/chats');
      if (res.success) {
        setChats(res.chats);
        if (res.chats.length > 0 && !activeChatId) {
          loadChat(res.chats[0].id);
        }
      }
    } catch (err) {
      console.warn('Chats fetch error:', err.message);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const loadChat = async (id) => {
    setActiveChatId(id);
    try {
      const res = await api.get(`/ai/chats/${id}`);
      if (res.success && res.chat) {
        setMessages(res.chat.messages || []);
      }
    } catch (err) {
      toast.error('Failed to load conversation messages.');
    }
  };

  const handleStartNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInputMessage('');
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const currentText = inputMessage.trim();
    setInputMessage('');

    // Optimistic UI for user message
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      message: currentText,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', {
        chatId: activeChatId,
        message: currentText
      });

      if (res.success) {
        if (!activeChatId && res.chatId) {
          setActiveChatId(res.chatId);
          fetchChats();
        }
        // Replace or append confirmed messages
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          res.userMessage,
          res.aiMessage
        ]);
      }
    } catch (err) {
      toast.error(err.message || 'Error communicating with AI Assistant.');
      // Remove failed optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
    }
  };

  const confirmDeleteChat = (chat, e) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setDeleteModalOpen(true);
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      const res = await api.delete(`/ai/chats/${chatToDelete.id}`);
      if (res.success) {
        toast.success('Chat deleted successfully.');
        setDeleteModalOpen(false);
        const updated = chats.filter((c) => c.id !== chatToDelete.id);
        setChats(updated);
        if (activeChatId === chatToDelete.id) {
          if (updated.length > 0) {
            loadChat(updated[0].id);
          } else {
            handleStartNewChat();
          }
        }
      }
    } catch (err) {
      toast.error(err.message || 'Unable to delete chat.');
    }
  };

  const quickPrompts = [
    "Explain ACID properties with bank transfer example (DBMS)",
    "Process vs Thread with real-life analogy (OS)",
    "4 Pillars of OOPs explained simply with code (Java/C++)",
    "TCP vs UDP: Difference and phone call analogy (Networks)",
    "Stack vs Queue with real life examples (DSA)"
  ];

  return (
    <div style={{ height: 'calc(100vh - 128px)', display: 'flex', gap: '20px' }}>
      {/* Sidebar: Past Conversations */}
      <div
        className="card"
        style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          backgroundColor: '#FFFFFF',
          shrink: 0
        }}
      >
        <button
          onClick={handleStartNewChat}
          className="btn btn-gradient"
          style={{ width: '100%', marginBottom: '14px', padding: '10px 14px' }}
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', padding: '0 4px' }}>
          Saved Conversations
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {loadingChats ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <div className="spinner spinner-dark" />
            </div>
          ) : chats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 8px', color: '#94A3B8', fontSize: '0.85rem' }}>
              No conversations yet. Start asking questions!
            </div>
          ) : (
            chats.map((c) => {
              const isActive = c.id === activeChatId;
              return (
                <div
                  key={c.id}
                  onClick={() => loadChat(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <MessageSquare size={14} color={isActive ? 'var(--primary)' : '#94A3B8'} />
                    <span
                      style={{
                        fontSize: '0.825rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--primary)' : '#334155',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {c.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => confirmDeleteChat(c, e)}
                    style={{ color: '#94A3B8', padding: '2px', display: 'flex' }}
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Conversation Area */}
      <div
        className="card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            height: '60px',
            padding: '0 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Brain size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                SkillMate AI Learning Assistant
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>Mentor Online & Ready</span>
              </div>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => {
                if (activeChatId) {
                  setChatToDelete(chats.find(c => c.id === activeChatId) || { id: activeChatId, title: 'Current Session' });
                  setDeleteModalOpen(true);
                } else {
                  setMessages([]);
                }
              }}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444' }}
            >
              <Trash2 size={14} />
              <span>Clear Chat</span>
            </button>
          )}
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '580px', padding: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'var(--gradient-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginBottom: '16px',
                  boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
                }}
              >
                <Sparkles size={28} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                How can I assist your study session today?
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
                Ask me to explain complicated concepts, debug programming code, break down algorithms, or outline study priorities.
              </p>

              {/* Starter Prompt Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputMessage(qp);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      color: '#334155',
                      fontWeight: 500,
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EEF2FF';
                      e.currentTarget.style.borderColor = '#C7D2FE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                  >
                    💡 {qp}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id || idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  {!isUser && (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        shrink: 0
                      }}
                    >
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isUser ? 'var(--primary)' : '#F8FAFC',
                      color: isUser ? '#FFFFFF' : '#0F172A',
                      border: isUser ? 'none' : '1px solid #E2E8F0',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div className="markdown-content" style={{ color: isUser ? '#FFFFFF' : '#0F172A' }}>
                      <pre
                        style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          fontFamily: isUser ? 'inherit' : 'inherit',
                          margin: 0,
                          backgroundColor: 'transparent',
                          color: 'inherit',
                          padding: 0
                        }}
                      >
                        {m.message}
                      </pre>
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        marginTop: '6px',
                        color: isUser ? 'rgba(255,255,255,0.7)' : '#94A3B8',
                        textAlign: isUser ? 'right' : 'left'
                      }}
                    >
                      {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {isUser && (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        shrink: 0
                      }}
                    >
                      <User size={18} />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* AI Thinking Spinner */}
          {sending && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  shrink: 0
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '16px 16px 16px 4px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#64748B',
                  fontSize: '0.85rem'
                }}
              >
                <div className="spinner spinner-dark" style={{ width: '16px', height: '16px' }} />
                <span>SkillMate AI is generating explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about computer science, engineering, or career prep..."
              className="form-input"
              style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '12px' }}
              disabled={sending}
            />
            <button
              type="submit"
              className={`btn btn-gradient ${sending || !inputMessage.trim() ? 'btn-disabled' : ''}`}
              style={{ padding: '0 20px', borderRadius: '12px' }}
              disabled={sending || !inputMessage.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteChat}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action will permanently remove it from your account."
        confirmText="Delete Chat"
        isDanger={true}
      />
    </div>
  );
};

export default Chat;
