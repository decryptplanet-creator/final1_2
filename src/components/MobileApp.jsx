import { ArrowLeft, Smartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Mobile viewport simulation: renders the same dashboard flow as web inside a phone-sized frame.
 */
export function MobileApp({ onBack, currentUser: _currentUser, renderContent }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start pt-4 pb-8 px-4 ${
        isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
      }`}
    >
      <div className="w-full max-w-[420px] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md transition hover:opacity-90 ${
              isDarkMode
                ? 'bg-slate-800 text-white border border-slate-600'
                : 'bg-white text-slate-900 border border-slate-200'
            }`}
          >
            <ArrowLeft className="size-4" />
            Back to web
          </button>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <Smartphone className="size-3.5" />
            Mobile preview
          </span>
        </div>

        <div
          className={`relative rounded-[2rem] border-[10px] shadow-2xl overflow-hidden min-h-[min(85vh,820px)] flex flex-col ${
            isDarkMode
              ? 'border-slate-800 bg-slate-900'
              : 'border-slate-900 bg-slate-50'
          }`}
        >
          <div
            className={`h-7 shrink-0 flex items-center justify-center gap-2 border-b ${
              isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
            }`}
          >
            <span className={`h-2 w-16 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">{renderContent?.()}</div>
        </div>
      </div>
    </div>
  );
}
