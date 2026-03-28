var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["Client"] = "Client";
  UserRole2["Manufacturer"] = "Manufacturer";
  UserRole2["Labour"] = "Labour";
  return UserRole2;
})(UserRole || {});
var UserState = /* @__PURE__ */ ((UserState2) => {
  UserState2["New"] = "New";
  UserState2["Active"] = "Active";
  UserState2["Suspended"] = "Suspended";
  UserState2["Blocked"] = "Blocked";
  UserState2["Verified"] = "Verified";
  return UserState2;
})(UserState || {});
var VerificationStatus = /* @__PURE__ */ ((VerificationStatus2) => {
  VerificationStatus2["Pending"] = "Pending";
  VerificationStatus2["UnderReview"] = "UnderReview";
  VerificationStatus2["Verified"] = "Verified";
  VerificationStatus2["Rejected"] = "Rejected";
  return VerificationStatus2;
})(VerificationStatus || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["Pending"] = "Pending";
  OrderStatus2["Bidding"] = "Bidding";
  OrderStatus2["Active"] = "Active";
  OrderStatus2["InProgress"] = "InProgress";
  OrderStatus2["Completed"] = "Completed";
  OrderStatus2["Cancelled"] = "Cancelled";
  OrderStatus2["Disputed"] = "Disputed";
  return OrderStatus2;
})(OrderStatus || {});
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["Pending"] = "Pending";
  PaymentStatus2["PartialPaid"] = "PartialPaid";
  PaymentStatus2["Escrowed"] = "Escrowed";
  PaymentStatus2["Released"] = "Released";
  PaymentStatus2["Refunded"] = "Refunded";
  PaymentStatus2["Completed"] = "Completed";
  return PaymentStatus2;
})(PaymentStatus || {});
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["Order"] = "Order";
  NotificationType2["Payment"] = "Payment";
  NotificationType2["Message"] = "Message";
  NotificationType2["System"] = "System";
  NotificationType2["Verification"] = "Verification";
  return NotificationType2;
})(NotificationType || {});
var DocumentType = /* @__PURE__ */ ((DocumentType2) => {
  DocumentType2["LegalDocument"] = "LegalDocument";
  DocumentType2["Affidavit"] = "Affidavit";
  DocumentType2["PPCLaw"] = "PPCLaw";
  DocumentType2["SkillProof"] = "SkillProof";
  DocumentType2["OrderProof"] = "OrderProof";
  return DocumentType2;
})(DocumentType || {});
class User {
  constructor(id, email, password, phone, role) {
    __publicField(this, "id");
    __publicField(this, "email");
    __publicField(this, "password");
    __publicField(this, "phone");
    __publicField(this, "role");
    __publicField(this, "state");
    __publicField(this, "createdAt");
    __publicField(this, "updatedAt");
    this.id = id;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
    this.state = "New" /* New */;
    this.createdAt = /* @__PURE__ */ new Date();
    this.updatedAt = /* @__PURE__ */ new Date();
  }
  login() {
    return true;
  }
  logout() {
  }
  updateProfile(data) {
    this.updatedAt = /* @__PURE__ */ new Date();
  }
  changePassword(oldPassword, newPassword) {
    return true;
  }
}
class Client extends User {
  constructor(id, email, password, phone, companyName, address) {
    super(id, email, password, phone, "Client" /* Client */);
    __publicField(this, "companyName");
    __publicField(this, "address");
    __publicField(this, "gstNumber");
    __publicField(this, "documents");
    __publicField(this, "orders");
    __publicField(this, "verification");
    this.companyName = companyName;
    this.address = address;
    this.documents = [];
    this.orders = [];
    this.verification = new Verification(id, "Client" /* Client */);
  }
  createOrder(order) {
    this.orders.push(order);
    return order;
  }
  viewManufacturers(filters) {
    return [];
  }
  submitVerificationDocuments(documents) {
    this.documents = documents;
    this.verification.submitDocuments(documents);
  }
  makePayment(orderId, amount) {
    return new Payment(this.id, orderId, amount);
  }
}
class Manufacturer extends User {
  constructor(id, email, password, phone, companyName, address, category) {
    super(id, email, password, phone, "Manufacturer" /* Manufacturer */);
    __publicField(this, "companyName");
    __publicField(this, "address");
    __publicField(this, "category");
    __publicField(this, "affidavit");
    __publicField(this, "ppcLawAccepted");
    __publicField(this, "documents");
    __publicField(this, "activeOrders");
    __publicField(this, "labourHired");
    __publicField(this, "verification");
    __publicField(this, "rating");
    __publicField(this, "reviewCount");
    this.companyName = companyName;
    this.address = address;
    this.category = category;
    this.affidavit = "";
    this.ppcLawAccepted = false;
    this.documents = [];
    this.activeOrders = [];
    this.labourHired = [];
    this.verification = new Verification(id, "Manufacturer" /* Manufacturer */);
    this.rating = 0;
    this.reviewCount = 0;
  }
  bidOnOrder(order, amount) {
    const bid = new Bid(this.id, order.id, amount);
    order.addBid(bid);
    return bid;
  }
  hireLabour(labour) {
    this.labourHired.push(labour);
  }
  submitAffidavit(affidavit) {
    this.affidavit = affidavit;
  }
  acceptPPCLaw() {
    this.ppcLawAccepted = true;
  }
  submitVerificationDocuments(documents) {
    this.documents = documents;
    this.verification.submitDocuments(documents);
  }
  updateOrderStatus(orderId, status) {
    const order = this.activeOrders.find((o) => o.id === orderId);
    if (order) {
      order.updateStatus(status);
    }
  }
  requestPaymentRelease(orderId) {
  }
}
class Labour extends User {
  constructor(id, email, password, phone, name, skills, location, hourlyRate) {
    super(id, email, password, phone, "Labour" /* Labour */);
    __publicField(this, "name");
    __publicField(this, "skills");
    __publicField(this, "location");
    __publicField(this, "hourlyRate");
    __publicField(this, "skillProofs");
    __publicField(this, "verification");
    __publicField(this, "rating");
    __publicField(this, "reviewCount");
    __publicField(this, "availability");
    this.name = name;
    this.skills = skills;
    this.location = location;
    this.hourlyRate = hourlyRate;
    this.skillProofs = [];
    this.verification = new Verification(id, "Labour" /* Labour */);
    this.rating = 0;
    this.reviewCount = 0;
    this.availability = true;
  }
  uploadSkillProof(photo, video) {
    const proof = new Document("SkillProof" /* SkillProof */, "Skill Proof", photo, video);
    this.skillProofs.push(proof);
    this.verification.submitDocuments([proof]);
  }
  updateAvailability(available) {
    this.availability = available;
  }
  setHourlyRate(rate) {
    this.hourlyRate = rate;
  }
}
class Verification {
  constructor(userId, userRole) {
    __publicField(this, "id");
    __publicField(this, "userId");
    __publicField(this, "userRole");
    __publicField(this, "status");
    __publicField(this, "documents");
    __publicField(this, "submittedAt");
    __publicField(this, "reviewedAt");
    __publicField(this, "verifiedAt");
    __publicField(this, "rejectionReason");
    this.id = `VER-${Date.now()}`;
    this.userId = userId;
    this.userRole = userRole;
    this.status = "Pending" /* Pending */;
    this.documents = [];
  }
  submitDocuments(documents) {
    this.documents = documents;
    this.status = "UnderReview" /* UnderReview */;
    this.submittedAt = /* @__PURE__ */ new Date();
  }
  approve() {
    this.status = "Verified" /* Verified */;
    this.verifiedAt = /* @__PURE__ */ new Date();
  }
  reject(reason) {
    this.status = "Rejected" /* Rejected */;
    this.rejectionReason = reason;
    this.reviewedAt = /* @__PURE__ */ new Date();
  }
  isVerified() {
    return this.status === "Verified" /* Verified */;
  }
}
class Document {
  constructor(type, title, fileUrl, videoUrl) {
    __publicField(this, "id");
    __publicField(this, "type");
    __publicField(this, "title");
    __publicField(this, "fileUrl");
    __publicField(this, "videoUrl");
    __publicField(this, "uploadedAt");
    this.id = `DOC-${Date.now()}`;
    this.type = type;
    this.title = title;
    this.fileUrl = fileUrl;
    this.videoUrl = videoUrl;
    this.uploadedAt = /* @__PURE__ */ new Date();
  }
}
class Order {
  constructor(clientId, title, description, category, quantity, budget, deadline) {
    __publicField(this, "id");
    __publicField(this, "clientId");
    __publicField(this, "manufacturerId");
    __publicField(this, "title");
    __publicField(this, "description");
    __publicField(this, "category");
    __publicField(this, "quantity");
    __publicField(this, "budget");
    __publicField(this, "deadline");
    __publicField(this, "status");
    __publicField(this, "bids");
    __publicField(this, "payment");
    __publicField(this, "escrow");
    __publicField(this, "createdAt");
    __publicField(this, "updatedAt");
    this.id = `ORD-${Date.now()}`;
    this.clientId = clientId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.quantity = quantity;
    this.budget = budget;
    this.deadline = deadline;
    this.status = "Pending" /* Pending */;
    this.bids = [];
    this.createdAt = /* @__PURE__ */ new Date();
    this.updatedAt = /* @__PURE__ */ new Date();
  }
  addBid(bid) {
    this.bids.push(bid);
    this.status = "Bidding" /* Bidding */;
  }
  acceptBid(bidId) {
    const bid = this.bids.find((b) => b.id === bidId);
    if (bid) {
      this.manufacturerId = bid.manufacturerId;
      bid.accept();
      this.status = "Active" /* Active */;
    }
  }
  updateStatus(status) {
    this.status = status;
    this.updatedAt = /* @__PURE__ */ new Date();
  }
  createEscrowPayment(amount) {
    this.escrow = new EscrowPayment(this.id, this.clientId, this.manufacturerId, amount);
    return this.escrow;
  }
  completeOrder() {
    this.status = "Completed" /* Completed */;
    this.updatedAt = /* @__PURE__ */ new Date();
  }
}
class Bid {
  constructor(manufacturerId, orderId, amount) {
    __publicField(this, "id");
    __publicField(this, "manufacturerId");
    __publicField(this, "orderId");
    __publicField(this, "amount");
    __publicField(this, "deliveryTime");
    // in days
    __publicField(this, "description");
    __publicField(this, "accepted");
    __publicField(this, "createdAt");
    this.id = `BID-${Date.now()}`;
    this.manufacturerId = manufacturerId;
    this.orderId = orderId;
    this.amount = amount;
    this.deliveryTime = 0;
    this.description = "";
    this.accepted = false;
    this.createdAt = /* @__PURE__ */ new Date();
  }
  accept() {
    this.accepted = true;
  }
  updateAmount(amount) {
    this.amount = amount;
  }
}
class Payment {
  constructor(userId, orderId, amount) {
    __publicField(this, "id");
    __publicField(this, "userId");
    __publicField(this, "orderId");
    __publicField(this, "amount");
    __publicField(this, "status");
    __publicField(this, "paidAt");
    __publicField(this, "createdAt");
    this.id = `PAY-${Date.now()}`;
    this.userId = userId;
    this.orderId = orderId;
    this.amount = amount;
    this.status = "Pending" /* Pending */;
    this.createdAt = /* @__PURE__ */ new Date();
  }
  processPayment() {
    this.status = "Completed" /* Completed */;
    this.paidAt = /* @__PURE__ */ new Date();
    return true;
  }
  refund() {
    this.status = "Refunded" /* Refunded */;
  }
}
class EscrowPayment {
  constructor(orderId, clientId, manufacturerId, totalAmount) {
    __publicField(this, "id");
    __publicField(this, "orderId");
    __publicField(this, "clientId");
    __publicField(this, "manufacturerId");
    __publicField(this, "totalAmount");
    __publicField(this, "upfrontAmount");
    // 30%
    __publicField(this, "finalAmount");
    // 70%
    __publicField(this, "upfrontPaid");
    __publicField(this, "finalPaid");
    __publicField(this, "upfrontReleasedAt");
    __publicField(this, "finalReleasedAt");
    __publicField(this, "status");
    __publicField(this, "createdAt");
    this.id = `ESC-${Date.now()}`;
    this.orderId = orderId;
    this.clientId = clientId;
    this.manufacturerId = manufacturerId;
    this.totalAmount = totalAmount;
    this.upfrontAmount = totalAmount * 0.3;
    this.finalAmount = totalAmount * 0.7;
    this.upfrontPaid = false;
    this.finalPaid = false;
    this.status = "Pending" /* Pending */;
    this.createdAt = /* @__PURE__ */ new Date();
  }
  releaseUpfrontPayment() {
    this.upfrontPaid = true;
    this.upfrontReleasedAt = /* @__PURE__ */ new Date();
    this.status = "PartialPaid" /* PartialPaid */;
  }
  releaseFinalPayment() {
    this.finalPaid = true;
    this.finalReleasedAt = /* @__PURE__ */ new Date();
    this.status = "Completed" /* Completed */;
  }
  getTotalPaid() {
    let total = 0;
    if (this.upfrontPaid) total += this.upfrontAmount;
    if (this.finalPaid) total += this.finalAmount;
    return total;
  }
  getRemainingAmount() {
    return this.totalAmount - this.getTotalPaid();
  }
}
class Message {
  constructor(senderId, receiverId, content) {
    __publicField(this, "id");
    __publicField(this, "senderId");
    __publicField(this, "receiverId");
    __publicField(this, "content");
    __publicField(this, "attachments");
    __publicField(this, "read");
    __publicField(this, "sentAt");
    this.id = `MSG-${Date.now()}`;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.attachments = [];
    this.read = false;
    this.sentAt = /* @__PURE__ */ new Date();
  }
  markAsRead() {
    this.read = true;
  }
}
class Notification {
  constructor(userId, type, title, message) {
    __publicField(this, "id");
    __publicField(this, "userId");
    __publicField(this, "type");
    __publicField(this, "title");
    __publicField(this, "message");
    __publicField(this, "read");
    __publicField(this, "link");
    __publicField(this, "createdAt");
    this.id = `NOT-${Date.now()}`;
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.read = false;
    this.createdAt = /* @__PURE__ */ new Date();
  }
  markAsRead() {
    this.read = true;
  }
}
class Review {
  constructor(orderId, reviewerId, reviewedUserId, rating, comment) {
    __publicField(this, "id");
    __publicField(this, "orderId");
    __publicField(this, "reviewerId");
    __publicField(this, "reviewedUserId");
    __publicField(this, "rating");
    // 1-5
    __publicField(this, "comment");
    __publicField(this, "createdAt");
    this.id = `REV-${Date.now()}`;
    this.orderId = orderId;
    this.reviewerId = reviewerId;
    this.reviewedUserId = reviewedUserId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = /* @__PURE__ */ new Date();
  }
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
  VerificationStatus
};
