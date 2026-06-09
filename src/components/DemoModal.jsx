import { useState, useEffect } from 'react';
import { X, ChevronRight, ShieldCheck, Factory, Wallet } from 'lucide-react';

const SLIDES = [
  { icon: <ShieldCheck className="size-12 text-blue-400" />, title: "Find Verified Manufacturers", desc: "Browse AI-verified manufacturers with trust scores, ratings, and capacity details — all in one place." },
  { icon: <Factory className="size-12 text-emerald-400" />, title: "Hire Skilled Labour", desc: "Connect with verified, skilled workers — tailors, cutters, and production experts — ready for your orders." },
  { icon: <Wallet className="size-12 text-purple-400" />, title: "Secure Escrow Payments", desc: "Pay safely with our escrow system. Funds are released only when work is completed and verified." }
];

export function DemoModal() {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('skillora_demo_dismissed')) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('skillora_demo_dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;
  const cur = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={dismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        <div className="flex justify-center mb-6">{cur.icon}</div>
        <h2 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-3">{cur.title}</h2>
        <p className="text-sm text-center text-slate-500 dark:text-slate-300 mb-8">{cur.desc}</p>
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200'}`} />)}
        </div>
        <div className="flex gap-3">
          <button onClick={dismiss} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50">Skip</button>
          <button onClick={() => isLast ? dismiss() : setSlide(s => s + 1)} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1">
            {isLast ? 'Get Started' : <>{('Next')}<ChevronRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
