import { CheckCircle, Circle, Loader2 } from 'lucide-react';

export function ProgressTimeline({ steps }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex flex-col items-center">
            <div className={`size-10 rounded-full flex items-center justify-center ${
              step.status === 'completed' 
                ? 'bg-[#2563EB]/10 text-[#2563EB]' 
                : step.status === 'in-progress'
                ? 'bg-[#2563EB]/10 text-[#2563EB]'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle className="size-6" />
              ) : step.status === 'in-progress' ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <Circle className="size-6" />
              )}
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`w-0.5 h-12 ${
                step.status === 'completed' ? 'bg-[#2563EB]/30' : 'bg-gray-200'
              }`} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-2">
            <div className={`font-medium ${
              step.status === 'completed' 
                ? 'text-[#2563EB]' 
                : step.status === 'in-progress'
                ? 'text-[#2563EB]'
                : 'text-gray-400'
            }`}>
              {step.label}
            </div>
            {step.date && (
              <div className="text-sm text-gray-500 mt-1">{step.date}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
/*Purpose: Yeh component order/payment progress ko timeline (steps like completed, in-progress, pending) ke form mein visually show karta hai.
Type: Web-based React component hai (web app ke liye use hota hai). */