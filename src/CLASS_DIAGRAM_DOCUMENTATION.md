# SKILLORA PLATFORM - CLASS DIAGRAM DOCUMENTATION 📊

## Complete UML Class Diagram for Labour-Manufacture-Client Platform

**Status:** ✅ **COMPLETE**  
**Date:** December 24, 2024  
**Platform:** Skillora - Trust in Every Talent

---

## 📋 **Overview**

This document describes the complete **Object-Oriented Class Structure** of the Skillora platform. The class diagram includes all entities, relationships, enumerations, and methods required for the platform.

---

## 🏗️ **Architecture Summary**

### **Total Classes:** 13
### **Total Enumerations:** 6
### **Key Relationships:** Inheritance, Composition, Association

---

## 📦 **Class Categories**

### 1. **User Management** (4 classes)
- `User` (Base class)
- `Client` (extends User)
- `Manufacturer` (extends User)
- `Labour` (extends User)

### 2. **Verification System** (2 classes)
- `Verification`
- `Document`

### 3. **Order Management** (2 classes)
- `Order`
- `Bid`

### 4. **Payment System** (2 classes)
- `Payment`
- `EscrowPayment` (extends Payment)

### 5. **Communication** (2 classes)
- `Message`
- `Notification`

### 6. **Review System** (1 class)
- `Review`

---

## 🎨 **Class Diagrams**

### **Color Coding:**
- 🔵 **Blue** = Client
- 🔴 **Red** = Manufacturer
- 🟡 **Yellow** = Labour
- 🟢 **Green** = Payments
- 🟣 **Purple** = Documents
- 🟠 **Orange** = Communication

---

## 📝 **Detailed Class Descriptions**

---

## 1️⃣ **USER (Base Class)**

**Type:** Abstract Base Class  
**Purpose:** Common functionality for all platform users

### **Attributes:**
```typescript
- id: String
- email: String
- password: String
- phone: String
- role: UserRole
- state: UserState
- createdAt: Date
- updatedAt: Date
```

### **Methods:**
```typescript
+ login(): Boolean
+ logout(): void
+ updateProfile(data): void
+ changePassword(old, new): Boolean
```

### **Relationships:**
- **Inherits to:** Client, Manufacturer, Labour
- **Has one:** Verification
- **Sends/Receives:** Messages, Notifications

---

## 2️⃣ **CLIENT (extends User)**

**Purpose:** Customers who order products

### **Attributes:**
```typescript
- companyName: String
- address: String
- gstNumber: String (optional)
- documents: Document[]
- orders: Order[]
- verification: Verification
```

### **Methods:**
```typescript
+ createOrder(order): Order
+ viewManufacturers(filters): Manufacturer[]
+ submitVerificationDocuments(docs): void
+ makePayment(orderId, amount): Payment
```

### **Verification Requirements:**
- ✅ Company legal documents
- ✅ Previous order proofs
- ✅ GST registration (if applicable)

---

## 3️⃣ **MANUFACTURER (extends User)**

**Purpose:** Manufactures products and hires labour

### **Attributes:**
```typescript
- companyName: String
- address: String
- category: String
- affidavit: String
- ppcLawAccepted: Boolean
- documents: Document[]
- activeOrders: Order[]
- labourHired: Labour[]
- verification: Verification
- rating: Number
- reviewCount: Number
```

### **Methods:**
```typescript
+ bidOnOrder(order, amount): Bid
+ hireLabour(labour): void
+ submitAffidavit(affidavit): void
+ acceptPPCLaw(): void
+ submitVerificationDocuments(docs): void
+ updateOrderStatus(orderId, status): void
+ requestPaymentRelease(orderId): void
```

### **Verification Requirements:**
- ✅ Legal documents
- ✅ Affidavit
- ✅ PPC (Pakistan Penal Code) Law acceptance
- ✅ Business registration

---

## 4️⃣ **LABOUR (extends User)**

**Purpose:** Skilled workers hired by manufacturers

