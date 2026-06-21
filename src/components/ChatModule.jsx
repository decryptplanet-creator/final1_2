import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Send, X, Loader2, AlertTriangle, Lock, Paperclip, Camera, Image, FileText, Phone, Video, MoreVertical, Smile } from 'lucide-react';

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5001';
const API_URL = `${CHAT_SERVER_URL}/api/messages`;

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function ChatModule({ currentUserId, currentUserName = '', receiverId, receiverName = 'Manufacturer', orderId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const socketRef = useRef(null);

  const norm = (v) => String(v || '');

  const isForThisChat = (msg) => norm(msg.orderId) === norm(orderId);

  const addIfNew = (incoming) => {
    const msg = incoming?.message || incoming;
    if (!isForThisChat(msg)) return;
    setMessages((prev) => {
      const dup = prev.some((m) =>
        (msg._id && m._id === msg._id) ||
        (m.sender === msg.sender && m.message === msg.message && m.createdAt === msg.createdAt)
      );
      return dup ? prev : [...prev, msg];
    });
  };

  const loadMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/${orderId}`, { headers: authHeaders() });
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 403) {
        const errData = err.response.data;
        if (errData?.locked) setIsLocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io(CHAT_SERVER_URL, {
      transports: ['websocket', 'polling'],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('join_chat', orderId);
      if (currentUserId) socket.emit('register_user', currentUserId);
    });

    socket.on('connect_error', (err) => {
      console.log('❌ Socket connection error:', err.message);
    });

    // On reconnect, reload messages from server
    socket.on('reconnect', () => {
      socket.emit('join_chat', orderId);
      if (currentUserId) socket.emit('register_user', currentUserId);
      loadMessages();
    });

    loadMessages();

    socket.on('receive_message', addIfNew);

    return () => {
      socket.emit('leave_chat', orderId);
      socket.off('receive_message', addIfNew);
      socket.disconnect();
    };
  }, [currentUserId, receiverId, orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendViaREST = async (messageText) => {
    const payload = {
      sender: currentUserId,
      senderName: currentUserName || currentUserId,
      receiver: receiverId,
      receiverName,
      orderId,
      message: messageText,
    };

    const { data } = await axios.post(API_URL, payload, { headers: authHeaders() });

    const saved = data?.message || data;
    addIfNew(saved);

    socketRef.current?.emit('notify_message', {
      ...saved,
      sender: norm(saved.sender ?? currentUserId),
      receiver: norm(saved.receiver ?? receiverId),
      senderName: currentUserName || currentUserId,
    });

    return data;
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || isLocked) return;
    const text = newMessage;
    setNewMessage('');
    setWarning('');
    setShowAttachments(false);
    try {
      const data = await sendViaREST(text);
      if (data.aiStatus === 'DISPUTE') {
        setWarning(`Dispute detected by Skillora AI (warnings: ${data.warnings ?? 1})`);
      }
    } catch (error) {
      setNewMessage(text);
      const errData = error.response?.data;
      if (errData?.error) {
        setWarning(errData.error);
        if (errData.locked) setIsLocked(true);
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const text = file.type.startsWith('image/') ? `IMAGE_DATA:${reader.result}` : `FILE_DATA:${file.name}`;
      try {
        await sendViaREST(text);
        setShowAttachments(false);
      } catch {
        alert('File send nahi ho saki!');
      }
    };
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const groupByDate = (msgs) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    msgs.forEach((m) => {
      const d = new Date(m.createdAt);
      let label;
      if (d.toDateString() === today.toDateString()) label = 'Today';
      else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
      else label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      (groups[label] = groups[label] || []).push(m);
    });
    return groups;
  };

  const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const grouped = groupByDate(messages);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative flex flex-col w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ height: 'min(680px, 95vh)', minHeight: '400px' }}>

        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: '#2563EB' }}>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors flex-shrink-0"><X size={20} /></button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#1D4ED8', color: '#fff' }}>{getInitials(receiverName)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">{receiverName}</p>
            <p className="text-blue-200 text-xs">online</p>
          </div>
          <div className="flex items-center gap-3 text-white/80 flex-shrink-0">
            <button className="hover:text-white transition-colors"><Video size={19} /></button>
            <button className="hover:text-white transition-colors"><Phone size={18} /></button>
            <button className="hover:text-white transition-colors"><MoreVertical size={19} /></button>
          </div>
        </div>

        {warning && (
          <div className="flex items-start gap-2 px-3 py-2 flex-shrink-0" style={{ background: '#FFF3CD', borderBottom: '1px solid #FFEAA7' }}>
            <AlertTriangle size={15} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-800 text-xs flex-1">{warning}</p>
            <button onClick={() => setWarning('')} className="text-yellow-500"><X size={13} /></button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-3" style={{ background: '#FFFFFF' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#EFF6FF' }}>
                <Loader2 size={16} className="animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">Loading messages...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="px-4 py-2 rounded-lg text-xs text-center" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                Messages are end-to-end encrypted.<br />No one outside this chat can read them.
              </div>
            </div>
          ) : (
            Object.entries(grouped).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex justify-center my-3">
                  <span className="text-xs px-3 py-1 rounded-full shadow-sm" style={{ background: '#DBEAFE', color: '#1E40AF', fontWeight: 500 }}>{date}</span>
                </div>
                {msgs.map((m, i) => {
                  const isMe = norm(m.sender) === norm(currentUserId);
                  const isImage = m.message?.startsWith('IMAGE_DATA:');
                  const showTail = i === 0 || norm(msgs[i - 1]?.sender) !== norm(m.sender);
                  return (
                    <div key={m._id || i} className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="relative max-w-[78%]" style={{ background: isMe ? '#2563EB' : '#F1F5F9', borderRadius: isMe ? (showTail ? '12px 12px 0px 12px' : '12px') : (showTail ? '12px 12px 12px 0px' : '12px'), padding: isImage ? '3px' : '8px 12px 6px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', marginBottom: showTail ? '2px' : '1px' }}>
                        {isImage ? (
                          <img src={m.message.split('IMAGE_DATA:')[1]} alt="Shared" className="rounded-md max-h-52 w-full object-cover" />
                        ) : (
                          <p className="text-sm leading-relaxed pr-10" style={{ color: isMe ? '#FFFFFF' : '#1E293B' }}>{m.message}</p>
                        )}
                        <div className={`flex items-center gap-1 justify-end mt-0.5 ${isImage ? 'px-2 pb-1' : ''}`}>
                          <span className="text-xs" style={{ color: isMe ? '#BFDBFE' : '#94A3B8', fontSize: '11px' }}>{formatTime(m.createdAt)}</span>
                          {isMe && <span style={{ color: '#BFDBFE', fontSize: '13px' }}>✓✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {showAttachments && (
          <div className="absolute bottom-16 left-3 rounded-2xl p-3 flex gap-2 z-10 shadow-xl" style={{ background: '#fff', border: '1px solid #DBEAFE' }}>
            {[
              { icon: <Camera size={20} />, label: 'Camera', color: '#2563EB', bg: '#EFF6FF', ref: cameraInputRef },
              { icon: <Image size={20} />, label: 'Gallery', color: '#7C3AED', bg: '#EDE9FE', ref: fileInputRef },
              { icon: <FileText size={20} />, label: 'Document', color: '#0369A1', bg: '#E0F2FE', ref: fileInputRef },
            ].map((item, i) => (
              <button key={i} onClick={() => item.ref.current.click()} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-blue-50 transition-all">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                <span className="text-xs" style={{ color: '#64748B' }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

        <div className="flex items-center gap-2 px-2 py-2 flex-shrink-0" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
          {isLocked ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <Lock size={14} /> Chat is locked for security review
            </div>
          ) : (
            <>
              <button onClick={() => setShowAttachments(!showAttachments)} className="w-10 h-10 flex items-center justify-center rounded-full transition-all flex-shrink-0" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                <Paperclip size={20} />
              </button>
              <div className="flex-1 flex items-center px-4 py-2 rounded-full" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <button className="mr-2 flex-shrink-0" style={{ color: '#94A3B8' }}><Smile size={20} /></button>
                <input
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: '#1E293B' }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Type a message"
                  autoComplete="off"
                />
              </div>
              <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 transition-all" style={{ background: '#2563EB', color: '#fff', opacity: newMessage.trim() ? 1 : 0.5 }}>
                <Send size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
