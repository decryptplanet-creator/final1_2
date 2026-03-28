# SKILLORA PLATFORM - DFD Level 2

## Process Selected for Detailed Breakdown:
**Process 2.0: ORDER MANAGEMENT** (Most critical process)

---

## Why Process 2.0?
- Core business functionality
- Involves all three user types
- Integrates with payment system
- Most complex workflow
- Critical for platform success

---

## Complete DFD Level 2 Diagram

```
                         ┌─────────────┐
                         │   CLIENT    │
                         └──────┬──────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │    2.1       │ │     2.2      │ │     2.3      │
        │CREATE ORDER  │ │SEARCH ORDERS │ │  VIEW ORDER  │
        │              │ │  & FILTER    │ │   DETAILS    │
        └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
               │                │                │
               │                │                │
               ▼                ▼                ▼
        ┌──────────────────────────────────────────────┐
        │           D2: ORDER_DATABASE                 │
        │  - Order Details  - Status  - Bids           │
        └──────────────┬───────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │   2.4    │  │   2.5    │  │   2.6    │
   │  PLACE   │  │  ACCEPT  │  │  TRACK   │
   │   BID    │  │  ORDER   │  │  ORDER   │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │             │             │
        │             │             │
        ▼             ▼             ▼
   ┌─────────────────────────────────────┐
   │     D2: ORDER_DATABASE              │
   │  Update Bids / Status / Progress    │
   └──────────┬──────────────────────────┘
              │
              │
     ┌────────┼────────┐
     │        │        │
     ▼        ▼        ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   2.7    │ │   2.8    │ │   2.9    │
│ UPDATE   │ │ COMPLETE │ │  CANCEL  │
│ PROGRESS │ │  ORDER   │ │  ORDER   │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     │            │            │
     ▼            ▼            ▼
┌──────────────────────────────────────┐
│   D2: ORDER_DATABASE                 │
│   Final Status Updates               │
└──────────────┬───────────────────────┘
               │
               │
               ▼
      ┌─────────────────┐
      │   MANUFACTURER  │
      └─────────────────┘
               │
               │
               ▼
      ┌─────────────────┐
      │  PROCESS 3.0    │
      │  (PAYMENT)      │
      └─────────────────┘
```

---

## SUB-PROCESSES (Detailed Breakdown)

### **Process 2.1: CREATE ORDER**

**Description:** Client creates new manufacturing order

**Input Data Flows:**
- Order Form Data (from Client)
  - Product Title
  - Product Description
  - Product Category
  - Quantity Required
  - Budget/Price Range
  - Deadline/Due Date
  - Product Specifications
  - Reference Images (optional)
  - Delivery Location
  
**Processing Steps:**
1. Validate client verification status
2. Check if all required fields are filled
3. Validate budget range (minimum threshold)
4. Validate deadline (future date)
5. Generate unique Order ID
6. Set initial order status as "PENDING"
7. Add timestamp (created date)
8. Upload reference images (if any)

**Output Data Flows:**
- Order Confirmation (to Client)
- Order ID
- Order Creation Notification
- Updated Order List

**Data Stores:**
- **WRITE** to D2: ORDER_DATABASE
  - Save complete order details
  - Store with status = "PENDING"
  
- **READ** from D1: USER_DATABASE
  - Verify client is verified
  - Get client details

**Validation Rules:**
- Client must be verified
- Budget must be > ₹0
- Deadline must be at least 7 days from today
- All mandatory fields must be filled

---

### **Process 2.2: SEARCH ORDERS & FILTER**

**Description:** Manufacturers search available orders

**Input Data Flows:**
- Search Query (from Manufacturer)
- Filter Criteria:
  - Product Category
  - Budget Range
  - Deadline
  - Location
  - Order Status
- Sort Preferences (Date, Budget, Deadline)

**Processing Steps:**
1. Verify manufacturer verification status
2. Apply search query on order titles/descriptions
3. Apply filter criteria
4. Sort results based on preference
5. Paginate results (10 orders per page)
6. Calculate match percentage (if applicable)
7. Highlight new orders

**Output Data Flows:**
- Filtered Order List (to Manufacturer)
- Total Results Count
- Filter Summary
- Suggested Orders (based on past work)

**Data Stores:**
- **READ** from D2: ORDER_DATABASE
  - Get all pending orders
  - Apply filters
  
