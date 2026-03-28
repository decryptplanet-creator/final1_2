/**
 * Skillora STRICT Color Palette
 * ONLY 3 COLORS ALLOWED
 */

export const COLORS = {
  BG: '#F9FAFB',         // Background only
  TEXT: '#1F2933',       // All text
  PRIMARY: '#2563EB',    // All buttons, links, active states
  PRIMARY_HOVER: '#1d4ed8',
  PRIMARY_LIGHT: '#3b82f6',
  WHITE: '#ffffff',
} as const;

/**
 * Button styles - ONLY blue color
 */
export const getButtonClass = (variant: 'solid' | 'outline' | 'ghost' = 'solid') => {
  switch (variant) {
    case 'solid':
      return 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white';
    case 'outline':
      return 'border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white';
    case 'ghost':
      return 'text-[#2563EB] hover:bg-[#2563EB]/10';
    default:
      return 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white';
  }
};

/**
 * Icon color - ONLY blue for active states
 */
export const getIconClass = (active: boolean = true) => {
  return active ? 'text-[#2563EB]' : 'text-gray-400';
};

/**
 * Badge colors - ONLY blue
 */
export const getBadgeClass = () => {
  return 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20';
};

/**
 * Card colors
 */
export const getCardClass = () => {
  return 'bg-white border border-gray-200';
};
