// ===================== ENUMERATIONS =====================

export enum UserRole {
  CLIENT = 'CLIENT',
  MANUFACTURER = 'MANUFACTURER',
  LABOUR = 'LABOUR'
}

export enum UserState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum DocumentType {
  LEGAL_DOCUMENT = 'LEGAL_DOCUMENT',
  AFFIDAVIT = 'AFFIDAVIT',
  SKILL_PROOF = 'SKILL_PROOF',
  REGISTRATION = 'REGISTRATION'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  UPFRONT_PAID = 'UPFRONT_PAID',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum NotificationType {
  ORDER_UPDATE = 'ORDER_UPDATE',
  PAYMENT_ALERT = 'PAYMENT_ALERT',
  MESSAGE = 'MESSAGE',
  VERIFICATION = 'VERIFICATION',
  SYSTEM = 'SYSTEM'
}

// ===================== BASE USER CLASS =====================

export class User {
  protected id: string;
  protected email: string;
  protected password: string;
  protected phone: string;
  protected role: UserRole;
  protected state: UserState;

  constructor(
    id: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole,
    state: UserState = UserState.ACTIVE
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
    this.state = state;
  }

  public login(): boolean {
    // Authentication logic
    if (this.state === UserState.ACTIVE) {
      console.log(`User ${this.email} logged in successfully`);
      return true;
    }
    console.log(`Login failed: Account is ${this.state}`);
    return false;
  }

  public logout(): void {
    console.log(`User ${this.email} logged out`);
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getState(): UserState {
    return this.state;
  }

  public setState(state: UserState): void {
    this.state = state;
  }
}

// ===================== DOCUMENT CLASS =====================

export class Document {
  private id: string;
  private type: DocumentType;
  private fileUrl: string;
  private videoUrl?: string;
  private uploadedAt: Date;

  constructor(
    id: string,
    type: DocumentType,
    fileUrl: string,
    videoUrl?: string
  ) {
    this.id = id;
    this.type = type;
    this.fileUrl = fileUrl;
    this.videoUrl = videoUrl;
    this.uploadedAt = new Date();
  }

  public upload(): void {
    console.log(`Uploading document ${this.id} of type ${this.type}`);
  }

  public getId(): string {
    return this.id;
  }

  public getType(): DocumentType {
    return this.type;
  }

  public getFileUrl(): string {
    return this.fileUrl;
  }

  public getVideoUrl(): string | undefined {
    return this.videoUrl;
  }
}

// ===================== VERIFICATION CLASS =====================

export class Verification {
  private id: string;
  private userId: string;
  private status: VerificationStatus;
  private documents: Document[];
  private submittedAt: Date;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
    this.status = VerificationStatus.PENDING;
    this.documents = [];
    this.submittedAt = new Date();
  }

  public submitDocuments(documents: Document[]): void {
    this.documents = documents;
    this.status = VerificationStatus.UNDER_REVIEW;
    console.log(`Documents submitted for user ${this.userId}`);
  }

  public approve(): void {
    this.status = VerificationStatus.APPROVED;
    console.log(`Verification approved for user ${this.userId}`);
  }

  public reject(): void {
    this.status = VerificationStatus.REJECTED;
    console.log(`Verification rejected for user ${this.userId}`);
  }

  public getStatus(): VerificationStatus {
    return this.status;
  }

  public getDocuments(): Document[] {
    return this.documents;
  }
}

// ===================== CLIENT CLASS =====================

export class Client extends User {
  private companyName: string;
  private address: string;
  private gstNumber: string;
  private orders: Order[];
  private documents: Document[];
  private verification: Verification;

  constructor(
    id: string,
    email: string,
    password: string,
    phone: string,
    companyName: string,
    address: string,
    gstNumber: string
  ) {
    super(id, email, password, phone, UserRole.CLIENT);
    this.companyName = companyName;
    this.address = address;
    this.gstNumber = gstNumber;
    this.orders = [];
    this.documents = [];
    this.verification = new Verification(`ver-${id}`, id);
  }

  public createOrder(
    title: string,
    quantity: number,
    budget: number
  ): Order {
    const order = new Order(
      `ord-${Date.now()}`,
      this.getId(),
      title,
      quantity,
      budget
    );
    this.orders.push(order);
    console.log(`Order created: ${title}`);
    return order;
  }

