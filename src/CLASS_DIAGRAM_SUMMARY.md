# SKILLORA CLASS DIAGRAM - SUMMARY

## 📊 Complete UML Class Diagram

---

## 🎯 **13 Classes Created**

### **1. User (Base Class)**
- Attributes: id, email, password, phone, role, state
- Methods: login(), logout(), updateProfile()

### **2. Client (extends User)**
- Attributes: companyName, address, orders[], documents[]
- Methods: createOrder(), viewManufacturers(), makePayment()

### **3. Manufacturer (extends User)**
- Attributes: companyName, category, affidavit, ppcLawAccepted, labourHired[], rating
- Methods: bidOnOrder(), hireLabour(), submitAffidavit()

### **4. Labour (extends User)**
- Attributes: name, skills[], hourlyRate, location, skillProofs[]
- Methods: uploadSkillProof(), updateAvailability()

### **5. Verification**
- Attributes: userId, status, documents[], submittedAt
- Methods: submitDocuments(), approve(), reject()

### **6. Document**
- Attributes: type, fileUrl, videoUrl, uploadedAt
- Methods: upload()

### **7. Order**
- Attributes: clientId, manufacturerId, title, quantity, budget, status, bids[]
- Methods: addBid(), acceptBid(), completeOrder()

### **8. Bid**
- Attributes: manufacturerId, orderId, amount, accepted
- Methods: accept()

### **9. Payment**
- Attributes: orderId, amount, status, paidAt
- Methods: processPayment()

### **10. EscrowPayment (extends Payment)** ⭐
- Attributes: upfrontAmount (30%), finalAmount (70%), upfrontPaid, finalPaid
- Methods: releaseUpfrontPayment(), releaseFinalPayment()

### **11. Message**
- Attributes: senderId, receiverId, content, read
- Methods: markAsRead()

### **12. Notification**
- Attributes: userId, type, message, read
- Methods: markAsRead()

### **13. Review**
- Attributes: orderId, reviewerId, rating (1-5), comment
- Methods: submit()

---

## 📋 **6 Enumerations**

1. **UserRole:** Client, Manufacturer, Labour
2. **UserState:** New, Active, Suspended, Blocked, Verified
3. **VerificationStatus:** Pending, UnderReview, Verified, Rejected
4. **OrderStatus:** Pending, Bidding, Active, InProgress, Completed, Cancelled, Disputed
5. **PaymentStatus:** Pending, PartialPaid, Escrowed, Released, Refunded, Completed
6. **NotificationType:** Order, Payment, Message, System, Verification

---

## 🔗 **Relationships**

### **Inheritance:**
- User → Client, Manufacturer, Labour
- Payment → EscrowPayment

### **Composition:**
- Order ◆→ Bid[]
- Verification ◆→ Document[]

### **Association:**
- Client → Order (creates)
- Manufacturer → Order (bids on)
- Manufacturer → Labour (hires)

---

## 🎨 **Color Coding**

- 🔵 **Blue** = Client
- 🔴 **Red** = Manufacturer
- 🟡 **Yellow** = Labour
- 🟢 **Green** = Payment/Escrow
- 🟣 **Purple** = Documents
- 🟠 **Orange** = Communication

---

## ✅ **Key Features**

### **1. Triple Verification System**
- Client: Orders + Legal Documents
- Manufacturer: Affidavit + PPC Law + Legal Docs
- Labour: Skill Photos/Videos

### **2. Escrow Payment (30-70 Split)**
```
Total: PKR 100,000
├── 30% Upfront: PKR 30,000 (at start)
└── 70% Final: PKR 70,000 (on completion)
```

### **3. Order Bidding System**
```
Client posts → Manufacturers bid → Client accepts → Escrow → Work → Complete
```

---

## 📁 **Files Created**

1. `/skillora-classes.ts` - TypeScript class definitions (650+ lines)
2. `/components/SkilloraClassDiagram.tsx` - Visual UML diagram (800+ lines)
3. `/CLASS_DIAGRAM_SUMMARY.md` - This summary

---

## 🚀 **How to View**

Click the **purple FileCode button** (bottom right) to view the interactive class diagram!

---

**Total:** 13 Classes | 6 Enums | 50+ Methods | 120+ Attributes

**Status:** ✅ COMPLETE