### **Attributes:**
```typescript
- name: String
- skills: String[]
- location: String
- hourlyRate: Number
- skillProofs: Document[]
- verification: Verification
- rating: Number
- reviewCount: Number
- availability: Boolean
```

### **Methods:**
```typescript
+ uploadSkillProof(photo, video): void
+ updateAvailability(available): void
+ setHourlyRate(rate): void
```

### **Verification Requirements:**
- ✅ Skill proof photos
- ✅ Skill proof videos
- ✅ Previous work samples

---

## 5️⃣ **VERIFICATION**

**Purpose:** Handles user verification process

### **Attributes:**
```typescript
- id: String
- userId: String
- userRole: UserRole
- status: VerificationStatus
- documents: Document[]
- submittedAt: Date
- reviewedAt: Date
- verifiedAt: Date
- rejectionReason: String
```

### **Methods:**
```typescript
+ submitDocuments(docs): void
+ approve(): void
+ reject(reason): void
+ isVerified(): Boolean
```

### **Status Flow:**
```
Pending → UnderReview → Verified/Rejected
```

---

## 6️⃣ **DOCUMENT**

**Purpose:** Stores verification documents

### **Attributes:**
```typescript
- id: String
- type: DocumentType
- title: String
- fileUrl: String
- videoUrl: String (optional)
- uploadedAt: Date
```

### **Document Types:**
- LegalDocument
- Affidavit
- PPCLaw
- SkillProof
- OrderProof

---

## 7️⃣ **ORDER**

**Purpose:** Client orders for products

### **Attributes:**
```typescript
- id: String
- clientId: String
- manufacturerId: String (optional)
- title: String
- description: String
- category: String
- quantity: Number
- budget: Number
- deadline: Date
- status: OrderStatus
- bids: Bid[]
- payment: Payment
- escrow: EscrowPayment
- createdAt: Date
- updatedAt: Date
```

### **Methods:**
```typescript
+ addBid(bid): void
+ acceptBid(bidId): void
+ updateStatus(status): void
+ createEscrowPayment(amount): EscrowPayment
+ completeOrder(): void
```

### **Order Lifecycle:**
```
Pending → Bidding → Active → InProgress → Completed
                  ↓
              Cancelled / Disputed
```

---

## 8️⃣ **BID**

**Purpose:** Manufacturer bids on orders

### **Attributes:**
```typescript
- id: String
- manufacturerId: String
- orderId: String
- amount: Number
- deliveryTime: Number (days)
- description: String
- accepted: Boolean
- createdAt: Date
```

### **Methods:**
```typescript
+ accept(): void
+ updateAmount(amount): void
```

---

## 9️⃣ **PAYMENT**

**Purpose:** Base payment class

### **Attributes:**
```typescript
- id: String
- userId: String
- orderId: String
- amount: Number
- status: PaymentStatus
- paidAt: Date
- createdAt: Date
```

### **Methods:**
```typescript
+ processPayment(): Boolean
+ refund(): void
```

---

## 🔟 **ESCROW PAYMENT** ⭐

**Purpose:** Escrow system (30% + 70% split)

### **Attributes:**
```typescript
- id: String
- orderId: String
- clientId: String
- manufacturerId: String
- totalAmount: Number
- upfrontAmount: Number (30%)
- finalAmount: Number (70%)
- upfrontPaid: Boolean
- finalPaid: Boolean
- upfrontReleasedAt: Date
- finalReleasedAt: Date
- status: PaymentStatus
- createdAt: Date
```

### **Methods:**
```typescript
+ releaseUpfrontPayment(): void
+ releaseFinalPayment(): void
+ getTotalPaid(): Number
+ getRemainingAmount(): Number
```

### **Payment Flow:**
```
1. Client creates escrow (100% locked)
2. Manufacturer receives 30% upfront
3. Work begins
4. Upon completion, 70% released
```

---

## 1️⃣1️⃣ **MESSAGE**