  public viewManufacturers(): Manufacturer[] {
    // Return list of manufacturers
    console.log('Fetching manufacturers...');
    return [];
  }

  public makePayment(orderId: string, amount: number): Payment {
    const payment = new Payment(`pay-${Date.now()}`, orderId, amount);
    console.log(`Payment of ${amount} initiated for order ${orderId}`);
    return payment;
  }

  public getOrders(): Order[] {
    return this.orders;
  }

  public getCompanyName(): string {
    return this.companyName;
  }

  public getVerification(): Verification {
    return this.verification;
  }
}

// ===================== LABOUR CLASS =====================

export class Labour extends User {
  private name: string;
  private skills: string[];
  private hourlyRate: number;
  private location: string;
  private skillProofs: Document[];
  private rating: number;

  constructor(
    id: string,
    email: string,
    password: string,
    phone: string,
    name: string,
    skills: string[],
    hourlyRate: number,
    location: string
  ) {
    super(id, email, password, phone, UserRole.LABOUR);
    this.name = name;
    this.skills = skills;
    this.hourlyRate = hourlyRate;
    this.location = location;
    this.skillProofs = [];
    this.rating = 0;
  }

  public uploadSkillProof(document: Document): void {
    this.skillProofs.push(document);
    console.log(`Skill proof uploaded for ${this.name}`);
  }

  public updateAvailability(available: boolean): void {
    console.log(`Availability updated to ${available} for ${this.name}`);
  }

  public setHourlyRate(rate: number): void {
    this.hourlyRate = rate;
    console.log(`Hourly rate updated to ${rate}`);
  }

  public getName(): string {
    return this.name;
  }

  public getSkills(): string[] {
    return this.skills;
  }

  public getHourlyRate(): number {
    return this.hourlyRate;
  }

  public getRating(): number {
    return this.rating;
  }

  public setRating(rating: number): void {
    this.rating = rating;
  }
}

// ===================== MANUFACTURER CLASS =====================

export class Manufacturer extends User {
  private companyName: string;
  private category: string;
  private affidavit: string;
  private ppcLawAccepted: boolean;
  private labourHired: Labour[];
  private activeOrders: Order[];
  private rating: number;
  private verification: Verification;

  constructor(
    id: string,
    email: string,
    password: string,
    phone: string,
    companyName: string,
    category: string
  ) {
    super(id, email, password, phone, UserRole.MANUFACTURER);
    this.companyName = companyName;
    this.category = category;
    this.affidavit = '';
    this.ppcLawAccepted = false;
    this.labourHired = [];
    this.activeOrders = [];
    this.rating = 0;
    this.verification = new Verification(`ver-${id}`, id);
  }

  public bidOnOrder(order: Order, amount: number): Bid {
    const bid = new Bid(
      `bid-${Date.now()}`,
      this.getId(),
      order.getId(),
      amount
    );
    order.addBid(bid);
    console.log(`Bid placed on order ${order.getId()}`);
    return bid;
  }

  public hireLabour(labour: Labour): void {
    this.labourHired.push(labour);
    console.log(`Labour ${labour.getName()} hired by ${this.companyName}`);
  }

  public submitAffidavit(affidavitUrl: string): void {
    this.affidavit = affidavitUrl;
    console.log('Affidavit submitted');
  }

  public acceptPPCLaw(): void {
    this.ppcLawAccepted = true;
    console.log('PPC Law accepted');
  }

  public getCompanyName(): string {
    return this.companyName;
  }

  public getCategory(): string {
    return this.category;
  }

  public getRating(): number {
    return this.rating;
  }

  public setRating(rating: number): void {
    this.rating = rating;
  }

  public getActiveOrders(): Order[] {
    return this.activeOrders;
  }

  public addActiveOrder(order: Order): void {
    this.activeOrders.push(order);
  }

  public getVerification(): Verification {
    return this.verification;
  }
}

// ===================== BID CLASS =====================

export class Bid {
  private id: string;
  private manufacturerId: string;
  private orderId: string;
  private amount: number;
  private accepted: boolean;

  constructor(
    id: string,
    manufacturerId: string,
    orderId: string,
    amount: number
  ) {
    this.id = id;
    this.manufacturerId = manufacturerId;
    this.orderId = orderId;
    this.amount = amount;
    this.accepted = false;
  }

