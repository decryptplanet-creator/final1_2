# SKILLORA PLATFORM - DFD Level 1

## Overview
Level 0 ke single process ko multiple main processes mein break down kiya gaya hai.

---

## Complete Diagram

```
                           ┌─────────────┐
                           │   CLIENT    │
                           └──────┬──────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌──────────────┐  ┌──────────┐  ┌──────────────┐
            │   1.0        │  │   2.0    │  │     3.0      │
            │USER REGISTER │  │  ORDER   │  │   PAYMENT    │
            │& VERIFICATION│  │MANAGEMENT│  │  MANAGEMENT  │
            └──────┬───────┘  └────┬─────┘  └──────┬───────┘
                   │               │                │
                   ▼               ▼                ▼
            ┌──────────────┐  ┌──────────┐  ┌──────────────┐
            │      D1      │  │    D2    │  │      D3      │
            │ USER_DATABASE│  │ORDER_DB  │  │  PAYMENT_DB  │
            └──────────────┘  └──────────┘  └──────────────┘
                   │               │                │
                   │               │                │
         ┌─────────┼───────────────┼────────────────┼─────────┐
         │         │               │                │         │
         ▼         ▼               ▼                ▼         ▼
   ┌──────────┐ ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐
   │   4.0    │ │   5.0    │  │   6.0    │  │   7.0    │ │   8.0    │
   │MESSAGING │ │  LABOUR  │  │ DOCUMENT │  │  REVIEW  │ │DASHBOARD │
   │  SYSTEM  │ │  HIRING  │  │VERIFICATION│ │  SYSTEM  │ │ SYSTEM   │
   └────┬─────┘ └────┬─────┘  └────┬─────┘  └────┬─────┘ └────┬─────┘
        │            │             │             │            │
        ▼            ▼             ▼             ▼            ▼
   ┌──────────┐ ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐
   │    D4    │ │    D5    │  │    D6    │  │    D7    │ │    D8    │
   │MESSAGE_DB│ │LABOUR_DB │  │DOCUMENT_│  │ REVIEW_DB│ │ACTIVITY_│
   │          │ │          │  │  DB      │  │          │ │   DB     │
   └──────────┘ └──────────┘  └──────────┘  └──────────┘ └──────────┘
         │            │             │             │            │
         │            │             │             │            │
         └────────────┴─────────────┴─────────────┴────────────┘
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
                      ▼                           ▼
               ┌──────────────┐          ┌──────────────┐
               │MANUFACTURER  │          │   LABOUR     │
               └──────────────┘          └──────────────┘
                      │                           │
                      └───────────┬───────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ PAYMENT SYSTEM  │
                         │    (ESCROW)     │
                         └─────────────────┘
```

---

## PROCESSES (Main Functions)

### **Process 1.0: USER REGISTRATION & VERIFICATION**
**Description:** Sabhi users (Client, Manufacturer, Labour) ka registration aur verification

**Input Data Flows:**
- Registration Form Data (from external entities)
- CNIC Images
- Business Documents (from Client)
- Legal Documents + Affidavit + PPC Law docs (from Manufacturer)
- Skill Photos/Videos (from Labour)

**Output Data Flows:**
- Verification Status (Approved/Rejected/Pending)
- User Credentials (Login access)
- Profile Data

**Data Stores:**
- D1: USER_DATABASE (Read/Write)
- D6: DOCUMENT_DATABASE (Write)

**Process Details:**
- Validate CNIC
- Check business registration
- Verify manufacturer legal compliance
- Review labour skill videos/photos
- Generate verification badges

---

### **Process 2.0: ORDER MANAGEMENT**
**Description:** Order creation, bidding, acceptance, tracking, completion

**Input Data Flows:**
- Order Details (from Client)
- Order Acceptance (from Manufacturer)
- Order Status Updates (from Manufacturer)
- Order Search/Filter criteria (from all users)

**Output Data Flows:**
- Order Listings (to Client/Manufacturer)
- Order Status Notifications
- Order Completion Confirmation
- Order History

**Data Stores:**
- D2: ORDER_DATABASE (Read/Write)
- D1: USER_DATABASE (Read - for user verification)

**Process Details:**
- Create new order
- Match orders with manufacturers
- Track order progress
- Update order status
- Mark order complete

---

### **Process 3.0: PAYMENT MANAGEMENT (ESCROW)**
**Description:** Payment processing with 30-70 escrow split

**Input Data Flows:**
- Payment Information (from Client)
- Order Completion Status (from Process 2.0)
- Payment Withdrawal Request (from Manufacturer)

**Output Data Flows:**
- Payment Confirmation (to Client)
- 30% Upfront Payment (to Manufacturer)
- 70% Completion Payment (to Manufacturer)
- Transaction Receipts (to all parties)
- Payment Status Notifications

**Data Stores:**
- D3: PAYMENT_DATABASE (Read/Write)
- D2: ORDER_DATABASE (Read - for order validation)
- D1: USER_DATABASE (Read - for user details)

**External Interactions:**
- Payment Gateway API (Escrow System)

**Process Details:**
- Hold payment in escrow
- Release 30% on order acceptance
- Hold 70% until completion
- Process refunds if needed
- Generate payment receipts

---

### **Process 4.0: MESSAGING SYSTEM**
**Description:** Real-time communication between users

**Input Data Flows:**
- Messages (from Client/Manufacturer/Labour)
- Chat Initiation Requests
- File Attachments

**Output Data Flows:**
- Message Delivery
- Read Receipts
- Notifications (New message alerts)
- Chat History

**Data Stores:**
- D4: MESSAGE_DATABASE (Read/Write)
- D1: USER_DATABASE (Read - for sender/receiver info)

