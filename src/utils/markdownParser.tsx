import React from 'react';
import CodeBlock from '@/components/CodeBlock';

export const parseMarkdown = (text: string, isDark: boolean): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      parts.push(
        <span key={`text-${currentIndex}`} dangerouslySetInnerHTML={{
          __html: beforeText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
            .replace(/\n/g, '<br/>')
        }} />
      );
    }

    const language = match[1] || '';
    const code = match[2].trim();
    parts.push(
      <CodeBlock key={`code-${match.index}`} code={code} language={language} isDark={isDark} />
    );

    currentIndex = match.index + match[0].length;
  }

  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    parts.push(
      <span key={`text-${currentIndex}`} dangerouslySetInnerHTML={{
        __html: remainingText
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
          .replace(/- (.*?)(?=\n|$)/g, '<div class="flex items-start gap-2 my-1"><span class="text-gray-600">•</span><span>$1</span></div>')
          .replace(/\n/g, '<br/>')
      }} />
    );
  }

  return parts.length > 0 ? parts : [<span key="text-0">{text}</span>];
};
