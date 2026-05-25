// Quick Access Button Component for Escrow Flow Demo
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { EscrowDemoPage } from './EscrowDemoPage';

export function EscrowFlowDemoButton() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDemo(true)}
        className="fixed bottom-24 left-6 size-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center border border-white/20 transition-all hover:scale-110 z-40"
        title="Open Escrow Payment Page"
      >
        <ShieldCheck className="size-6 text-white" />
      </button>

      {showDemo && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <EscrowDemoPage onClose={() => setShowDemo(false)} />
        </div>
      )}
    </>
  );
}
/*Purpose: A floating action button that opens the escrow payment workflow for quick access.

Type: Frontend component usable in both web apps and hybrid (mobile/web) apps.





 */