**Process Details:**
- Send/receive messages
- Store chat history
- Real-time notifications
- File attachment support
- Message status tracking

---

### **Process 5.0: LABOUR HIRING SYSTEM**
**Description:** Manufacturers hire skilled labour

**Input Data Flows:**
- Labour Search Criteria (from Manufacturer)
- Hiring Request (from Manufacturer)
- Job Application (from Labour)
- Labour Availability Status (from Labour)

**Output Data Flows:**
- Labour Listings (to Manufacturer)
- Hiring Confirmation (to Labour)
- Job Opportunities (to Labour)
- Hiring Notifications

**Data Stores:**
- D5: LABOUR_DATABASE (Read/Write)
- D1: USER_DATABASE (Read)

**Process Details:**
- Search labour by skills
- Filter by rating/location
- Send hiring requests
- Accept/reject applications
- Track hired labour

---

### **Process 6.0: DOCUMENT VERIFICATION**
**Description:** Verify all uploaded documents

**Input Data Flows:**
- Document Uploads (CNIC, Business docs, Legal docs, Affidavit)
- Verification Requests

**Output Data Flows:**
- Verification Status (Approved/Rejected)
- Document Status Notifications
- Verification Badges

**Data Stores:**
- D6: DOCUMENT_DATABASE (Read/Write)
- D1: USER_DATABASE (Write - update verification status)

**Process Details:**
- Scan documents for authenticity
- Check legal compliance (PPC Law for manufacturers)
- Validate CNIC
- Review affidavits
- Issue verification badges

---

### **Process 7.0: REVIEW & RATING SYSTEM**
**Description:** User reviews and ratings

**Input Data Flows:**
- Review Text (from Client/Manufacturer)
- Star Rating (1-5)
- Review Photos (optional)

**Output Data Flows:**
- Review Display (on profiles)
- Average Rating Calculation
- Review Notifications

**Data Stores:**
- D7: REVIEW_DATABASE (Read/Write)
- D1: USER_DATABASE (Read/Write - update ratings)

**Process Details:**
- Submit reviews
- Calculate average ratings
- Display on user profiles
- Filter inappropriate content
- Track review history

---

### **Process 8.0: DASHBOARD SYSTEM**
**Description:** Personalized dashboards for each user type

**Input Data Flows:**
- User Activity Data
- User Type (Client/Manufacturer/Labour)
- Filter/Sort Preferences

**Output Data Flows:**
- Dashboard Data (stats, charts, recent activity)
- Notifications
- Quick Action Buttons
- Analytics

**Data Stores:**
- D8: ACTIVITY_DATABASE (Read/Write)
- D1: USER_DATABASE (Read)
- D2: ORDER_DATABASE (Read)
- D3: PAYMENT_DATABASE (Read)
- D7: REVIEW_DATABASE (Read)

**Process Details:**
- Display user-specific data
- Show order statistics
- Payment history
- Recent messages
- Notifications panel

---

## DATA STORES

### **D1: USER_DATABASE**
**Stores:**
- User ID, Name, Email, Phone
- CNIC, Address
- User Type (Client/Manufacturer/Labour)
- Verification Status
- Profile Image
- Rating & Reviews Count
- Created Date

### **D2: ORDER_DATABASE**
**Stores:**
- Order ID
- Client ID
- Manufacturer ID (if accepted)
- Order Title, Description
- Quantity, Budget, Deadline
- Order Status (Pending/Active/Completed)
- Creation Date, Completion Date

### **D3: PAYMENT_DATABASE**
**Stores:**
- Payment ID
- Order ID
- Client ID, Manufacturer ID
- Total Amount
- 30% Upfront Amount
- 70% Completion Amount
- Payment Status
- Transaction Date
- Escrow Status

### **D4: MESSAGE_DATABASE**
**Stores:**
- Message ID
- Sender ID, Receiver ID
- Message Text
- File Attachments
- Timestamp
- Read Status

### **D5: LABOUR_DATABASE**
**Stores:**
- Labour ID
- Skills (Array)
- Skill Videos/Photos
- Availability Status
- Hired By (Manufacturer ID)
- Rate per Day
- Location

### **D6: DOCUMENT_DATABASE**
**Stores:**
- Document ID
- User ID
- Document Type (CNIC/Business/Legal/Affidavit)
- File Path
- Verification Status
- Upload Date
- Verified By (Admin ID)

### **D7: REVIEW_DATABASE**
**Stores:**
- Review ID
- Reviewer ID
- Reviewed User ID
- Order ID
- Star Rating (1-5)
- Review Text
- Review Date

### **D8: ACTIVITY_DATABASE**
**Stores:**
- Activity ID
- User ID
- Activity Type (Order Created, Payment Made, etc.)
- Timestamp
- Activity Details

---

## EXTERNAL ENTITIES

1. **CLIENT** - Interacts with: 1.0, 2.0, 3.0, 4.0, 7.0, 8.0
2. **MANUFACTURER** - Interacts with: 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0
3. **LABOUR** - Interacts with: 1.0, 4.0, 5.0, 8.0
4. **PAYMENT SYSTEM (ESCROW)** - Interacts with: 3.0

---

## DATA FLOW SUMMARY

**Total Processes:** 8 main processes  
**Total Data Stores:** 8 databases  
**External Entities:** 4  

**Key Integration Points:**
- All processes access D1 (USER_DATABASE) for user verification
- Order Management (2.0) feeds into Payment (3.0)
- Document Verification (6.0) updates User Database (D1)
- Reviews (7.0) update user ratings in D1
- Dashboard (8.0) reads from multiple data stores

---

**Platform:** Skillora - Trust in Every Talent ✨
