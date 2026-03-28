// ============================================
// SKILLORA PLATFORM - CLASS DIAGRAM CODE
// Labour-Manufacture-Client Platform
// ============================================

// ==================== ENUMERATIONS ====================

enum UserRole {
  Client = 'Client',
  Manufacturer = 'Manufacturer',
  Labour = 'Labour'
}

enum UserState {
  New = 'New',
  Active = 'Active',
  Suspended = 'Suspended',
  Blocked = 'Blocked',
  Verified = 'Verified'
}

enum VerificationStatus {
  Pending = 'Pending',
  UnderReview = 'UnderReview',
  Verified = 'Verified',
  Rejected = 'Rejected'
}

enum OrderStatus {
  Pending = 'Pending',
  Bidding = 'Bidding',
  Active = 'Active',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Disputed = 'Disputed'
}

enum PaymentStatus {
  Pending = 'Pending',
  PartialPaid = 'PartialPaid',
  Escrowed = 'Escrowed',
  Released = 'Released',
  Refunded = 'Refunded',
  Completed = 'Completed'
}

enum NotificationType {
  Order = 'Order',
  Payment = 'Payment',
  Message = 'Message',
  System = 'System',
  Verification = 'Verification'
}

enum DocumentType {
  LegalDocument = 'LegalDocument',
  Affidavit = 'Affidavit',
  PPCLaw = 'PPCLaw',
  SkillProof = 'SkillProof',
  OrderProof = 'OrderProof'
}

// ==================== BASE CLASSES ====================

/**
 * User - Base class for all platform users
 */
class User {
  id: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  state: UserState;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, email: string, password: string, phone: string, role: UserRole) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
    this.state = UserState.New;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  login(): boolean {
    // Authentication logic
    return true;
  }

  logout(): void {
    // Logout logic
  }

  updateProfile(data: Partial<User>): void {
    // Update user profile
    this.updatedAt = new Date();
  }

  changePassword(oldPassword: string, newPassword: string): boolean {
    // Password change logic
    return true;
  }
}

// ==================== USER TYPES ====================

/**
 * Client - Orders products from manufacturers
 */
class Client extends User {
  companyName: string;
  address: string;
  gstNumber?: string;
  documents: Document[];
  orders: Order[];
  verification: Verification;

  constructor(id: string, email: string, password: string, phone: string, companyName: string, address: string) {
    super(id, email, password, phone, UserRole.Client);
    this.companyName = companyName;
    this.address = address;
    this.documents = [];
    this.orders = [];
    this.verification = new Verification(id, UserRole.Client);
  }

  createOrder(order: Order): Order {
    this.orders.push(order);
    return order;
  }

  viewManufacturers(filters?: any): Manufacturer[] {
    // Search manufacturers
    return [];
  }

  submitVerificationDocuments(documents: Document[]): void {
    this.documents = documents;
    this.verification.submitDocuments(documents);
  }

  makePayment(orderId: string, amount: number): Payment {
    // Create payment
    return new Payment(this.id, orderId, amount);
  }
}

/**
 * Manufacturer - Manufactures products and hires labour
 */
class Manufacturer extends User {
  companyName: string;
  address: string;
  category: string;
  affidavit: string;
  ppcLawAccepted: boolean;
  documents: Document[];
  activeOrders: Order[];
  labourHired: Labour[];
  verification: Verification;
  rating: number;
  reviewCount: number;

  constructor(id: string, email: string, password: string, phone: string, companyName: string, address: string, category: string) {
    super(id, email, password, phone, UserRole.Manufacturer);
    this.companyName = companyName;
    this.address = address;
    this.category = category;
    this.affidavit = '';
    this.ppcLawAccepted = false;
    this.documents = [];
    this.activeOrders = [];
    this.labourHired = [];
    this.verification = new Verification(id, UserRole.Manufacturer);
    this.rating = 0;
    this.reviewCount = 0;
  }

  bidOnOrder(order: Order, amount: number): Bid {
    const bid = new Bid(this.id, order.id, amount);
    order.addBid(bid);
    return bid;
  }

  hireLabour(labour: Labour): void {
    this.labourHired.push(labour);
  }

  submitAffidavit(affidavit: string): void {
    this.affidavit = affidavit;
  }

  acceptPPCLaw(): void {
    this.ppcLawAccepted = true;
  }

  submitVerificationDocuments(documents: Document[]): void {
    this.documents = documents;
    this.verification.submitDocuments(documents);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const order = this.activeOrders.find(o => o.id === orderId);
    if (order) {
      order.updateStatus(status);
    }
  }

