import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "안녕하세요! 🍓 논산딸기축제 AI 도우미 '베리'입니다. 무엇을 도와드릴까요?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 새 메시지 오면 스크롤 내리기
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. 내 메시지 추가
    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      // 2. 백엔드로 전송
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      
      // 3. 봇 응답 추가
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "서버 연결에 실패했어요. 😢 백엔드가 켜져있는지 확인해주세요.", isBot: true }]);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* 챗봇 열기 버튼 (로봇 아이콘) */}
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
          <img src="/bot_icon.png" alt="챗봇" className="chatbot-btn-img" />
        </button>
      )}

      {/* 채팅창 화면 */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <img src="/bot_icon.png" alt="" style={{width:'28px', height:'28px'}} />
              <span>AI 안내원 베리</span>
            </div>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="질문을 입력하세요..."
            />
            <button type="submit">전송</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;