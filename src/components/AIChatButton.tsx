'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageSquare, FiX, FiDownload } from 'react-icons/fi';
import { useTheme } from 'next-themes';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatButton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi there! I am Ryan's AI assistant. I can tell you about Ryan's background as an AI Engineer, his work experience, projects, skills, and how to get in touch. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  
  // Track whether this is the first user message
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  
  // Suggested queries that users can click on
  const suggestedQueries = [
    "What are Ryan's skills?",
    "Tell me about Ryan's work experience",
    "What projects has Ryan worked on?",
    "What is Ryan's educational background?",
    "How can I contact Ryan?"
  ];
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('#chat-container') && !target.closest('#chat-toggle')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Update timestamps every 30 seconds to refresh "Just now" texts
  useEffect(() => {
    if (messages.length <= 1) return; // Don't set interval if only welcome message exists
    
    const intervalId = setInterval(() => {
      // Force re-render to update timestamps
      setMessages(prevMessages => [...prevMessages]);
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [messages.length]);
  
  const handleSendMessage = async (e?: React.FormEvent, suggestedQuery?: string) => {
    if (e) e.preventDefault();
    
    const messageToSend = suggestedQuery || inputMessage;
    if (!messageToSend.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // For Gemini 2.0 Flash, we need to make sure we don't send the welcome message
      // and that we have at least one user message in history
      const messageHistory = messages
        .filter((msg, index) => 
          // Skip the initial greeting from assistant
          !(index === 0 && msg.role === 'assistant') &&
          // Include this user message and previous context
          (msg.content === messageToSend || index < messages.length - 1)
        );
        
      // After first message is sent, update state
      if (isFirstMessage) {
        setIsFirstMessage(false);
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend, history: messageHistory }),
      });      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to get response');
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorText = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorText}. Please try again later.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: 1 
        }}
      >
        {/* Enhanced pulse effect */}
        {!isOpen && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isDark ? 'bg-dark-accent' : 'bg-light-accent'
              }`}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isDark ? 'bg-dark-accent' : 'bg-light-accent'
              }`}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </>
        )}
        
        <motion.button
          id="chat-toggle"
          onClick={() => setIsOpen(prev => !prev)}
          className={`relative rounded-full w-16 h-16 flex items-center justify-center ${
            isDark 
              ? 'bg-dark-bg text-dark-accent shadow-dark-neu-button' 
              : 'bg-light-bg text-light-accent shadow-light-neu-button'
          } transition-all duration-300`}
          whileHover={{ 
            scale: 1.05,
            boxShadow: isDark 
              ? '5px 5px 10px #1a1a1a, -5px -5px 10px #262626' 
              : '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff'
          }}
          whileTap={{ 
            scale: 0.98,
            boxShadow: isDark 
              ? 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #262626' 
              : 'inset 5px 5px 10px #d9d9d9, inset -5px -5px 10px #ffffff'
          }}
        >
          {isOpen ? <FiX size={22} /> : <FiMessageSquare size={22} />}
        </motion.button>
      </motion.div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-container"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] rounded-2xl overflow-hidden ${
              isDark 
                ? 'bg-dark-bg shadow-dark-neu-card border border-dark-accent/30' 
                : 'bg-light-bg shadow-light-neu-card border border-light-accent/30'
            }`}
          >
            {/* Chat header */}
            <div className={`p-4 mb-2 mx-4 mt-4 rounded-xl ${
              isDark 
                ? 'bg-black shadow-dark-neu-inset border-t border-dark-shadow-light/10' 
                : 'bg-black shadow-light-neu-inset border-t border-gray-700/30'
            }`}>
              <h3 className="font-heading font-medium text-center text-white">
                Chat with Ryan&apos;s AI Assistant
              </h3>
              <div className="flex items-center justify-center mt-1">
                <motion.div 
                  className="flex items-center"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                </motion.div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="px-4 pb-2 h-[350px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-4 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? isDark 
                        ? 'bg-dark-shadow-light/20 shadow-dark-neu-button ml-2 border border-dark-accent/20' 
                        : 'bg-light-shadow-dark/10 shadow-light-neu-button ml-2 border border-light-accent/20'
                      : isDark 
                        ? 'bg-dark-bg shadow-dark-neu-inset border border-dark-accent/10 mr-2' 
                        : 'bg-light-bg shadow-light-neu-inset border border-light-accent/10 mr-2'
                  }`}>
                    {msg.role === 'assistant' && msg.content.includes('[DOWNLOAD_CV]') ? (
                      <>
                        <p className="text-sm">{msg.content.replace('[DOWNLOAD_CV]', '')}</p>
                        <div className="mt-3">
                          <a 
                            href="/Ryan Radityatama - Software Engineer.pdf" 
                            download
                            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm ${
                              isDark 
                                ? 'bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent' 
                                : 'bg-light-accent/20 hover:bg-light-accent/30 text-light-accent'
                            } transition-colors`}
                          >
                            <FiDownload size={16} />
                            Download CV
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-dark-text/60' : 'text-light-text/60'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              ))}
              
              {/* Suggested queries - only show after assistant's first message and no other messages */}
              {messages.length === 1 && messages[0].role === 'assistant' && (
                <div className="mt-4 mb-2">
                  <p className="text-xs mb-2 opacity-70">You can ask me about:</p>
                  <div className="flex flex-col gap-2">
                    {suggestedQueries.map((query, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSendMessage(undefined, query)}
                        className={`text-xs py-2 px-4 rounded-lg text-left ${
                          isDark 
                            ? 'bg-dark-bg shadow-dark-neu-button border border-dark-accent/20' 
                            : 'bg-light-bg shadow-light-neu-button border border-light-accent/20'
                        }`}
                        whileHover={{ 
                          scale: 1.02, 
                          x: 2,
                          boxShadow: isDark 
                            ? '3px 3px 6px #1a1a1a, -3px -3px 6px #262626' 
                            : '3px 3px 6px #d9d9d9, -3px -3px 6px #ffffff'
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          boxShadow: isDark 
                            ? 'inset 3px 3px 6px #1a1a1a, inset -3px -3px 6px #262626' 
                            : 'inset 3px 3px 6px #d9d9d9, inset -3px -3px 6px #ffffff'
                        }}
                      >
                        {query}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className={`flex space-x-2 mb-4 p-3 rounded-lg mr-auto max-w-[60%] ${
                  isDark 
                    ? 'bg-dark-bg shadow-dark-neu-inset border border-dark-accent/10' 
                    : 'bg-light-bg shadow-light-neu-inset border border-light-accent/10'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-dark-accent' : 'bg-light-accent'}`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-dark-accent' : 'bg-light-accent'}`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-dark-accent' : 'bg-light-accent'}`} style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="px-4 pb-4 pt-2">
              <div className={`flex p-1 rounded-xl ${
                isDark 
                  ? 'bg-dark-shadow-light/5 shadow-dark-neu-card border border-dark-accent/20' 
                  : 'bg-light-shadow-dark/5 shadow-light-neu-card border border-light-accent/20'
              }`}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 py-2 px-4 rounded-lg focus:outline-none ${
                    isDark 
                      ? 'bg-dark-shadow-light/10 text-dark-text shadow-dark-neu-inset' 
                      : 'bg-light-shadow-dark/5 text-light-text shadow-light-neu-inset'
                  }`}
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className={`ml-2 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isDark 
                      ? 'bg-dark-bg text-dark-accent shadow-dark-neu-button' 
                      : 'bg-light-bg text-light-accent shadow-light-neu-button'
                  } ${(isLoading || !inputMessage.trim()) ? 'opacity-50' : ''}`}
                  whileTap={{ 
                    scale: 0.95,
                    boxShadow: isDark 
                      ? 'inset 3px 3px 6px #1a1a1a, inset -3px -3px 6px #262626' 
                      : 'inset 3px 3px 6px #d9d9d9, inset -3px -3px 6px #ffffff'
                  }}
                >
                  <FiSend size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
