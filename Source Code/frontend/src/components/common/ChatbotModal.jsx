import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import AiBlob from '../reactbits/AiBlob';
import LatticeLoader from '../reactbits/LatticeLoader';
import { generateVegetablePdf } from '../../utils/vegetablePdfGenerator';

function formatInline(text) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-dark-emphasis fw-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function formatMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} style={{ height: '6px' }} />;
    }

    // Heading 3 or 4: ### Heading
    if (trimmed.startsWith('###')) {
      return (
        <h6 key={idx} className="fw-bold text-success font-heading mt-2.5 mb-1" style={{ fontSize: '0.92rem' }}>
          {formatInline(trimmed.replace(/^###\s*/, ''))}
        </h6>
      );
    }

    // Heading 2: ## Heading
    if (trimmed.startsWith('##')) {
      return (
        <h5 key={idx} className="fw-bold text-success font-heading mt-2.5 mb-1" style={{ fontSize: '1rem' }}>
          {formatInline(trimmed.replace(/^##\s*/, ''))}
        </h5>
      );
    }

    // Bullet point: * or -
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.replace(/^[*|-]\s*/, '');
      return (
        <div key={idx} className="d-flex align-items-start gap-2 my-1 ps-1">
          <span className="text-success fw-bold" style={{ fontSize: '1.1rem', lineHeight: '0.9' }}>•</span>
          <span style={{ fontSize: '0.86rem', lineHeight: '1.55' }}>{formatInline(content)}</span>
        </div>
      );
    }

    // Numbered item: 1. 2.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className="d-flex align-items-start gap-2 my-1 ps-1">
          <span className="badge bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px', fontSize: '0.65rem' }}>
            {numMatch[1]}
          </span>
          <span style={{ fontSize: '0.86rem', lineHeight: '1.55' }}>{formatInline(numMatch[2])}</span>
        </div>
      );
    }

    return (
      <p key={idx} className="mb-1" style={{ fontSize: '0.86rem', lineHeight: '1.55' }}>
        {formatInline(trimmed)}
      </p>
    );
  });
}

const DEFAULT_SUGGESTIONS = [
  "📄 Download Vegetable Guide (PDF)",
  "What produce was picked today?",
  "How do 0% fee pre-orders work?",
  "Suggest an organic dinner recipe"
];

