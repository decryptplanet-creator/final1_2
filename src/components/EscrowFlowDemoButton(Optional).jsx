// Quick Access Button Component for Escrow Flow Demo
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { EscrowFlowDemo } from './EscrowFlowDemo';

export function EscrowFlowDemoButton() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDemo(true)}
        className="fixed bottom-24 left-6 size-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center border border-white/20 transition-all hover:scale-110 z-40"
        title="View 4-Screen Escrow Flow Demo"
      >
        <ShieldCheck className="size-6 text-white" />
      </button>

      {showDemo && <EscrowFlowDemo onClose={() => setShowDemo(false)} />}
    </>
  );
}
/*Purpose: A floating action button that opens the 4-screen escrow payment demo modal for quick access.

Type: Frontend component usable in both web apps and hybrid (mobile/web) apps.





 */