  public accept(): void {
    this.accepted = true;
    console.log(`Bid ${this.id} accepted`);
  }

  public getId(): string {
    return this.id;
  }

  public getManufacturerId(): string {
    return this.manufacturerId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public isAccepted(): boolean {
    return this.accepted;
  }
}

// ===================== ORDER CLASS =====================

export class Order {
  private id: string;
  private clientId: string;
  private manufacturerId?: string;
  private title: string;
  private quantity: number;
  private budget: number;
  private status: OrderStatus;
  private bids: Bid[];

  constructor(
    id: string,
    clientId: string,
    title: string,
    quantity: number,
    budget: number
  ) {
    this.id = id;
    this.clientId = clientId;
    this.title = title;
    this.quantity = quantity;
    this.budget = budget;
    this.status = OrderStatus.PENDING;
    this.bids = [];
  }

  public addBid(bid: Bid): void {
    this.bids.push(bid);
    console.log(`Bid added to order ${this.id}`);
  }

  public acceptBid(bid: Bid, manufacturer: Manufacturer): void {
    bid.accept();
    this.manufacturerId = bid.getManufacturerId();
    this.status = OrderStatus.ACCEPTED;
    manufacturer.addActiveOrder(this);
    console.log(`Bid ${bid.getId()} accepted for order ${this.id}`);
  }

  public completeOrder(): void {
    this.status = OrderStatus.COMPLETED;
    console.log(`Order ${this.id} completed`);
  }

  public cancelOrder(): void {
    this.status = OrderStatus.CANCELLED;
    console.log(`Order ${this.id} cancelled`);
  }

