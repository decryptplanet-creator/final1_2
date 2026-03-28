# Skillora Color Update Guide

## Color Replacement Map

### Old Colors → New Colors

```
BLACK THEME → DARK TEAL THEME

Background Colors:
bg-black → bg-[#1a4d4d]
bg-gray-900 → bg-[#1e5252]
bg-gray-800 → bg-[#2d6a6a]

Accent Colors (RED → PURPLE):
bg-red-600 → bg-purple-500 OR bg-[#a78bfa]
bg-red-700 → bg-purple-600
hover:bg-red-700 → hover:bg-purple-600
text-red-600 → text-purple-500
text-red-400 → text-purple-400
border-red-600 → border-purple-500
from-red-600 → from-purple-500
to-red-700 → to-purple-600

Secondary Accent (GREEN):
Use for success states:
bg-green-500 → bg-[#4ade80]
text-green-400 → text-[#4ade80]

Gradients:
bg-gradient-to-br from-red-600 to-red-700 
→ bg-gradient-to-br from-purple-500 to-purple-600

OR for primary brand:
→ bg-gradient-to-br from-[#1e5252] to-[#2d6a6a]
```

## Tailwind Custom Classes

Add to components where needed:

```tsx
className="bg-teal-primary" // Use CSS variable
className="bg-purple-accent"
className="bg-green-accent"
```

## Files Requiring Updates

### High Priority:
1. ✅ /styles/globals.css - DONE
2. [ ] /App.tsx
3. [ ] /components/LandingPage.tsx
4. [ ] /components/ClientDashboard.tsx
5. [ ] /components/ManufacturerDashboard.tsx
6. [ ] /components/LabourDashboard.tsx
7. [ ] /components/VerificationFlow.tsx
8. [ ] /components/ProfileModal.tsx
9. [ ] /components/SettingsModal.tsx
10. [ ] /components/SearchModal.tsx

### Medium Priority:
11. [ ] /components/PostOrderModal.tsx
12. [ ] /components/AcceptOrderModal.tsx
13. [ ] /components/OrderDetailsModal.tsx
14. [ ] /components/HireLabourModal.tsx
15. [ ] /components/ChatModal.tsx
16. [ ] /components/EmailModal.tsx
17. [ ] /components/NotificationsModal.tsx
18. [ ] /components/ViewAllModal.tsx
19. [ ] /components/HorizontalProfiles.tsx

### Low Priority (Already Created with New Colors):
20. ✅ /components/SelfieCapture.tsx
21. ✅ /components/LocationModal.tsx
22. ✅ /components/HelpModal.tsx
23. ✅ /components/ProfileDetailModal.tsx
24. ✅ /components/DocumentationModal.tsx
25. ✅ /components/SecurityPrivacyModal.tsx

## Quick Find & Replace Commands

For bulk updates in each file:

```bash
# Red to Purple
bg-red-600 → bg-purple-500
bg-red-700 → bg-purple-600
hover:bg-red-700 → hover:bg-purple-600
text-red-600 → text-purple-500
text-red-400 → text-purple-400
border-red-600 → border-purple-500

# Black to Teal
bg-black → bg-[#1a4d4d]
bg-gray-900 → bg-[#1e5252]
bg-gray-800 → bg-[#2d6a6a]

# Gradients
from-red-600 → from-purple-500
to-red-700 → to-purple-600
```

## Component-Specific Notes

### Logo/Branding:
- Sparkles icon background: `bg-gradient-to-br from-purple-500 to-purple-600`
- "Skillora" text: `text-purple-500`

### Buttons:
- Primary: `bg-purple-500 hover:bg-purple-600`
- Secondary: `bg-[#2d6a6a] hover:bg-[#1e5252]`
- Success: `bg-[#4ade80] hover:bg-green-600`

### Cards:
- Dark mode: `bg-[#1e5252] border-purple-500/20`
- Light mode: `bg-white border-gray-200`

### Status Badges:
- Trust Score: purple
- Verified: green
- Pending: yellow
- Active: blue
- Completed: green

### Hover States:
- Links: `hover:text-purple-500`
- Buttons: `hover:bg-purple-600`
- Cards: `hover:border-purple-500/50`

## Implementation Strategy

1. Update global CSS variables ✅
2. Update App.tsx and LandingPage (high visibility)
3. Update all Dashboard components
4. Update Modal components
5. Update utility components
6. Test thoroughly in both light and dark modes