**Purpose:** Chat between users

### **Attributes:**
```typescript
- id: String
- senderId: String
- receiverId: String
- content: String
- attachments: String[]
- read: Boolean
- sentAt: Date
```

### **Methods:**
```typescript
+ markAsRead(): void
```

---

## 1️⃣2️⃣ **NOTIFICATION**

**Purpose:** System notifications

### **Attributes:**
```typescript
- id: String
- userId: String
- type: NotificationType
- title: String
- message: String
- read: Boolean
- link: String
- createdAt: Date
```

### **Methods:**
```typescript
+ markAsRead(): void
```

### **Notification Types:**
- 📦 Order (New bids, status updates)
- 💰 Payment (Transactions)
- 💬 Message (New messages)
- ⚙️ System (Updates)
- ✅ Verification (Status changes)

---

## 1️⃣3️⃣ **REVIEW**

**Purpose:** Ratings and reviews

### **Attributes:**
```typescript
- id: String
- orderId: String
- reviewerId: String
- reviewedUserId: String
- rating: Number (1-5)
- comment: String
- createdAt: Date
```

---

## 📊 **ENUMERATIONS**

### 1️⃣ **UserRole**
```typescript
enum UserRole {
  Client,
  Manufacturer,
  Labour
}
```

### 2️⃣ **UserState**
```typescript
enum UserState {
  New,
  Active,
  Suspended,
  Blocked,
  Verified
}
```

### 3️⃣ **VerificationStatus**
```typescript
enum VerificationStatus {
  Pending,
  UnderReview,
  Verified,
  Rejected
}
```

### 4️⃣ **OrderStatus**
```typescript
enum OrderStatus {
  Pending,
  Bidding,
  Active,
  InProgress,
  Completed,
  Cancelled,
  Disputed
}
```

### 5️⃣ **PaymentStatus**
```typescript
enum PaymentStatus {
  Pending,
  PartialPaid,
  Escrowed,
  Released,
  Refunded,
  Completed
}
```

### 6️⃣ **NotificationType**
```typescript
enum NotificationType {
  Order,
  Payment,
  Message,
  System,
  Verification
}
```

---

## 🔗 **Relationships**

### **Inheritance (IS-A)**
```
User ──▷ Client
User ──▷ Manufacturer
User ──▷ Labour
Payment ──▷ EscrowPayment
```

### **Composition (HAS-A, Strong)**
```
Order ◆── Bid (0..*)
Order ◆── Payment (0..1)
Verification ◆── Document (1..*)
```

### **Association (USES)**
```
Client ──→ Order (creates, 1..*)
Manufacturer ──→ Order (bids on, 0..*)
Manufacturer ──→ Labour (hires, 0..*)
User ──→ Message (sends/receives)
User ──→ Notification (receives)
Order ──→ Review (has, 0..*)
```

---

## 🎯 **Key Platform Features**

### 1️⃣ **Triple Verification System**

| User Type | Verification Method |
|-----------|---------------------|
| **Client** | Orders + Legal Documents |
| **Manufacturer** | Affidavit + PPC Law + Legal Docs |
| **Labour** | Skill Photos/Videos |

### 2️⃣ **Escrow Payment (30-70 Split)**

```
Order Accepted
     ↓
Client pays 100% to Escrow
     ↓
30% released to Manufacturer (upfront)
     ↓
Manufacturer starts work
     ↓
Order completed
     ↓
70% released to Manufacturer
```

### 3️⃣ **Order Bidding System**

```
Client posts order
     ↓
Manufacturers submit bids
     ↓
Client reviews & accepts best bid
     ↓
Escrow payment created
     ↓
Work begins
```

---

## 📁 **Files Generated**

1. **`/skillora-classes.ts`** - Complete TypeScript class definitions
2. **`/components/ClassDiagram.tsx`** - Visual UML diagram component
3. **`/CLASS_DIAGRAM_DOCUMENTATION.md`** - This documentation

---

