import React, { useState, useEffect, useRef } from 'react';
import { HiSupport, HiPaperAirplane, HiUser, HiChatAlt2, HiSparkles, HiRefresh } from 'react-icons/hi';
import { generateAIChatResponse } from '../../services/api';
import './shared.css';
import './Support.css';

const Support = ({ messages, setMessages, userContext }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input.trim();
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call Real Groq API with user context
    const response = await generateAIChatResponse(userMessageText, messages, userContext);

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'bot',
      text: response.success ? response.text : response.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsTyping(false);
  };


  return (
    <div className="ud-support-container">
      <div className="ud-support-header">
        <div className="ud-support-title-row">
          <div>
            <h1 className="ud-page-title">InsuAI Assistant</h1>
            <p className="ud-page-subtitle">Your real-time insurance support partner.</p>
          </div>
          <button
            className="ud-clear-chat-btn"
            onClick={() => setMessages([{
              id: Date.now(),
              type: 'bot',
              text: `Chat cleared. How else can I assist you, ${userContext.name || 'there'}?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])}
            title="Clear Conversation"
          >
            <HiRefresh />
          </button>
        </div>
      </div>

      <div className="ud-chat-card">
        <div className="ud-chat-messages" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.type}`}>
              <div className="chat-avatar">
                {msg.type === 'bot' ? <HiSparkles className="icon-bot" /> : <HiUser />}
              </div>
              <div className="chat-bubble">
                <p className="chat-text">{msg.text}</p>
                <span className="chat-time">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-avatar"><HiSparkles className="icon-bot" /></div>
              <div className="chat-bubble typing">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        <form className="ud-chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="ud-chat-input"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="ud-chat-send-btn">
            <HiPaperAirplane />
          </button>
        </form>
        <div className="ud-chat-footer">
          <HiSparkles /> Powered by Llama 3.3 Intelligence
        </div>
      </div>

      <div className="ud-support-info-grid">
        <div className="ud-card ud-support-card miniature">
          <div className="ud-metric-icon blue"><HiSupport /></div>
          <h4>Human Support</h4>
          <p>Email: insurai02@gmail.com<br />Phone: 1-800-INSURE-AI</p>
        </div>
        <div className="ud-card ud-support-card miniature">
          <div className="ud-metric-icon green"><HiChatAlt2 /></div>
          <h4>Live Chat</h4>
          <p>Average wait: &lt; 2 mins<br />Available 24/7</p>
        </div>
      </div>
    </div >
  );
};

export default Support;
