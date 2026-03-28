# Skillora Comprehensive Implementation - Final Plan

## Status: IN PROGRESS

### Critical Changes Required:

#### 1. COLOR SCHEME (STRICT) ✓
- ✅ Remove ALL purple (#800080, purple-500, purple-600, etc.)
- ✅ Remove ALL blue (#0000FF, blue-500, blue-600, etc.)
- ✅ Remove ALL red (#FF0000, red-500, red-600, etc.)
- ✅ Remove ALL pink colors
- ✅ Replace with #138f8a (Dark Teal) and #10b981 (Green) ONLY

#### 2. CLIENT DASHBOARD FIXES
- Remove purple logo → Use teal gradient
- Email/Chat/Notification buttons → Green color + Active
- Search bar → Semantic search integration
- "Post Order" button → Teal color
- Filter buttons → Teal when active
- Recommended Manufacturers → Remove "View All" red button, use teal
- Profile cards → Click opens popup with close button
- Stats cards → Teal text
- Order tabs → Teal when active
- Order cards → Replace purple badges with teal/green
- "Contact Manufacturers" button → Active + green
- Remove all "Hire" buttons for labour in search results
- Posted Orders → Order Details → Contact Manufacturers → Active

#### 3. MANUFACTURER DASHBOARD FIXES  
- Move profile section to TOP (like Client dashboard)
- Email/Chat/Notification → Green + Active
- Search Results → Remove "Hire" button, only "View Profile"
- View Profile → Add Close (✕) button
- "Hire Labour" section → Profile click shows full details
- Available Orders → "Accept Order" → Popup with OK + Close
- Accepted Orders → Click opens popup with:
  - Chat with Client (Active)
  - Mark as Completed (Active)
- Remove bottom-right "View All"
- Activate "View Full Profile"
- Settings → Manage Security → Add Close/Back
- Settings → Get Help → Fully active

#### 4. LABOUR DASHBOARD FIXES
- Show ONLY skilled & top-rated labour
- Pending Offers → View details + Accept/Decline (functional)
- Active Jobs → View Details (popup + close)
- Completed Jobs → Click opens detail popup
- Edit Profile → Save changes MUST work
- Settings → Upload Documents (Active)
- Settings → Get Help (Active)  
- Settings → Change Password (Active)

#### 5. VERIFICATION & SIGNUP (ALL USER TYPES)
- Add fields: Address, Location (Map), Password, Confirm Password
- CNIC + Selfie Flow FIX:
  - Upload CNIC → Success
  - Capture Selfie → Success
  - Both uploaded → Verification success
  - ❌ NO repeated "Upload CNIC" error
- Add Video Upload option
- Replace Trust Badge with Trust Score everywhere

#### 6. ANIMATIONS
- Add smooth auto-scroll/carousel to dashboard images/cards (Tamasha-style)

#### 7. SEMANTIC SEARCH (GLOBAL)
- Partial name matching
- Skill type matching
- Location matching
- Trust score matching
- Results show ONLY relevant entities (no mixed data)

#### 8. MODALS & POPUPS
- ALL modals MUST have Close (✕) or Back button
- Profile view → Opens in popup with full details
- All save/update actions → MUST persist changes

### Files to Update:
1. ✓ /styles/globals.css - Color scheme updated
2. /components/ClientDashboard.tsx - Full rewrite
3. /components/ManufacturerDashboard.tsx - Full rewrite  
4. /components/LabourDashboard.tsx - Full rewrite
5. /components/EnhancedRegistrationForm.tsx - Fix verification flow
6. /components/ProfileModal.tsx - Add close button, colors
7. /components/ChatModal.tsx - Green colors
8. /components/EmailModal.tsx - Green colors
9. /components/NotificationsModal.tsx - Green colors
10. /components/SearchModal.tsx - Semantic search, colors
11. /components/OrderDetailsModal.tsx - Contact Manufacturers active
12. /components/AcceptOrderModal.tsx - Replace red with teal
13. /components/HireLabourModal.tsx - Update colors
14. /components/SettingsModal.tsx - Activate all options
15. /components/HorizontalProfiles.tsx - Animations + colors
16. /components/ProfileDetailModal.tsx - Trust Score display
17. /components/LandingPage.tsx - Update colors

### Testing Checklist:
- [ ] All buttons clickable and functional
- [ ] All modals open/close properly  
- [ ] All forms save changes
- [ ] Semantic search returns correct results
- [ ] No purple/blue/red colors anywhere
- [ ] Verification flow works without errors
- [ ] Profile popups have close buttons
- [ ] Animations smooth on dashboard
- [ ] Trust Score displayed (not Trust Badge)

