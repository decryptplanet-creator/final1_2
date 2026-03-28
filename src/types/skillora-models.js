var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["CLIENT"] = "CLIENT";
  UserRole2["MANUFACTURER"] = "MANUFACTURER";
  UserRole2["LABOUR"] = "LABOUR";
  return UserRole2;
})(UserRole || {});
var UserState = /* @__PURE__ */ ((UserState2) => {
  UserState2["ACTIVE"] = "ACTIVE";
  UserState2["INACTIVE"] = "INACTIVE";
  UserState2["SUSPENDED"] = "SUSPENDED";
  return UserState2;
})(UserState || {});
var VerificationStatus = /* @__PURE__ */ ((VerificationStatus2) => {
  VerificationStatus2["PENDING"] = "PENDING";
  VerificationStatus2["UNDER_REVIEW"] = "UNDER_REVIEW";
  VerificationStatus2["APPROVED"] = "APPROVED";
  VerificationStatus2["REJECTED"] = "REJECTED";
  return VerificationStatus2;
})(VerificationStatus || {});
var DocumentType = /* @__PURE__ */ ((DocumentType2) => {
  DocumentType2["LEGAL_DOCUMENT"] = "LEGAL_DOCUMENT";
  DocumentType2["AFFIDAVIT"] = "AFFIDAVIT";
  DocumentType2["SKILL_PROOF"] = "SKILL_PROOF";
  DocumentType2["REGISTRATION"] = "REGISTRATION";
  return DocumentType2;
})(DocumentType || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["PENDING"] = "PENDING";
  OrderStatus2["ACCEPTED"] = "ACCEPTED";
  OrderStatus2["IN_PROGRESS"] = "IN_PROGRESS";
  OrderStatus2["COMPLETED"] = "COMPLETED";
  OrderStatus2["CANCELLED"] = "CANCELLED";
  return OrderStatus2;
})(OrderStatus || {});
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["PENDING"] = "PENDING";
  PaymentStatus2["UPFRONT_PAID"] = "UPFRONT_PAID";
  PaymentStatus2["COMPLETED"] = "COMPLETED";
  PaymentStatus2["FAILED"] = "FAILED";
  PaymentStatus2["REFUNDED"] = "REFUNDED";
  return PaymentStatus2;
})(PaymentStatus || {});
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["ORDER_UPDATE"] = "ORDER_UPDATE";
  NotificationType2["PAYMENT_ALERT"] = "PAYMENT_ALERT";
  NotificationType2["MESSAGE"] = "MESSAGE";
  NotificationType2["VERIFICATION"] = "VERIFICATION";
  NotificationType2["SYSTEM"] = "SYSTEM";
  return NotificationType2;
})(NotificationType || {});
class User {
  constructor(id, email, password, phone, role, state = "ACTIVE" /* ACTIVE */) {
    __publicField(this, "id");
    __publicField(this, "email");
    __publicField(this, "password");
    __publicField(this, "phone");
    __publicField(this, "role");
    __publicField(this, "state");
    this.id = id;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
    this.state = state;
  }
  login() {
    if (this.state === "ACTIVE" /* ACTIVE */) {
      console.log(`User ${this.email} logged in successfully`);
      return true;
    }
    console.log(`Login failed: Account is ${this.state}`);
    return false;
  }
  logout() {
    console.log(`User ${this.email} logged out`);
  }
  // Getters
  getId() {
    return this.id;
  }
  getEmail() {
    return this.email;
  }
  getRole() {
    return this.role;
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
  }
}
class Document {
  constructor(id, type, fileUrl, videoUrl) {
    __publicField(this, "id");
    __publicField(this, "type");
    __publicField(this, "fileUrl");
    __publicField(this, "videoUrl");
    __publicField(this, "uploadedAt");
    this.id = id;
    this.type = type;
    this.fileUrl = fileUrl;
    this.videoUrl = videoUrl;
    this.uploadedAt = /* @__PURE__ */ new Date();
  }
  upload() {
    console.log(`Uploading document ${this.id} of type ${this.type}`);
  }
  getId() {
    return this.id;
  }
  getType() {
    return this.type;
  }
  getFileUrl() {
    return this.fileUrl;
  }
  getVideoUrl() {
    return this.videoUrl;
  }
}
class Verification {
  constructor(id, userId) {
    __publicField(this, "id");
    __publicField(this, "userId");
    __publicField(this, "status");
    __publicField(this, "documents");
    __publicField(this, "submittedAt");
    this.id = id;
    this.userId = userId;
    this.status = "PENDING" /* PENDING */;
    this.documents = [];
    this.submittedAt = /* @__PURE__ */ new Date();
  }
  submitDocuments(documents) {
    this.documents = documents;
    this.status = "UNDER_REVIEW" /* UNDER_REVIEW */;
    console.log(`Documents submitted for user ${this.userId}`);
  }
  approve() {
    this.status = "APPROVED" /* APPROVED */;
    console.log(`Verification approved for user ${this.userId}`);
  }
  reject() {
    this.status = "REJECTED" /* REJECTED */;
    console.log(`Verification rejected for user ${this.userId}`);
  }
  getStatus() {
    return this.status;
  }
  getDocuments() {
    return this.documents;
  }
}
class Client extends User {
  constructor(id, email, password, phone, companyName, address, gstNumber) {
    super(id, email, password, phone, "CLIENT" /* CLIENT */);
    __publicField(this, "companyName");
    __publicField(this, "address");
    __publicField(this, "gstNumber");
    __publicField(this, "orders");
    __publicField(this, "documents");
    __publicField(this, "verification");
    this.companyName = companyName;
    this.address = address;
    this.gstNumber = gstNumber;
    this.orders = [];
    this.documents = [];
    this.verification = new Verification(`ver-${id}`, id);
  }
  createOrder(title, quantity, budget) {
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
  viewManufacturers() {
    console.log("Fetching manufacturers...");
    return [];
  }
  makePayment(orderId, amount) {
    const payment = new Payment(`pay-${Date.now()}`, orderId, amount);
    console.log(`Payment of ${amount} initiated for order ${orderId}`);
    return payment;
  }
  getOrders() {
    return this.orders;
  }
  getCompanyName() {
    return this.companyName;
  }
  getVerification() {
    return this.verification;
  }
}
class Labour extends User {
  constructor(id, email, password, phone, name, skills, hourlyRate, location) {
    super(id, email, password, phone, "LABOUR" /* LABOUR */);
    __publicField(this, "name");
    __publicField(this, "skills");
    __publicField(this, "hourlyRate");
    __publicField(this, "location");
    __publicField(this, "skillProofs");
    __publicField(this, "rating");
    this.name = name;
    this.skills = skills;
    this.hourlyRate = hourlyRate;
    this.location = location;
    this.skillProofs = [];
    this.rating = 0;
  }
  uploadSkillProof(document) {
    this.skillProofs.push(document);
    console.log(`Skill proof uploaded for ${this.name}`);
  }
  updateAvailability(available) {
    console.log(`Availability updated to ${available} for ${this.name}`);
  }
  setHourlyRate(rate) {
    this.hourlyRate = rate;
    console.log(`Hourly rate updated to ${rate}`);
  }
  getName() {
    return this.name;
  }
  getSkills() {
    return this.skills;
  }
  getHourlyRate() {
    return this.hourlyRate;
  }
  getRating() {
    return this.rating;
  }
  setRating(rating) {
    this.rating = rating;
  }
}
class Manufacturer extends User {
  constructor(id, email, password, phone, companyName, category) {
    super(id, email, password, phone, "MANUFACTURER" /* MANUFACTURER */);
    __publicField(this, "companyName");
    __publicField(this, "category");
    __publicField(this, "affidavit");
    __publicField(this, "ppcLawAccepted");
    __publicField(this, "labourHired");
    __publicField(this, "activeOrders");
    __publicField(this, "rating");
    __publicField(this, "verification");
    this.companyName = companyName;
    this.category = category;
    this.affidavit = "";
    this.ppcLawAccepted = false;
    this.labourHired = [];
    this.activeOrders = [];
    this.rating = 0;
    this.verification = new Verification(`ver-${id}`, id);
  }
  bidOnOrder(order, amount) {
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
  hireLabour(labour) {
    this.labourHired.push(labour);
    console.log(`Labour ${labour.getName()} hired by ${this.companyName}`);
  }
  submitAffidavit(affidavitUrl) {
    this.affidavit = affidavitUrl;
    console.log("Affidavit submitted");
  }
  acceptPPCLaw() {
    this.ppcLawAccepted = true;
    console.log("PPC Law accepted");
  }
  getCompanyName() {
    return this.companyName;
  }
  getCategory() {
    return this.category;
  }
  getRating() {
    return this.rating;
  }
  setRating(rating) {
    this.rating = rating;
  }
  getActiveOrders() {
    return this.activeOrders;
  }
  addActiveOrder(order) {
    this.activeOrders.push(order);
  }
  getVerification() {
    return this.verification;
  }
}
class Bid {
  constructor(id, manufacturerId, orderId, amount) {
    __publicField(this, "id");
    __publicField(this, "manufacturerId");
    __publicField(this, "orderId");
    __publicField(this, "amount");
    __publicField(this, "accepted");
    this.id = id;
    this.manufacturerId = manufacturerId;
    this.orderId = orderId;
    this.amount = amount;
    this.accepted = false;
  }
  accept() {
    this.accepted = true;
    console.log(`Bid ${this.id} accepted`);
  }
  getId() {
    return this.id;
  }
  getManufacturerId() {
    return this.manufacturerId;
  }
  getAmount() {
    return this.amount;
  }
  isAccepted() {
    return this.accepted;
  }
}
class Order {
  constructor(id, clientId, title, quantity, budget) {
    __publicField(this, "id");
    __publicField(this, "clientId");
    __publicField(this, "manufacturerId");
    __publicField(this, "title");
    __publicField(this, "quantity");
    __publicField(this, "budget");
    __publicField(this, "status");
    __publicField(this, "bids");
    this.id = id;
    this.clientId = clientId;
    this.title = title;
    this.quantity = quantity;
    this.budget = budget;
    this.status = "PENDING" /* PENDING */;
    this.bids = [];
  }
  addBid(bid) {
    this.bids.push(bid);
    console.log(`Bid added to order ${this.id}`);
  }
  acceptBid(bid, manufacturer) {
    bid.accept();
    this.manufacturerId = bid.getManufacturerId();
    this.status = "ACCEPTED" /* ACCEPTED */;
    manufacturer.addActiveOrder(this);
    console.log(`Bid ${bid.getId()} accepted for order ${this.id}`);
  }
  completeOrder() {
    this.status = "COMPLETED" /* COMPLETED */;
    console.log(`Order ${this.id} completed`);
  }
  cancelOrder() {
    this.status = "CANCELLED" /* CANCELLED */;
    console.log(`Order ${this.id} cancelled`);
  }
  getId() {
    return this.id;
  }
  getClientId() {
    return this.clientId;
  }
  getManufacturerId() {
    return this.manufacturerId;
  }
  getTitle() {
    return this.title;
  }
  getBudget() {
    return this.budget;
  }
  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }
  getBids() {
    return this.bids;
  }
}
class Payment {
  constructor(id, orderId, amount) {
    __publicField(this, "id");
    __publicField(this, "orderId");
    __publicField(this, "amount");
    __publicField(this, "status");
    __publicField(this, "paidAt");
    this.id = id;
    this.orderId = orderId;
    this.amount = amount;
    this.status = "PENDING" /* PENDING */;
  }
  processPayment() {
    try {
      this.status = "COMPLETED" /* COMPLETED */;
      this.paidAt = /* @__PURE__ */ new Date();
      console.log(`Payment ${this.id} processed successfully`);
      return true;
    } catch (error) {
      this.status = "FAILED" /* FAILED */;
      console.error(`Payment ${this.id} failed`);
      return false;
    }
  }
  getId() {
    return this.id;
  }
  getAmount() {
    return this.amount;
  }
  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }
}
class EscrowPayment extends Payment {
  constructor(id, orderId, totalAmount) {
    super(id, orderId, totalAmount);
    __publicField(this, "totalAmount");
    __publicField(this, "upfrontAmount");
    // 30%
    __publicField(this, "finalAmount");
    // 70%
    __publicField(this, "upfrontPaid");
    __publicField(this, "finalPaid");
    this.totalAmount = totalAmount;
    this.upfrontAmount = totalAmount * 0.3;
    this.finalAmount = totalAmount * 0.7;
    this.upfrontPaid = false;
    this.finalPaid = false;
  }
  releaseUpfrontPayment() {
    if (!this.upfrontPaid) {
      this.upfrontPaid = true;
      this.setStatus("UPFRONT_PAID" /* UPFRONT_PAID */);
      console.log(`Upfront payment of ${this.upfrontAmount} released (30%)`);
      return true;
    }
    return false;
  }
  releaseFinalPayment() {
    if (this.upfrontPaid && !this.finalPaid) {
      this.finalPaid = true;
      this.setStatus("COMPLETED" /* COMPLETED */);
      console.log(`Final payment of ${this.finalAmount} released (70%)`);
      return true;
    }
    return false;
  }
  getRemainingAmount() {
    if (!this.upfrontPaid) {
      return this.totalAmount;
    } else if (!this.finalPaid) {
      return this.finalAmount;
    }
    return 0;
  }
  getUpfrontAmount() {
    return this.upfrontAmount;
  }
  getFinalAmount() {
    return this.finalAmount;
  }
  isUpfrontPaid() {
    return this.upfrontPaid;
  }
  isFinalPaid() {
    return this.finalPaid;
  }
}
class Message {
  constructor(id, senderId, receiverId, content) {
    __publicField(this, "id");
    __publicField(this, "senderId");
    __publicField(this, "receiverId");
    __publicField(this, "content");
    __publicField(this, "read");
    __publicField(this, "sentAt");
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.read = false;
    this.sentAt = /* @__PURE__ */ new Date();
  }
  markAsRead() {
    this.read = true;
    console.log(`Message ${this.id} marked as read`);
  }
  getId() {
    return this.id;
  }
  getSenderId() {
    return this.senderId;
  }
  getReceiverId() {
    return this.receiverId;
  }
  getContent() {
    return this.content;
  }
  isRead() {
    return this.read;
  }
}
class Notification {
  constructor(id, userId, type, message) {
    __publicField(this, "id");
    __publicField(this, "userId");
    __publicField(this, "type");
    __publicField(this, "message");
    __publicField(this, "read");
    __publicField(this, "createdAt");
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.message = message;
    this.read = false;
    this.createdAt = /* @__PURE__ */ new Date();
  }
  markAsRead() {
    this.read = true;
    console.log(`Notification ${this.id} marked as read`);
  }
  getId() {
    return this.id;
  }
  getUserId() {
    return this.userId;
  }
  getType() {
    return this.type;
  }
  getMessage() {
    return this.message;
  }
  isRead() {
    return this.read;
  }
}
class Review {
  constructor(id, orderId, reviewerId, rating, comment) {
    __publicField(this, "id");
    __publicField(this, "orderId");
    __publicField(this, "reviewerId");
    __publicField(this, "rating");
    // 1-5
    __publicField(this, "comment");
    __publicField(this, "createdAt");
    this.id = id;
    this.orderId = orderId;
    this.reviewerId = reviewerId;
    this.rating = Math.max(1, Math.min(5, rating));
    this.comment = comment;
    this.createdAt = /* @__PURE__ */ new Date();
  }
  submit() {
    console.log(`Review submitted for order ${this.orderId} with rating ${this.rating}`);
  }
  getId() {
    return this.id;
  }
  getOrderId() {
    return this.orderId;
  }
  getReviewerId() {
    return this.reviewerId;
  }
  getRating() {
    return this.rating;
  }
  getComment() {
    return this.comment;
  }
}
function exampleUsage() {
  const client = new Client(
    "client-001",
    "client@example.com",
    "password123",
    "+92 300 1234567",
    "ABC Industries",
    "Karachi, Pakistan",
    "GST12345"
  );
  const manufacturer = new Manufacturer(
    "manu-001",
    "manufacturer@example.com",
    "password123",
    "+92 301 7654321",
    "XYZ Manufacturing",
    "Textile"
  );
  const labour = new Labour(
    "labour-001",
    "labour@example.com",
    "password123",
    "+92 302 9876543",
    "Ali Khan",
    ["Welding", "Fabrication"],
    500,
    "Lahore, Pakistan"
  );
  const order = client.createOrder("Steel Rods Manufacturing", 1e3, 5e5);
  const bid = manufacturer.bidOnOrder(order, 48e4);
  order.acceptBid(bid, manufacturer);
  manufacturer.hireLabour(labour);
  const escrowPayment = new EscrowPayment(
    "escrow-001",
    order.getId(),
    48e4
  );
  escrowPayment.releaseUpfrontPayment();
  order.completeOrder();
  escrowPayment.releaseFinalPayment();
  const review = new Review(
    "review-001",
    order.getId(),
    client.getId(),
    5,
    "Excellent work!"
  );
  review.submit();
  console.log("Skillora Platform - Complete Flow Executed Successfully!");
}
export {
  Bid,
  Client,
  Document,
  DocumentType,
  EscrowPayment,
  Labour,
  Manufacturer,
  Message,
  Notification,
  NotificationType,
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  Review,
  User,
  UserRole,
  UserState,
  Verification,
  VerificationStatus,
  exampleUsage
};
