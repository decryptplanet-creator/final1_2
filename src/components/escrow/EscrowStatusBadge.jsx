import { Lock, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/labelstatus';

export function EscrowStatusBadge({ status, size = 'md' }) {
  const configs = {
    HOLD: {
      icon: Lock,
      text: 'Payment Held in Escrow',
      className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
    },
    RELEASED: {
      icon: CheckCircle,
      text: 'Payment Released',
      className: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
    },
    PENDING: {
      icon: Clock,
      text: 'Pending Confirmation',
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/30'
    },
    COMPLETED: {
      icon: CheckCircle,
      text: 'Completed',
      className: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30'
    }
  };

  const config = configs[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge variant="outline" className={`${config.className} ${sizeClasses[size]} flex items-center gap-1.5 w-fit`}>
      <Icon className={size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'} />
      {config.text}
    </Badge>
  );
}
/*Purpose: Yeh file escrow payment ka status (hold, released, pending, completed) visually badge ke through show karti hai.

Type: Yeh web-based (React UI) component hai, lekin hybrid apps mein bhi use ho sakta hai. */