- **READ** from D1: USER_DATABASE
  - Verify manufacturer status
  - Get manufacturer preferences

**Search Filters:**
- Category: Textile, Electronics, Furniture, etc.
- Budget: Min-Max range
- Deadline: Next 7 days, 30 days, etc.
- Status: Pending, Active, All

---

### **Process 2.3: VIEW ORDER DETAILS**

**Description:** View complete details of a specific order

**Input Data Flows:**
- Order ID (from Client/Manufacturer)
- User Type (who is viewing)

**Processing Steps:**
1. Verify user has permission to view
2. Fetch complete order details
3. Fetch client information
4. Load reference images/documents
5. Check if user has already bid (for manufacturers)
6. Calculate time remaining until deadline
7. Load bid history (if any)

**Output Data Flows:**
- Complete Order Details
  - Product Title & Description
  - Quantity, Budget, Deadline
  - Client Information (Name, Rating)
  - Reference Images
  - Current Bids Count
  - Order Status
  - Time Remaining
  
**Data Stores:**
- **READ** from D2: ORDER_DATABASE
  - Get order details by Order ID
  - Get bid information
  
- **READ** from D1: USER_DATABASE
  - Get client profile info
  - Get manufacturer info (if viewing bids)

**Display Rules:**
- Show client contact only if order is accepted
- Show bid details only to order owner
- Highlight "Accepted" manufacturer

---

### **Process 2.4: PLACE BID**

**Description:** Manufacturer bids on client order

**Input Data Flows:**
- Order ID (from Process 2.3)
- Bid Details (from Manufacturer):
  - Quoted Price
  - Estimated Completion Time
  - Brief Proposal/Message
  - Sample Work (optional)
  - Terms & Conditions

**Processing Steps:**
1. Verify manufacturer is verified
2. Check if order is still "PENDING"
3. Validate bid amount (within budget range)
4. Check if manufacturer already bid
5. Save bid information
6. Update order's bid count
7. Generate notification to client

**Output Data Flows:**
- Bid Confirmation (to Manufacturer)
- Bid Notification (to Client)
- Updated Order Details (with new bid)

**Data Stores:**
- **WRITE** to D2: ORDER_DATABASE
  - Add bid to order's bid list
  - Update bid count
  
- **READ** from D1: USER_DATABASE
  - Get manufacturer details
  - Verify manufacturer status

**Validation Rules:**
- Only verified manufacturers can bid
- Bid amount must be reasonable
- One manufacturer = One bid per order
- Order status must be "PENDING"

---

### **Process 2.5: ACCEPT ORDER**

**Description:** Client accepts a manufacturer's bid

**Input Data Flows:**
- Order ID (from Client)
- Selected Bid/Manufacturer ID
- Acceptance Confirmation

**Processing Steps:**
1. Verify client owns this order
2. Verify selected manufacturer's bid exists
3. Change order status: "PENDING" → "ACTIVE"
4. Assign manufacturer to order
5. Lock the order (no more bids accepted)
6. Set acceptance date
7. Trigger 30% payment process
8. Send notifications to manufacturer
9. Notify other bidders (order taken)

**Output Data Flows:**
- Order Acceptance Confirmation (to Client)
- Order Assignment Notification (to Manufacturer)
- Payment Trigger (to Process 3.0 - Payment)
- Rejection Notification (to other bidders)

**Data Stores:**
- **WRITE** to D2: ORDER_DATABASE
  - Update status to "ACTIVE"
  - Set assigned_manufacturer_id
  - Set acceptance_date
  
- **READ/WRITE** to D3: PAYMENT_DATABASE
  - Initiate 30% payment

**Integration Points:**
- **Process 3.0 (Payment Management)**
  - Trigger 30% escrow payment release
  
- **Process 4.0 (Messaging)**
  - Create direct chat between client & manufacturer

---

### **Process 2.6: TRACK ORDER**

**Description:** Monitor order progress

**Input Data Flows:**
- Order ID (from Client/Manufacturer)
- User Type

**Processing Steps:**
1. Verify user is associated with order
2. Fetch current order status
3. Get progress updates timeline
4. Calculate percentage completion
5. Show milestone achievements
6. Display expected completion date
7. Show payment status (30% released, 70% pending)

**Output Data Flows:**
- Order Progress Details
  - Current Status
  - Progress Percentage
  - Timeline/Milestones
  - Last Updated timestamp
  - Next Action Required
  - Payment Status
  
