export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatHistory {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export interface Project {
  id: number;
  name: string;
  type: 'chatbot' | 'react' | 'design';
}

export interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}
