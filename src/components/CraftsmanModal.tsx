import React, { useState } from 'react';
import { ARTISAN_INFO } from '../data/garments';
import { AtelierDesignState, Garment, Fabric, ColorShade } from '../types';
import { X, Send, CheckCircle2, Calendar, Scissors, Award } from 'lucide-react';

interface CraftsmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AtelierDesignState;
  garment: Garment;
  fabric: Fabric;
  color: ColorShade;
}

export const CraftsmanModal: React.FC<CraftsmanModalProps> = ({
  isOpen,
  onClose,
  state,
  garment,
  fabric,
  color
}) => {
  const [messages, setMessages] = useState([
    {
      sender: 'artisan',
      text: `Greetings from the Varanasi loom room. I see you are designing a bespoke ${garment.name} woven in ${fabric.name} with ${color.name} dye. Are you planning this for a particular ceremonial occasion or wedding?`,
      time: '10:14 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [measurementNotes, setMeasurementNotes] = useState('');
  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Believable artisan response
    setTimeout(() => {
      const replies = [
        `Understood. For ${fabric.name}, I recommend we prepare the pit loom with our 3-ply mulberry warp to ensure the ${color.name} dye reflects the natural light with heirloom depth.`,
        `Splendid choice. The ${garment.name} silhouette draped with this density will have exceptional grace. I will personally supervise the Korvai interlock on the border.`,
        `I have noted your specifications in our loom ledger. We can draft the punch cards tomorrow morning.`
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          sender: 'artisan',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleBookLoom = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAppointmentSuccess(true);
    setTimeout(() => {
      setShowAppointmentSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FAF8F5] border border-[#D9CEB5] rounded-xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ARTISAN_INFO.portraitSrc}
              alt={ARTISAN_INFO.name}
              className="w-12 h-12 rounded-full object-cover border border-[#B89355]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                  {ARTISAN_INFO.name}
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                  Atelier Loom Active
                </span>
              </div>
              <p className="text-xs text-[#8C7A5B] font-medium">
                {ARTISAN_INFO.title} · {ARTISAN_INFO.location}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8C7A5B] hover:text-[#24211D] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Customization Attachment Bar */}
        <div className="bg-[#F3EDE2] px-4 py-2 border-b border-[#E8DFC8] flex items-center justify-between text-xs text-[#5C5345]">
          <div className="flex items-center gap-2 truncate">
            <Scissors className="w-3.5 h-3.5 text-[#B89355] shrink-0" />
            <span className="truncate">
              Attached Spec: <strong className="text-[#24211D]">{garment.name}</strong> · {fabric.name} · {color.name}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#8C7A5B] shrink-0">
            Loom Draft #TT-9402
          </span>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#24211D] text-white rounded-br-none'
                    : 'bg-white border border-[#E2D8C3] text-[#332E27] rounded-bl-none shadow-2xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#A39988] mt-1 px-1">
                {m.sender === 'user' ? 'You' : ARTISAN_INFO.name} · {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E8DFC8] flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Ustad Ansari about custom drape, zari density, or bridal timelines..."
            className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C3] rounded-md focus:outline-none focus:border-[#B89355]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#24211D] hover:bg-[#3D372F] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-[#E6C687]" />
            <span>Send</span>
          </button>
        </form>

        {/* Schedule Loom Weaving Consultation Section */}
        <div className="p-4 border-t border-[#E8DFC8] bg-[#F7F3EB]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6E59] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B89355]" />
              Schedule 1-on-1 Master Loom Consultation
            </span>
          </div>

          {showAppointmentSuccess ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Loom consultation requested! Master Weaver Ansari will contact you via your verified client profile.
              </span>
            </div>
          ) : (
            <form onSubmit={handleBookLoom} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Custom measurements / notes (e.g., Height 5'8'', Blouse 36B, Pallu 2.5m)"
                value={measurementNotes}
                onChange={(e) => setMeasurementNotes(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDD5C3] rounded-md focus:outline-none focus:border-[#B89355]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#8C7A5B] hover:bg-[#786749] text-white text-xs font-medium rounded-md whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Request Loom Session
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