## 🚀 **How to View**

### **Option 1: Web Interface**
1. Open app in browser
2. Click **purple FileCode icon** (bottom right)
3. View interactive class diagram

### **Option 2: Code Review**
1. Open `/skillora-classes.ts`
2. Review all class definitions
3. See methods, attributes, and relationships

### **Option 3: Documentation**
1. Read this file (`/CLASS_DIAGRAM_DOCUMENTATION.md`)
2. Understand each class in detail

---

## 💡 **Usage Examples**

### **Example 1: Client Creates Order**
```typescript
// Client creates order
const client = new Client('C001', 'abc@company.com', '***', '03001234567', 'ABC Ltd', 'Karachi');
const order = new Order('C001', 'Textile Order', '1000 pieces', 'Textile', 1000, 500000, new Date());
client.createOrder(order);

// Manufacturer bids
const manufacturer = new Manufacturer('M001', 'xyz@factory.com', '***', '03009876543', 'XYZ Factory', 'Faisalabad', 'Textile');
const bid = manufacturer.bidOnOrder(order, 480000);

// Client accepts bid
order.acceptBid(bid.id);

// Escrow payment created
const escrow = order.createEscrowPayment(480000);
// upfrontAmount = 144,000 (30%)
// finalAmount = 336,000 (70%)

// Release upfront
escrow.releaseUpfrontPayment(); // Manufacturer gets PKR 144,000

// Complete order
order.completeOrder();
escrow.releaseFinalPayment(); // Manufacturer gets PKR 336,000
```

### **Example 2: Labour Verification**
```typescript
const labour = new Labour('L001', 'worker@gmail.com', '***', '03001111111', 'Ali Raza', ['Welding', 'Fabrication'], 'Lahore', 550);

// Upload skill proofs
labour.uploadSkillProof('photo1.jpg', 'video1.mp4');
labour.uploadSkillProof('photo2.jpg', 'video2.mp4');

// Submit for verification
labour.verification.submitDocuments(labour.skillProofs);

// Admin approves
labour.verification.approve();

// Check status
if (labour.verification.isVerified()) {
  console.log('Labour is verified!');
}
```

### **Example 3: Manufacturer Hires Labour**
```typescript
const manufacturer = new Manufacturer(...);
const labour = new Labour(...);

// Manufacturer hires labour
manufacturer.hireLabour(labour);

// Labour in manufacturer's team
console.log(manufacturer.labourHired); // [labour]
```

---

## 🎨 **Design Patterns Used**

1. **Inheritance** - User base class
2. **Composition** - Order has Bids, Payments
3. **Encapsulation** - Private attributes, public methods
4. **State Pattern** - Order/Payment status transitions
5. **Strategy Pattern** - Different verification strategies per user type

---

## 📈 **Statistics**

| Metric | Count |
|--------|-------|
| Total Classes | 13 |
| Total Enums | 6 |
| Base Classes | 2 (User, Payment) |
| Inheritance Relationships | 4 |
| Composition Relationships | 3 |
| Association Relationships | 7 |
| Total Attributes | 120+ |
| Total Methods | 50+ |

---

## ✅ **Validation**

### **All Features Covered:**
- ✅ User management (3 types)
- ✅ Verification system (role-specific)
- ✅ Order creation & bidding
- ✅ Escrow payment (30-70 split)
- ✅ Labour hiring
- ✅ Messaging
- ✅ Notifications
- ✅ Reviews & ratings
- ✅ Document management

---

## 🔥 **Next Steps**

1. **Database Schema** - Convert classes to database tables
2. **API Design** - Create RESTful endpoints
3. **State Management** - Implement Redux/Context
4. **Testing** - Unit tests for each class
5. **Deployment** - Deploy to production

---

**Platform:** Skillora ✨  
**Tagline:** Trust in Every Talent  
**Theme:** Complete BLACK (#000000) with red accents (#DC2626)  
**Status:** CLASS DIAGRAM COMPLETE 🎉