  public getId(): string {
    return this.id;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getManufacturerId(): string | undefined {
    return this.manufacturerId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getBudget(): number {
    return this.budget;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setStatus(status: OrderStatus): void {
    this.status = status;
  }

  public getBids(): Bid[] {
    return this.bids;
  }
}

// ===================== PAYMENT CLASS =====================

export class Payment {
  private id: string;
  private orderId: string;
  private amount: number;
  private status: PaymentStatus;
  private paidAt?: Date;

  constructor(id: string, orderId: string, amount: number) {
    this.id = id;
    this.orderId = orderId;
    this.amount = amount;
    this.status = PaymentStatus.PENDING;
  }

  public processPayment(): boolean {
    try {
      // Payment processing logic
      this.status = PaymentStatus.COMPLETED;
      this.paidAt = new Date();
      console.log(`Payment ${this.id} processed successfully`);
      return true;
    } catch (error) {
      this.status = PaymentStatus.FAILED;
      console.error(`Payment ${this.id} failed`);
      return false;
    }
  }

  public getId(): string {
    return this.id;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getStatus(): PaymentStatus {
    return this.status;
  }

  public setStatus(status: PaymentStatus): void {
    this.status = status;
  }
}

// ===================== ESCROW PAYMENT CLASS =====================

export class EscrowPayment extends Payment {
  private totalAmount: number;
  private upfrontAmount: number; // 30%
  private finalAmount: number; // 70%
  private upfrontPaid: boolean;
  private finalPaid: boolean;

  constructor(id: string, orderId: string, totalAmount: number) {
    super(id, orderId, totalAmount);
    this.totalAmount = totalAmount;
    this.upfrontAmount = totalAmount * 0.3;
    this.finalAmount = totalAmount * 0.7;
    this.upfrontPaid = false;
    this.finalPaid = false;
  }

  public releaseUpfrontPayment(): boolean {
    if (!this.upfrontPaid) {
      this.upfrontPaid = true;
      this.setStatus(PaymentStatus.UPFRONT_PAID);
      console.log(`Upfront payment of ${this.upfrontAmount} released (30%)`);
      return true;
    }
    return false;
  }

  public releaseFinalPayment(): boolean {
    if (this.upfrontPaid && !this.finalPaid) {
      this.finalPaid = true;
      this.setStatus(PaymentStatus.COMPLETED);
      console.log(`Final payment of ${this.finalAmount} released (70%)`);
      return true;
    }
    return false;
  }

  public getRemainingAmount(): number {
    if (!this.upfrontPaid) {
      return this.totalAmount;
    } else if (!this.finalPaid) {
      return this.finalAmount;
    }
    return 0;
  }

  public getUpfrontAmount(): number {
    return this.upfrontAmount;
  }

  public getFinalAmount(): number {
    return this.finalAmount;
  }

  public isUpfrontPaid(): boolean {
    return this.upfrontPaid;
  }

  public isFinalPaid(): boolean {
    return this.finalPaid;
  }
}

// ===================== MESSAGE CLASS =====================

export class Message {
  private id: string;
  private senderId: string;
  private receiverId: string;
  private content: string;
  private read: boolean;
  private sentAt: Date;

  constructor(
    id: string,
    senderId: string,
    receiverId: string,
    content: string
  ) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.read = false;
    this.sentAt = new Date();
  }

  public markAsRead(): void {
    this.read = true;
    console.log(`Message ${this.id} marked as read`);
  }

  public getId(): string {
    return this.id;
  }

  public getSenderId(): string {
    return this.senderId;
  }

  public getReceiverId(): string {
    return this.receiverId;
  }

  public getContent(): string {
    return this.content;
  }

  public isRead(): boolean {
    return this.read;
  }
}

// ===================== NOTIFICATION CLASS =====================

export class Notification {
  private id: string;
  private userId: string;
  private type: NotificationType;
  private message: string;
  private read: boolean;
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    type: NotificationType,
    message: string
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.message = message;
    this.read = false;
    this.createdAt = new Date();
  }

  public markAsRead(): void {
    this.read = true;
    console.log(`Notification ${this.id} marked as read`);
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getType(): NotificationType {
    return this.type;
  }

  public getMessage(): string {
    return this.message;
  }

  public isRead(): boolean {
    return this.read;
  }
}

// ===================== REVIEW CLASS =====================

export class Review {
  private id: string;
  private orderId: string;
  private reviewerId: string;
  private rating: number; // 1-5
  private comment: string;
  private createdAt: Date;

  constructor(
    id: string,
    orderId: string,
    reviewerId: string,
    rating: number,
    comment: string
  ) {
    this.id = id;
    this.orderId = orderId;
    this.reviewerId = reviewerId;
    this.rating = Math.max(1, Math.min(5, rating)); // Clamp between 1-5
    this.comment = comment;
    this.createdAt = new Date();
  }

  public submit(): void {
    console.log(`Review submitted for order ${this.orderId} with rating ${this.rating}`);
  }

  public getId(): string {
    return this.id;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getReviewerId(): string {
    return this.reviewerId;
  }

  public getRating(): number {
    return this.rating;
  }

  public getComment(): string {
    return this.comment;
  }
}

// ===================== USAGE EXAMPLE =====================

export function exampleUsage() {
  // Create Client
  const client = new Client(
    'client-001',
    'client@example.com',
    'password123',
    '+92 300 1234567',
    'ABC Industries',
    'Karachi, Pakistan',
    'GST12345'
  );

  // Create Manufacturer
  const manufacturer = new Manufacturer(
    'manu-001',
    'manufacturer@example.com',
    'password123',
    '+92 301 7654321',
    'XYZ Manufacturing',
    'Textile'
  );

  // Create Labour
  const labour = new Labour(
    'labour-001',
    'labour@example.com',
    'password123',
    '+92 302 9876543',
    'Ali Khan',
    ['Welding', 'Fabrication'],
    500,
    'Lahore, Pakistan'
  );

  // Client creates order
  const order = client.createOrder('Steel Rods Manufacturing', 1000, 500000);

  // Manufacturer bids on order
  const bid = manufacturer.bidOnOrder(order, 480000);

  // Client accepts bid
  order.acceptBid(bid, manufacturer);

  // Manufacturer hires labour
  manufacturer.hireLabour(labour);

  // Create escrow payment
  const escrowPayment = new EscrowPayment(
    'escrow-001',
    order.getId(),
    480000
  );

  // Release upfront payment (30%)
  escrowPayment.releaseUpfrontPayment();

  // Complete order
  order.completeOrder();

  // Release final payment (70%)
  escrowPayment.releaseFinalPayment();

  // Submit review
  const review = new Review(
    'review-001',
    order.getId(),
    client.getId(),
    5,
    'Excellent work!'
  );
  review.submit();

  console.log('Skillora Platform - Complete Flow Executed Successfully!');
}