  requestPaymentRelease(orderId: string): void {
    // Request escrow payment release
  }
}

/**
 * Labour - Skilled workers hired by manufacturers
 */
class Labour extends User {
  name: string;
  skills: string[];
  location: string;
  hourlyRate: number;
  skillProofs: Document[];
  verification: Verification;
  rating: number;
  reviewCount: number;
  availability: boolean;

  constructor(id: string, email: string, password: string, phone: string, name: string, skills: string[], location: string, hourlyRate: number) {
    super(id, email, password, phone, UserRole.Labour);
    this.name = name;
    this.skills = skills;
    this.location = location;
    this.hourlyRate = hourlyRate;
    this.skillProofs = [];
    this.verification = new Verification(id, UserRole.Labour);
    this.rating = 0;
    this.reviewCount = 0;
    this.availability = true;
  }

  uploadSkillProof(photo: string, video: string): void {
    const proof = new Document(DocumentType.SkillProof, 'Skill Proof', photo, video);
    this.skillProofs.push(proof);
    this.verification.submitDocuments([proof]);
  }

  updateAvailability(available: boolean): void {
    this.availability = available;
  }

  setHourlyRate(rate: number): void {
    this.hourlyRate = rate;
  }
}

// ==================== VERIFICATION SYSTEM ====================

/**
 * Verification - Handles user verification process
 */
class Verification {
  id: string;
  userId: string;
  userRole: UserRole;
  status: VerificationStatus;
  documents: Document[];
  submittedAt?: Date;
  reviewedAt?: Date;
  verifiedAt?: Date;
  rejectionReason?: string;

  constructor(userId: string, userRole: UserRole) {
    this.id = `VER-${Date.now()}`;
    this.userId = userId;
    this.userRole = userRole;
    this.status = VerificationStatus.Pending;
    this.documents = [];
  }

  submitDocuments(documents: Document[]): void {
    this.documents = documents;
    this.status = VerificationStatus.UnderReview;
    this.submittedAt = new Date();
  }

  approve(): void {
    this.status = VerificationStatus.Verified;
    this.verifiedAt = new Date();
  }

  reject(reason: string): void {
    this.status = VerificationStatus.Rejected;
    this.rejectionReason = reason;
    this.reviewedAt = new Date();
  }

  isVerified(): boolean {
    return this.status === VerificationStatus.Verified;
  }
}

/**
 * Document - Stores verification documents
 */
class Document {
  id: string;
  type: DocumentType;
  title: string;
  fileUrl: string;
  videoUrl?: string;
  uploadedAt: Date;

  constructor(type: DocumentType, title: string, fileUrl: string, videoUrl?: string) {
    this.id = `DOC-${Date.now()}`;
    this.type = type;
    this.title = title;
    this.fileUrl = fileUrl;
    this.videoUrl = videoUrl;
    this.uploadedAt = new Date();
  }
}

// ==================== ORDER SYSTEM ====================

/**
 * Order - Represents a client order
 */
class Order {
  id: string;
  clientId: string;
  manufacturerId?: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  budget: number;
  deadline: Date;
  status: OrderStatus;
  bids: Bid[];
  payment?: Payment;
  escrow?: EscrowPayment;
  createdAt: Date;
  updatedAt: Date;

