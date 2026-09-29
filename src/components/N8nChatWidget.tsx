import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Settings,
  HelpCircle,
  Check,
  Copy,
  ChevronDown
} from 'lucide-react';
import { Garment, Fabric, ColorShade, Motif, Hardware } from '../types';

export const DEFAULT_N8N_WEBHOOK = 'https://asrithajenigalla.app.n8n.cloud/webhook/7ce4e24f-735c-4119-b5a1-5c454b4b12ba/chat';
export const TEST_N8N_WEBHOOK = 'https://asrithajenigalla.app.n8n.cloud/webhook-test/7ce4e24f-735c-4119-b5a1-5c454b4b12ba/chat';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

interface N8nChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  garment: Garment;
  fabric: Fabric;
  color: ColorShade;
  motif: Motif;
  hardware: Hardware;
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({
  isOpen,
  onToggle,
  garment,
  fabric,
  color,
  motif,
  hardware
}) => {
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('threads_textures_n8n_webhook') || DEFAULT_N8N_WEBHOOK;
  });
  const [isTestMode, setIsTestMode] = useState<boolean>(() => {
    return localStorage.getItem('threads_textures_n8n_test_mode') === 'true';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Namaste & Welcome to **Threads & Textures Atelier**. I am your bespoke couture weave advisor, powered by your n8n AI workflow.\n\nI am currently tracking your live studio design: **${garment.name}** in **${color.name}** (${fabric.name}). How can I assist you with heritage weaves, natural dye traditions, or silhouette styling today?`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() => {
    let sid = sessionStorage.getItem('threads_textures_chat_session');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 12);
      sessionStorage.setItem('threads_textures_chat_session', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const activeWebhook = isTestMode ? TEST_N8N_WEBHOOK : webhookUrl;

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const payload = {
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: messageText,
        message: messageText,
        text: messageText,
        context: {
          garment: {
            id: garment.id,
            name: garment.name,
            origin: garment.origin,
            silhouette: garment.silhouette,
            basePrice: garment.basePrice,
            heritage: garment.heritageText
          },
          fabric: {
            id: fabric.id,
            name: fabric.name,
            warpWeft: fabric.warpWeft,
            drapeWeight: fabric.drapeWeight,
            sheenLevel: fabric.sheenLevel
          },
          color: {
            id: color.id,
            name: color.name,
            hex: color.hex,
            pantone: color.pantone,
            dyeOrigin: color.dyeOrigin
          },
          motif: {
            id: motif.id,
            name: motif.name,
            category: motif.category,
            historicalEra: motif.historicalEra
          },
          hardware: {
            id: hardware.id,
            name: hardware.name,
            finish: hardware.finish
          }
        }
      };

      const response = await fetch(activeWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let responseText = '';
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.output) {
          responseText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output, null, 2);
        } else if (data.text) {
          responseText = data.text;
        } else if (data.response) {
          responseText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response, null, 2);
        } else if (data.message && typeof data.message === 'string') {
          // If n8n returns standard error message
          if (data.message.includes('is not registered')) {
            responseText = `⚠️ **n8n Workflow Notice:**\n\n${data.message}\n\n**To fix this:**\n1. Go to your [n8n cloud workspace](https://asrithajenigalla.app.n8n.cloud).\n2. Open your Chat Bot workflow.\n3. Turn the **'Active'** toggle switch ON in the top-right corner.\n4. *(Or toggle 'Test Mode' in this widget if executing directly on the canvas).*`;
          } else {
            responseText = data.message;
          }
        } else {
          responseText = JSON.stringify(data, null, 2);
        }
      } else {
        responseText = await response.text();
      }

      if (!response.ok && !responseText.includes('n8n Workflow Notice')) {
        responseText = `⚠️ **Connection Note (${response.status}):**\n${responseText || 'No response body received from n8n webhook.'}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: responseText,
          timestamp: new Date()
        }
      ]);
    } catch (error: any) {
      console.error('n8n chat error:', error);
      const errNote = error?.message || 'Failed to reach n8n webhook.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'bot',
          isError: true,
          text: `⚠️ **Unable to connect to n8n webhook**\n\n*Error details:* ${errNote}\n\n*Target URL:* \`${activeWebhook}\`\n\n**Troubleshooting:**\n1. Ensure your n8n workflow is active on \`asrithajenigalla.app.n8n.cloud\`.\n2. Ensure your n8n "When chat message received" node is listening for POST requests.\n3. If running test executions on the canvas, switch to **Test Mode** in settings.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        sender: 'bot',
        text: `Conversation history reset. I am ready to advise you on **${garment.name}** or any weave technique in our repertoire.`,
        timestamp: new Date()
      }
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterSuggestions = [
    `Tell me about the ${garment.name}'s heritage and weaving hours`,
    `How is the natural dye for ${color.name} formulated?`,
    `What makes ${fabric.name} unique for this silhouette?`,
    `Recommend complementary jewellery and hardware for this design`
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <button
        type="button"
        onClick={onToggle}
        className={`fixed bottom-24 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl transition-all duration-300 border cursor-pointer ${
          isOpen
            ? 'bg-[#24211D] text-[#E6C687] border-[#B89355] scale-95'
            : 'bg-[#1C1A17] hover:bg-[#2C2824] text-white border-[#B89355]/60 hover:border-[#B89355] hover:scale-105 shadow-gold'
        }`}
        title="Open n8n Atelier AI Advisor"
      >
        <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#B89355]/20 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[12px] font-semibold tracking-wide text-[#FAF8F5]">
            Atelier AI Stylist
          </span>
          <span className="text-[9px] tracking-wider uppercase text-[#D4AF37] font-mono">
            n8n Connected
          </span>
        </div>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[440px] h-[580px] max-h-[82vh] bg-[#FAF8F5] border border-[#DCD3C0] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[#1C1A17] text-[#FAF8F5] flex items-center justify-between border-b border-[#38332C]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B89355]/20 border border-[#B89355]/50 flex items-center justify-center text-[#E6C687]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-serif font-semibold tracking-wide text-[#FAF8F5]">
                    Atelier AI Stylist
                  </h3>
                  <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
                    isTestMode ? 'bg-amber-900/60 text-amber-300 border border-amber-600/40' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/40'
                  }`}>
                    {isTestMode ? 'TEST MODE' : 'PROD'}
                  </span>
                </div>
                <p className="text-[10px] text-[#A69C8A] truncate max-w-[210px]">
                  asrithajenigalla.app.n8n.cloud
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${showSettings ? 'text-[#E6C687] bg-white/10' : 'text-[#A69C8A]'}`}
                title="Webhook Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-[#A69C8A] hover:text-[#FAF8F5] hover:bg-white/10 rounded-md transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 text-[#A69C8A] hover:text-[#FAF8F5] hover:bg-white/10 rounded-md transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Drawer (Dropdown) */}
          {showSettings && (
            <div className="p-3 bg-[#24211D] text-[#FAF8F5] border-b border-[#3D372E] text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#E6C687]">n8n Endpoint Mode:</span>
                <div className="flex items-center gap-1 bg-[#151311] p-0.5 rounded border border-[#38332C]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestMode(false);
                      localStorage.setItem('threads_textures_n8n_test_mode', 'false');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      !isTestMode ? 'bg-[#B89355] text-white' : 'text-[#8C8270] hover:text-white'
                    }`}
                  >
                    Production (/webhook/)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestMode(true);
                      localStorage.setItem('threads_textures_n8n_test_mode', 'true');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      isTestMode ? 'bg-amber-600 text-white' : 'text-[#8C8270] hover:text-white'
                    }`}
                  >
                    Test (/webhook-test/)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#A69C8A] uppercase tracking-wider mb-1">
                  Active Webhook URL:
                </label>
                <div className="p-1.5 bg-[#151311] border border-[#3D372E] rounded font-mono text-[10px] break-all text-[#DCD3C0]">
                  {activeWebhook}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://asrithajenigalla.app.n8n.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline"
                >
                  <span>Open n8n Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-[#FAF8F5] rounded text-[10px]"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Current Garment Context Bar */}
          <div className="px-3.5 py-1.5 bg-[#F2ECE0] border-b border-[#E2D9C5] flex items-center justify-between text-[11px] text-[#544D42]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }}></span>
              <span className="font-semibold text-[#24211D]">{garment.name}</span>
              <span className="text-[#8C8270]">·</span>
              <span className="truncate text-[#6B6254]">{color.name}</span>
              <span className="text-[#8C8270]">·</span>
              <span className="truncate text-[#6B6254]">{fabric.name}</span>
            </div>
            <span className="text-[10px] font-mono text-[#8C7A5B] font-medium shrink-0 ml-2">
              Context Synced
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#FAF8F5]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-1 px-1">
                    {isUser ? (
                      <span className="text-[10px] font-medium text-[#7D7364]">You</span>
                    ) : (
                      <span className="text-[10px] font-medium text-[#B89355] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Atelier AI
                      </span>
                    )}
                    <span className="text-[9px] text-[#A69C8A]">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`group relative max-w-[88%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap transition-all ${
                      isUser
                        ? 'bg-[#24211D] text-[#FAF8F5] rounded-tr-none'
                        : msg.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-none'
                        : 'bg-white border border-[#E8DFC9] text-[#2C2824] shadow-xs rounded-tl-none'
                    }`}
                  >
                    {/* Render basic bold formatting */}
                    {formatMessageText(msg.text)}

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 bg-white/90 hover:bg-white text-[#6B6254] rounded shadow-xs transition-opacity"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1 mb-1 px-1">
                  <span className="text-[10px] font-medium text-[#B89355] flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 animate-spin" />
                    Consulting n8n AI Agent...
                  </span>
                </div>
                <div className="p-3 bg-white border border-[#E8DFC9] rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#B89355] animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#B89355] animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#B89355] animate-bounce"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (if only initial message) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-[#F6F1E6] border-t border-[#E8DFC9] overflow-x-auto flex gap-1.5 scrollbar-none">
              {starterSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 px-2.5 py-1 text-[10px] bg-white hover:bg-[#FAF8F5] border border-[#DCD3C0] hover:border-[#B89355] text-[#544D42] hover:text-[#24211D] rounded-full transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-[#E8DFC9] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask n8n agent about ${garment.name}...`}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C3] rounded-lg text-[#24211D] placeholder-[#9E9484] focus:outline-none focus:border-[#B89355] focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 bg-[#24211D] hover:bg-[#38332C] text-[#FAF8F5] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              title="Send to n8n"
            >
              <Send className="w-3.5 h-3.5 text-[#E6C687]" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

// Simple Markdown formatting helper for bold, italics, bullets, and code blocks
function formatMessageText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\n)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-[#1F1C18]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1 py-0.5 bg-black/5 rounded font-mono text-[11px] text-[#8C4A28]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part === '\n') {
      return <br key={index} />;
    }
    return <span key={index}>{part}</span>;
  });
}
