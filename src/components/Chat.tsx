'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Menu } from 'lucide-react';
import { Message } from '@/types/chat';
import { parseMarkdown } from '@/utils/markdownParser';

interface ChatProps {
  messages: Message[];
  isLoading: boolean;
  isDarkTheme: boolean;
  sidebarOpen: boolean;
  onSendMessage: (message: string) => void;
  onToggleSidebar: () => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  isLoading,
  isDarkTheme,
  sidebarOpen,
  onSendMessage,
  onToggleSidebar
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeepThink = () => {
    console.log("DeepThink attivato!");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">ChatBot Assistant</h1>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Claude AI</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {message.sender === 'user' ? (
                  <>
                    <div className="inline-block p-4 rounded-2xl bg-blue-600 text-white">
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <div className={`text-xs mt-2 px-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`py-2 ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>
                      <div className="prose prose-sm max-w-none [&>*]:m-0 [&>*:not(:last-child)]:mb-4">
                        {parseMarkdown(message.text, isDarkTheme)}
                      </div>
                    </div>
                    <div className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl">
                <div className={`py-4 ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkTheme ? 'bg-gray-400' : 'bg-gray-500'}`}></div>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkTheme ? 'bg-gray-400' : 'bg-gray-500'}`} style={{animationDelay: '0.2s'}}></div>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkTheme ? 'bg-gray-400' : 'bg-gray-500'}`} style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Sto scrivendo...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-end gap-3 rounded-2xl p-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi un messaggio..."
              className={`flex-1 bg-transparent resize-none outline-none max-h-32 min-h-[24px] ${
                isDarkTheme 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              }`}
              rows={1}
              style={{
                height: 'auto',
                overflowY: inputValue.split('\n').length > 3 ? 'scroll' : 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={handleDeepThink}
              className={`p-2 rounded-xl transition-colors ${
                isDarkTheme 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
              title="Attiva DeepThink"
            >
              <Brain size={20} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-xl transition-colors ${
                inputValue.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : (isDarkTheme ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500') + ' cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <div className={`text-xs text-center mt-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Premi Invio per inviare, Shift+Invio per andare a capo
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
