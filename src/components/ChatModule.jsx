import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Send, X, Loader2, AlertTriangle, Lock, User, Paperclip, Camera, Image, Mic, ArrowLeft } from 'lucide-react';

const socket = io("http://localhost:5001");

export default function ChatModule({ 
  currentUserId = "user_02", 
  receiverId = "user_01", 
  receiverName = "Manufacturer", 
  orderId = "order_01", 
  onClose 
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  
  // --- TYPING & VOICE LOGIC ---
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Online');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const API_URL = "http://localhost:5001/api/messages";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${orderId}`);
        setMessages(res.data);
      } catch (err) { if (err.response?.status === 403) setIsLocked(true); }
      finally { setLoading(false); }
    };

    fetchHistory();
    socket.emit('join_chat', orderId);

    socket.on("display_typing", (data) => {
      if (data.senderId !== currentUserId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
      setIsTyping(false); 
    });

    socket.on("user_status_change", (data) => {
      if (data.userId === receiverId) {
        setStatus(data.status === 'online' ? 'Online' : 'Offline');
      }
    });
    
    return () => {
      socket.off('display_typing');
      socket.off('receive_message');
      socket.off('user_status_change');
    };
  }, [orderId, currentUserId, receiverId]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", { orderId, senderId: currentUserId });
  };

  // --- VOICE ENGINE ---
  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const payload = { sender: currentUserId, receiver: receiverId, orderId, message: `VOICE_DATA:${reader.result}` };
          const response = await axios.post(API_URL, payload);
          socket.emit('send_message', response.data);
          setMessages((prev) => [...prev, response.data]);
        };
        audioChunks.current = [];
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) { alert("Mic Permission Denied"); }
  };

  const stopVoice = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLocked) return;
    const payload = { sender: currentUserId, receiver: receiverId, orderId, message: newMessage, createdAt: new Date().toISOString() };
    try {
      const response = await axios.post(API_URL, payload);
      socket.emit('send_message', response.data);
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setShowAttachments(false);
    } catch (error) {
      if (error.response?.data?.ai_warning) setWarning(error.response.data.ai_warning);
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-[400px] h-[600px] flex flex-col rounded-[24px] overflow-hidden shadow-2xl relative border">
        
        {/* --- HEADER (WHITE BG + BLACK BACK + BLUE NAME) --- */}
        <div className="bg-white border-b p-3 flex items-center gap-3 shrink-0 shadow-sm">
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-black">
            <ArrowLeft size={24} />
          </button>
          <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
             <User size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-600 text-sm leading-tight">{receiverName}</h3>
            <p className="text-[10px] text-green-500 font-medium italic">{isTyping ? "typing..." : status}</p>
          </div>
          <X className="cursor-pointer opacity-50 hover:opacity-100" onClick={onClose} size={20}/>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#F9FBFF] flex flex-col gap-3">
          {loading ? (
            <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            messages.map((m, index) => {
              const isMe = m.sender === currentUserId;
              const isVoice = m.message?.startsWith("VOICE_DATA:");
              const isImage = m.message?.startsWith("IMAGE_DATA:");
              
              return (
                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                    isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {isVoice ? (
                      <audio controls className="w-40 h-8 scale-90 origin-left">
                        <source src={m.message.split("VOICE_DATA:")[1]} type="audio/wav" />
                      </audio>
                    ) : isImage ? (
                      <img src={m.message.split("IMAGE_DATA:")[1]} alt="Sent" className="rounded-lg max-h-40" />
                    ) : (
                      <p className="text-sm">{m.message}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="p-4 bg-white border-t border-gray-50 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <button type="button" onClick={() => setShowAttachments(!showAttachments)} className="p-2 text-gray-400 hover:text-blue-600">
              <Paperclip size={22} />
            </button>
            <input 
              className="flex-1 bg-gray-100 p-3 rounded-full outline-none text-sm" 
              value={newMessage} 
              onChange={handleInputChange} 
              placeholder="Type a message..." 
            />
            {/* Mic Button: Hold to Record */}
            <button 
              type="button"
              onMouseDown={startVoice} 
              onMouseUp={stopVoice}
              onTouchStart={startVoice}
              onTouchEnd={stopVoice}
              className={`p-2.5 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Mic size={24} />
            </button>
            <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
              <Send size={20}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

