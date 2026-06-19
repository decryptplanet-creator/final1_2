import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, MessageSquare, Loader2, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_CHAT_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001';
const authHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  return { Authorization: `Bearer ${token}` };
};

export function ChatInbox({ currentUserId, onClose, onOpenChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) { setLoading(false); return; }
    axios
      .get(`${API_URL}/api/messages/inbox`, { headers: authHeaders() })
      .then(({ data }) => setConversations(Array.isArray(data) ? data : []))
      .catch(() => {
        // ✅ Fallback: load inbox entries saved by ChatModule from localStorage
        const local = JSON.parse(localStorage.getItem(`chat_inbox_${currentUserId}`) || '[]');
        setConversations(local);
      })
      .finally(() => setLoading(false));
  }, [currentUserId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Messages</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
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
                key={conv._id || i}
                onClick={() => onOpenChat?.(conv)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {conv.with?.name || conv.receiverName || 'User'}
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
