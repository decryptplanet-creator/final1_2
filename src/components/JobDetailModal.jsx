import { X, Briefcase, User, Clock, DollarSign, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function JobDetailModal({ job, onClose }) {
  const { isDarkMode } = useTheme();
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Briefcase size={18} className="text-blue-500" /> Job Details
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Order Title</p>
            <p className="font-medium">{job.orderTitle || job.title || '—'}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><User size={12} /> Manufacturer</p>
              <p className="font-medium">{job.manufacturerName || '—'}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={12} /> Rate</p>
              <p className="font-medium">{job.rate ? `PKR ${job.rate}/hr` : '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Clock size={12} /> Duration</p>
            <p className="font-medium">{job.duration || '—'}</p>
          </div>
          {job.description && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><FileText size={12} /> Description</p>
              <p className="text-sm text-slate-500 dark:text-slate-300">{job.description}</p>
            </div>
          )}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            job.status === 'accepted' ? 'bg-green-100 text-green-700' :
            job.status === 'completed' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Pending'}
          </span>
        </div>

        <button onClick={onClose} className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          Close
        </button>
      </div>
    </div>
  );
}
