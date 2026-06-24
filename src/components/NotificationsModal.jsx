import { useState, useEffect } from 'react';
import { X, Bell, Package, MessageSquare, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
const getToken = () => localStorage.getItem('token') || '';

export function NotificationsModal({ onClose }) {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    let userRole = 'user';
    try { userRole = JSON.parse(localStorage.getItem('user') || '{}').role || 'user'; } catch {}
    const endpoint = userRole === 'admin'
      ? `${API}/api/admin/notifications`
      : `${API}/api/admin/my-notifications`;
    try {
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setNotifications(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markRead = async (id) => {
    const token = getToken();
    if (!token) return;
    let userRole = 'user';
    try { userRole = JSON.parse(localStorage.getItem('user') || '{}').role || 'user'; } catch {}
    const endpoint = userRole === 'admin'
      ? `${API}/api/admin/notifications/${id}/read`
      : `${API}/api/admin/my-notifications/${id}/read`;
    await fetch(endpoint, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleOrderDecision = async (notif, decision) => {
    const token = getToken();
    try {
      const orderId = notif.orderId;
      if (!orderId) return alert('Order ID nahi mili notification mein');

      if (decision === 'reject') {
        const res = await fetch(`${API}/api/orders/cancel/${orderId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return alert('Cancel failed');
        // get manufacturerId from order
        const oRes = await fetch(`${API}/api/orders/client`, { headers: { Authorization: `Bearer ${token}` } });
        const orders = await oRes.json();
        const order = orders.find(o => o._id === orderId || o.id === orderId);
        if (order?.manufacturerId) {
          await fetch(`${API}/api/admin/send-notification`, {
            method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: order.manufacturerId, title: 'Order Rejected', message: `Client na "${order.title}" order reject ker diya.`, type: 'system' })
          }).catch(() => {});
        }
        alert('Order reject ho gaya');
      } else {
        const oRes = await fetch(`${API}/api/orders/client`, { headers: { Authorization: `Bearer ${token}` } });
        const orders = await oRes.json();
        const order = orders.find(o => o._id === orderId || o.id === orderId);
        if (!order) return alert('Order nahi mila');
        await fetch(`${API}/api/admin/send-notification`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: order.manufacturerId, title: 'Order Approved', message: `Client na "${order.title}" order approve ker diya. Kaam shuru karein!`, type: 'system' })
        }).catch(() => {});
        alert('Order approve ho gaya! Manufacturer ko notification bhej di.');
      }
      markRead(notif._id);
      fetchNotifs();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'registration':    return <Package className="size-5 text-[#2563EB]" />;
      case 'labour_apply':    return <Users className="size-5 text-green-500" />;
      case 'order_completed':
      case 'labour_complete': return <CheckCircle className="size-5 text-green-600" />;
      case 'document':        return <CheckCircle className="size-5 text-yellow-500" />;
      case 'video':           return <AlertCircle className="size-5 text-purple-500" />;
      default:                return <Bell className="size-5 text-gray-500" />;
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins/60)} hr ago`;
    return `${Math.floor(mins/1440)} days ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Bell className="size-6 text-[#2563EB]" />
            <h2 className="text-2xl">Notifications</h2>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 max-h-[500px] overflow-y-auto">
          {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}

          {!loading && notifications.length === 0 && (
            <p className="text-center text-gray-400 py-8">Koi notification nahi hai</p>
          )}

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id || n.id}
                onClick={() => markRead(n._id || n.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isDarkMode
                    ? n.isRead ? 'bg-gray-900 border-gray-800' : 'bg-gray-800 border-gray-700'
                    : n.isRead ? 'bg-white border-gray-200' : 'bg-[#2563EB]/5 border-[#2563EB]/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-medium text-sm ${!n.isRead ? 'text-[#2563EB]' : ''}`}>{n.title}</h3>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{n.message}</p>
                    {n.type === 'order_accepted' && !n.isRead && (
                      <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => handleOrderDecision(n, 'approve')}>✓ Approve</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => handleOrderDecision(n, 'reject')}>✗ Reject</Button>
                      </div>
                    )}
                  </div>
                  {!n.isRead && <div className="size-2 rounded-full bg-[#2563EB] mt-2 shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <Button onClick={onClose} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">Close</Button>
        </div>
      </div>
    </div>
  );
}
