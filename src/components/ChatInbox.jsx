import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { X, MessageSquare, Loader2, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_CHAT_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001';
const SOCKET_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5001';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Hook: use this in dashboards to get unread count + open inbox ──────────────
export function useChatNotifications(currentUserId) {
  const [unread, setUnread] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUserId) return;
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    // register after connect so it's not lost
    socket.on('connect', () => {
      socket.emit('register_user', String(currentUserId));
    });
    if (socket.connected) socket.emit('register_user', String(currentUserId));

    socket.on('new_message_notification', () => {
      setUnread(prev => prev + 1);
    });

    // Also register on R_Back (5003) to receive hire/reject notifications
    const mainApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';
    const socket2 = io(mainApiUrl, { transports: ['websocket', 'polling'] });
    socket2.on('connect', () => socket2.emit('register_user', String(currentUserId)));
    if (socket2.connected) socket2.emit('register_user', String(currentUserId));
    socket2.on('new_message_notification', () => setUnread(prev => prev + 1));

    return () => { socket.disconnect(); socket2.disconnect(); };
  }, [currentUserId]);

  const clearUnread = () => setUnread(0);

  const sendNotification = (receiverId, message, orderId = 'system') => {
    const socket = socketRef.current;
    if (!socket) return;
    // Use main API socket (R_Back 5003) for notifications — emit via REST fallback
    const notifSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5003', { transports: ['websocket', 'polling'] });
    notifSocket.on('connect', () => {
      notifSocket.emit('register_user', String(currentUserId));
      notifSocket.emit('notify_message', {
        orderId,
        sender: String(currentUserId),
        receiver: String(receiverId),
        senderName: 'Skillora',
        message,
      });
      setTimeout(() => notifSocket.disconnect(), 2000);
    });
  };

  return { unread, clearUnread, sendNotification };
}

// ── ChatInbox Modal ────────────────────────────────────────────────────────────
export function ChatInbox({ currentUserId, onClose, onOpenChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const loadConversations = () => {
    if (!currentUserId) { setLoading(false); return; }
    console.log('📬 Loading inbox for userId:', currentUserId);
    axios
      .get(`${API_URL}/api/messages/inbox?userId=${currentUserId}`, { headers: authHeaders() })
      .then(({ data }) => {
        console.log('📬 Inbox data:', data);
        setConversations(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setConversations([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConversations();

    // Real-time: jab naya message aaye toh inbox refresh karo
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('connect', () => socket.emit('register_user', String(currentUserId)));
    if (socket.connected) socket.emit('register_user', String(currentUserId));
    socket.on('new_message_notification', (data) => {
      // Update or add conversation in list
      setConversations(prev => {
        const idx = prev.findIndex(c => c.orderId === data.orderId);
        const updated = { orderId: data.orderId, with: { name: data.senderName }, lastMessage: data.message, unread: 1 };
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], lastMessage: data.message, unread: (copy[idx].unread || 0) + 1 };
          return copy;
        }
        return [updated, ...prev];
      });
    });

    return () => socket.disconnect();
  }, [currentUserId]); // eslint-disable-line

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Messages</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y dark:divide-gray-700">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv, i) => (
              <button
                key={conv._id || conv.orderId || i}
                onClick={() => onOpenChat?.(conv)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {(() => {
                      const name = conv.with?.name || conv.receiverName || 'User';
                      // agar MongoDB ID jaisi string hai toh "User" dikhao
                      if (/^[a-f0-9]{24}$/.test(name)) return 'Labour User';
                      if (name === 'guest_labour') return 'Labour (Guest)';
                      if (name === 'guest_manufacturer') return 'Manufacturer (Guest)';
                      if (name === 'guest_client') return 'Client (Guest)';
                      return name;
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
