import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Cpu, 
  User, 
  X, 
  Mic, 
  MicOff, 
  ArrowUp, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Zap, 
  Play, 
  AlertTriangle, 
  LifeBuoy, 
  RefreshCw 
} from 'lucide-react';
import CONFIG from '../../services/config';
import { sendMessageStream, getOfflineReply } from '../../services/chatbotService';

export const Chatbot = ({ isOpen: propIsOpen, onOpen, onClose }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : localOpen;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "hi im sakra(ai) likith's assistant, you can ask me anything about my boss ill letchu know",
      card: 'none'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Voice Speech Recognition States
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [infoIsError, setInfoIsError] = useState(false);

  const chatAreaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat area to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initialize Speech Recognition on mount if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setInfoMessage("Microphone active");
        setInfoIsError(false);
      };

      rec.onend = () => {
        setIsListening(false);
        setInfoMessage('');
      };

      rec.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
        setInfoIsError(true);
        if (event.error === 'not-allowed') {
          setInfoMessage("Permission denied. Enable mic to use voice input.");
        } else {
          setInfoMessage(`Voice error: ${event.error}`);
        }
        setTimeout(() => {
          setInfoMessage('');
          setInfoIsError(false);
        }, 4000);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setInfoMessage("Speech recognized. Press send to transmit.");
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleOpenPanel = () => {
    setLocalOpen(true);
    if (onOpen) onOpen();
  };

  const handleClosePanel = () => {
    setLocalOpen(false);
    if (onClose) onClose();
  };

  const toggleVoiceInput = (e) => {
    e.preventDefault();
    if (!recognitionRef.current) {
      // Speech recognition not supported fallback
      setInfoIsError(true);
      setInfoMessage("Voice input is not supported in this browser. Please type.");
      setTimeout(() => {
        setInfoMessage('');
        setInfoIsError(false);
      }, 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = selectedLang;
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
  };

  const handleLangToggle = (lang) => {
    setSelectedLang(lang);
    if (lang === 'te-IN') {
      setInfoMessage("Language: Telugu (India)");
    } else {
      setInfoMessage("Language: English (India)");
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    setInput('');
    setInfoMessage('');
    
    // Add user message
    const userMsg = { role: 'user', content: text, card: 'none' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Prepare history payload
    const historyPayload = chatHistory.map(h => ({ role: h.role, content: h.content }));

    // Append a streaming placeholder message for AI response
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true, card: 'none' }]);

    let accumulatedText = '';

    try {
      await sendMessageStream(
        text,
        historyPayload,
        // onChunk callback
        (chunk) => {
          accumulatedText += chunk;
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              // progressive clean for display
              lastMsg.content = accumulatedText.replace(/\[\[CARD:.*?\]\]/g, '').trim();
            }
            return updated;
          });
        },
        // onError callback (fallback to local offline response)
        (error) => {
          console.warn('Chat Stream error, activating offline fallback:', error);
          handleOfflineFallback(text);
        },
        // onDone callback
        () => {
          setIsTyping(false);
          // Parse card tags from final text
          const cardMatch = accumulatedText.match(/\[\[CARD:(.*?)\]\]/);
          const cardType = cardMatch ? cardMatch[1] : 'none';
          const cleanText = accumulatedText.replace(/\[\[CARD:.*?\]\]/g, '').trim();

          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              lastMsg.content = cleanText;
              lastMsg.card = cardType;
              lastMsg.isStreaming = false;
            }
            return updated;
          });

          // Save to state history
          setChatHistory(prev => [
            ...prev,
            { role: 'user', content: text },
            { role: 'assistant', content: cleanText }
          ]);
        }
      );
    } catch (err) {
      console.error(err);
      handleOfflineFallback(text);
    }
  };

  const handleOfflineFallback = (text) => {
    setIsTyping(false);
    const offlineReply = getOfflineReply(text);

    if (offlineReply) {
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.content = offlineReply.reply;
          lastMsg.card = offlineReply.card;
          lastMsg.isStreaming = false;
        }
        return updated;
      });

      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: offlineReply.reply }
      ]);
    } else {
      // Default offline error
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.content = "I encountered a technical glitch. The connection to my neural backend was interrupted.";
          lastMsg.card = 'error';
          lastMsg.isStreaming = false;
        }
        return updated;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Helper to render special components under response bubbles
  const renderCard = (cardType) => {
    switch (cardType) {
      case 'contact':
      case 'social':
      case 'collab':
        return (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/5 text-left">
            <a 
              href={`mailto:${CONFIG.CONTACT.PRIMARY_EMAIL}`} 
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] text-slate-300">Email Likith</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 group-hover:translate-x-1 transition-transform">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
            <a 
              href={`tel:${CONFIG.CONTACT.PHONE}`} 
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] text-slate-300">Call Likith</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 group-hover:translate-x-1 transition-transform">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
            
            <div className="grid grid-cols-4 gap-2">
              <a href={CONFIG.CONTACT.GITHUB} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white">
                <Github className="w-4 h-4" />
              </a>
              <a href={CONFIG.CONTACT.LINKEDIN} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-blue-400">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={CONFIG.CONTACT.X} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={CONFIG.CONTACT.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-pink-400">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            
            <Link 
              to="/collab?source=agent" 
              onClick={handleClosePanel}
              className="w-full btn-premium py-2 text-[10px] flex items-center justify-center gap-2"
            >
              <span>Open Collab Portal</span>
              <Zap className="w-3 h-3" />
            </Link>
          </div>
        );
      case 'git':
        return (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/5 text-left">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Explore Likith's curated showcase of 22+ public repositories and AI systems.
            </p>
            <Link 
              to="/git-profile?source=agent" 
              onClick={handleClosePanel}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[10px] text-slate-300 font-semibold"
            >
              <span>Open Engineering Archive</span>
              <Github className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      case 'youtube':
        return (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/5 text-left">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Watch Likith's project deep dives and cinematic piano performances.
            </p>
            <Link 
              to="/youtube?source=agent" 
              onClick={handleClosePanel}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[10px] text-slate-300 font-semibold"
            >
              <span>Open Media Hub</span>
              <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </Link>
          </div>
        );
      case 'error':
        return (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/5 text-left">
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2 animate-pulse" />
              <p className="text-[10px] text-slate-400 leading-relaxed">The connection to my neural backend was interrupted.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to="/problem?result=error&type=chatbot&source=agent" 
                onClick={handleClosePanel}
                className="w-full py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[10px] text-slate-300 font-semibold"
              >
                <LifeBuoy className="w-3 h-3" /> Support
              </Link>
              <button 
                type="button" 
                onClick={() => handleSendMessage(messages[messages.length - 2]?.content)} 
                className="w-full py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[10px] text-slate-300 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
            <Link 
              to="/collab?source=agent" 
              onClick={handleClosePanel}
              className="w-full btn-premium py-2 text-[10px] flex items-center justify-center gap-2 mt-2"
            >
              <span>Contact Likith</span>
              <Mail className="w-3 h-3" />
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* AI AGENT LAUNCHER ORB */}
      <div 
        id="ai-agent-launcher" 
        onClick={handleOpenPanel}
        className={`fixed bottom-8 right-8 z-[100] group cursor-pointer transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
        }`}
      >
        {/* Glow halos */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 rounded-full blur-xl opacity-30 group-hover:opacity-80 transition duration-500 animate-pulse" />
        
        {/* Orb container */}
        <div className="relative w-16 h-16 rounded-full bg-slate-950/65 backdrop-blur-xl border border-amber-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0.5 rounded-full border border-dashed border-amber-500/20 animate-spin-slow" />
          <Bot className="w-7 h-7 text-amber-400 relative z-10 transition-transform group-hover:rotate-12 duration-300" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse z-20" />
        </div>
      </div>

      {/* AI CHAT PANEL */}
      <div 
        id="ai-agent-panel" 
        className={`fixed bottom-28 right-8 w-96 h-[min(600px,calc(100vh-10rem))] z-[100] glass-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 max-w-[calc(100vw-2rem)] shadow-[0_0_50px_rgba(251,191,36,0.15)] ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        data-lenis-prevent="true"
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02] backdrop-blur-md relative text-left">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          
          <div className="flex items-center gap-3">
            {/* AI Spinner Orb */}
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-500 animate-spin-slow rounded-full opacity-80 blur-[2px]" />
              <div className="absolute w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center z-10 border border-white/10">
                <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute w-10 h-10 rounded-full border border-amber-500/30 animate-ping opacity-25" />
            </div>

            <div>
              <h3 className="font-bold text-white text-sm tracking-wider font-display flex items-center gap-1.5 uppercase leading-none">
                SAKRA-AI
              </h3>
              <p className="text-[10px] text-slate-400 font-light tracking-wide leading-none mt-1">Likith Naidu's AI Assistant</p>
              
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">System Online</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleClosePanel} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5" 
            aria-label="Close Chatbot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div ref={chatAreaRef} id="ai-chat-area" className="flex-grow min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.05),_transparent_70%)] pointer-events-none" />
          
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={index}
                className={`flex gap-3 max-w-[85%] animate-fade-in text-left ${
                  isUser ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-blue-600/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                    : 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                }`}>
                  {isUser ? (
                    <User className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Cpu className="w-4 h-4 text-amber-400" />
                  )}
                </div>

                {/* Message Body */}
                <div className={`border rounded-2xl p-3 text-sm text-slate-300 max-w-full overflow-hidden break-words ${
                  isUser 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-blue-600/10 border-indigo-500/30 rounded-tr-sm shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                    : 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                }`}>
                  <div className="prose prose-invert prose-sm break-words max-w-full font-light leading-relaxed">
                    <span>{msg.content}</span>
                    {msg.isStreaming && <span className="typing-cursor"></span>}
                  </div>
                  
                  {/* Embedded Custom UI Card */}
                  {msg.card && msg.card !== 'none' && renderCard(msg.card)}
                </div>
              </div>
            );
          })}

          {/* Assistant typing loader dot state */}
          {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3 max-w-[85%] animate-fade-in text-left">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center shrink-0 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl rounded-tl-sm p-4 text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce typing-dot" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce typing-dot" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Container */}
        <div className="px-4 py-2.5 flex gap-2 overflow-x-auto quick-reply-container whitespace-nowrap border-t border-white/5 custom-scrollbar select-none">
          <button 
            type="button" 
            onClick={() => handleSendMessage("Who is Likith?")}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-all font-medium"
          >
            Who is Likith?
          </button>
          <button 
            type="button" 
            onClick={() => handleSendMessage("Contact Details")}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-all font-medium"
          >
            Contact Details
          </button>
          <button 
            type="button" 
            onClick={() => handleSendMessage("Systems")}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-all font-medium"
          >
            Systems
          </button>
          <button 
            type="button" 
            onClick={() => handleSendMessage("Git Archive")}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-all font-medium"
          >
            Git Archive
          </button>
          <button 
            type="button" 
            onClick={() => handleSendMessage("YouTube Hub")}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-all font-medium"
          >
            YouTube Hub
          </button>
          <button 
            type="button" 
            onClick={() => handleSendMessage("Collaborate")}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-all font-medium"
          >
            Collaborate
          </button>
        </div>

        {/* Input Form Area */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40 relative">
          
          {/* Speech Recording Status Indicator overlay */}
          <div className={`absolute -top-12 left-0 right-0 h-12 bg-slate-950/95 border-t border-white/5 items-center justify-between px-6 backdrop-blur-md transition-all duration-300 z-30 ${isListening ? 'flex' : 'hidden'}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span id="ai-voice-status" className="text-xs text-slate-300 font-mono">
                {selectedLang === 'te-IN' ? 'Listening (TE)...' : 'Listening (EN)...'}
              </span>
            </div>
            <div className="flex gap-0.5 items-end h-4 pb-0.5">
              <div className="w-[2.5px] bg-amber-400 animate-wave-bar h-1" style={{ animationDelay: '0.1s' }} />
              <div className="w-[2.5px] bg-amber-400 animate-wave-bar h-3" style={{ animationDelay: '0.2s' }} />
              <div className="w-[2.5px] bg-amber-400 animate-wave-bar h-4" style={{ animationDelay: '0.3s' }} />
              <div className="w-[2.5px] bg-amber-400 animate-wave-bar h-2" style={{ animationDelay: '0.4s' }} />
              <div className="w-[2.5px] bg-amber-400 animate-wave-bar h-3" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Language Toggle Pill & Info Status */}
          <div className="flex items-center justify-between mb-2 px-1 text-left">
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-full text-[10px] font-mono select-none">
              <button 
                type="button" 
                onClick={() => handleLangToggle('en-IN')}
                className={`px-2.5 py-0.5 rounded-full transition-all font-semibold ${
                  selectedLang === 'en-IN' 
                    ? 'text-white bg-amber-500/20 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button 
                type="button" 
                onClick={() => handleLangToggle('te-IN')}
                className={`px-2.5 py-0.5 rounded-full transition-all font-semibold ${
                  selectedLang === 'te-IN' 
                    ? 'text-white bg-amber-500/20 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TE
              </button>
            </div>
            
            {/* Info Message Label */}
            <div className={`text-[9px] font-mono truncate max-w-[200px] ${infoIsError ? 'text-red-400' : 'text-slate-500'}`}>
              {infoMessage}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening... Speak now' : 'Initiate query...'} 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-24 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" 
              autoComplete="off" 
              aria-label="Chat query input"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Mic Icon Toggle */}
              <button 
                type="button" 
                onClick={toggleVoiceInput}
                className={`w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all relative ${
                  isListening ? 'mic-listening' : ''
                }`}
                title="Speak to AI" 
                aria-label="Microphone voice input"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {/* Micro pulse indicator dot */}
                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-950 ${isListening ? '' : 'hidden'}`} />
              </button>

              {/* Submit Arrow up */}
              <button 
                type="submit" 
                className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black hover:bg-amber-400 transition-colors" 
                aria-label="Send query message"
              >
                <ArrowUp className="w-4 h-4 font-black" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
