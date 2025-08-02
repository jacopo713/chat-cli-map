'use client';

import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  FolderOpen, 
  Settings, 
  User, 
  Sun, 
  Moon,
  Map
} from 'lucide-react';
import { ChatHistory, Project } from '@/types/chat';

interface SidebarProps {
  isOpen: boolean;
  isDarkTheme: boolean;
  chatHistory: ChatHistory[];
  activeChat: number;
  currentView: 'chat' | 'mindmap';
  onCreateNewChat: () => void;
  onSelectChat: (chatId: number) => void;
  onToggleTheme: () => void;
  onMapsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isDarkTheme,
  chatHistory,
  activeChat,
  currentView,
  onCreateNewChat,
  onSelectChat,
  onToggleTheme,
  onMapsClick
}) => {
  const projects: Project[] = [
    { id: 1, name: 'Chatbot Clone', type: 'chatbot' },
    { id: 2, name: 'App React', type: 'react' },
    { id: 3, name: 'Design Sistema', type: 'design' }
  ];

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Oggi';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ieri';
    } else {
      return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className={`${isOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden ${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
      <div className="flex flex-col h-full">
        {/* Header con pulsante nuova chat */}
        <div className={`p-4 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onCreateNewChat}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Plus size={20} />
            <span>Nuova chat</span>
          </button>
        </div>

        {/* Contenuto scrollabile */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Sezione Mappe */}
          <div className="mb-6">
            <div className={`flex items-center gap-2 mb-3 ${
              currentView === 'mindmap' 
                ? (isDarkTheme ? 'text-blue-400' : 'text-blue-600') 
                : (isDarkTheme ? 'text-gray-400' : 'text-gray-600')
            }`}>
              <Map size={18} />
              <span className="font-medium">Mappe</span>
            </div>
            <div className="space-y-2 ml-6">
              <div 
                onClick={onMapsClick}
                className={`text-sm cursor-pointer p-2 rounded transition-colors ${
                  currentView === 'mindmap' 
                    ? (isDarkTheme ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900') 
                    : (isDarkTheme ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100')
                }`}
              >
                Mappa Mentale
              </div>
            </div>
          </div>

          {/* Sezione Progetti */}
          <div className="mb-6">
            <div className={`flex items-center gap-2 mb-3 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              <FolderOpen size={18} />
              <span className="font-medium">Progetti</span>
            </div>
            <div className="space-y-2 ml-6">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className={`text-sm cursor-pointer p-2 rounded transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  {project.name}
                </div>
              ))}
            </div>
          </div>

          {/* Sezione Chat */}
          <div>
            <div className={`flex items-center gap-2 mb-3 ${
              currentView === 'chat' 
                ? (isDarkTheme ? 'text-blue-400' : 'text-blue-600') 
                : (isDarkTheme ? 'text-gray-400' : 'text-gray-600')
            }`}>
              <MessageSquare size={18} />
              <span className="font-medium">Chat</span>
            </div>
            <div className="space-y-1 ml-6">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat === chat.id 
                      ? (isDarkTheme ? 'bg-gray-600' : 'bg-blue-100') 
                      : (isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                  }`}
                >
                  <div className={`text-sm font-medium truncate ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {chat.title}
                  </div>
                  <div className={`text-xs truncate mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    {chat.lastMessage}
                  </div>
                  <div className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatDate(chat.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con tema e account */}
        <div className={`p-4 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Toggle tema */}
          <div className="mb-3 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Sun size={18} className={!isDarkTheme ? 'text-yellow-500' : 'text-gray-400'} />
              <button 
                onClick={onToggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  !isDarkTheme ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                title={isDarkTheme ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !isDarkTheme ? 'translate-x-1' : 'translate-x-6'
                  }`}
                />
              </button>
              <Moon size={18} className={isDarkTheme ? 'text-blue-400' : 'text-gray-400'} />
            </div>
          </div>
          
          {/* Account */}
          <div className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <div className="flex items-center gap-3">
              <User size={20} />
              <span className="text-sm">Il mio Account</span>
            </div>
            <button className={`p-1 rounded transition-colors ${isDarkTheme ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
