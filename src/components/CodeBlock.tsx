'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  isDark: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, isDark }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Errore copia:', err);
    }
  };

  // Funzione di escape HTML pura (senza DOM)
  const escapeHtml = (text: string) => {
    const htmlEscapes: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
  };

  const highlightSyntax = (code: string, language: string) => {
    if (!language) return code;

    let highlighted = code;

    switch (language.toLowerCase()) {
      case 'html':
        highlighted = highlighted
          .replace(/(<!--[\s\S]*?-->)/g, '<span style="color: #6a737d; font-style: italic;">$1</span>')
          .replace(/(&lt;!DOCTYPE[^&]*&gt;)/g, '<span style="color: #d73a49;">$1</span>')
          .replace(/(&lt;\/?)([\w-]+)([^&]*?)(&gt;)/g, (match, open, tagName, attributes, close) => {
            let result = `<span style="color: #6f42c1;">${open}</span><span style="color: #22863a;">${tagName}</span>`;
            
            if (attributes) {
              result += attributes
                .replace(/([\w-]+)(=)/g, '<span style="color: #6f42c1;">$1</span><span style="color: #d73a49;">$2</span>')
                .replace(/(&quot;[^&]*&quot;|&#x27;[^&]*&#x27;)/g, '<span style="color: #032f62;">$1</span>');
            }
            
            result += `<span style="color: #6f42c1;">${close}</span>`;
            return result;
          });
        break;

      case 'css':
        highlighted = highlighted
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a737d; font-style: italic;">$1</span>')
          .replace(/^(\s*)([\w\-#.]+)(\s*{)/gm, '$1<span style="color: #6f42c1;">$2</span>$3')
          .replace(/(\s+)([\w-]+)(\s*:)/g, '$1<span style="color: #005cc5;">$2</span><span style="color: #d73a49;">$3</span>')
          .replace(/(:\s*)([^;}\n]+)(;?)/g, '$1<span style="color: #032f62;">$2</span><span style="color: #d73a49;">$3</span>');
        break;

      case 'javascript':
      case 'js':
      case 'typescript':
      case 'ts':
        highlighted = highlighted
          .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span style="color: #6a737d; font-style: italic;">$1</span>')
          .replace(/\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|default|interface|type|async|await)\b/g, '<span style="color: #d73a49;">$1</span>')
          .replace(/(["`'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span style="color: #032f62;">$1$2$1</span>')
          .replace(/\b(\d+)\b/g, '<span style="color: #005cc5;">$1</span>');
        break;

      case 'json':
        highlighted = highlighted
          .replace(/("[\w\-_]+")(\s*:)/g, '<span style="color: #005cc5;">$1</span>$2')
          .replace(/:\s*(".*?")/g, ': <span style="color: #032f62;">$1</span>')
          .replace(/:\s*(\d+)/g, ': <span style="color: #005cc5;">$1</span>')
          .replace(/:\s*(true|false|null)/g, ': <span style="color: #d73a49;">$1</span>');
        break;

      case 'python':
        highlighted = highlighted
          .replace(/(#.*$)/gm, '<span style="color: #6a737d; font-style: italic;">$1</span>')
          .replace(/\b(def|class|if|else|elif|for|while|return|import|from|try|except|finally|with|as)\b/g, '<span style="color: #d73a49;">$1</span>')
          .replace(/(["`'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span style="color: #032f62;">$1$2$1</span>')
          .replace(/\b(\d+)\b/g, '<span style="color: #005cc5;">$1</span>');
        break;
    }

    return highlighted;
  };

  const escapedCode = escapeHtml(code);
  const highlightedCode = highlightSyntax(escapedCode, language);

  return (
    <div className="relative rounded-lg overflow-hidden my-4 border" style={{ backgroundColor: '#f9f9f9', borderColor: '#e5e5e5' }}>
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 border-b border-gray-300" style={{ backgroundColor: '#f0f0f0' }}>
        <span className="font-mono">{language || 'plaintext'}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-gray-200 text-gray-600"
          title="Copia codice"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span className="text-xs">Copiato!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-xs">Copia</span>
            </>
          )}
        </button>
      </div>
      
      <pre className="overflow-x-auto p-4 text-sm font-mono text-gray-900">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
};

export default CodeBlock;
