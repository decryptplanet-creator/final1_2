# SKILLORA - QUICK CLASS REFERENCE 🚀

## One-Page Class Diagram Cheat Sheet

---

## 👥 **USER HIERARCHY**

```
          User (Base)
            ├── Client
            ├── Manufacturer
            └── Labour
```

---

## 📋 **ALL CLASSES AT A GLANCE**

### **Core Users (4)**
1. `User` - Base class
2. `Client` - Orders products
3. `Manufacturer` - Makes products, hires labour
4. `Labour` - Skilled workers

### **Verification (2)**
5. `Verification` - Verification process
6. `Document` - Uploaded documents

### **Orders (2)**
7. `Order` - Client orders
8. `Bid` - Manufacturer bids

### **Payments (2)**
9. `Payment` - Base payment
10. `EscrowPayment` - 30-70 split

### **Communication (2)**
11. `Message` - Chat messages
12. `Notification` - System notifications

### **Reviews (1)**
13. `Review` - Ratings & reviews

---

## 🎯 **QUICK ATTRIBUTES**

### **User**
```
id, email, password, phone, role, state
```

### **Client**
```
User + companyName, address, orders[]
```

### **Manufacturer**
```
User + companyName, category, affidavit, ppcLaw, labourHired[], rating
```

### **Labour**
```
User + name, skills[], hourlyRate, location, rating
```

### **Order**
```
id, clientId, manufacturerId, title, quantity, budget, status, bids[]
```

### **EscrowPayment** ⭐
```
totalAmount, upfrontAmount(30%), finalAmount(70%), upfrontPaid, finalPaid
```

---

## 🔄 **KEY FLOWS**

### **Order Flow**
```
Client creates → Manufacturers bid → Client accepts → Escrow → Work → Complete
```

### **Payment Flow**
```
100% to Escrow → 30% to Manufacturer → Work → 70% to Manufacturer
```

### **Verification Flow**
```
Submit docs → Under Review → Verified/Rejected
```

---

## 📊 **ENUMERATIONS**

```typescript
UserRole: Client | Manufacturer | Labour
UserState: New | Active | Suspended | Blocked | Verified
OrderStatus: Pending | Bidding | Active | InProgress | Completed | Cancelled
PaymentStatus: Pending | PartialPaid | Escrowed | Released | Completed
VerificationStatus: Pending | UnderReview | Verified | Rejected
NotificationType: Order | Payment | Message | System | Verification
```

---

## 🔗 **KEY RELATIONSHIPS**

```
Client ──creates──> Order (1..*)
Manufacturer ──bids──> Order (0..*)
Manufacturer ──hires──> Labour (0..*)
Order ──has──> Bid[] (0..*)
Order ──has──> EscrowPayment (0..1)
User ──has──> Verification (1)
Verification ──has──> Document[] (1..*)
```

---

## 💡 **KEY METHODS**

### **Client**
```typescript
createOrder()
viewManufacturers()
makePayment()
```

### **Manufacturer**
```typescript
bidOnOrder()
hireLabour()
submitAffidavit()
acceptPPCLaw()
```

### **Labour**
```typescript
uploadSkillProof()
updateAvailability()
setHourlyRate()
```

### **Order**
```typescript
addBid()
acceptBid()
createEscrowPayment()
completeOrder()
```

### **EscrowPayment**
```typescript
releaseUpfrontPayment()    // 30%
releaseFinalPayment()       // 70%
getTotalPaid()
getRemainingAmount()
```

---

## ✅ **VERIFICATION REQUIREMENTS**

| Role | Required Documents |
|------|-------------------|
| **Client** | Orders, Legal Documents |
| **Manufacturer** | Affidavit, PPC Law, Legal Docs |
| **Labour** | Skill Photos, Skill Videos |

---

## 💰 **ESCROW BREAKDOWN**

```
Total Order Amount: PKR 100,000
├── Upfront (30%): PKR 30,000  → Released at start
└── Final (70%):   PKR 70,000  → Released on completion
```

---

## 🎨 **COLOR SCHEME**

```
Client       → Blue   (#DBEAFE)
Manufacturer → Red    (#FECACA)
Labour       → Yellow (#FEF3C7)
Payments     → Green  (#BBF7D0)
Orders       → Purple (#DDD6FE)
Documents    → Violet (#E9D5FF)
Messages     → Orange (#FED7AA)
```

---

## 📁 **FILES**

1. `/skillora-classes.ts` - Full code
2. `/components/ClassDiagram.tsx` - Visual diagram
3. `/CLASS_DIAGRAM_DOCUMENTATION.md` - Complete docs
4. `/QUICK_CLASS_REFERENCE.md` - This file

---

## 🚀 **USAGE**

```typescript
// Create client
const client = new Client('C001', 'email@test.com', 'pass', '0300...', 'ABC Ltd', 'Karachi');

// Create order
const order = client.createOrder(new Order('C001', 'Textile Order', '...', 'Textile', 1000, 500000, date));

// Manufacturer bids
const bid = manufacturer.bidOnOrder(order, 480000);

// Accept bid
order.acceptBid(bid.id);

// Create escrow
const escrow = order.createEscrowPayment(480000);

// Release payments
escrow.releaseUpfrontPayment();  // 30% → PKR 144,000
escrow.releaseFinalPayment();    // 70% → PKR 336,000
```

---

**Total:** 13 Classes | 6 Enums | 50+ Methods | 120+ Attributes

**Status:** ✅ COMPLETE