export default function ChatbotModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hello! I am your **MarketLink AI Assistant** powered by **Gemini 3.8 Flash**.\n\nI can answer harvest questions in **any language**, share seasonal farm recipes, and generate our official **Vegetable Definition Guide (PDF)**!\n\nHow can I help you today?",
      suggestions: DEFAULT_SUGGESTIONS,
      showPdfBtn: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isDirectPdf = textToSend.toLowerCase().includes('download vegetable guide (pdf)') ||
                        textToSend.toLowerCase().includes('download pdf') ||
                        textToSend.toLowerCase().includes('vegetable guide');

    const userMsg = { sender: 'user', text: textToSend, timestamp: timeStr };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (isDirectPdf) {
      generateVegetablePdf();
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "📄 **Vegetable Definition Encyclopedia (PDF) Generated!**\n\nYour comprehensive PDF guide has been created and downloaded to your computer. It features complete botanical definitions, nutritional profiles, storage secrets, and culinary pairings for our top organic vegetables!",
          showPdfBtn: true,
          suggestions: ["What produce is fresh today?", "When is the market open?"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    setLoading(true);

    try {
      const data = await api.sendAIChat(textToSend);
      const isPdf = data.isPdfRequest || 
                    textToSend.toLowerCase().includes('pdf') || 
                    textToSend.toLowerCase().includes('defining') ||
                    textToSend.toLowerCase().includes('vegetable definition');

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply,
          suggestions: data.suggestions || [],
          matchedProducts: data.matchedProducts || [],
          model: data.model || 'Gemini 3.8 Flash',
          showPdfBtn: isPdf,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (isPdf) {
        generateVegetablePdf();
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm having a brief connection hitch with the farm database. Feel free to browse our Markets or Fresh Produce pages directly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "👋 Chat reset! I'm your **MarketLink AI Assistant**. Ask me in any language or request our Vegetable Definition PDF!",
        suggestions: DEFAULT_SUGGESTIONS,
        showPdfBtn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button with Animated AiBlob & Green Status Dot */}
      <div className="chatbot-bubble">
        <button
          type="button"
          onClick={() => setIsOpen(open => !open)}
          className="chatbot-btn shadow-lg position-relative"
          title="MarketLink AI Assistant (Multilingual • Gemini 3.8 Flash)"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <i className="bi bi-x-lg fs-4 text-white"></i>
          ) : (
            <div className="position-relative d-flex align-items-center justify-content-center">
              <AiBlob size={40} glow={true} />
              <span
                className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle shadow-sm"
                style={{ width: '13px', height: '13px' }}
                title="Gemini Online"
              />
            </div>
          )}
        </button>
      </div>

      {/* Clean, Fully Remade AI Chatbot Window */}
      {isOpen && (
        <div className="chat-modal-window shadow-2xl border" style={{ height: '580px', width: '410px' }}>
          {/* Clean Single Header Bar */}
          <div className="chat-modal-header text-white d-flex align-items-center justify-content-between p-3 position-relative">
            <div className="d-flex align-items-center gap-2.5">
              <div className="p-1 bg-white bg-opacity-15 rounded-circle border border-white border-opacity-25 d-flex align-items-center justify-content-center">
                <AiBlob size={32} glow={false} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="fw-bold mb-0 text-white font-heading" style={{ fontSize: '0.98rem' }}>
                    MarketLink AI
                  </h6>
                  <span className="badge rounded-pill bg-white text-success fw-bold px-2 py-0.5" style={{ fontSize: '0.62rem' }}>
                    Gemini 3.8
                  </span>
                </div>
                <div className="small text-white-50" style={{ fontSize: '0.7rem' }}>
                  ● Multilingual Farm Intelligence
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="btn btn-sm btn-link text-white-50 text-decoration-none p-1"
                onClick={handleClearChat}
                title="Reset conversation"
              >
                <i className="bi bi-arrow-counterclockwise fs-5 text-white"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-link text-white text-decoration-none p-1"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
              >
                <i className="bi bi-x-lg fs-5"></i>
              </button>
            </div>
          </div>

          {/* Clean Message Feed with Markdown Rendering */}
          <div className="flex-grow-1 p-3 overflow-y-auto chat-messages-container d-flex flex-column gap-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`d-flex flex-column ${m.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                <div className="position-relative" style={{ maxWidth: '92%' }}>
                  <div
                    className={`p-3 rounded-4 ${
                      m.sender === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-bot border'
                    }`}
                  >
                    {/* Render Formatted Markdown Content */}
                    <div>
                      {formatMarkdown(m.text)}
                    </div>

                    {/* Interactive PDF Download Card */}
                    {m.showPdfBtn && (
                      <div className="mt-2.5 p-2.5 rounded-3 border bg-body-tertiary d-flex align-items-center justify-content-between gap-2 shadow-xs">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-pdf-fill text-danger fs-3"></i>
                          <div style={{ fontSize: '0.76rem' }}>
                            <strong className="text-dark-emphasis d-block">Vegetable Guide (PDF)</strong>
                            <span className="text-muted">Definitions & Nutrition</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => generateVegetablePdf()}
                          className="btn btn-sm btn-egreen rounded-pill px-3 py-1 shadow-xs text-nowrap"
                          style={{ fontSize: '0.74rem' }}
                        >
                          <i className="bi bi-download me-1"></i> Download
                        </button>
                      </div>
                    )}

                    {/* Matched Products Recommendations */}
                    {m.matchedProducts && m.matchedProducts.length > 0 && (
                      <div className="mt-2.5 pt-2 border-top border-success border-opacity-25">
                        <div className="small fw-bold text-success mb-1.5" style={{ fontSize: '0.76rem' }}>
                          🌱 Fresh From Farm Stalls:
                        </div>
                        <div className="d-flex flex-column gap-1.5">
                          {m.matchedProducts.map((p, pIdx) => (
                            <div key={pIdx} className="d-flex align-items-center justify-content-between gap-2 p-1.5 rounded-3 bg-body-tertiary border">
                              <div className="d-flex align-items-center gap-2 overflow-hidden">
                                {p.image && (
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80';
                                    }}
                                    style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px' }}
                                  />
                                )}
                                <div className="overflow-hidden" style={{ fontSize: '0.76rem' }}>
                                  <div className="fw-semibold text-truncate text-dark-emphasis">{p.name}</div>
                                  <div className="text-success small">
                                    ${typeof p.price === 'number' ? p.price.toFixed(2) : p.price} / {p.unit || 'unit'}
                                    <span className="text-muted ms-1">• {p.farmerName}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsOpen(false);
                                  navigate('/products');
                                }}
                                className="btn btn-sm btn-outline-success rounded-pill px-2 py-0.5 text-nowrap"
                                style={{ fontSize: '0.7rem' }}
                              >
                                View →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bubble Subtext & Copy Action */}
                  <div className={`d-flex align-items-center gap-2 mt-1 px-1 ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-between'}`}>
                    {m.sender === 'bot' && (
                      <div className="d-flex align-items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(m.text, idx)}
                          className="btn btn-sm btn-link p-0 text-muted text-decoration-none"
                          style={{ fontSize: '0.68rem' }}
                        >
                          {copiedIdx === idx ? (
                            <span className="text-success"><i className="bi bi-check2"></i> Copied</span>
                          ) : (
                            <span><i className="bi bi-copy"></i> Copy</span>
                          )}
                        </button>
                      </div>
                    )}
                    {m.timestamp && (
                      <span className="text-muted" style={{ fontSize: '0.66rem' }}>{m.timestamp}</span>
                    )}
                  </div>
                </div>

                {/* Suggestions Pills (Clean, subtle chips) */}
                {m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && !loading && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {m.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="btn btn-sm btn-suggestion-pill rounded-pill px-2.5 py-1 text-truncate shadow-xs"
                        style={{ fontSize: '0.72rem', maxWidth: '300px' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {loading && (
              <div className="p-2.5 rounded-4 bg-body-tertiary border d-flex flex-column gap-2" style={{ maxWidth: '85%' }}>
                <div className="d-flex align-items-center gap-2 text-success small fw-semibold" style={{ fontSize: '0.78rem' }}>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Gemini is thinking...
                </div>
                <LatticeLoader size={28} glowColor="#10b981" label="Cross-referencing harvest database & recipes" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Clean Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 border-top chat-modal-footer d-flex gap-2 align-items-center"
          >
            <input
              type="text"
              className="form-control form-control-sm rounded-pill px-3 py-2 chat-input-field"
              placeholder="Ask anything in English, Español, Français..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              style={{ fontSize: '0.84rem' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-sm btn-egreen rounded-circle d-flex align-items-center justify-content-center shadow-xs"
              style={{ width: '38px', height: '38px', minWidth: '38px' }}
              title="Send to Gemini"
            >
              <i className="bi bi-send-fill" style={{ fontSize: '0.85rem' }}></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