  constructor(clientId: string, title: string, description: string, category: string, quantity: number, budget: number, deadline: Date) {
    this.id = `ORD-${Date.now()}`;
    this.clientId = clientId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.quantity = quantity;
    this.budget = budget;
    this.deadline = deadline;
    this.status = OrderStatus.Pending;
    this.bids = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addBid(bid: Bid): void {
    this.bids.push(bid);
    this.status = OrderStatus.Bidding;
  }

  acceptBid(bidId: string): void {
    const bid = this.bids.find(b => b.id === bidId);
    if (bid) {
      this.manufacturerId = bid.manufacturerId;
      bid.accept();
      this.status = OrderStatus.Active;
    }
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  createEscrowPayment(amount: number): EscrowPayment {
    this.escrow = new EscrowPayment(this.id, this.clientId, this.manufacturerId!, amount);
    return this.escrow;
  }

  completeOrder(): void {
    this.status = OrderStatus.Completed;
    this.updatedAt = new Date();
  }
}

/**
 * Bid - Manufacturer's bid on an order
 */
class Bid {
  id: string;
  manufacturerId: string;
  orderId: string;
  amount: number;
  deliveryTime: number; // in days
  description: string;
  accepted: boolean;
  createdAt: Date;

  constructor(manufacturerId: string, orderId: string, amount: number) {
    this.id = `BID-${Date.now()}`;
    this.manufacturerId = manufacturerId;
    this.orderId = orderId;
    this.amount = amount;
    this.deliveryTime = 0;
    this.description = '';
    this.accepted = false;
    this.createdAt = new Date();
  }

  accept(): void {
    this.accepted = true;
  }

  updateAmount(amount: number): void {
    this.amount = amount;
  }
}

// ==================== PAYMENT SYSTEM ====================

/**
 * Payment - Base payment class
 */
class Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: Date;
  createdAt: Date;

  constructor(userId: string, orderId: string, amount: number) {
    this.id = `PAY-${Date.now()}`;
    this.userId = userId;
    this.orderId = orderId;
    this.amount = amount;
    this.status = PaymentStatus.Pending;
    this.createdAt = new Date();
  }

  processPayment(): boolean {
    this.status = PaymentStatus.Completed;
    this.paidAt = new Date();
    return true;
  }

  refund(): void {
    this.status = PaymentStatus.Refunded;
  }
}

/**
 * EscrowPayment - Escrow system (30% upfront, 70% on completion)
 */
class EscrowPayment {
  id: string;
  orderId: string;
  clientId: string;
  manufacturerId: string;
  totalAmount: number;
  upfrontAmount: number; // 30%
  finalAmount: number; // 70%
  upfrontPaid: boolean;
  finalPaid: boolean;
  upfrontReleasedAt?: Date;
  finalReleasedAt?: Date;
  status: PaymentStatus;
  createdAt: Date;

  constructor(orderId: string, clientId: string, manufacturerId: string, totalAmount: number) {
    this.id = `ESC-${Date.now()}`;
    this.orderId = orderId;
    this.clientId = clientId;
    this.manufacturerId = manufacturerId;
    this.totalAmount = totalAmount;
    this.upfrontAmount = totalAmount * 0.30;
    this.finalAmount = totalAmount * 0.70;
    this.upfrontPaid = false;
    this.finalPaid = false;
    this.status = PaymentStatus.Pending;
    this.createdAt = new Date();
  }

  releaseUpfrontPayment(): void {
    this.upfrontPaid = true;
    this.upfrontReleasedAt = new Date();
    this.status = PaymentStatus.PartialPaid;
  }

  releaseFinalPayment(): void {
    this.finalPaid = true;
    this.finalReleasedAt = new Date();
    this.status = PaymentStatus.Completed;
  }

  getTotalPaid(): number {
    let total = 0;
    if (this.upfrontPaid) total += this.upfrontAmount;
    if (this.finalPaid) total += this.finalAmount;
    return total;
  }

  getRemainingAmount(): number {
    return this.totalAmount - this.getTotalPaid();
  }
}

// ==================== MESSAGING SYSTEM ====================

/**
 * Message - Chat messages between users
 */
class Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments: string[];
  read: boolean;
  sentAt: Date;

  constructor(senderId: string, receiverId: string, content: string) {
    this.id = `MSG-${Date.now()}`;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.attachments = [];
    this.read = false;
    this.sentAt = new Date();
  }

  markAsRead(): void {
    this.read = true;
  }
}

/**
 * Notification - System notifications
 */
class Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;

  constructor(userId: string, type: NotificationType, title: string, message: string) {
    this.id = `NOT-${Date.now()}`;
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.read = false;
    this.createdAt = new Date();
  }

  markAsRead(): void {
    this.read = true;
  }
}

// ==================== REVIEW SYSTEM ====================

/**
 * Review - User reviews and ratings
 */
class Review {
  id: string;
  orderId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;

  constructor(orderId: string, reviewerId: string, reviewedUserId: string, rating: number, comment: string) {
    this.id = `REV-${Date.now()}`;
    this.orderId = orderId;
    this.reviewerId = reviewerId;
    this.reviewedUserId = reviewedUserId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = new Date();
  }
}

// ==================== EXPORT ALL CLASSES ====================

export {
  // Enums
  UserRole,
  UserState,
  VerificationStatus,
  OrderStatus,
  PaymentStatus,
  NotificationType,
  DocumentType,
  
  // Base Classes
  User,
  
  // User Types
  Client,
  Manufacturer,
  Labour,
  
  // Verification
  Verification,
  Document,
  
  // Orders
  Order,
  Bid,
  
  // Payments
  Payment,
  EscrowPayment,
  
  // Communication
  Message,
  Notification,
  
  // Reviews
  Review
};
