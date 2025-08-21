// src/components/Chatbot.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertContext';
import { analyzeMessage, generateContextualResponse } from '../utils/nlp';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const { addChatbotAlert } = useAlerts();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I'm your Crescent Companion. You can talk to me about anything on your mind. Your safety and well-being are my top priorities. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Analyze the message using your NLP utility
    const analysis = analyzeMessage(userMessage.text);

    // If risk is medium or high, create an alert for admins
    if (analysis.riskLevel === 'medium' || analysis.riskLevel === 'high') {
      addChatbotAlert({
        studentId: user.id,
        studentName: user.name,
        conversation: userMessage.text,
        detectedKeywords: analysis.detectedKeywords,
        riskLevel: analysis.riskLevel,
        timestamp: new Date(),
        status: 'new',
      });
    }

    // Generate a response from the bot
    const botResponseText = generateContextualResponse(analysis, userMessage.text);
    
    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: Message = { sender: 'bot', text: botResponseText };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="bg-blue-600 text-white rounded-full p-2 flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            )}
            <div
              className={`max-w-md p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-gray-200 text-gray-800 rounded-br-none'
                  : 'bg-blue-50 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
             {msg.sender === 'user' && (
              <div className="bg-gray-700 text-white rounded-full p-2 flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
             <div className="bg-blue-600 text-white rounded-full p-2 flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            <div className="bg-blue-50 text-gray-900 p-3 rounded-lg rounded-bl-none">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-6">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full border border-gray-300 rounded-lg py-3 pl-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;