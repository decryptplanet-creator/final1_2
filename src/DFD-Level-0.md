# SKILLORA PLATFORM - DFD Level 0 (Context Diagram)

## Overview
**Trust in Every Talent** - Labour-Manufacture-Client Verification Platform

---

## Diagram Structure

```
┌─────────────────┐
│                 │
│     CLIENT      │────────────┐
│  (Order Placer) │            │
│                 │            │
└─────────────────┘            │
                               │
                               ▼
                    ┌──────────────────────┐
                    │                      │
                    │                      │
                    │   SKILLORA PLATFORM  │
                    │   (Complete System)  │
                    │    Process 0.0       │
                    │                      │
                    │                      │
                    └──────────────────────┘
                               ▲
                               │
┌─────────────────┐            │            ┌─────────────────┐
│                 │            │            │                 │
│  MANUFACTURER   │────────────┘            │     LABOUR      │
│  (Order Taker)  │                         │ (Skill Worker)  │
│                 │                         │                 │
└─────────────────┘                         └─────────────────┘
                                                     │
                                                     │
                                            ┌────────┴────────┐
                                            │                 │
                                            │  PAYMENT SYSTEM │
                                            │   (Escrow)      │
                                            │                 │
                                            └─────────────────┘
```

---

## External Entities

### 1. **CLIENT**
- Business owners who need manufacturing services
- Post orders for products
- Make payments via escrow

### 2. **MANUFACTURER**  
- Factories/Companies that fulfill orders
- Accept orders and deliver products
- Receive payments (30% upfront, 70% on completion)

### 3. **LABOUR**
- Skilled workers hired by manufacturers
- Provide skills verification (photos/videos)
- Work on manufacturing projects

### 4. **PAYMENT SYSTEM (Escrow)**
- Third-party payment gateway
- Handles secure transactions
- Manages escrow (30-70 split)

---

## Data Flows

### FROM CLIENT → SKILLORA:
1. **Registration Data** (Name, Email, Phone, CNIC, Business Documents)
2. **Order Details** (Product specs, Quantity, Deadline, Budget)
3. **Payment Information** (Amount, Payment method)
4. **Messages** (Communication with Manufacturers)
5. **Reviews & Ratings** (After order completion)
6. **Document Uploads** (Legal documents, Business registration)

### FROM SKILLORA → CLIENT:
1. **Verification Status** (Approved/Rejected)
2. **Manufacturer Listings** (Available manufacturers)
3. **Order Status Updates** (In Progress, Completed)
4. **Payment Receipts** (Transaction confirmations)
5. **Messages** (From Manufacturers)
6. **Notifications** (Order updates, New bids)

---

### FROM MANUFACTURER → SKILLORA:
1. **Registration Data** (Company name, Legal docs, Affidavit, PPC Law compliance)
2. **Order Acceptance** (Bid on client orders)
3. **Production Updates** (Progress reports)
4. **Completed Work** (Final product delivery proof)
5. **Messages** (Communication with Clients)
6. **Labour Hiring Requests** (Search for skilled workers)
7. **Payment Withdrawal Requests** (After order completion)

### FROM SKILLORA → MANUFACTURER:
1. **Verification Status** (Legal document verification)
2. **Order Notifications** (New orders available)
3. **Payment Confirmation** (30% upfront, 70% completion)
4. **Labour Listings** (Available skilled workers)
5. **Messages** (From Clients/Labour)
6. **Escrow Release Notifications** (Payment released)

---

### FROM LABOUR → SKILLORA:
1. **Registration Data** (Name, Skills, CNIC, Contact info)
2. **Skill Verification** (Photos/Videos of work)
3. **Job Applications** (Apply to manufacturer postings)
4. **Work Portfolio** (Previous work samples)
5. **Availability Status** (Available/Busy)
6. **Messages** (Communication with Manufacturers)

### FROM SKILLORA → LABOUR:
1. **Verification Status** (Skill verification approved/rejected)
2. **Job Opportunities** (Manufacturer hiring requests)
3. **Hiring Confirmations** (Job accepted)
4. **Messages** (From Manufacturers)
5. **Ratings & Reviews** (From Manufacturers)
6. **Notifications** (New job postings)

---

### FROM PAYMENT SYSTEM → SKILLORA:
1. **Payment Confirmations** (Transaction successful)
2. **Escrow Status** (Funds held/released)
3. **Transaction Receipts** (Payment proof)
4. **Payment Failure Alerts** (If transaction fails)

### FROM SKILLORA → PAYMENT SYSTEM:
1. **Payment Requests** (Client payment initiation)
2. **Escrow Release Orders** (Release 30% to manufacturer)
3. **Final Payment Release** (Release 70% on completion)
4. **Refund Requests** (If order cancelled)

---

## Key Features Represented:

✅ **Triple Verification System**
- Clients: Business documents verification
- Manufacturers: Legal docs + Affidavit + PPC Law compliance
- Labour: Skills verification via photos/videos

✅ **Escrow Payment System**
- 30% payment upfront to manufacturer
- 70% payment on order completion

✅ **Complete Communication System**
- Messaging between all entities
- Real-time notifications

✅ **Order Management**
- Post, Accept, Track, Complete orders

✅ **Rating & Review System**
- Builds trust in platform
- Quality assurance

---

## System Boundary:
**Everything inside "SKILLORA PLATFORM (Process 0.0)" is the system we're building.**

All external entities interact with this single system boundary through clearly defined data flows.

---

**Platform Name:** Skillora  
**Tagline:** Trust in Every Talent  
**Theme:** Complete BLACK (#000000) with Dark/Light mode toggle  
**Logo:** Sparkles icon ✨