**Data Stores:**
- **READ** from D2: ORDER_DATABASE
  - Get order status
  - Get progress updates
  
- **READ** from D3: PAYMENT_DATABASE
  - Get payment status

**Status Timeline:**
1. ORDER CREATED ✓
2. BID ACCEPTED ✓
3. 30% PAYMENT RELEASED ✓
4. PRODUCTION STARTED → (Current)
5. PRODUCTION IN PROGRESS
6. QUALITY CHECK
7. ORDER COMPLETED
8. 70% PAYMENT RELEASED

---

### **Process 2.7: UPDATE PROGRESS**

**Description:** Manufacturer updates order progress

**Input Data Flows:**
- Order ID (from Manufacturer)
- Progress Update:
  - Status Message
  - Percentage Complete (0-100%)
  - Update Photos/Videos
  - Milestone Achieved
  - Issues/Delays (if any)

**Processing Steps:**
1. Verify manufacturer is assigned to this order
2. Validate progress percentage (can't decrease)
3. Upload progress photos/videos
4. Update progress timeline
5. Set last_updated timestamp
6. Send notification to client
7. Log activity

**Output Data Flows:**
- Progress Update Confirmation (to Manufacturer)
- Progress Notification (to Client)
- Updated Order Timeline

**Data Stores:**
- **WRITE** to D2: ORDER_DATABASE
  - Update progress_percentage
  - Add progress update to timeline
  - Update last_updated timestamp
  
- **WRITE** to D8: ACTIVITY_DATABASE
  - Log progress update activity

**Progress Milestones:**
- 25% - Materials Procured
- 50% - Production Started
- 75% - Quality Check
- 100% - Order Complete

---

### **Process 2.8: COMPLETE ORDER**

**Description:** Mark order as completed

**Input Data Flows:**
- Order ID (from Manufacturer)
- Completion Details:
  - Final Product Photos/Videos
  - Completion Certificate
  - Delivery Confirmation
  - Final Report

**Processing Steps:**
1. Verify order progress is 100%
2. Verify manufacturer is assigned
3. Change status: "ACTIVE" → "COMPLETED"
4. Set completion_date
5. Upload final product media
6. Trigger 70% payment release
7. Send completion notification to client
8. Enable review/rating system
9. Update manufacturer's completed orders count

**Output Data Flows:**
- Completion Confirmation (to Manufacturer)
- Completion Notification (to Client)
- Payment Release Trigger (70% to Process 3.0)
- Review Request (to Client)

**Data Stores:**
- **WRITE** to D2: ORDER_DATABASE
  - Update status to "COMPLETED"
  - Set completion_date
  - Store final product media
  
- **WRITE** to D3: PAYMENT_DATABASE
  - Trigger 70% payment release
  
- **WRITE** to D1: USER_DATABASE
  - Increment manufacturer's completed_orders count

**Integration Points:**
- **Process 3.0 (Payment Management)**
  - Release remaining 70% payment from escrow
  
- **Process 7.0 (Review System)**
  - Enable client to review manufacturer

**Post-Completion:**
- Client can download invoice
- Both parties can leave reviews
- Order archived after 30 days

---

### **Process 2.9: CANCEL ORDER**

**Description:** Cancel order (with conditions)

**Input Data Flows:**
- Order ID (from Client/Manufacturer)
- Cancellation Reason
- Cancellation Type (Client/Manufacturer/Mutual)

**Processing Steps:**
1. Verify user has permission to cancel
2. Check order status (can't cancel completed orders)
3. Determine refund amount based on progress:
   - If PENDING: Full refund
   - If ACTIVE (0-25%): 90% refund
   - If ACTIVE (25-50%): 70% refund
   - If ACTIVE (50-75%): 50% refund
   - If ACTIVE (>75%): No refund, must complete
4. Change status to "CANCELLED"
5. Process refund (if applicable)
6. Send notifications
7. Log cancellation reason

**Output Data Flows:**
- Cancellation Confirmation
- Refund Details (to Client)
- Cancellation Notification (to other party)
- Refund Processing (to Process 3.0)

**Data Stores:**
- **WRITE** to D2: ORDER_DATABASE
  - Update status to "CANCELLED"
  - Set cancellation_date
  - Store cancellation_reason
  
- **WRITE** to D3: PAYMENT_DATABASE
  - Process refund based on progress
  
- **WRITE** to D8: ACTIVITY_DATABASE
  - Log cancellation activity

**Cancellation Rules:**
- Client can cancel if order is PENDING (full refund)
- Client can request cancellation if <50% complete
- Manufacturer can decline order within 24 hours
- Mutual agreement needed if >50% complete
- Cancellation fee may apply

**Refund Timeline:**
- Refund initiated immediately
- Funds return in 5-7 business days
- Deduct platform fee (if applicable)

---

## DATA FLOWS BETWEEN SUB-PROCESSES

```
2.1 (Create) → D2 → 2.2 (Search) → 2.3 (View Details)
                ↓
2.4 (Place Bid) → D2 → 2.5 (Accept Order)
                          ↓
                    2.6 (Track) ← 2.7 (Update Progress)
                          ↓
                    2.8 (Complete) → Process 3.0 (Payment)
                          ↓
                    Process 7.0 (Reviews)

Alternative Flow:
2.1/2.5/2.6 → 2.9 (Cancel) → Process 3.0 (Refund)
```

---

## DATA STORES USED

### **D2: ORDER_DATABASE (Primary)**

**Fields Used:**
- order_id (Primary Key)
- client_id (Foreign Key → D1)
- manufacturer_id (Foreign Key → D1, null if pending)
- order_title
- order_description
- product_category
- quantity
- budget_min, budget_max
- deadline
- order_status (PENDING/ACTIVE/COMPLETED/CANCELLED)
- created_date
- acceptance_date
- completion_date
- cancellation_date
- progress_percentage (0-100)
- bids[] (Array of bid objects)
- progress_timeline[] (Array of updates)
- reference_images[]
- final_product_media[]

### **D1: USER_DATABASE (Reference)**
- Used for verification checks
- Client/Manufacturer profile info

### **D3: PAYMENT_DATABASE (Integration)**
- Payment status tracking
- Escrow management

### **D8: ACTIVITY_DATABASE (Logging)**
- Activity logging
- Audit trail

---

## EXTERNAL INTERACTIONS

### **Client:**
- Interacts with: 2.1, 2.3, 2.5, 2.6, 2.9
- Can create orders, view details, accept bids, track progress, cancel

### **Manufacturer:**
- Interacts with: 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9
- Can search orders, place bids, track, update progress, mark complete

### **Process 3.0 (Payment):**
- Triggered by: 2.5 (30% payment), 2.8 (70% payment), 2.9 (Refund)

### **Process 4.0 (Messaging):**
- Enabled after: 2.5 (Order acceptance)

### **Process 7.0 (Reviews):**
- Enabled after: 2.8 (Order completion)

---

## VALIDATION & BUSINESS RULES

### **Order Creation Rules:**
- Minimum budget: ₹1,000
- Minimum deadline: 7 days
- Maximum 5 reference images
- Client must be verified

### **Bidding Rules:**
- Manufacturer must be verified
- One bid per manufacturer per order
- Bid amount within budget range ±20%
- Can update bid before acceptance

### **Progress Rules:**
- Only assigned manufacturer can update
- Progress can't decrease
- Must upload proof at milestones
- Client notified on each update

### **Completion Rules:**
- Must be at 100% progress
- Final media upload mandatory
- Client has 7 days to dispute
- Auto-complete after 7 days if no dispute

### **Cancellation Rules:**
- Full refund if PENDING
- Partial refund based on progress
- No refund if >75% complete
- Dispute resolution if disagreement

---

## NOTIFICATIONS GENERATED

1. **Order Created** → Notify all manufacturers
2. **New Bid Received** → Notify client
3. **Order Accepted** → Notify manufacturer + other bidders
4. **30% Payment Released** → Notify manufacturer
5. **Progress Updated** → Notify client
6. **Order Completed** → Notify client
7. **70% Payment Released** → Notify manufacturer
8. **Order Cancelled** → Notify both parties
9. **Refund Processed** → Notify client

---

## ERROR HANDLING

- **Invalid Order Data** → Return validation errors
- **Unauthorized Access** → Deny with error message
- **Duplicate Bid** → Update existing bid instead
- **Payment Failure** → Notify parties, hold order
- **System Error** → Log error, notify admin

---

**Total Sub-Processes:** 9  
**Data Stores Used:** 4 (D1, D2, D3, D8)  
**External Processes Integrated:** 2 (Process 3.0, 7.0)  

**Platform:** Skillora - Trust in Every Talent ✨
