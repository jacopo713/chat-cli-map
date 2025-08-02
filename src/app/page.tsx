'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { Message, ChatHistory } from '@/types/chat';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Ciao! Sono Claude, il tuo assistente AI. Come posso aiutarti oggi?", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 2, 
      text: `Ecco un esempio di come posso aiutarti con il **codice**:

\`\`\`html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>La mia prima pagina</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 50px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Benvenuto nella mia pagina!</h1>
  <p>Questa è una semplice pagina HTML con un pulsante.</p>
  <button onclick="alert('Hai cliccato il pulsante!')">Cliccami</button>
</body>
</html>
\`\`\`

Posso anche spiegare **concetti**, rispondere a domande e aiutarti con:
- Programmazione e sviluppo
- Analisi e problem solving  
- Scrittura e creatività
- *E molto altro ancora!*

Cosa posso fare per te oggi?`, 
      sender: 'bot', 
      timestamp: new Date(Date.now() - 5000) 
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'mindmap'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { 
      id: 1, 
      title: "Conversazione con Claude", 
      lastMessage: "Ciao! Sono Claude, il tuo assistente AI...", 
      timestamp: new Date() 
    },
    { 
      id: 2, 
      title: "Aiuto con React", 
      lastMessage: "Come posso aiutarti con React?", 
      timestamp: new Date(Date.now() - 86400000) 
    },
    { 
      id: 3, 
      title: "Consigli di programmazione", 
      lastMessage: "Ecco alcuni suggerimenti...", 
      timestamp: new Date(Date.now() - 172800000) 
    }
  ]);
  const [activeChat, setActiveChat] = useState(1);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepara la cronologia della conversazione per l'API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      conversationHistory.push({
        role: 'user',
        content: messageText
      });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const claudeResponse = data.content[0].text;

      const botMessage: Message = {
        id: messages.length + 2,
        text: claudeResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Errore chiamata API Claude:", error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Mi dispiace, ho riscontrato un problema nel collegarmi al servizio. Tuttavia posso aiutarti con qualsiasi domanda tu abbia! Prova a riformulare la tua richiesta o riprova tra poco.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    const newChat: ChatHistory = {
      id: chatHistory.length + 1,
      title: "Nuova conversazione",
      lastMessage: "Ciao! Sono Claude, il tuo assistente AI...",
      timestamp: new Date()
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setCurrentView('chat');
    setMessages([
      { 
        id: 1, 
        text: "Ciao! Sono Claude, il tuo assistente AI. Come posso aiutarti oggi?", 
        sender: 'bot', 
        timestamp: new Date() 
      }
    ]);
  };

  const selectChat = (chatId: number) => {
    setActiveChat(chatId);
    setCurrentView('chat');
    setMessages([
      { 
        id: 1, 
        text: "Ciao! Sono Claude, il tuo assistente AI. Come posso aiutarti oggi?", 
        sender: 'bot', 
        timestamp: new Date() 
      }
    ]);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleMapsClick = () => {
    setCurrentView('mindmap');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Sidebar
        isOpen={sidebarOpen}
        isDarkTheme={isDarkTheme}
        chatHistory={chatHistory}
        activeChat={activeChat}
        currentView={currentView}
        onCreateNewChat={createNewChat}
        onSelectChat={selectChat}
        onToggleTheme={toggleTheme}
        onMapsClick={handleMapsClick}
      />
      
      {currentView === 'chat' ? (
        <Chat
          messages={messages}
          isLoading={isLoading}
          isDarkTheme={isDarkTheme}
          sidebarOpen={sidebarOpen}
          onSendMessage={handleSendMessage}
          onToggleSidebar={toggleSidebar}
        />
      ) : (
        <div className={`flex-1 flex items-center justify-center ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className={`p-8 rounded-lg ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
            <h2 className="text-2xl font-bold mb-4">Mappa Mentale</h2>
            <p className="text-gray-500">Funzionalità in arrivo...</p>
            <button 
              onClick={() => setCurrentView('chat')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Torna alla Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
