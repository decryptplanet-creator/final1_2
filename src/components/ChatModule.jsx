import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Send, X, Loader2, AlertTriangle, Lock, User, Paperclip, Camera, Image, FileText } from 'lucide-react';

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
  const messagesEndRef = useRef(null);
  
  // File References
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const API_URL = "http://localhost:5001/api/messages";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${orderId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err.response?.status === 403) setIsLocked(true);
      } finally { setLoading(false); }
    };

    fetchHistory();
    socket.emit('join_chat', orderId);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, [orderId]);

  // --- NAYA FILE HANDLING LOGIC ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64File = reader.result;
      const payload = {
        sender: currentUserId,
        receiver: receiverId,
        orderId: orderId,
        message: file.type.startsWith("image/") ? `IMAGE_DATA:${base64File}` : `FILE_DATA:${file.name}`,
        createdAt: new Date().toISOString()
      };

      try {
        const response = await axios.post(API_URL, payload);
        socket.emit('send_message', response.data);
        setMessages((prev) => [...prev, response.data]);
        setShowAttachments(false);
      } catch (err) {
        alert("File send nahi ho saki!");
      }
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLocked) return;

    const payload = {
      sender: currentUserId,
      receiver: receiverId,
      orderId: orderId,
      message: newMessage,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await axios.post(API_URL, payload);
      socket.emit('send_message', response.data);
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setWarning("");
      setShowAttachments(false);
    } catch (error) {
      if (error.response?.data?.ai_warning) {
        setWarning(error.response.data.ai_warning);
        if (error.response.data.ai_warning.includes("Locked")) setIsLocked(true);
      } else {
        alert("Backend Server (Port 5001) band hai ya block hai!");
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans text-slate-800">
      <div className="bg-white w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-gray-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 p-2 rounded-full text-blue-400">
               <User size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">{receiverName}</span>
              <span className="text-[10px] text-slate-400 mt-1 italic">Order ID: {orderId}</span>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>

        {warning && (
          <div className="bg-red-50 border-b border-red-100 p-3 flex items-start gap-2 animate-pulse">
            <AlertTriangle className="text-red-500 shrink-0" size={16} />
            <span className="text-[11px] text-red-700 font-semibold">{warning}</span>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              <Loader2 className="animate-spin mr-2" /> Loading History...
            </div>
          ) : (
            messages.map((m, index) => {
              const isMe = m.sender === currentUserId;
              const isImage = m.message.startsWith("IMAGE_DATA:");
              return (
                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-2xl max-w-[85%] shadow-sm text-sm ${
                    isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-gray-200 rounded-bl-none'
                  }`}>
                    {isImage ? (
                      <img src={m.message.split("IMAGE_DATA:")[1]} alt="Shared" className="rounded-lg max-h-48 w-full object-cover" />
                    ) : (
                      <p>{m.message}</p>
                    )}
                    <div className={`text-[10px] mt-1 opacity-70 text-right ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- ATTACHMENT MENU POPUP --- */}
        {showAttachments && (
          <div className="absolute bottom-20 left-4 bg-white shadow-2xl border border-gray-100 rounded-2xl p-2 flex gap-4 animate-in slide-in-from-bottom-2 z-10">
            <button onClick={() => cameraInputRef.current.click()} className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-xl transition-all">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Camera size={20}/></div>
              <span className="text-[10px] font-medium">Camera</span>
            </button>
            <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-1 p-2 hover:bg-purple-50 rounded-xl transition-all">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Image size={20}/></div>
              <span className="text-[10px] font-medium">Gallery</span>
            </button>
            <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-1 p-2 hover:bg-orange-50 rounded-xl transition-all">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600"><FileText size={20}/></div>
              <span className="text-[10px] font-medium">Document</span>
            </button>
          </div>
        )}

        {/* Hidden Inputs for File and Camera */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

        {/* Input Form with + Button */}
        <div className="p-4 bg-white border-t border-gray-100">
          {isLocked ? (
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-gray-400 text-xs italic border border-dashed border-gray-300">
              <Lock size={14} /> This chat is locked for security review.
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              <button 
                type="button"
                onClick={() => setShowAttachments(!showAttachments)}
                className={`p-2.5 rounded-full transition-all ${showAttachments ? 'bg-blue-600 text-white rotate-45' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <Paperclip size={20} />
              </button>

              <input 
                className="flex-1 border-none bg-slate-100 p-3 rounded-full outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                autoComplete="off"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
              >
                <Send size={20}/>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}